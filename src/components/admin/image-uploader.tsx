"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, Copy, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImageAction } from "@/actions/upload-actions";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    slug: string;
    onUploadComplete?: (url: string) => void;
}

export function ImageUploader({ slug, onUploadComplete }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (!slug) {
            alert("Por favor define un slug para el post primero.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", slug);

        const result = await uploadImageAction(formData);

        if (result.success && result.url) {
            setUploadedUrl(result.url);
            if (onUploadComplete) onUploadComplete(result.url);
        } else {
            alert("Error en la subida: " + result.error);
        }
        setIsUploading(false);
    };

    const copyToClipboard = () => {
        if (uploadedUrl) {
            navigator.clipboard.writeText(uploadedUrl);
            alert("¡URL copiada al portapapeles!");
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative overflow-hidden",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
                    isUploading ? "opacity-50 pointer-events-none" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">Subiendo y optimizando...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-sm">Haz clic o arrastra para subir</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Las imágenes se renombrarán a <span className="font-mono text-primary">{slug}</span>
                        </p>
                    </div>
                )}
            </div>

            {uploadedUrl && (
                <div className="bg-card border rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="h-10 w-10 rounded bg-muted relative overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={uploadedUrl} alt="Uploaded" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-muted-foreground truncate">{uploadedUrl}</p>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors"
                        title="Copiar URL"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => {
                            if (onUploadComplete) onUploadComplete(uploadedUrl);
                        }}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:opacity-90 transition-opacity"
                    >
                        Usar como Portada
                    </button>
                </div>
            )}
        </div>
    );
}
