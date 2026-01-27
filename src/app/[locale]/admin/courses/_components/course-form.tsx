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

    // Normalize initialData if it comes from the old bilingual structure
    const normalizedData = initialData ? {
        ...initialData,
        title: typeof initialData.title === 'object' ? (initialData.title as any).en || "" : initialData.title,
        description: typeof initialData.description === 'object' ? (initialData.description as any).en || "" : initialData.description,
        learningPoints: Array.isArray(initialData.learningPoints) ? initialData.learningPoints : ((initialData.learningPoints as any)?.en || [])
    } : EMPTY_COURSE;

    const [formData, setFormData] = useState<CourseDB>(normalizedData as CourseDB);

    const handleChange = (field: keyof CourseDB, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-generate ID from title for NEW courses if ID hasn't been manually set (or matches old auto-gen)
            if (!initialData && field === 'title' && typeof value === 'string') {
                const autoId = value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                if (!prev.id || prev.id === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
                    newData.id = autoId;
                }
            }
            return newData;
        });
    };

    // Learning Points Handlers
    const updatePoint = (index: number, text: string) => {
        setFormData(prev => {
            const currentPoints = [...(prev.learningPoints || [])];
            currentPoints[index] = text;
            return { ...prev, learningPoints: currentPoints };
        });
    };

    // Ensure we always have 5 slots for points
    const points = formData.learningPoints || [];
    const displayPoints = [...points];
    while (displayPoints.length < 5) displayPoints.push("");

    const [autoFillUrl, setAutoFillUrl] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);

    const handleAutoFill = async () => {
        if (!autoFillUrl) {
            alert("Please enter a URL");
            return;
        }

        setIsExtracting(true);
        try {
            const { extractCourseDataFromURL } = await import("@/actions/ai-actions");
            const result = await extractCourseDataFromURL(autoFillUrl);

            if (!result.success || !result.data) {
                alert("Error: " + (result.error || "Failed to extract"));
                return;
            }

            const data = result.data;
            setFormData(prev => ({
                ...prev,
                title: typeof data.title === 'string' ? data.title : prev.title,
                description: typeof data.description === 'string' ? data.description : prev.description,
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
                // Take up to 5 points
                learningPoints: data.learningPoints ? data.learningPoints.slice(0, 5) : prev.learningPoints
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

        // Filter out empty learning points
        const cleanFormData = {
            ...formData,
            learningPoints: (formData.learningPoints || []).filter(p => p.trim() !== "")
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
                    <p className="text-muted-foreground text-sm">
                        La información se mostrará en las fichas tal cual la escribas aquí (sin pestañas por idioma).
                    </p>
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
                        <h3 className="font-semibold text-lg mb-2">✨ AI Auto-Fill (Groq Llama 3)</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Pega la URL del curso y la IA rellenará los campos automáticamente en el idioma detectado.
                        </p>
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
                                {isExtracting ? (
                                    <>Extrayendo...</>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Auto-Rellenar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="md:col-span-2 space-y-6">

                    <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Título del Curso</label>
                            <input
                                type="text"
                                value={formData.title as string}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full text-lg p-3 font-semibold rounded-md border bg-background"
                                placeholder="Ej. Master en Trading Algorítmico"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Descripción</label>
                            <textarea
                                value={formData.description as string}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full p-3 rounded-md border bg-background min-h-[150px]"
                                placeholder="Resumen atractivo del curso..."
                            />
                        </div>

                        <div className="space-y-3 pt-4">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                Puntos Clave (Lo que aprenderás)
                                <span className="text-xs font-normal text-muted-foreground ml-auto">Máximo 5 puntos</span>
                            </label>
                            <div className="space-y-3">
                                {displayPoints.slice(0, 5).map((point, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <span className="text-xs font-mono text-muted-foreground w-4">{index + 1}.</span>
                                        <input
                                            value={point}
                                            onChange={(e) => updatePoint(index, e.target.value)}
                                            className="flex-1 p-2 rounded-md border bg-background text-sm"
                                            placeholder={`Punto clave #${index + 1} (dejar vacío si no se usa)`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column (Metadata) */}
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

                        {/* ID is hidden/auto-generated, removed manual input */}

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
                                        onUploadComplete={(url: string) => handleChange('imageUrl', url)}
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
        </form >
    );
}
