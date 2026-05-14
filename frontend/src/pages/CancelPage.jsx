import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";

export default function CancelPage() {
    return (
        <div className="min-h-[80vh] bg-white flex items-center" data-testid="cancel-page">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-20 text-center">
                <RotateCcw className="mx-auto h-14 w-14 text-slate-400" />
                <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Checkout cancelled
                </h1>
                <p className="mt-3 text-slate-600">
                    No problem — your application is still saved. Resume whenever you're
                    ready. No charges were made.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        asChild
                        className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white rounded-md h-11 px-6"
                    >
                        <Link to="/qualifier">Return to qualifier</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-11 px-6 rounded-md border-slate-300"
                    >
                        <Link to="/pricing">View plans</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
