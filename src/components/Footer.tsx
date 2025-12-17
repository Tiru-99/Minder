"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <Link
                            href="/"
                            className="text-2xl font-serif font-bold text-white block mb-2"
                        >
                            Minder
                        </Link>
                        <p className="text-neutral-400 text-sm max-w-sm">
                            Designed for clarity and focus. Master your day with Minder.
                        </p>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="https://github.com/Tiru-99"
                            target="_blank"
                            aria-label="GitHub"
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </Link>

                        <Link
                            href="https://x.com/tiru299"
                            target="_blank"
                            aria-label="Twitter"
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </Link>

                        <Link
                            href="https://www.linkedin.com/in/aayush-tirmanwar-b81a62261/"
                            target="_blank"
                            aria-label="LinkedIn"
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center md:text-left">
                    <p className="text-neutral-500 text-sm">
                        Built with <span className="mx-1">❤️</span> by{" "}
                        <span className="text-neutral-300 font-medium">
                            Tiru
                        </span>{" "}
                        · © {new Date().getFullYear()} Minder
                    </p>
                </div>
            </div>
        </footer>
    );
}
