import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

const MAX_ATTEMPTS = 8;
const POLL_MS = 2500;

export default function SuccessPage() {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const [status, setStatus] = useState("pending"); // pending | paid | failed | timeout
    const [info, setInfo] = useState(null);
    const attempts = useRef(0);
    const timer = useRef(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("failed");
            return;
        }

        const poll = async () => {
            attempts.current += 1;
            try {
                const res = await api.get(`/payments/checkout/status/${sessionId}`);
                const data = res.data;
                setInfo(data);
                if (data.payment_status === "paid") {
                    setStatus("paid");
                    return;
                }
                if (data.status === "expired") {
                    setStatus("failed");
                    return;
                }
                if (attempts.current >= MAX_ATTEMPTS) {
                    setStatus("timeout");
                    return;
                }
                timer.current = setTimeout(poll, POLL_MS);
            } catch {
                if (attempts.current >= MAX_ATTEMPTS) {
                    setStatus("failed");
                } else {
                    timer.current = setTimeout(poll, POLL_MS);
                }
            }
        };
        poll();
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [sessionId]);

    return (
        <div className="min-h-[80vh] bg-white flex items-center" data-testid="success-page">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
                {status === "pending" && (
                    <>
                        <Loader2 className="mx-auto h-14 w-14 text-[hsl(var(--brand-primary))] animate-spin" />
                        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Confirming payment…
                        </h1>
                        <p className="mt-3 text-slate-600">
                            Just a moment while Stripe confirms your order.
                        </p>
                    </>
                )}
                {status === "paid" && (
                    <>
                        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
                        <h1 className="mt-6 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                            You're in.
                        </h1>
                        <p className="mt-4 text-slate-600 max-w-lg mx-auto">
                            We received your payment
                            {info?.amount
                                ? ` of $${Number(info.amount).toFixed(2)}`
                                : ""}
                            . A specialist will email you within 1 business hour to confirm
                            your posting window and next steps.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                asChild
                                className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white rounded-md h-11 px-6"
                            >
                                <Link to="/">Return home</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 px-6 rounded-md border-slate-300"
                            >
                                <Link to="/faq">Read what's next</Link>
                            </Button>
                        </div>
                    </>
                )}
                {(status === "failed" || status === "timeout") && (
                    <>
                        <XCircle className="mx-auto h-14 w-14 text-red-500" />
                        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                            {status === "timeout"
                                ? "We're still confirming…"
                                : "Payment not completed"}
                        </h1>
                        <p className="mt-3 text-slate-600 max-w-lg mx-auto">
                            {status === "timeout"
                                ? "Your confirmation is taking longer than expected. You'll receive an email once it lands — no action needed from you."
                                : "We couldn't confirm your payment session. Don't worry — no charges were completed. Try again when ready."}
                        </p>
                        <Button
                            asChild
                            className="mt-8 bg-slate-900 hover:bg-slate-800 text-white rounded-md h-11 px-6"
                        >
                            <Link to="/qualifier">Back to qualifier</Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
