"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Save, Search, AlertCircle, ChevronDown, ChevronRight, Trash2, Wand2, RotateCcw, X, Menu, Zap, Home, MessageSquare, Star, Mail, HelpCircle, Footprints, Grid3x3, BarChart3, BookOpen, Phone, Bot, Cookie, Lock, Clock } from "lucide-react";
import { saveTranslationAction, deleteTranslationAction } from "@/actions/translation-actions";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import { m, AnimatePresence } from "framer-motion";

interface TranslationsManagerProps {
    allKeys: string[];
    flatEn: Record<string, string>;
    flatEs: Record<string, string>;
    dynamicTranslations: Record<string, { en: string; es: string }>;
}

export function TranslationsManager({ allKeys, flatEn, flatEs, dynamicTranslations }: TranslationsManagerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    // Filter keys based on search
    const filteredKeys = useMemo(() => {
        if (!searchQuery) return allKeys;
        const lowerQuery = searchQuery.toLowerCase();
        return allKeys.filter(key =>
            key.toLowerCase().includes(lowerQuery) ||
            (flatEn[key] || "").toLowerCase().includes(lowerQuery) ||
            (flatEs[key] || "").toLowerCase().includes(lowerQuery)
        );
    }, [allKeys, searchQuery, flatEn, flatEs]);

    // Group keys by module (first part of dot notation)
    const groupedKeys = useMemo(() => {
        const groups: Record<string, string[]> = {};
        filteredKeys.forEach(key => {
            const moduleName = key.split('.')[0] || "Other";
            if (!groups[moduleName]) groups[moduleName] = [];
            groups[moduleName].push(key);
        });
        return groups;
    }, [filteredKeys]);

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const toggleAll = (expand: boolean) => {
        const newExpanded: Record<string, boolean> = {};
        Object.keys(groupedKeys).forEach(key => newExpanded[key] = expand);
        setExpandedGroups(newExpanded);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Buscar claves o texto..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                    <button onClick={() => toggleAll(true)} className="px-3 py-1.5 rounded hover:bg-muted transition-colors">Expandir Todo</button>
                    <button onClick={() => toggleAll(false)} className="px-3 py-1.5 rounded hover:bg-muted transition-colors">Contraer Todo</button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <span className="text-muted-foreground">{filteredKeys.length} claves</span>
                </div>
            </div>

            {/* Groups */}
            <div className="space-y-4">
                {Object.keys(groupedKeys).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Search className="mx-auto h-12 w-12 opacity-20 mb-4" />
                        <p>No se encontraron traducciones para &quot;{searchQuery}&quot;</p>
                    </div>
                ) : (
                    Object.entries(groupedKeys).map(([group, keys]) => (
                        <TranslationGroup
                            key={group}
                            group={group}
                            keys={keys}
                            isExpanded={!!expandedGroups[group]}
                            onToggle={() => toggleGroup(group)}
                            data={{ flatEn, flatEs, dynamicTranslations }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// Helper function to get icon for each group
function getGroupIcon(groupName: string) {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        'Navbar': Menu,
        'Hero': Zap,
        'Home': Home,
        'AIPromo': Bot,
        'Testimonials': MessageSquare,
        'Newsletter': Mail,
        'FAQ': HelpCircle,
        'PreFooter': Footprints,
        'Footer': Grid3x3,
        'Common': Grid3x3,
        'Compare': BarChart3,
        'Blog': BookOpen,
        'Contact': Phone,
        'AI': Bot,
        'Cookies': Cookie,
        'auth': Lock,
        'ComingSoon': Clock
    };

    const Icon = iconMap[groupName] || Grid3x3;
    return <Icon className="h-4 w-4 text-primary" />;
}

interface TranslationGroupProps {
    group: string;
    keys: string[];
    isExpanded: boolean;
    onToggle: () => void;
    data: {
        flatEn: Record<string, string>;
        flatEs: Record<string, string>;
        dynamicTranslations: Record<string, { en: string; es: string }>;
    };
}

function TranslationGroup({ group, keys, isExpanded, onToggle, data }: TranslationGroupProps) {
    const hasOverrides = keys.some((k: string) => data.dynamicTranslations[k]);

    return (
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-md bg-muted transition-transform duration-200", isExpanded && "rotate-90")}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                        {getGroupIcon(group)}
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            {group}
                            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {keys.length}
                            </span>
                        </h3>
                    </div>
                </div>
                {hasOverrides && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                        Tiene Cambios
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="border-t divide-y divide-border">
                            {keys.map((key: string) => (
                                <TranslationRow
                                    key={key}
                                    itemKey={key}
                                    data={data}
                                />
                            ))}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface TranslationRowProps {
    itemKey: string;
    data: {
        flatEn: Record<string, string>;
        flatEs: Record<string, string>;
        dynamicTranslations: Record<string, { en: string; es: string }>;
    };
}

function TranslationRow({ itemKey, data }: TranslationRowProps) {
    const override = data.dynamicTranslations[itemKey];
    const defaultEn = data.flatEn[itemKey] || "";
    const defaultEs = data.flatEs[itemKey] || "";

    // Local state for immediate feedback before server revalidation
    const [isModified, setIsModified] = useState(false);

    const handleAutoTranslate = (lang: 'en' | 'es') => {
        // Mock auto-translate logic
        // In a real app, this would call an API
        // console.log(`Auto-translating ${itemKey} to ${lang}`);
    };

    return (
        <div className={cn("p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start transition-colors", override ? "bg-primary/[0.02]" : "hover:bg-muted/10")}>
            {/* Key & Status */}
            <div className="lg:col-span-3 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs font-bold text-primary truncate bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20" title={itemKey}>
                        {itemKey.split('.').slice(1).join('.')}
                    </code>
                    {override && <div className="h-1.5 w-1.5 rounded-full bg-primary" title="Active Override" />}
                </div>
                <p className="text-[10px] text-muted-foreground truncate" title={itemKey}>{itemKey}</p>
            </div>

            {/* Inputs Container */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* English Column */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Inglés (Original)</span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={defaultEn}>{defaultEn}</span>
                    </div>
                    <form action={saveTranslationAction} className="relative group">
                        <input type="hidden" name="key" value={itemKey} />
                        <input type="hidden" name="es" value={override?.es || defaultEs} /> {/* Preserve other lang */}
                        <div className="relative">
                            <AutoResizeTextarea
                                name="en"
                                defaultValue={override?.en || defaultEn}
                                onChange={() => setIsModified(true)}
                                className={cn(
                                    "w-full text-sm px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-8 resize-none overflow-hidden",
                                    override?.en ? "border-primary/40 font-medium" : "border-border"
                                )}
                            />
                            {/* Actions overlay */}
                            <div className="absolute right-1 top-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button type="submit" className="p-1 hover:bg-primary hover:text-primary-foreground rounded">
                                    <Save className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Spanish Column */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Español</span>
                            {!override?.es && (
                                <button type="button" className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5">
                                    <Wand2 className="h-2 w-2" /> Auto
                                </button>
                            )}
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={defaultEs}>{defaultEs}</span>
                    </div>
                    <form action={saveTranslationAction} className="relative group">
                        <input type="hidden" name="key" value={itemKey} />
                        <input type="hidden" name="en" value={override?.en || defaultEn} /> {/* Preserve other lang */}

                        <div className="relative">
                            <AutoResizeTextarea
                                name="es"
                                defaultValue={override?.es || defaultEs}
                                onChange={() => setIsModified(true)}
                                className={cn(
                                    "w-full text-sm px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-8 resize-none overflow-hidden",
                                    override?.es ? "border-primary/40 font-medium" : "border-border"
                                )}
                            />
                            {/* Actions overlay */}
                            <div className="absolute right-1 top-1  opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
                                <button type="submit" className="p-1 hover:bg-primary hover:text-primary-foreground rounded" title="Save">
                                    <Save className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Global Actions for Row */}
                <div className="md:col-span-2 flex justify-end gap-2 pt-1 border-t border-dashed border-border/40 mt-1">
                    {override && (
                        <form action={async () => await deleteTranslationAction(itemKey)}>
                            <button className="text-[10px] text-red-500 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                <RotateCcw className="h-3 w-3" /> Restaurar Original
                            </button>
                        </form>
                    )}
                    <div className="flex-1"></div>
                    {/* We can put a global save button here if we wrap the whole row in a form, but strictly per-input is safer for concurrent edits unless we manage complex state */}
                </div>
            </div>
        </div>
    );
}

function AutoResizeTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
        // Also adjust on window resize
        window.addEventListener('resize', adjustHeight);
        return () => window.removeEventListener('resize', adjustHeight);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        adjustHeight();
        if (props.onChange) props.onChange(e);
    };

    return (
        <textarea
            {...props}
            ref={textareaRef}
            rows={1}
            onChange={handleChange}
        />
    );
}
