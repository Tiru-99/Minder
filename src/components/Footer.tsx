"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-serif font-bold text-white mb-4 block">
                            Minder
                        </Link>
                        <p className="text-neutral-400 text-sm">
                            Designed for clarity and focus. Master your day with Minder.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
                    <p className="text-neutral-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Minder Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
