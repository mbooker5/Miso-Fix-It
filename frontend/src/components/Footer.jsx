import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer
            className="relative mt-24 bg-[hsl(var(--brand-ink))] text-white"
            data-testid="main-footer"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid gap-12 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent))] text-white">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <span className="font-display text-xl font-bold">
                                Miso Fix It
                            </span>
                        </div>
                        <p className="mt-5 max-w-md text-sm text-slate-300 leading-relaxed">
                            Premium authorized-user tradelines designed to
                            accelerate your credit profile. Aged accounts,
                            perfect history, transparent pricing. Engineered
                            for real-life financial goals — from mortgage
                            approvals to auto financing.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5" /> Bank-grade
                                security
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5" /> FCRA
                                compliant process
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Explore
                        </div>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link className="hover:text-[hsl(var(--brand-accent))]" to="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="hover:text-[hsl(var(--brand-accent))]"
                                    to="/pricing"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="hover:text-[hsl(var(--brand-accent))]"
                                    to="/qualifier"
                                >
                                    Start Qualifier
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-[hsl(var(--brand-accent))]" to="/faq">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Contact
                        </div>
                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-[hsl(var(--brand-accent))]" />
                                hello@misofixit.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-[hsl(var(--brand-accent))]" />
                                Mon–Fri, 9a–6p CT
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div>© {new Date().getFullYear()} Miso Fix It. All rights reserved.</div>
                    <div className="max-w-xl text-right sm:text-right text-[11px] leading-relaxed">
                        Miso Fix It is not a credit repair organization. Tradeline
                        enrollment is an authorized-user service. Results vary by
                        individual file and lender scoring model.
                    </div>
                </div>
            </div>
        </footer>
    );
}
