import { STATUS_META } from "../lib/creditFactors";

export default function FactorCard({
    impact = "High impact",
    title,
    value,
    band = "unknown",
    icon: Icon,
    testId,
    subValue,
}) {
    const meta = STATUS_META[band] || STATUS_META.unknown;
    return (
        <div
            className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
            data-testid={testId}
        >
            <div className="flex items-start justify-between">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    {impact}
                </div>
                {Icon && (
                    <div className="text-slate-400 transition-colors group-hover:text-[hsl(var(--brand-primary))]">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
            </div>
            <div className="mt-1.5 font-display text-lg font-bold leading-tight text-slate-900">
                {title}
            </div>
            <div className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900">
                {value}
            </div>
            {subValue && (
                <div className="mt-0.5 text-xs text-slate-500">{subValue}</div>
            )}
            <div className="mt-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                <span className={`text-xs font-semibold ${meta.text}`}>
                    {meta.label}
                </span>
            </div>
        </div>
    );
}
