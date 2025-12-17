"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingNavbar() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 backdrop-blur-sm bg-black/10"
        >
            <Link href="/" className="flex items-center -gap-1">
                <Image
                    src="/assets/minder_logo.png"
                    alt="Minder logo"
                    width={60}
                    height={60}
                    priority
                    className="object-contain"
                />
            </Link>

            <div className="flex items-center gap-4">
                <Link
                    href="/auth"
                    className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    Log in
                </Link>

                <Link
                    href="/auth"
                    className="hidden sm:block px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
                >
                    Sign up
                </Link>
            </div>
        </motion.nav>
    );
}
