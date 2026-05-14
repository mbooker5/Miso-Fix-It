import {
    CreditCard,
    CalendarClock,
    AlertOctagon,
    Clock3,
    Layers,
    Search,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import FactorCard from "./FactorCard";
import {
    utilizationBand,
    paymentHistoryBand,
    derogatoryBand,
    creditAgeBand,
    totalAccountsBand,
    hardInquiriesBand,
    formatAge,
} from "../lib/creditFactors";

export default function LiveDashboard({ values }) {
    const {
        credit_score,
        credit_utilization_pct,
        payment_history_pct,
        derogatory_marks,
        credit_age_years,
        credit_age_months,
        number_of_accounts,
        hard_inquiries,
    } = values;

    const fmtPct = (v) =>
        v === "" || v === null || v === undefined ? "--%" : `${Number(v)}%`;

    return (
        <div
            className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm"
            data-testid="live-dashboard"
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Live preview
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
                        Your credit factors
                    </h3>
                    <p className="text-sm text-slate-500 text-pretty">
                        Watch your profile update in real time as you type.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <ScoreGauge
                    score={credit_score}
                    label="TransUnion"
                    testId="live-score-gauge-tu"
                />
                <ScoreGauge
                    score={
                        credit_score === "" || credit_score === null
                            ? credit_score
                            : Number(credit_score) + 1
                    }
                    label="Equifax"
                    testId="live-score-gauge-eq"
                />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FactorCard
                    testId="factor-utilization"
                    impact="High impact"
                    title="Credit utilization"
                    value={fmtPct(credit_utilization_pct)}
                    band={utilizationBand(credit_utilization_pct)}
                    icon={CreditCard}
                />
                <FactorCard
                    testId="factor-payment-history"
                    impact="High impact"
                    title="Payment history"
                    value={fmtPct(payment_history_pct)}
                    band={paymentHistoryBand(payment_history_pct)}
                    icon={CalendarClock}
                />
                <FactorCard
                    testId="factor-derogatory"
                    impact="High impact"
                    title="Derogatory"
                    value={
                        derogatory_marks === "" ||
                        derogatory_marks === null ||
                        derogatory_marks === undefined
                            ? "—"
                            : Number(derogatory_marks)
                    }
                    band={derogatoryBand(derogatory_marks)}
                    icon={AlertOctagon}
                />
                <FactorCard
                    testId="factor-credit-age"
                    impact="Medium impact"
                    title="Credit age"
                    value={formatAge(credit_age_years, credit_age_months)}
                    band={creditAgeBand(credit_age_years, credit_age_months)}
                    icon={Clock3}
                />
                <FactorCard
                    testId="factor-total-accounts"
                    impact="Low impact"
                    title="Total accounts"
                    value={
                        number_of_accounts === "" ||
                        number_of_accounts === null ||
                        number_of_accounts === undefined
                            ? "—"
                            : Number(number_of_accounts)
                    }
                    band={totalAccountsBand(number_of_accounts)}
                    icon={Layers}
                />
                <FactorCard
                    testId="factor-hard-inquiries"
                    impact="Low impact"
                    title="Hard inquiries"
                    value={
                        hard_inquiries === "" ||
                        hard_inquiries === null ||
                        hard_inquiries === undefined
                            ? "0"
                            : Number(hard_inquiries)
                    }
                    band={hardInquiriesBand(
                        hard_inquiries === "" ||
                            hard_inquiries === null ||
                            hard_inquiries === undefined
                            ? 0
                            : hard_inquiries,
                    )}
                    icon={Search}
                />
            </div>
        </div>
    );
}
