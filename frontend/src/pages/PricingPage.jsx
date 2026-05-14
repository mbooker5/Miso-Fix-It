import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import PricingCard from "../components/PricingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, Handshake } from "lucide-react";

export default function PricingPage() {
    const [data, setData] = useState({ individual: [], bundles: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/packages")
            .then((r) => setData(r.data))
            .finally(() => setLoading(false));
    }, []);

    const qualifierLink = (id) => `/qualifier?package=${id}`;

    return (
        <div className="bg-white">
            <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
                <div className="absolute inset-0 bg-grid-dense opacity-60 pointer-events-none" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                            3-month posting term · Pay weekly, biweekly, monthly, or once
                        </div>
                        <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-slate-900">
                            Simple, transparent tradeline pricing.
                        </h1>
                        <p className="mt-5 text-lg text-slate-600 max-w-2xl text-pretty">
                            Every tradeline is aged, verified, and has perfect payment history.
                            Pick an individual line — or stack bundles for serious profile lifts.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Tabs defaultValue="bundles" className="w-full">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <TabsList
                                className="bg-slate-100 p-1 rounded-lg"
                                data-testid="pricing-tabs"
                            >
                                <TabsTrigger
                                    value="bundles"
                                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                    data-testid="tab-bundles"
                                >
                                    Bundle Packages
                                </TabsTrigger>
                                <TabsTrigger
                                    value="individual"
                                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                    data-testid="tab-individual"
                                >
                                    Individual Tradelines
                                </TabsTrigger>
                            </TabsList>
                            <div className="text-xs text-slate-500">
                                All pricing in USD · 3-month posting cycle
                            </div>
                        </div>

                        <TabsContent value="bundles" className="mt-10">
                            {loading ? (
                                <GridSkeleton count={6} />
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {data.bundles.map((pkg) => (
                                        <PricingCard
                                            key={pkg.id}
                                            pkg={pkg}
                                            featured={pkg.badge === "MOST POPULAR"}
                                            ctaLabel="Qualify & checkout"
                                            linkTo={qualifierLink(pkg.id)}
                                            testId={`pricing-card-${pkg.id}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="individual" className="mt-10">
                            {loading ? (
                                <GridSkeleton count={4} />
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    {data.individual.map((pkg) => (
                                        <PricingCard
                                            key={pkg.id}
                                            pkg={pkg}
                                            ctaLabel="Qualify & checkout"
                                            linkTo={qualifierLink(pkg.id)}
                                            testId={`pricing-card-${pkg.id}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Payment schedule */}
            <section className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-10 items-start">
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--brand-primary))] font-semibold">
                                Flexible payments
                            </div>
                            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                                Pay your way. No interest. No surprises.
                            </h2>
                            <p className="mt-4 text-slate-600">
                                Choose the pace that matches your cashflow. Every schedule
                                covers the same 3-month tradeline term — the only difference
                                is how you break up the total.
                            </p>
                        </div>

                        <div className="grid gap-3">
                            {[
                                { label: "Weekly", helper: "Total ÷ 13 weeks" },
                                { label: "Biweekly", helper: "Total ÷ 6 pays" },
                                { label: "Monthly", helper: "Total ÷ 3 months" },
                                {
                                    label: "Straight deposit",
                                    helper: "Pay once, full term covered",
                                },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="flex items-center justify-between rounded-xl bg-white border border-slate-200 p-4"
                                >
                                    <div>
                                        <div className="font-display font-semibold text-slate-900">
                                            {s.label}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {s.helper}
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--brand-primary))]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner program */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--brand-ink))] text-white p-10 md:p-14 relative overflow-hidden">
                        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[hsl(var(--brand-accent))]/20 blur-3xl" />
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                                <Handshake className="h-3.5 w-3.5" /> Partner referral program
                            </div>
                            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight">
                                Earn 20% — paid after tradeline posts.
                            </h2>
                            <p className="mt-4 text-slate-300 max-w-xl">
                                Built for credit repair companies and affiliates. No fulfillment
                                work. Straightforward payouts.
                            </p>

                            <div className="mt-8 grid sm:grid-cols-2 gap-3">
                                {[
                                    ["Starter Builder $525", "$105"],
                                    ["Credit Builder Plus $625", "$125"],
                                    ["High Limit Flex $675", "$135"],
                                    ["Amex Power Pack $725", "$145"],
                                    ["Limit Booster $795", "$159"],
                                    ["Ultimate Boost $1,075", "$215"],
                                ].map(([k, v]) => (
                                    <div
                                        key={k}
                                        className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 p-4"
                                    >
                                        <span className="text-sm text-slate-200">{k}</span>
                                        <span className="font-display font-bold text-[hsl(var(--brand-accent))]">
                                            {v}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                asChild
                                className="mt-8 bg-white text-slate-900 hover:bg-slate-100 rounded-md h-11 px-5 font-semibold"
                                data-testid="partner-cta"
                            >
                                <Link to="/qualifier">
                                    Get started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function GridSkeleton({ count }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="h-96 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse"
                />
            ))}
        </div>
    );
}
