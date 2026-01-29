"use client";

import { useState } from "react";
import { CourseDB } from "@/lib/db";
import { saveCourseAction } from "@/actions/save-course-action";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/image-uploader";

interface CourseFormProps {
    initialData?: CourseDB;
}

const EMPTY_COURSE: CourseDB = {
    id: "",
    title: "",
    description: "",
    instructor: "",
    link: "",
    imageUrl: "",
    platform: "Teachable",
    rating: 5.0,
    duration: "",
    featured: false,
    level: "All Levels",
    language: "English",
    category: "General",
    priceLabel: "",
    priceMin: 0,
    priceMax: undefined,
    learningPoints: []
};

export function CourseForm({ initialData }: CourseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [langTab, setLangTab] = useState<"en" | "es">("en");

    // Initialize data ensuring bilingual structure
    const initData = (data?: CourseDB): CourseDB => {
        if (!data) return { ...EMPTY_COURSE, title: { en: "", es: "" }, description: { en: "", es: "" }, learningPoints: { en: [], es: [] } };

        return {
            ...data,
            title: typeof data.title === 'string' ? { en: data.title, es: data.title } : data.title,
            description: typeof data.description === 'string' ? { en: data.description, es: data.description } : data.description,
            learningPoints: Array.isArray(data.learningPoints) ? { en: data.learningPoints, es: data.learningPoints } : data.learningPoints
        };
    };

    const [formData, setFormData] = useState<CourseDB>(initData(initialData));

    const handleChange = (field: keyof CourseDB, value: any, lang?: "en" | "es") => {
        setFormData(prev => {
            const newData = { ...prev };

            if (lang && (field === 'title' || field === 'description' || field === 'learningPoints')) {
                const currentVal = (prev[field] as any) || (field === 'learningPoints' ? { en: [], es: [] } : { en: "", es: "" });
                (newData[field] as any) = { ...currentVal, [lang]: value };
            } else {
                (newData[field] as any) = value;
            }

            // Auto-generate ID from title for NEW courses if ID hasn't been manually set
            if (!initialData && field === 'title') {
                const titleStr = typeof value === 'object' ? (value.en || value.es || "") : (value as string);
                if (titleStr) {
                    const autoId = titleStr.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');

                    const prevTitle = typeof prev.title === 'object' ? (prev.title.en || prev.title.es || "") : prev.title;
                    const currentAutoId = prevTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                    if (!prev.id || prev.id === currentAutoId) {
                        newData.id = autoId;
                    }
                }
            }
            return newData;
        });
    };

    // Learning Points Handlers
    const updatePoint = (index: number, text: string, lang: "en" | "es") => {
        setFormData(prev => {
            const pointsObj = { ...(prev.learningPoints as { en: string[]; es: string[] }) };
            const currentPoints = [...(pointsObj[lang] || [])];
            currentPoints[index] = text;
            pointsObj[lang] = currentPoints;
            return {
                ...prev,
                learningPoints: pointsObj
            };
        });
    };

    const addPointSlot = (lang: "en" | "es") => {
        setFormData(prev => {
            const pointsObj = { ...(prev.learningPoints as { en: string[]; es: string[] }) };
            pointsObj[lang] = [...(pointsObj[lang] || []), ""];
            return {
                ...prev,
                learningPoints: pointsObj
            };
        });
    };

    const removePointSlot = (index: number, lang: "en" | "es") => {
        setFormData(prev => {
            const pointsObj = { ...(prev.learningPoints as { en: string[]; es: string[] }) };
            pointsObj[lang] = (pointsObj[lang] || []).filter((_, i) => i !== index);
            return {
                ...prev,
                learningPoints: pointsObj
            };
        });
    };

    const getPoints = (lang: "en" | "es") => {
        const points = (formData.learningPoints as { en: string[]; es: string[] })[lang];
        return points.length > 0 ? points : [""];
    };

    const [autoFillUrl, setAutoFillUrl] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);

    const handleAutoFill = async () => {
        if (!autoFillUrl) {
            alert("Por favor ingrese una URL");
            return;
        }

        setIsExtracting(true);
        try {
            const { extractCourseDataFromURL } = await import("@/actions/ai-actions");
            const result = await extractCourseDataFromURL(autoFillUrl);

            if (!result.success || !result.data) {
                alert("Error: " + (result.error || "Fallo en la extracción"));
                return;
            }

            const data = result.data;
            // Handle potentially bilingual data from AI by picking one or providing fallback
            const getStr = (val: any) => typeof val === 'object' ? (val.es || val.en || "") : (val || "");
            const lpObj = formData.learningPoints as { en: string[]; es: string[] };

            setFormData(prev => ({
                ...prev,
                title: {
                    en: getStr(data.title) || (prev.title as any).en || "",
                    es: (prev.title as any).es || getStr(data.title) || ""
                },
                description: {
                    en: getStr(data.description) || (prev.description as any).en || "",
                    es: (prev.description as any).es || getStr(data.description) || ""
                },
                instructor: data.instructor || prev.instructor,
                link: autoFillUrl,
                imageUrl: data.imageUrl || prev.imageUrl,
                platform: data.platform || prev.platform,
                rating: data.rating || prev.rating,
                duration: data.duration || prev.duration,
                level: data.level || prev.level,
                language: data.language || prev.language,
                category: data.category || prev.category,
                priceLabel: data.priceLabel || prev.priceLabel,
                priceMin: data.priceMin !== undefined ? data.priceMin : prev.priceMin,
                priceMax: data.priceMax !== undefined ? data.priceMax : prev.priceMax,
                learningPoints: {
                    en: Array.isArray(data.learningPoints) ? data.learningPoints : (lpObj.en || []),
                    es: (lpObj.es && lpObj.es.length > 0) ? lpObj.es : (Array.isArray(data.learningPoints) ? data.learningPoints : [])
                }
            }));
            alert("✨ Datos extraídos! Revisa los campos.");
        } catch (e: unknown) {
            console.error(e);
            alert("Error: " + (e instanceof Error ? e.message : "Extract failed"));
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const lp = formData.learningPoints as { en: string[]; es: string[] };
        const cleanFormData = {
            ...formData,
            learningPoints: {
                en: (lp.en || []).filter(p => p.trim() !== ""),
                es: (lp.es || []).filter(p => p.trim() !== ""),
            }
        };

        try {
            await saveCourseAction(cleanFormData);
            router.push("/admin/courses");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al guardar el curso");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold">
                        {initialData ? "Editar Curso" : "Crear Nuevo Curso"}
                    </h2>
                    <div className="flex bg-muted rounded-lg p-1 mt-2 w-fit">
                        <button
                            type="button"
                            onClick={() => setLangTab("en")}
                            className={`px-4 py-1 text-xs rounded-md transition-all ${langTab === "en" ? "bg-background shadow-sm font-bold border" : "text-muted-foreground"}`}
                        >
                            Inglés
                        </button>
                        <button
                            type="button"
                            onClick={() => setLangTab("es")}
                            className={`px-4 py-1 text-xs rounded-md transition-all ${langTab === "es" ? "bg-background shadow-sm font-bold border" : "text-muted-foreground"}`}
                        >
                            Español
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Guardar Curso
                    </button>
                </div>
            </div>

            {/* AI Auto-Fill Section */}
            <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-6 md:p-8">
                <div className="flex items-start gap-4">
                    <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">✨ AI Auto-Fill</h3>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                value={autoFillUrl}
                                onChange={(e) => setAutoFillUrl(e.target.value)}
                                placeholder="https://www.udemy.com/course/..."
                                className="flex-1 rounded-md border bg-background px-4 py-2"
                                disabled={isExtracting}
                            />
                            <button
                                type="button"
                                onClick={handleAutoFill}
                                disabled={isExtracting}
                                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isExtracting ? "Extrayendo..." : "Auto-Rellenar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
                        <div className={langTab === "en" ? "block" : "hidden"}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">Title (EN)</label>
                                    <input
                                        type="text"
                                        value={(formData.title as any).en || ""}
                                        onChange={(e) => handleChange('title', e.target.value, 'en')}
                                        className="w-full text-lg p-3 font-semibold rounded-md border bg-background"
                                        placeholder="Algorithmic Trading..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">Description (EN)</label>
                                    <textarea
                                        value={(formData.description as any).en || ""}
                                        onChange={(e) => handleChange('description', e.target.value, 'en')}
                                        className="w-full p-3 rounded-md border bg-background min-h-[150px]"
                                        placeholder="Course summary in English..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={langTab === "es" ? "block" : "hidden"}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">Título (ES)</label>
                                    <input
                                        type="text"
                                        value={(formData.title as any).es || ""}
                                        onChange={(e) => handleChange('title', e.target.value, 'es')}
                                        className="w-full text-lg p-3 font-semibold rounded-md border bg-background"
                                        placeholder="Trading Algorítmico..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">Descripción (ES)</label>
                                    <textarea
                                        value={(formData.description as any).es || ""}
                                        onChange={(e) => handleChange('description', e.target.value, 'es')}
                                        className="w-full p-3 rounded-md border bg-background min-h-[150px]"
                                        placeholder="Resumen del curso en español..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-bold">Puntos Clave ({langTab.toUpperCase()})</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addPointSlot(langTab)}
                                    className="p-1 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {getPoints(langTab).map((point, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <span className="text-xs font-mono text-muted-foreground w-4">{index + 1}.</span>
                                        <input
                                            value={point}
                                            onChange={(e) => updatePoint(index, e.target.value, langTab)}
                                            className="flex-1 p-2 rounded-md border bg-background text-sm"
                                            placeholder={`Point #${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePointSlot(index, langTab)}
                                            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
                        <h3 className="font-bold border-b pb-2 mb-4">Configuración</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground">Idioma del Curso</label>
                            <select
                                value={formData.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                className="w-full p-2 rounded-md border bg-background text-sm font-medium"
                            >
                                {["English", "Spanish"].map(l => (
                                    <option key={l} value={l}>{l === 'Spanish' ? 'Español' : 'Inglés'}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground">Instructor</label>
                            <input
                                type="text"
                                value={formData.instructor}
                                onChange={(e) => handleChange('instructor', e.target.value)}
                                className="w-full p-2 rounded-md border bg-background text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full p-2 rounded-md border bg-background text-sm"
                            >
                                {["General", "Forex", "Crypto", "Futures", "Options", "Stocks"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground">Enlace Externo</label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) => handleChange('link', e.target.value)}
                                className="w-full p-2 rounded-md border bg-background text-sm"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-muted-foreground">Imagen de Portada</label>
                            {formData.id ? (
                                <div className="space-y-3">
                                    <ImageUploader
                                        slug={`course-${formData.id}`}
                                        onUploadComplete={(url: string) => handleChange('imageUrl', url)}
                                    />
                                    <input
                                        type="url"
                                        value={formData.imageUrl || ""}
                                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                                        className="w-full p-2 rounded-md border bg-background text-sm"
                                        placeholder="https://..."
                                    />
                                    {formData.imageUrl && (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                            <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground bg-muted/30">
                                    Escribe un Título para habilitar la subida de imagen.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => handleChange('featured', e.target.checked)}
                                className="h-4 w-4 rounded border-primary text-primary"
                            />
                            <label htmlFor="featured" className="text-sm font-bold">Destacar este curso</label>
                        </div>
                    </div>

                    <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
                        <h3 className="font-bold border-b pb-2 mb-4">Precios y Detalles</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Precio Mín ($)</label>
                                <input
                                    type="number"
                                    value={formData.priceMin}
                                    onChange={(e) => handleChange('priceMin', Number(e.target.value))}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Puntuación</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    max="5"
                                    value={formData.rating}
                                    onChange={(e) => handleChange('rating', Number(e.target.value))}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground">Etiqueta de Precio</label>
                            <input
                                type="text"
                                value={formData.priceLabel}
                                onChange={(e) => handleChange('priceLabel', e.target.value)}
                                className="w-full p-2 rounded-md border bg-background text-sm"
                                placeholder="ej. $497 o Gratis"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Duración</label>
                                <input
                                    type="text"
                                    value={formData.duration || ""}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Nivel</label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => handleChange('level', e.target.value)}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                >
                                    {[
                                        { v: "Beginner", l: "Principiante" },
                                        { v: "Intermediate", l: "Intermedio" },
                                        { v: "Advanced", l: "Avanzado" },
                                        { v: "All Levels", l: "Todos los niveles" }
                                    ].map(opt => (
                                        <option key={opt.v} value={opt.v}>{opt.l}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
