"use client";

import { saveFirmAction } from "@/actions/firm-actions";
import { PropFirm } from "@/lib/data";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        >
            {pending ? "Saving..." : "Save Firm"} <Save className="ml-2 h-4 w-4" />
        </button>
    );
}

export function FirmForm({ firm }: { firm?: PropFirm }) {
    return (
        <form action={saveFirmAction} className="space-y-8 max-w-4xl">
            <input type="hidden" name="id" value={firm?.id || ""} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">{firm ? `Edit ${firm.name}` : "New Firm"}</h1>
                </div>
                <SubmitButton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-4 rounded-lg border bg-card p-6">
                    <h2 className="font-semibold text-lg border-b pb-2">Basic Info</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Firm Name</label>
                        <input name="name" defaultValue={firm?.name} required className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. Apex Trader" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" defaultValue={firm?.description} required rows={3} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Short marketing blurb" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Affiliate Link</label>
                            <input name="link" defaultValue={firm?.link} required type="url" className="w-full rounded-md border bg-background px-3 py-2" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Logo URL</label>
                            <input name="imageUrl" defaultValue={firm?.imageUrl} className="w-full rounded-md border bg-background px-3 py-2" placeholder="https://.../logo.png" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Discount Label</label>
                            <input name="discount" defaultValue={firm?.discount} required className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. 90% OFF" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Code</label>
                            <input name="code" defaultValue={firm?.code} required className="w-full rounded-md border bg-background px-3 py-2 font-mono" />
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4 rounded-lg border bg-card p-6">
                    <h2 className="font-semibold text-lg border-b pb-2">Metrics & Tags</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rating (0-5)</label>
                            <input name="rating" defaultValue={firm?.rating} type="number" step="0.1" max="5" required className="w-full rounded-md border bg-background px-3 py-2" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Drawdown Type</label>
                            <select name="drawdownType" defaultValue={firm?.drawdownType} required className="w-full rounded-md border bg-background px-3 py-2">
                                <option value="Trailing">Trailing</option>
                                <option value="Static">Static</option>
                                <option value="Balance-based">Balance-based</option>
                                <option value="Step-based">Step-based</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Trustpilot</label>
                            <input name="trustpilotScore" defaultValue={firm?.trustpilotScore} type="number" step="0.1" className="w-full rounded-md border bg-background px-3 py-2" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min Price ($)</label>
                            <input name="minPrice" defaultValue={firm?.minPrice} type="number" required className="w-full rounded-md border bg-background px-3 py-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Leverage</label>
                            <input name="maxLeverage" defaultValue={firm?.maxLeverage} required className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. 1:100" />
                        </div>
                        <div className="space-y-2 flex items-center pt-6">
                            <input type="checkbox" name="featured" id="featured" defaultChecked={firm?.featured} className="h-4 w-4" />
                            <label htmlFor="featured" className="text-sm font-medium ml-2">Featured (Show first)</label>
                        </div>
                    </div>
                </div>

                {/* Lists (Comma separated for simplicity in JSON DB) */}
                <div className="md:col-span-2 space-y-4 rounded-lg border bg-card p-6">
                    <h2 className="font-semibold text-lg border-b pb-2">Lists (Comma Separated)</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Categories</label>
                            <input name="categories" defaultValue={firm?.categories.join(", ")} className="w-full rounded-md border bg-background px-3 py-2" placeholder="crypto, forex, futures" />
                            <p className="text-xs text-muted-foreground">Supported: crypto, forex, futures</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Platforms</label>
                            <input name="platforms" defaultValue={firm?.platforms.join(", ")} className="w-full rounded-md border bg-background px-3 py-2" placeholder="MT4, MT5, cTrader, Rithmic" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Features</label>
                            <textarea name="features" defaultValue={firm?.features.join(", ")} rows={3} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Fast Payouts, No Time Limit..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rules</label>
                            <textarea name="rules" defaultValue={firm?.rules.join(", ")} rows={3} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Max DD 10%, consistency rule..." />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
