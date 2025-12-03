"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "Minder has completely transformed how I organize my day. The focus mode is a game-changer.",
        author: "Madar Wagh",
        role: "ML Engineer",
        initials: "MW",
        color: "bg-blue-500",
    },
    {
        quote: "The cleanest task manager I've ever used. It's simple, beautiful, and just works.",
        author: "Pranay Nimje",
        role: "Software Developer",
        initials: "PN",
        color: "bg-purple-500",
    },
    {
        quote: "I love the due reminder feature. It helps me stay on top of my tasks.",
        author: "Nikhil Gupta",
        role: "AI and Data Engineer",
        initials: "NG",
        color: "bg-green-500",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
                    >
                        Loved by thousands
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-neutral-400 max-w-2xl mx-auto text-lg"
                    >
                        Join a community of productive individuals who trust Minder to manage their daily tasks.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-neutral-900/50 border border-white/5 relative"
                        >
                            <Quote className="w-10 h-10 text-white/10 absolute top-6 right-6" />
                            <p className="text-neutral-300 mb-8 leading-relaxed relative z-10">
                                &quot;{testimonial.quote}&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{testimonial.author}</div>
                                    <div className="text-neutral-500 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
