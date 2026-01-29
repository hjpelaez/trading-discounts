"use client";

import { Star, Quote } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations";

interface TestimonialsProps {
    locale: string;
    title: string;
    subtitle: string;
    testimonials: {
        [key: string]: string;
    };
}

export function Testimonials({ locale, title, subtitle, testimonials }: TestimonialsProps) {
    const lang = locale as "en" | "es";

    // Build testimonials array from translation keys
    const testimonialsData = [];
    for (let i = 1; i <= 6; i++) {
        const name = testimonials[`testimonial${i}Name`];
        const role = testimonials[`testimonial${i}Role`];
        const text = testimonials[`testimonial${i}Text`];

        if (name && role && text) {
            testimonialsData.push({
                id: i,
                name,
                role,
                text,
                avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                rating: 5
            });
        }
    }

    return (
        <section className="container mx-auto px-4 md:px-6 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    {title}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonialsData.map((testimonial) => (
                    <StaggerItem key={testimonial.id}>
                        <div className="group relative h-full bg-card rounded-3xl border border-border p-8 transition-all duration-500 hover:border-sky-500/50 hover:shadow-[0_20px_80px_-15px_rgba(14,165,233,0.15)] hover:-translate-y-2">
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-50 transition-opacity">
                                <Quote className="h-16 w-16 text-sky-500/20" />
                            </div>

                            {/* Avatar and Info */}
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="h-14 w-14 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20 font-bold text-sky-600 text-lg">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-muted-foreground leading-relaxed relative z-10">
                                &quot;{testimonial.text}&quot;
                            </p>

                            {/* Gradient Overlay on Hover */}
                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
}
