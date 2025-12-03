"use client";

import { motion } from "framer-motion";
import { Calendar, Zap, Shield, Smartphone, Bell, Palette } from "lucide-react";

const features = [
    {
        icon: Calendar,
        title: "Smart Scheduling",
        description: "Automatically organize your tasks based on priority and deadlines.",
    },
    {
        icon: Zap,
        title: "Focus Mode",
        description: "Eliminate distractions and boost your productivity with dedicated focus sessions.",
    },
    {
        icon: Bell,
        title: "Smart Reminders",
        description: "Never miss a deadline with intelligent notifications and custom alerts.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Your data is encrypted and stored securely. We prioritize your privacy.",
    },
    {
        icon: Smartphone,
        title: "Cross-Platform",
        description: "Access your tasks from anywhere, on any device. Seamless sync across all platforms.",
    },
    {
        icon: Palette,
        title: "Customizable Themes",
        description: "Personalize your workspace with beautiful themes and dark mode options.",
    },
];

export default function Features() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10 opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight"
                    >
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-200 to-blue-200">
                            stay organized
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
                    >
                        Powerful features designed to help you manage your time effectively and achieve your goals with style.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group cursor-default"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/20">
                                <feature.icon className="w-7 h-7 text-white group-hover:text-purple-200 transition-colors" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-100 transition-colors">{feature.title}</h3>
                            <p className="text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
