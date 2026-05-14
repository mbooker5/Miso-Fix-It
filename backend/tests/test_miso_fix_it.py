"""Backend tests for Miso Fix It tradeline app."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://tradeline-qualifier.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------- Packages ----------------
class TestPackages:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_list_packages(self, session):
        r = session.get(f"{API}/packages")
        assert r.status_code == 200
        data = r.json()
        assert "individual" in data and "bundles" in data
        assert len(data["individual"]) == 4, f"expected 4 individual got {len(data['individual'])}"
        assert len(data["bundles"]) == 6, f"expected 6 bundles got {len(data['bundles'])}"
        # MOST POPULAR
        amex = [b for b in data["bundles"] if b["id"] == "amex_power_pack"]
        assert amex, "amex_power_pack missing"
        assert amex[0].get("badge") == "MOST POPULAR"

    def test_get_package(self, session):
        r = session.get(f"{API}/packages/amex_power_pack")
        assert r.status_code == 200
        assert r.json()["price"] == 725.00

    def test_get_package_404(self, session):
        r = session.get(f"{API}/packages/does_not_exist")
        assert r.status_code == 404


# ---------------- Applications ----------------
APP_PAYLOAD = {
    "full_name": "TEST_Jane Doe",
    "email": "TEST_jane@test.com",
    "phone": "5551234567",
    "payment_history_pct": 82,
    "credit_age_years": 6,
    "credit_age_months": 2,
    "credit_score": 590,
    "derogatory_marks": 3,
    "credit_utilization_pct": 68,
    "total_credit_limit": 2500,
    "number_of_accounts": 8,
    "hard_inquiries": 0,
    "payment_schedule": "monthly",
    "selected_package_id": "amex_power_pack",
}


class TestApplications:
    application_id = None

    def test_create_application(self, session):
        r = session.post(f"{API}/applications", json=APP_PAYLOAD)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and len(data["id"]) > 0
        assert data["selected_package_name"] == "Amex Power Pack"
        assert data["selected_package_price"] == 725.00
        assert data["status"] == "new"
        assert "_id" not in data
        TestApplications.application_id = data["id"]

    def test_create_invalid_schedule(self, session):
        bad = {**APP_PAYLOAD, "payment_schedule": "yearly"}
        r = session.post(f"{API}/applications", json=bad)
        assert r.status_code == 400

    def test_create_invalid_package(self, session):
        bad = {**APP_PAYLOAD, "selected_package_id": "ghost_pkg"}
        r = session.post(f"{API}/applications", json=bad)
        assert r.status_code == 400

    def test_create_missing_required_field(self, session):
        bad = {k: v for k, v in APP_PAYLOAD.items() if k != "credit_score"}
        r = session.post(f"{API}/applications", json=bad)
        assert r.status_code == 422

    def test_get_application(self, session):
        assert TestApplications.application_id
        r = session.get(f"{API}/applications/{TestApplications.application_id}")
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == TestApplications.application_id
        assert "_id" not in d

    def test_get_application_404(self, session):
        r = session.get(f"{API}/applications/nope-nope-nope")
        assert r.status_code == 404

    def test_list_applications(self, session):
        r = session.get(f"{API}/applications")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert any(a["id"] == TestApplications.application_id for a in items)
        for a in items:
            assert "_id" not in a


# ---------------- Stripe Checkout ----------------
class TestCheckout:
    session_id = None

    def test_create_checkout_session_monthly(self, session):
        # ensure application exists
        if not TestApplications.application_id:
            r = session.post(f"{API}/applications", json=APP_PAYLOAD)
            TestApplications.application_id = r.json()["id"]

        body = {
            "application_id": TestApplications.application_id,
            "origin_url": BASE_URL,
        }
        r = session.post(f"{API}/payments/checkout/session", json=body)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and data["url"].startswith("http")
        assert "session_id" in data
        # monthly => 725 / 3 = 241.67
        assert abs(data["amount"] - round(725.0 / 3, 2)) < 0.01
        TestCheckout.session_id = data["session_id"]

    def test_create_checkout_straight_deposit(self, session):
        # create a fresh application with straight_deposit
        payload = {**APP_PAYLOAD, "payment_schedule": "straight_deposit",
                   "selected_package_id": "wells_fargo_55k",
                   "email": "TEST_straight@test.com"}
        r = session.post(f"{API}/applications", json=payload)
        assert r.status_code == 200
        app_id = r.json()["id"]

        r = session.post(
            f"{API}/payments/checkout/session",
            json={"application_id": app_id, "origin_url": BASE_URL},
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["amount"] == 275.00  # full price wells_fargo_55k

    def test_create_checkout_weekly(self, session):
        payload = {**APP_PAYLOAD, "payment_schedule": "weekly",
                   "selected_package_id": "starter_builder",
                   "email": "TEST_weekly@test.com"}
        r = session.post(f"{API}/applications", json=payload)
        app_id = r.json()["id"]
        r = session.post(
            f"{API}/payments/checkout/session",
            json={"application_id": app_id, "origin_url": BASE_URL},
        )
        assert r.status_code == 200
        d = r.json()
        assert abs(d["amount"] - round(525.0 / 13.0, 2)) < 0.01

    def test_create_checkout_biweekly(self, session):
        payload = {**APP_PAYLOAD, "payment_schedule": "biweekly",
                   "selected_package_id": "high_limit_flex",
                   "email": "TEST_bi@test.com"}
        r = session.post(f"{API}/applications", json=payload)
        app_id = r.json()["id"]
        r = session.post(
            f"{API}/payments/checkout/session",
            json={"application_id": app_id, "origin_url": BASE_URL},
        )
        assert r.status_code == 200
        d = r.json()
        assert abs(d["amount"] - round(675.0 / 6.0, 2)) < 0.01

    def test_create_checkout_invalid_app(self, session):
        r = session.post(
            f"{API}/payments/checkout/session",
            json={"application_id": "nonexistent", "origin_url": BASE_URL},
        )
        assert r.status_code == 404

    def test_status_endpoint(self, session):
        assert TestCheckout.session_id
        r = session.get(f"{API}/payments/checkout/status/{TestCheckout.session_id}")
        assert r.status_code == 200
        d = r.json()
        assert "payment_status" in d
        assert "status" in d

    def test_status_unknown_session(self, session):
        r = session.get(f"{API}/payments/checkout/status/cs_unknown_xxxx")
        assert r.status_code == 404
