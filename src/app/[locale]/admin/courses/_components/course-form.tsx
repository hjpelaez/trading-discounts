"use client";

import { useState } from "react";
import { CourseDB } from "@/lib/db";
import { saveCourseAction } from "@/actions/save-course-action";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X, Wand2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/image-uploader";

interface CourseFormProps {
    initialData?: CourseDB;
}

const EMPTY_COURSE: CourseDB = {
    id: "",
    title: { en: "", es: "" },
    description: { en: "", es: "" },
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
    learningPoints: { en: [], es: [] }
};

export function CourseForm({ initialData }: CourseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CourseDB>(initialData || EMPTY_COURSE);
    const [activeLang, setActiveLang] = useState<'en' | 'es'>('en');

    // Helper specific to this form to safely get/set bilingual fields
    const getBilingual = (field: keyof CourseDB, lang: 'en' | 'es') => {
        const value = formData[field];
        if (typeof value === 'object' && value !== null && lang in value) {
            // @ts-ignore
            return value[lang] || "";
        }
        return "";
    };

    const setBilingual = (field: keyof CourseDB, lang: 'en' | 'es', text: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                // @ts-ignore
                ...prev[field],
                [lang]: text
            }
        }));
    };

    const handleChange = (field: keyof CourseDB, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Learning Points Handlers
    const addPoint = (lang: 'en' | 'es') => {
        setFormData(prev => {
            const currentPoints = prev.learningPoints?.[lang] || [];
            return {
                ...prev,
                learningPoints: {
                    ...prev.learningPoints!, // Assume initialized
                    [lang]: [...currentPoints, ""]
                }
            };
        });
    };

    const updatePoint = (lang: 'en' | 'es', index: number, text: string) => {
        setFormData(prev => {
            const currentPoints = [...(prev.learningPoints?.[lang] || [])];
            currentPoints[index] = text;
            return {
                ...prev,
                learningPoints: {
                    ...prev.learningPoints!,
                    [lang]: currentPoints
                }
            };
        });
    };

    const removePoint = (lang: 'en' | 'es', index: number) => {
        setFormData(prev => {
            const currentPoints = [...(prev.learningPoints?.[lang] || [])];
            currentPoints.splice(index, 1);
            return {
                ...prev,
                learningPoints: {
                    ...prev.learningPoints!,
                    [lang]: currentPoints
                }
            };
        });
    };

    // ...
    // Remove const t = useTranslations...

    const [autoFillUrl, setAutoFillUrl] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);

    const handleAutoFill = async () => {
        const url = prompt("Enter Course URL (Udemy, etc):");
        if (!url) return;

        setIsExtracting(true);
        try {
            const { extractCourseDataFromURL } = await import("@/actions/ai-actions");
            const result = await extractCourseDataFromURL(url);

            if (!result.success || !result.data) {
                alert("Error: " + (result.error || "Failed to extract"));
                return;
            }

            const data = result.data;
            setFormData(prev => ({
                ...prev,
                title: typeof data.title === 'string' ? { en: data.title, es: data.title } : (data.title || prev.title),
                description: typeof data.description === 'string' ? { en: data.description, es: data.description } : (data.description || prev.description),
                instructor: data.instructor || prev.instructor,
                link: url, // auto set link
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
                learningPoints: data.learningPoints ? { en: data.learningPoints, es: data.learningPoints } : prev.learningPoints
            }));
            alert("✨ Datos extraídos! Revisa los campos.");
        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveCourseAction(formData);
            router.push("/admin/courses");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al guardar el curso");
        } finally {
            setLoading(false);
        }
    };

    // ...

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold">
                        {initialData ? "Editar Curso" : "Crear Nuevo Curso"}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Completa los detalles. Usa las pestañas para editar el contenido en inglés y español.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAutoFill}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-50"
                    >
                        <Wand2 className="h-4 w-4" /> Auto-Rellenar IA
                    </button>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content Column (Bilingual) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Language Switcher Tabs */}
                    <div className="flex p-1 bg-muted rounded-lg w-fit">
                        <button
                            type="button"
                            onClick={() => setActiveLang('en')}
                            className={cn(
                                "px-4 py-1.5 text-sm font-bold rounded-md transition-all flex items-center gap-2",
                                activeLang === 'en' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            🇺🇸 Inglés (English)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveLang('es')}
                            className={cn(
                                "px-4 py-1.5 text-sm font-bold rounded-md transition-all flex items-center gap-2",
                                activeLang === 'es' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            🇪🇸 Español
                        </button>
                    </div>

                    <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Título del Curso ({activeLang === 'en' ? 'Inglés' : 'Español'})</label>
                            <input
                                type="text"
                                value={getBilingual('title', activeLang)}
                                onChange={(e) => setBilingual('title', activeLang, e.target.value)}
                                className="w-full p-2 rounded-md border bg-background"
                                placeholder={activeLang === 'en' ? "e.g. Master Technical Analysis" : "ej. Domina el Análisis Técnico"}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Descripción ({activeLang === 'en' ? 'Inglés' : 'Español'})</label>
                            <textarea
                                value={getBilingual('description', activeLang)}
                                onChange={(e) => setBilingual('description', activeLang, e.target.value)}
                                className="w-full p-2 rounded-md border bg-background min-h-[120px]"
                                placeholder={activeLang === 'en' ? "Short summary..." : "Resumen corto..."}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Puntos Clave / Lo que aprenderás</label>
                            <div className="space-y-2">
                                {(formData.learningPoints?.[activeLang] || []).map((point, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            value={point}
                                            onChange={(e) => updatePoint(activeLang, index, e.target.value)}
                                            className="flex-1 p-2 rounded-md border bg-background text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePoint(activeLang, index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addPoint(activeLang)}
                                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                >
                                    <Plus className="h-3 w-3" /> Añadir Punto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column (Metadata) */}
                <div className="space-y-6">
                    <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
                        <h3 className="font-bold border-b pb-2 mb-4">Metadatos</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground">ID (Slug URL)</label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={(e) => handleChange('id', e.target.value)}
                                className="w-full p-2 rounded-md border bg-background text-sm font-mono"
                                placeholder="curso-ejemplo-id"
                                disabled={!!initialData} // Lock ID on edit
                            />
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

                        <div className="grid grid-cols-2 gap-4">
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
                                <label className="text-xs font-bold text-muted-foreground">Idioma del Audio</label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => handleChange('language', e.target.value)}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                >
                                    {["English", "Spanish", "Mixed"].map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground">Enlace Externo (Afiliado)</label>
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
                                        onUploadComplete={(url) => handleChange('imageUrl', url)}
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="url"
                                            value={formData.imageUrl || ""}
                                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                                            className="flex-1 p-2 rounded-md border bg-background text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    {formData.imageUrl && (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground bg-muted/30">
                                    Ingresa el ID arriba para habilitar la subida de imagen.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => handleChange('featured', e.target.checked)}
                                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
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
                                <label className="text-xs font-bold text-muted-foreground">Puntuación (0-5)</label>
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
                                    placeholder="ej. 10h 30m"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Nivel</label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => handleChange('level', e.target.value)}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                >
                                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map(l => (
                                        <option key={l} value={l}>{l}</option>
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
