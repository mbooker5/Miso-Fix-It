from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

STRIPE_API_KEY = os.environ["STRIPE_API_KEY"]

app = FastAPI(title="Miso Fix It API")
api_router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Package catalog (SERVER-SIDE SOURCE OF TRUTH - NEVER trust prices from FE)
# ---------------------------------------------------------------------------
PACKAGES: Dict[str, Dict[str, Any]] = {
    # Individual Tradelines
    "amex_275k": {
        "id": "amex_275k",
        "kind": "individual",
        "name": "Amex #1",
        "limit": 27500,
        "age": "1.5 Years",
        "price": 475.00,
        "tagline": "Perfect History",
        "benefits": [
            "Major utilization drop",
            "Helps qualify for higher limit cards",
            "Strong boost for scores under 650",
        ],
    },
    "amex_155k": {
        "id": "amex_155k",
        "kind": "individual",
        "name": "Amex #2",
        "limit": 15500,
        "age": "1.5 Years",
        "price": 425.00,
        "tagline": "Perfect History",
        "benefits": [
            "Adds strong revolving credit depth",
            "Improves overall score stability",
        ],
    },
    "capital_one_93k": {
        "id": "capital_one_93k",
        "kind": "individual",
        "name": "Capital One",
        "limit": 9300,
        "age": "3 Years",
        "price": 325.00,
        "tagline": "Perfect History",
        "benefits": [
            "Adds seasoned account age",
            "Strengthens payment history",
            "Improves credit mix",
        ],
    },
    "wells_fargo_55k": {
        "id": "wells_fargo_55k",
        "kind": "individual",
        "name": "Wells Fargo",
        "limit": 5500,
        "age": "3 Years 8 Months",
        "price": 275.00,
        "tagline": "Perfect History",
        "benefits": [
            "Helps aging of profile",
            "Strengthens payment history",
            "Ideal for thin files",
        ],
    },
    # Bundles
    "starter_builder": {
        "id": "starter_builder",
        "kind": "bundle",
        "name": "Starter Builder",
        "price": 525.00,
        "includes": ["Capital One $9.3k", "Wells Fargo $5.5k"],
        "added_credit": 14800,
        "tagline": "Perfect entry package",
        "benefits": [
            "Adds $14.8k credit",
            "6+ years combined age",
            "Perfect entry package",
        ],
    },
    "credit_builder_plus": {
        "id": "credit_builder_plus",
        "kind": "bundle",
        "name": "Credit Builder Plus",
        "price": 625.00,
        "includes": ["Amex $15.5k", "Wells Fargo $5.5k"],
        "added_credit": 21000,
        "tagline": "Ideal for 600–660 range",
        "benefits": [
            "Adds $21k total credit",
            "Strong balance of limit + age",
            "Ideal for 600–660 range",
        ],
    },
    "high_limit_flex": {
        "id": "high_limit_flex",
        "kind": "bundle",
        "name": "High Limit Flex",
        "price": 675.00,
        "includes": ["Amex $27.5k", "Capital One $9.3k"],
        "added_credit": 36800,
        "tagline": "High limit + aged account combo",
        "benefits": [
            "Adds $36.8k credit",
            "High limit + aged account combo",
            "Strong utilization drop",
        ],
    },
    "amex_power_pack": {
        "id": "amex_power_pack",
        "kind": "bundle",
        "name": "Amex Power Pack",
        "price": 725.00,
        "includes": ["Amex $27.5k", "Amex $15.5k"],
        "added_credit": 43000,
        "badge": "MOST POPULAR",
        "tagline": "Ideal for 660–720+ goals",
        "benefits": [
            "Adds $43k total credit",
            "Maximum utilization impact",
            "Ideal for 660–720+ goals",
        ],
    },
    "limit_booster": {
        "id": "limit_booster",
        "kind": "bundle",
        "name": "Limit Booster",
        "price": 795.00,
        "includes": ["Amex $27.5k", "Capital One $9.3k", "Wells Fargo $5.5k"],
        "added_credit": 42300,
        "tagline": "Strong rebuild package",
        "benefits": [
            "Adds $42k+ total credit",
            "Mix of age + high limits",
            "Strong rebuild package",
        ],
    },
    "ultimate_credit_boost": {
        "id": "ultimate_credit_boost",
        "kind": "bundle",
        "name": "Ultimate Credit Boost",
        "price": 1075.00,
        "includes": [
            "Amex $27.5k",
            "Amex $15.5k",
            "Capital One $9.3k",
            "Wells Fargo $5.5k",
        ],
        "added_credit": 57800,
        "tagline": "Full profile transformation",
        "benefits": [
            "Adds $57k+ credit",
            "Full profile transformation",
            "Best for 500–650 rebuilding to 700+",
        ],
    },
}

VALID_SCHEDULES = {"weekly", "biweekly", "monthly", "straight_deposit"}


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class ApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    payment_history_pct: float = Field(ge=0, le=100)
    credit_age_years: int = Field(ge=0, le=80)
    credit_age_months: int = Field(ge=0, le=11)
    credit_score: int = Field(ge=300, le=900)
    derogatory_marks: int = Field(ge=0, le=50)
    credit_utilization_pct: float = Field(ge=0, le=200)
    total_credit_limit: float = Field(ge=0)
    number_of_accounts: int = Field(ge=0, le=200)
    hard_inquiries: int = Field(default=0, ge=0, le=50)
    payment_schedule: str
    selected_package_id: str
    notes: Optional[str] = ""


class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: str
    phone: str
    payment_history_pct: float
    credit_age_years: int
    credit_age_months: int
    credit_score: int
    derogatory_marks: int
    credit_utilization_pct: float
    total_credit_limit: float
    number_of_accounts: int
    hard_inquiries: int = 0
    payment_schedule: str
    selected_package_id: str
    selected_package_name: str
    selected_package_price: float
    notes: str = ""
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CheckoutRequest(BaseModel):
    application_id: str
    origin_url: str


class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    application_id: str
    email: str
    amount: float
    currency: str = "usd"
    package_id: str
    payment_schedule: str
    status: str = "initiated"
    payment_status: str = "pending"
    metadata: Dict[str, str] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------------------------------------------------------------------------
# Package endpoints
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Miso Fix It API", "ok": True}


@api_router.get("/packages")
async def list_packages():
    individual = [p for p in PACKAGES.values() if p["kind"] == "individual"]
    bundles = [p for p in PACKAGES.values() if p["kind"] == "bundle"]
    return {"individual": individual, "bundles": bundles}


@api_router.get("/packages/{package_id}")
async def get_package(package_id: str):
    pkg = PACKAGES.get(package_id)
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return pkg


# ---------------------------------------------------------------------------
# Applications endpoints
# ---------------------------------------------------------------------------
@api_router.post("/applications", response_model=Application)
async def create_application(payload: ApplicationCreate):
    if payload.payment_schedule not in VALID_SCHEDULES:
        raise HTTPException(status_code=400, detail="Invalid payment schedule")
    pkg = PACKAGES.get(payload.selected_package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Invalid package selection")

    app_obj = Application(
        **payload.model_dump(exclude={"selected_package_id"}),
        selected_package_id=payload.selected_package_id,
        selected_package_name=pkg["name"],
        selected_package_price=pkg["price"],
    )
    await db.applications.insert_one(app_obj.model_dump())
    return app_obj


@api_router.get("/applications", response_model=List[Application])
async def list_applications():
    docs = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/applications/{application_id}", response_model=Application)
async def get_application(application_id: str):
    doc = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")
    return doc


# ---------------------------------------------------------------------------
# Stripe checkout
# ---------------------------------------------------------------------------
@api_router.post("/payments/checkout/session")
async def create_checkout_session(payload: CheckoutRequest, request: Request):
    application = await db.applications.find_one(
        {"id": payload.application_id}, {"_id": 0}
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    pkg = PACKAGES.get(application["selected_package_id"])
    if not pkg:
        raise HTTPException(status_code=400, detail="Invalid package selection")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/cancel?application_id={application['id']}"

    # Determine amount based on schedule (weekly/biweekly/monthly split)
    schedule = application["payment_schedule"]
    full_price: float = float(pkg["price"])
    if schedule == "weekly":
        # 3-month tradeline ~ 13 weeks
        amount = round(full_price / 13.0, 2)
    elif schedule == "biweekly":
        amount = round(full_price / 6.0, 2)
    elif schedule == "monthly":
        amount = round(full_price / 3.0, 2)
    else:  # straight_deposit
        amount = round(full_price, 2)

    webhook_url = f"{str(request.base_url).rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    metadata = {
        "application_id": application["id"],
        "package_id": pkg["id"],
        "email": application["email"],
        "schedule": schedule,
    }

    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(
        checkout_request
    )

    txn = PaymentTransaction(
        session_id=session.session_id,
        application_id=application["id"],
        email=application["email"],
        amount=amount,
        currency="usd",
        package_id=pkg["id"],
        payment_schedule=schedule,
        metadata=metadata,
    )
    await db.payment_transactions.insert_one(txn.model_dump())

    return {
        "url": session.url,
        "session_id": session.session_id,
        "amount": amount,
        "currency": "usd",
        "package_name": pkg["name"],
        "schedule": schedule,
    }


@api_router.get("/payments/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not txn:
        raise HTTPException(status_code=404, detail="Session not found")

    # Return early if already finalized (prevents double-processing)
    if txn.get("payment_status") == "paid":
        return {
            "status": txn.get("status", "complete"),
            "payment_status": "paid",
            "amount": txn["amount"],
            "currency": txn["currency"],
        }

    webhook_url = f"{str(request.base_url).rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        new_status = status.status
        new_payment_status = status.payment_status
    except Exception as exc:  # noqa: BLE001
        # Defensive fallback — emergentintegrations may fail to parse Stripe's
        # response in some environments. Return current DB state instead of 500
        # so the client polling loop keeps working until webhook updates it.
        logging.getLogger(__name__).warning("Stripe status fetch failed: %s", exc)
        return {
            "status": txn.get("status", "open"),
            "payment_status": txn.get("payment_status", "pending"),
            "amount": txn["amount"],
            "currency": txn["currency"],
        }

    now_iso = datetime.now(timezone.utc).isoformat()
    update = {
        "status": new_status,
        "payment_status": new_payment_status,
        "updated_at": now_iso,
    }
    await db.payment_transactions.update_one({"session_id": session_id}, {"$set": update})

    # Mark application paid if payment completed
    if new_payment_status == "paid":
        await db.applications.update_one(
            {"id": txn["application_id"]},
            {"$set": {"status": "paid", "paid_at": now_iso}},
        )

    return {
        "status": new_status,
        "payment_status": new_payment_status,
        "amount": txn["amount"],
        "currency": txn["currency"],
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    webhook_url = f"{str(request.base_url).rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
    except Exception as exc:  # noqa: BLE001
        logging.getLogger(__name__).warning("Stripe webhook error: %s", exc)
        raise HTTPException(status_code=400, detail="Invalid webhook") from exc

    now_iso = datetime.now(timezone.utc).isoformat()
    await db.payment_transactions.update_one(
        {"session_id": event.session_id},
        {
            "$set": {
                "payment_status": event.payment_status,
                "updated_at": now_iso,
            }
        },
    )
    if event.payment_status == "paid":
        txn = await db.payment_transactions.find_one(
            {"session_id": event.session_id}, {"_id": 0}
        )
        if txn:
            await db.applications.update_one(
                {"id": txn["application_id"]},
                {"$set": {"status": "paid", "paid_at": now_iso}},
            )
    return {"received": True}


# ---------------------------------------------------------------------------
# Mount router & middleware
# ---------------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
