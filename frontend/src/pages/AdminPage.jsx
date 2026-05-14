import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";

export default function AdminPage() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const r = await api.get("/applications");
            setApps(r.data || []);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, []);

    return (
        <div className="bg-slate-50 min-h-[80vh]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Applications
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {apps.length} total submissions
                        </p>
                    </div>
                    <Button
                        onClick={load}
                        variant="outline"
                        className="rounded-md border-slate-300"
                        data-testid="admin-refresh"
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                </div>

                <div className="mt-8 rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Package</TableHead>
                                <TableHead>Schedule</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && apps.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                                        No applications yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading &&
                                apps.map((a) => (
                                    <TableRow key={a.id} data-testid={`admin-row-${a.id}`}>
                                        <TableCell className="text-xs text-slate-500">
                                            {new Date(a.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {a.full_name}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            <div>{a.email}</div>
                                            <div className="text-xs text-slate-400">
                                                {a.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {a.credit_score}
                                        </TableCell>
                                        <TableCell>{a.selected_package_name}</TableCell>
                                        <TableCell className="capitalize">
                                            {String(a.payment_schedule).replace("_", " ")}
                                        </TableCell>
                                        <TableCell>${a.selected_package_price}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    a.status === "paid"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-slate-100 text-slate-700"
                                                }
                                            >
                                                {a.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
