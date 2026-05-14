import { Check, Star, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function PricingCard({
    pkg,
    featured = false,
    ctaLabel = "Select package",
    onSelect,
    linkTo,
    testId,
}) {
    const benefits = pkg.benefits || [];
    const body = (
        <div
            className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 md:p-8 transition-all ${
                featured
                    ? "popular-glow border-transparent shadow-xl"
                    : "border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            }`}
        >
            {featured && (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--brand-primary))] text-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-md">
                    <Star className="h-3 w-3 fill-white" />
                    Most Popular
                </div>
            )}
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                        {pkg.kind === "bundle" ? "Bundle" : "Individual"}
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight">
                        {pkg.name}
                    </h3>
                    {pkg.tagline && (
                        <p className="mt-1 text-sm text-slate-500">{pkg.tagline}</p>
                    )}
                </div>
                {pkg.limit && (
                    <div className="text-right">
                        <div className="text-[11px] uppercase tracking-widest text-slate-400">
                            Limit
                        </div>
                        <div className="font-display text-base font-bold">
                            ${pkg.limit.toLocaleString()}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-baseline gap-2">
                <div className="font-display text-5xl font-extrabold tracking-tight text-slate-900">
                    ${pkg.price}
                </div>
                <div className="text-sm text-slate-500">/ 3-month term</div>
            </div>

            {pkg.age && (
                <div className="mt-1 text-xs text-slate-500">
                    Aged · {pkg.age}
                </div>
            )}
            {pkg.added_credit && (
                <div className="mt-1 text-xs font-medium text-[hsl(var(--brand-primary))]">
                    <Sparkles className="inline h-3 w-3 mr-1" />
                    Adds ${pkg.added_credit.toLocaleString()}+ available credit
                </div>
            )}

            {pkg.includes && pkg.includes.length > 0 && (
                <div className="mt-5">
                    <div className="text-[11px] uppercase tracking-widest text-slate-400">
                        Includes
                    </div>
                    <ul className="mt-2 space-y-1">
                        {pkg.includes.map((i) => (
                            <li
                                key={i}
                                className="text-sm text-slate-700 flex items-center gap-2"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-primary))]" />
                                {i}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <ul className="mt-6 space-y-2.5 flex-1">
                {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                        <div
                            className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                                featured
                                    ? "bg-[hsl(var(--brand-primary))] text-white"
                                    : "bg-emerald-100 text-emerald-700"
                            }`}
                        >
                            <Check className="h-3 w-3" />
                        </div>
                        {b}
                    </li>
                ))}
            </ul>

            <div className="mt-8">
                {linkTo ? (
                    <Button
                        asChild
                        className={`w-full rounded-md font-semibold ${
                            featured
                                ? "bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white"
                                : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                        data-testid={testId}
                    >
                        <Link to={linkTo}>{ctaLabel}</Link>
                    </Button>
                ) : (
                    <Button
                        onClick={onSelect}
                        className={`w-full rounded-md font-semibold ${
                            featured
                                ? "bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white"
                                : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                        data-testid={testId}
                    >
                        {ctaLabel}
                    </Button>
                )}
            </div>
        </div>
    );
    return body;
}
