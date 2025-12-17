"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import HeroMockup from "@/components/HeroMockup";

export default function Hero() {
    return (
        <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden bg-black text-white pt-16 selection:bg-white/20">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />

            {/* Grid */}
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.5}
                duration={3}
                repeatDelay={1}
                className="mask-[radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 stroke-gray-400/40"
            />

            <div className="container relative z-10 mx-auto px-4 text-center">
                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight mb-6 bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent"
                >
                    Minder
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="font-sans text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Master your day with a task manager designed for clarity and focus.
                    Elevate your productivity with a seamless, premium experience.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <Link
                        href="/home"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium text-lg transition-all hover:bg-white/90 hover:scale-105 active:scale-95"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* Mockup */}
                <HeroMockup />
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <div className="w-px h-24 bg-linear-to-b from-transparent via-white/20 to-transparent" />
            </motion.div>
        </section>
    );
}
