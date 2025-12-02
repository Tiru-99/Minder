"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingNavbar() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm bg-black/5"
        >
            <div className="flex items-center">
                <Link href="/" className="text-2xl font-serif font-bold text-white tracking-wide">
                    Minder
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/auth"
                    className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    Log in
                </Link>
                <Link
                    href="/auth"
                    className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 transition-transform hover:scale-105 active:scale-95 hidden sm:block"
                >
                    Sign up
                </Link>
            </div>
        </motion.nav>
    );
}
