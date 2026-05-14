import { useMemo } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { scoreBand, STATUS_META } from "../lib/creditFactors";

export default function ScoreGauge({ score, label = "TransUnion", testId }) {
    const numeric = Number(score);
    const hasScore = score !== "" && score !== null && score !== undefined && !isNaN(numeric);
    const capped = hasScore ? Math.min(850, Math.max(300, numeric)) : 300;
    const band = scoreBand(hasScore ? capped : undefined);
    const meta = STATUS_META[band];
    // Map 300-850 → 0-100
    const pct = useMemo(() => ((capped - 300) / 550) * 100, [capped]);

    return (
        <div
            className="flex flex-col items-center"
            data-testid={testId || "score-gauge"}
        >
            <div className="relative h-40 w-56">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={18}
                        data={[{ value: hasScore ? pct : 0 }]}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: "#E2E8F0" }}
                            dataKey="value"
                            cornerRadius={10}
                            fill={meta.color}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
                    <div
                        className="font-display text-4xl font-bold tracking-tight"
                        data-testid={`${testId || "score-gauge"}-value`}
                    >
                        {hasScore ? Math.round(capped) : "—"}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        {label}
                    </div>
                </div>
            </div>
            <div
                className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.text} border ${meta.border}`}
                data-testid={`${testId || "score-gauge"}-band`}
            >
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                {hasScore ? meta.label : "Awaiting input"}
            </div>
        </div>
    );
}
