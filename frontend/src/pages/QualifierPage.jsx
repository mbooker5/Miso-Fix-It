import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "../lib/api";
import LiveDashboard from "../components/LiveDashboard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { ShieldCheck, Lock, ArrowRight, Loader2 } from "lucide-react";

const SCHEDULES = [
    { value: "weekly", label: "Weekly", helper: "Total ÷ 13 weeks" },
    { value: "biweekly", label: "Biweekly", helper: "Total ÷ 6 pays" },
    { value: "monthly", label: "Monthly", helper: "Total ÷ 3 months" },
    { value: "straight_deposit", label: "Straight deposit", helper: "Pay once" },
];

const initialValues = {
    full_name: "",
    email: "",
    phone: "",
    payment_history_pct: "",
    credit_age_years: "",
    credit_age_months: "",
    credit_score: "",
    derogatory_marks: "",
    credit_utilization_pct: "",
    total_credit_limit: "",
    number_of_accounts: "",
    hard_inquiries: "0",
    payment_schedule: "",
    selected_package_id: "",
    notes: "",
};

export default function QualifierPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [values, setValues] = useState(initialValues);
    const [packages, setPackages] = useState({ individual: [], bundles: [] });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get("/packages").then((r) => setPackages(r.data));
    }, []);

    const allPackages = useMemo(
        () => [...(packages.bundles || []), ...(packages.individual || [])],
        [packages],
    );

    // Apply URL ?package= AFTER packages list is loaded so Radix Select
    // can match the value to a mounted SelectItem and display its label.
    useEffect(() => {
        const pkg = searchParams.get("package");
        if (!pkg || allPackages.length === 0) return;
        if (allPackages.find((p) => p.id === pkg)) {
            setValues((v) =>
                v.selected_package_id === pkg
                    ? v
                    : { ...v, selected_package_id: pkg },
            );
        }
    }, [searchParams, allPackages]);

    const selectedPackage = useMemo(
        () => allPackages.find((p) => p.id === values.selected_package_id),
        [allPackages, values.selected_package_id],
    );

    const computedAmount = useMemo(() => {
        if (!selectedPackage || !values.payment_schedule) return null;
        const p = selectedPackage.price;
        switch (values.payment_schedule) {
            case "weekly":
                return { amount: p / 13, suffix: "/ week × 13" };
            case "biweekly":
                return { amount: p / 6, suffix: "/ biweekly × 6" };
            case "monthly":
                return { amount: p / 3, suffix: "/ month × 3" };
            default:
                return { amount: p, suffix: "one-time" };
        }
    }, [selectedPackage, values.payment_schedule]);

    const setField = (name) => (e) => {
        const v = e?.target ? e.target.value : e;
        setValues((prev) => ({ ...prev, [name]: v }));
    };

    const required = [
        "full_name",
        "email",
        "phone",
        "payment_history_pct",
        "credit_age_years",
        "credit_age_months",
        "credit_score",
        "derogatory_marks",
        "credit_utilization_pct",
        "total_credit_limit",
        "number_of_accounts",
        "payment_schedule",
        "selected_package_id",
    ];
    const missingFields = required.filter(
        (k) => values[k] === "" || values[k] === null || values[k] === undefined,
    );
    const isValid = missingFields.length === 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) {
            toast.error("Please complete all required fields");
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                ...values,
                payment_history_pct: Number(values.payment_history_pct),
                credit_age_years: Number(values.credit_age_years),
                credit_age_months: Number(values.credit_age_months),
                credit_score: Number(values.credit_score),
                derogatory_marks: Number(values.derogatory_marks),
                credit_utilization_pct: Number(values.credit_utilization_pct),
                total_credit_limit: Number(values.total_credit_limit),
                number_of_accounts: Number(values.number_of_accounts),
                hard_inquiries: Number(values.hard_inquiries || 0),
            };

            const res = await api.post("/applications", payload);
            const application = res.data;
            toast.success("Application submitted — redirecting to secure checkout");

            const origin = window.location.origin;
            const checkout = await api.post("/payments/checkout/session", {
                application_id: application.id,
                origin_url: origin,
            });

            if (checkout.data?.url) {
                window.location.href = checkout.data.url;
            } else {
                toast.error("Unable to initialize checkout");
                navigate("/cancel");
            }
        } catch (err) {
            const detail =
                err?.response?.data?.detail ||
                err?.message ||
                "Something went wrong";
            toast.error(typeof detail === "string" ? detail : "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white">
            <section className="bg-slate-50 border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
                    <div className="max-w-3xl">
                        <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--brand-primary))] font-semibold">
                            Free qualifier · ~3 minutes
                        </div>
                        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tighter">
                            See your profile like a lender sees it.
                        </h1>
                        <p className="mt-4 text-slate-600 text-pretty">
                            Fill out your credit factors and watch the dashboard light up
                            in real time. Then pick your plan and pay securely via Stripe.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="lg:col-span-7 space-y-8"
                            data-testid="qualifier-form"
                        >
                            <SectionHeader
                                step="01"
                                title="Your details"
                                subtitle="We'll never share your info."
                            />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="Full name" required>
                                    <Input
                                        value={values.full_name}
                                        onChange={setField("full_name")}
                                        placeholder="Jane Doe"
                                        data-testid="input-full-name"
                                    />
                                </Field>
                                <Field label="Email" required>
                                    <Input
                                        type="email"
                                        value={values.email}
                                        onChange={setField("email")}
                                        placeholder="jane@email.com"
                                        data-testid="input-email"
                                    />
                                </Field>
                                <Field label="Phone" required>
                                    <Input
                                        type="tel"
                                        value={values.phone}
                                        onChange={setField("phone")}
                                        placeholder="(555) 123-4567"
                                        data-testid="input-phone"
                                    />
                                </Field>
                            </div>

                            <SectionHeader
                                step="02"
                                title="Credit factors"
                                subtitle="Enter the numbers as they show in your credit app."
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                    label="Credit score"
                                    required
                                    helper="300 – 850"
                                >
                                    <Input
                                        type="number"
                                        min={300}
                                        max={850}
                                        value={values.credit_score}
                                        onChange={setField("credit_score")}
                                        placeholder="590"
                                        data-testid="input-credit-score"
                                    />
                                </Field>
                                <Field
                                    label="Payment history (%)"
                                    required
                                    helper="0–100%"
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={values.payment_history_pct}
                                        onChange={setField("payment_history_pct")}
                                        placeholder="82"
                                        data-testid="input-payment-history"
                                    />
                                </Field>

                                <Field
                                    label="Credit utilization (%)"
                                    required
                                    helper="Under 10% is excellent"
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        max={200}
                                        value={values.credit_utilization_pct}
                                        onChange={setField("credit_utilization_pct")}
                                        placeholder="68"
                                        data-testid="input-utilization"
                                    />
                                </Field>
                                <Field
                                    label="Derogatory marks"
                                    required
                                    helper="Collections, charge-offs, etc."
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        value={values.derogatory_marks}
                                        onChange={setField("derogatory_marks")}
                                        placeholder="3"
                                        data-testid="input-derogatory"
                                    />
                                </Field>

                                <Field
                                    label="Credit age — years"
                                    required
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        max={80}
                                        value={values.credit_age_years}
                                        onChange={setField("credit_age_years")}
                                        placeholder="6"
                                        data-testid="input-age-years"
                                    />
                                </Field>
                                <Field
                                    label="Credit age — months"
                                    required
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        max={11}
                                        value={values.credit_age_months}
                                        onChange={setField("credit_age_months")}
                                        placeholder="2"
                                        data-testid="input-age-months"
                                    />
                                </Field>

                                <Field
                                    label="Total credit limit ($)"
                                    required
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        value={values.total_credit_limit}
                                        onChange={setField("total_credit_limit")}
                                        placeholder="2500"
                                        data-testid="input-credit-limit"
                                    />
                                </Field>
                                <Field
                                    label="Number of accounts"
                                    required
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        value={values.number_of_accounts}
                                        onChange={setField("number_of_accounts")}
                                        placeholder="8"
                                        data-testid="input-accounts"
                                    />
                                </Field>
                                <Field label="Hard inquiries (last 12mo)">
                                    <Input
                                        type="number"
                                        min={0}
                                        value={values.hard_inquiries}
                                        onChange={setField("hard_inquiries")}
                                        placeholder="0"
                                        data-testid="input-hard-inquiries"
                                    />
                                </Field>
                            </div>

                            <SectionHeader
                                step="03"
                                title="Package & payment"
                                subtitle="All plans cover a 3-month posting cycle."
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="Select package" required>
                                    <Select
                                        value={values.selected_package_id}
                                        onValueChange={(v) =>
                                            setValues((prev) => ({
                                                ...prev,
                                                selected_package_id: v,
                                            }))
                                        }
                                    >
                                        <SelectTrigger data-testid="select-package">
                                            <SelectValue placeholder="Choose a tradeline" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {packages.bundles?.length > 0 && (
                                                <>
                                                    <div className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-slate-500">
                                                        Bundles
                                                    </div>
                                                    {packages.bundles.map((p) => (
                                                        <SelectItem
                                                            key={p.id}
                                                            value={p.id}
                                                            data-testid={`select-option-${p.id}`}
                                                        >
                                                            {p.name} — ${p.price}
                                                            {p.badge ? " · Most Popular" : ""}
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            )}
                                            {packages.individual?.length > 0 && (
                                                <>
                                                    <div className="px-2 py-1.5 mt-1 text-[10px] uppercase tracking-widest text-slate-500">
                                                        Individual
                                                    </div>
                                                    {packages.individual.map((p) => (
                                                        <SelectItem
                                                            key={p.id}
                                                            value={p.id}
                                                            data-testid={`select-option-${p.id}`}
                                                        >
                                                            {p.name} — ${p.price}
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field label="Payment schedule" required>
                                    <Select
                                        value={values.payment_schedule}
                                        onValueChange={(v) =>
                                            setValues((prev) => ({
                                                ...prev,
                                                payment_schedule: v,
                                            }))
                                        }
                                    >
                                        <SelectTrigger data-testid="select-schedule">
                                            <SelectValue placeholder="Choose a pace" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SCHEDULES.map((s) => (
                                                <SelectItem
                                                    key={s.value}
                                                    value={s.value}
                                                    data-testid={`select-schedule-${s.value}`}
                                                >
                                                    {s.label} · {s.helper}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <Field label="Notes (optional)">
                                <Textarea
                                    rows={3}
                                    value={values.notes}
                                    onChange={setField("notes")}
                                    placeholder="Anything we should know about your goal?"
                                    data-testid="input-notes"
                                />
                            </Field>

                            {/* Summary */}
                            {selectedPackage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-start gap-4"
                                    data-testid="order-summary"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--brand-primary))] text-white">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs uppercase tracking-widest text-slate-500">
                                            Order summary
                                        </div>
                                        <div className="font-display text-lg font-bold">
                                            {selectedPackage.name} · ${selectedPackage.price}
                                        </div>
                                        {computedAmount && (
                                            <div className="text-sm text-slate-600">
                                                First charge:{" "}
                                                <span className="font-semibold text-slate-900">
                                                    ${computedAmount.amount.toFixed(2)}
                                                </span>{" "}
                                                {computedAmount.suffix}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={!isValid || submitting}
                                    className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white rounded-md h-12 px-6 text-base font-semibold w-full sm:w-auto"
                                    data-testid="submit-qualifier"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating checkout…
                                        </>
                                    ) : (
                                        <>
                                            Continue to secure checkout
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Lock className="h-3.5 w-3.5" />
                                    Stripe encrypted · Your card info never touches our servers.
                                </div>
                            </div>

                            {!isValid && missingFields.length > 0 && (
                                <p className="text-xs text-slate-500">
                                    {missingFields.length} field
                                    {missingFields.length > 1 ? "s" : ""} remaining
                                </p>
                            )}
                        </form>

                        {/* LIVE DASHBOARD */}
                        <aside className="lg:col-span-5">
                            <div className="lg:sticky lg:top-24">
                                <LiveDashboard values={values} />
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}

function SectionHeader({ step, title, subtitle }) {
    return (
        <div className="flex items-end gap-4 border-b border-slate-200 pb-3">
            <div className="font-display text-3xl font-black text-[hsl(var(--brand-primary))] opacity-30 tabular-nums">
                {step}
            </div>
            <div>
                <h3 className="font-display text-xl font-bold tracking-tight">
                    {title}
                </h3>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
        </div>
    );
}

function Field({ label, required, helper, children }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-[0.14em] text-slate-600 font-semibold">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            {children}
            {helper && <p className="text-[11px] text-slate-500">{helper}</p>}
        </div>
    );
}
