// Credit factor scoring thresholds based on standard credit-bureau logic.
// Status values: "excellent" | "good" | "fair" | "needs_work" | "unknown"

export const STATUS_META = {
    excellent: {
        label: "Excellent",
        color: "hsl(var(--status-excellent))",
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
    },
    good: {
        label: "Good",
        color: "hsl(var(--status-good))",
        dot: "bg-yellow-500",
        text: "text-yellow-800",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
    },
    fair: {
        label: "Fair",
        color: "hsl(var(--status-fair))",
        dot: "bg-amber-500",
        text: "text-amber-800",
        bg: "bg-amber-50",
        border: "border-amber-200",
    },
    needs_work: {
        label: "Needs Work",
        color: "hsl(var(--status-needs-work))",
        dot: "bg-red-500",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
    },
    unknown: {
        label: "—",
        color: "hsl(215 16% 70%)",
        dot: "bg-slate-300",
        text: "text-slate-500",
        bg: "bg-slate-50",
        border: "border-slate-200",
    },
};

export function scoreBand(score) {
    if (score === null || score === undefined || score === "" || isNaN(score))
        return "unknown";
    const s = Number(score);
    if (s >= 740) return "excellent";
    if (s >= 670) return "good";
    if (s >= 580) return "fair";
    return "needs_work";
}

export function utilizationBand(pct) {
    if (pct === "" || pct === null || pct === undefined || isNaN(pct))
        return "unknown";
    const v = Number(pct);
    if (v <= 10) return "excellent";
    if (v <= 30) return "good";
    if (v <= 50) return "fair";
    return "needs_work";
}

export function paymentHistoryBand(pct) {
    if (pct === "" || pct === null || pct === undefined || isNaN(pct))
        return "unknown";
    const v = Number(pct);
    if (v >= 99) return "excellent";
    if (v >= 95) return "good";
    if (v >= 85) return "fair";
    return "needs_work";
}

export function derogatoryBand(count) {
    if (count === "" || count === null || count === undefined || isNaN(count))
        return "unknown";
    const v = Number(count);
    if (v === 0) return "excellent";
    if (v <= 1) return "good";
    if (v <= 2) return "fair";
    return "needs_work";
}

export function creditAgeBand(years, months) {
    const y = Number(years) || 0;
    const m = Number(months) || 0;
    if (y === 0 && m === 0 && (years === "" || years === null)) return "unknown";
    const total = y + m / 12;
    if (total >= 10) return "excellent";
    if (total >= 5) return "good";
    if (total >= 2) return "fair";
    return "needs_work";
}

export function totalAccountsBand(count) {
    if (count === "" || count === null || count === undefined || isNaN(count))
        return "unknown";
    const v = Number(count);
    if (v >= 10) return "excellent";
    if (v >= 5) return "good";
    if (v >= 3) return "fair";
    return "needs_work";
}

export function hardInquiriesBand(count) {
    if (count === "" || count === null || count === undefined || isNaN(count))
        return "unknown";
    const v = Number(count);
    if (v === 0) return "excellent";
    if (v <= 1) return "good";
    if (v <= 3) return "fair";
    return "needs_work";
}

export function formatAge(years, months) {
    const y = Number(years) || 0;
    const m = Number(months) || 0;
    if (!years && !months) return "—";
    if (y && m) return `${y} yr, ${m} mo`;
    if (y) return `${y} yr`;
    return `${m} mo`;
}
