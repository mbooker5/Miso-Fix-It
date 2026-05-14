import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ShieldCheck,
    Clock3,
    TrendingUp,
    Award,
    Lock,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";

const valueProps = [
    {
        icon: TrendingUp,
        title: "Score lift in 45–60 days",
        body: "Our authorized-user tradelines post on all three bureaus and typically lift scores 40–120 points per reporting cycle.",
    },
    {
        icon: Clock3,
        title: "Aged accounts — real history",
        body: "Every tradeline we offer is 1.5+ years old with perfect payment history. No seasoned knock-offs.",
    },
    {
        icon: ShieldCheck,
        title: "Guaranteed posting or refund",
        body: "If your tradeline doesn't post within one statement cycle, you'll receive a full refund — no questions asked.",
    },
    {
        icon: Lock,
        title: "Bank-grade security",
        body: "Your data is encrypted end-to-end. We never sell or share your information with third parties.",
    },
];

const steps = [
    {
        step: "01",
        title: "Run your free credit profile check",
        body: "Input your credit factors in our qualifier and see exactly which tradeline will maximize your score.",
    },
    {
        step: "02",
        title: "Pick a plan that fits your budget",
        body: "Pay weekly, biweekly, monthly, or one-time. Transparent pricing — no hidden fees ever.",
    },
    {
        step: "03",
        title: "Tradeline posts and scores climb",
        body: "Your new authorized-user account reports to all 3 bureaus. Watch your score jump within 30–45 days.",
    },
];

export default function HomePage() {
    return (
        <div className="relative">
            {/* HERO */}
            <section className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-grid pointer-events-none" />
                <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[hsl(var(--brand-accent))]/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-[hsl(var(--brand-primary))]/10 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Now accepting new clients — 3-month posting cycle
                        </div>

                        <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 leading-[0.95]">
                            Rebuild your credit
                            <br />
                            with <span className="text-[hsl(var(--brand-primary))]">premium</span>{" "}
                            tradelines.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed text-pretty">
                            Authorized-user accounts from real Amex, Capital One, and Wells
                            Fargo cards. Aged history, perfect payment record, and posted to all
                            three bureaus. <span className="font-semibold text-slate-900">A $57k credit profile makeover</span>{" "}
                            is 3 months away.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-3">
                            <Button
                                asChild
                                className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white rounded-md h-12 px-6 text-base font-semibold"
                                data-testid="hero-cta-qualifier"
                            >
                                <Link to="/qualifier">
                                    Start free qualifier
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-12 px-6 text-base font-semibold rounded-md border-slate-300 hover:border-slate-900 hover:text-slate-900"
                                data-testid="hero-cta-pricing"
                            >
                                <Link to="/pricing">See pricing</Link>
                            </Button>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-[hsl(var(--brand-primary))]" />
                                <span>4.9 ★ avg client rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>2,400+ tradelines posted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-[hsl(var(--brand-primary))]" />
                                <span>Full refund guarantee</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating score card preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25 }}
                        className="hidden lg:block absolute right-8 top-28 w-[340px] rounded-2xl border border-slate-200 bg-white shadow-2xl p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Live score preview
                            </div>
                            <Sparkles className="h-4 w-4 text-[hsl(var(--brand-accent))]" />
                        </div>
                        <div className="mt-3 flex items-end justify-between">
                            <div>
                                <div className="text-xs text-slate-500">
                                    Before
                                </div>
                                <div className="font-display text-3xl font-bold text-slate-900">
                                    590
                                </div>
                                <div className="text-[11px] text-red-600 font-semibold">
                                    Needs Work
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-slate-400" />
                            <div>
                                <div className="text-xs text-slate-500">
                                    After
                                </div>
                                <div className="font-display text-3xl font-bold text-emerald-600">
                                    724
                                </div>
                                <div className="text-[11px] text-emerald-600 font-semibold">
                                    Good
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <motion.div
                                initial={{ width: "32%" }}
                                animate={{ width: "78%" }}
                                transition={{ duration: 1.6, delay: 0.8 }}
                                className="h-full bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-accent))]"
                            />
                        </div>
                        <div className="mt-3 text-[11px] text-slate-500">
                            Avg. lift w/ Ultimate Credit Boost (past 30 days)
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* VALUE PROPS */}
            <section className="bg-slate-50 py-24 border-y border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--brand-primary))] font-semibold">
                            Why Miso Fix It
                        </div>
                        <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                            Built for real financial goals — not gimmicks.
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {valueProps.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.06 }}
                                className="rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--brand-primary))]/10 text-[hsl(var(--brand-primary))]">
                                    <v.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                                    {v.title}
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                    {v.body}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                        <div className="lg:col-span-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--brand-primary))] font-semibold">
                                How it works
                            </div>
                            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                                Three steps. One cleaner file.
                            </h2>
                            <p className="mt-4 text-slate-600">
                                From qualifier to posted tradeline in under 14 days.
                                No credit pull, no co-signer, no strings.
                            </p>
                            <Button
                                asChild
                                className="mt-8 bg-slate-900 hover:bg-slate-800 text-white rounded-md h-11 px-5"
                                data-testid="how-it-works-cta"
                            >
                                <Link to="/qualifier">
                                    Start qualifier
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="lg:col-span-8 grid gap-4">
                            {steps.map((s, i) => (
                                <motion.div
                                    key={s.step}
                                    initial={{ opacity: 0, x: 18 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6"
                                >
                                    <div className="font-display text-4xl font-black text-[hsl(var(--brand-primary))] opacity-30 tabular-nums">
                                        {s.step}
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-bold tracking-tight">
                                            {s.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                                            {s.body}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="bg-[hsl(var(--brand-ink))] text-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-4 text-center md:text-left">
                        {[
                            { k: "2,400+", v: "Tradelines posted" },
                            { k: "+112 pts", v: "Avg. score increase" },
                            { k: "98.7%", v: "On-time posting rate" },
                            { k: "$57k", v: "Peak credit added" },
                        ].map((s) => (
                            <div key={s.v}>
                                <div className="font-display text-4xl md:text-5xl font-black tracking-tight">
                                    {s.k}
                                </div>
                                <div className="mt-1 text-sm text-slate-300">
                                    {s.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white p-10 md:p-14">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[hsl(var(--brand-primary))]/10 blur-3xl" />
                        <div className="relative">
                            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 max-w-2xl">
                                Ready to see how your score could shift?
                            </h2>
                            <p className="mt-4 text-slate-600 max-w-xl text-pretty">
                                Our live qualifier is free and instant. See which tradeline
                                fits your profile — before you pay a cent.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <Button
                                    asChild
                                    className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white rounded-md h-12 px-6 text-base font-semibold"
                                    data-testid="cta-final-qualifier"
                                >
                                    <Link to="/qualifier">
                                        Start free qualifier
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-12 px-6 text-base font-semibold rounded-md border-slate-300"
                                >
                                    <Link to="/pricing">Browse tradelines</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
