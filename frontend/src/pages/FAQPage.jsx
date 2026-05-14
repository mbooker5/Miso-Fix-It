import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";

const FAQS = [
    {
        q: "What is a tradeline and how does it actually work?",
        a: "A tradeline is any credit account on your report. We add you as an authorized user to an aged primary account with perfect payment history. When that account reports to the bureaus, the entire history (age, limit, utilization, and on-time payments) mirrors onto your report — typically within 30–45 days.",
    },
    {
        q: "Is this legal?",
        a: "Yes. Adding authorized users is a long-standing feature of every major card issuer (Amex, Visa, Mastercard). FCRA allows authorized-user histories to report to the consumer's credit file. We do not alter your existing accounts in any way.",
    },
    {
        q: "How many points will my score go up?",
        a: "It depends on your starting profile. Clients with thin files (<3 accounts) typically see 40–80 point lifts per tradeline. Clients with high utilization often see 60–120 points. Results vary by scoring model (FICO 8, FICO 9, VantageScore).",
    },
    {
        q: "When does the tradeline post?",
        a: "Every card has a monthly statement cut date. Once we add you, your line reports within the next 1–2 statement cycles (usually 15–35 days). We guarantee posting within one cycle or you get a full refund.",
    },
    {
        q: "Do I get a physical card?",
        a: "No. You are added as an authorized user for reporting purposes only. You never receive the card and cannot make charges on the account — keeping the primary user's history untouched and your profile safe.",
    },
    {
        q: "What if I need to cancel?",
        a: "Contact us within 48 hours of purchase for a full refund. After posting, the tradeline remains on your report for the 3-month term. We do not offer partial refunds after the posting date.",
    },
    {
        q: "Do weekly/biweekly payments charge more?",
        a: "No. The total you pay is identical regardless of schedule. We simply divide the package price across 13 weeks, 6 biweekly periods, 3 months, or a single deposit.",
    },
];

export default function FAQPage() {
    return (
        <div className="bg-white">
            <section className="bg-slate-50 border-b border-slate-200">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
                        Questions, answered.
                    </h1>
                    <p className="mt-4 text-slate-600 max-w-xl mx-auto text-pretty">
                        Everything you need to know about tradelines, posting, and the
                        Miso Fix It process.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <Accordion type="single" collapsible className="w-full">
                        {FAQS.map((item, i) => (
                            <AccordionItem
                                key={item.q}
                                value={`item-${i}`}
                                data-testid={`faq-item-${i}`}
                            >
                                <AccordionTrigger className="text-left font-display text-lg font-semibold">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 leading-relaxed text-base">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
