"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
                    >
                        Ready to take control of your day?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
                    >
                        Join thousands of users who are boosting their productivity with Minder. Start your free trial today.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Link
                            href="/auth/signup"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium text-lg transition-all hover:bg-white/90 hover:scale-105 active:scale-95"
                        >
                            Get Started for Free
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
