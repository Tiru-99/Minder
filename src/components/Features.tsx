"use client";

import { motion } from "framer-motion";
import { Calendar, Zap, BarChart3, Shield, Smartphone, Users } from "lucide-react";

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
        icon: BarChart3,
        title: "Detailed Analytics",
        description: "Gain insights into your productivity habits and track your progress over time.",
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
        icon: Users,
        title: "Collaboration",
        description: "Share tasks and lists with your team or family. Collaborate in real-time.",
    },
];

export default function Features() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
                    >
                        Everything you need to stay organized
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-neutral-400 max-w-2xl mx-auto text-lg"
                    >
                        Powerful features designed to help you manage your time effectively and achieve your goals.
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
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
