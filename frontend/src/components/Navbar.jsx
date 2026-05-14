import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

const LINKS = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/qualifier", label: "Qualify" },
    { to: "/faq", label: "FAQ" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all ${
                scrolled
                    ? "bg-white/85 backdrop-blur-lg border-b border-slate-200"
                    : "bg-white border-b border-transparent"
            }`}
            data-testid="main-navbar"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 group"
                        data-testid="navbar-logo"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--brand-primary))] text-white shadow-sm transition-transform group-hover:-rotate-6">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="leading-tight">
                            <div className="font-display text-lg font-bold tracking-tight">
                                Miso <span className="text-[hsl(var(--brand-primary))]">Fix It</span>
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                Premium Tradelines
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {LINKS.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                data-testid={`nav-link-${l.label.toLowerCase()}`}
                                end={l.to === "/"}
                                className={({ isActive }) =>
                                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive
                                            ? "text-[hsl(var(--brand-primary))] bg-slate-100"
                                            : "text-slate-700 hover:text-[hsl(var(--brand-primary))] hover:bg-slate-50"
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            asChild
                            className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white rounded-md"
                            data-testid="navbar-cta-apply"
                        >
                            <Link to="/qualifier">Start Qualifier</Link>
                        </Button>
                    </div>

                    <button
                        className="md:hidden p-2 text-slate-700"
                        onClick={() => setOpen((v) => !v)}
                        data-testid="navbar-mobile-toggle"
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {open && (
                    <div className="md:hidden pb-4" data-testid="navbar-mobile-menu">
                        <div className="flex flex-col gap-1 border-t border-slate-200 pt-3">
                            {LINKS.map((l) => (
                                <NavLink
                                    key={l.to}
                                    to={l.to}
                                    end={l.to === "/"}
                                    className={({ isActive }) =>
                                        `px-3 py-3 rounded-md text-sm ${
                                            isActive
                                                ? "bg-slate-100 text-[hsl(var(--brand-primary))]"
                                                : "text-slate-700 hover:bg-slate-50"
                                        }`
                                    }
                                >
                                    {l.label}
                                </NavLink>
                            ))}
                            <Button
                                asChild
                                className="mt-2 bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white"
                            >
                                <Link to="/qualifier">Start Qualifier</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
