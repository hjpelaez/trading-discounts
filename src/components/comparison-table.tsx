"use client";

import { PropFirm } from "@/lib/data";
import { Check, X, ExternalLink, ShieldCheck, Zap, DollarSign, Scale } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

interface ComparisonTableProps {
    firms: PropFirm[];
    onRemove: (id: string) => void;
}

export function ComparisonTable({ firms, onRemove }: ComparisonTableProps) {
    const t = useTranslations('Compare');
    const locale = useLocale();

    if (firms.length === 0) return null;

    const metrics = [
        { label: t('metrics.rating'), key: "rating", icon: Zap, format: (v: number) => `★ ${v}` },
        { label: t('metrics.price'), key: "minPrice", icon: DollarSign, format: (v: number) => `$${v}` },
        { label: t('metrics.drawdown'), key: "drawdownType", icon: ShieldCheck },
        { label: t('metrics.leverage'), key: "maxLeverage", icon: Scale },
        { label: t('metrics.platforms'), key: "platforms", format: (v: string[]) => v.join(", ") },
    ];

    return (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
            <table className="w-full min-w-[600px] border-collapse">
                <thead>
                    <tr className="bg-muted/30">
                        <th className="p-6 text-left border-b w-[200px] bg-muted/50 font-bold uppercase text-xs tracking-wider text-muted-foreground">
                            Features & Specs
                        </th>
                        {firms.map((firm) => (
                            <th key={firm.id} className="p-6 text-center border-b border-l min-w-[200px] relative group">
                                <button
                                    onClick={() => onRemove(firm.id)}
                                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="space-y-4">
                                    <div className="h-16 w-16 bg-primary/10 rounded-xl mx-auto flex items-center justify-center text-primary font-bold text-xl">
                                        {firm.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{firm.name}</h3>
                                        <span className="text-primary font-bold text-sm">{firm.discount}</span>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {metrics.map((metric) => (
                        <tr key={metric.label} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4 bg-muted/20 font-medium">
                                <div className="flex items-center gap-2">
                                    {metric.icon && <metric.icon className="h-4 w-4 text-primary/60" />}
                                    {metric.label}
                                </div>
                            </td>
                            {firms.map((firm) => {
                                const value = (firm as PropFirm)[metric.key as keyof PropFirm];
                                return (
                                    <td key={firm.id} className="p-4 text-center border-l font-semibold">
                                        {metric.format
                                            ? (metric.format as (v: string | number | string[]) => string)(value as string | number | string[])
                                            : ((value as string | number | string[]) ?? "")}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}

                    <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 bg-muted/20 font-medium align-top">{t('metrics.features')}</td>
                        {firms.map((firm) => (
                            <td key={firm.id} className="p-4 border-l text-left align-top">
                                <ul className="space-y-2">
                                    {firm.features.slice(0, 4).map((f: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-xs font-medium">
                                            <div className="mt-0.5 rounded-full bg-green-500/10 p-0.5">
                                                <Check className="h-3 w-3 text-green-500" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        ))}
                    </tr>

                    <tr>
                        <td className="p-4 bg-muted/20"></td>
                        {firms.map((firm) => (
                            <td key={firm.id} className="p-6 border-l text-center">
                                <Link
                                    href={firm.link}
                                    target="_blank"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:-translate-y-1"
                                >
                                    {t('getDeal', { discount: firm.discount })} <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
