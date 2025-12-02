"use client"
import { useState } from "react";
import {
    Menu,
    X,
    LayoutGrid,
    Briefcase,
    Heart,
    User,
    List,
    Clock,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Bug,
    LogOut,
    ChevronRight,
    Github
} from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ItemType {
    name : string , 
    icon : ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>, 
    active : boolean
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const categories = [
        { name: "All Tasks", icon: LayoutGrid, active: true },
        { name: "Work", icon: Briefcase, active: false },
        { name: "Health", icon: Heart, active: false },
        { name: "Personal", icon: User, active: false },
    ];

    const statuses = [
        { name: "All Status", icon: List, active: false },
        { name: "Incoming", icon: Clock, active: false },
        { name: "Overdue", icon: AlertCircle, active: false },
        { name: "Completed", icon: CheckCircle2, active: false },
    ];

    const feedback = [
        { name: "Suggest Feature", icon: Sparkles, active: false },
        { name: "Report Bug", icon: Bug, active: false },
    ];

    const Section = ({ title, items }: { title: string, items: ItemType[] }) => (
        <div>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-2">
                {title}
            </h3>
            <ul className="space-y-[2px]">
                {items.map((item) => (
                    <li key={item.name}>
                        <button
                            className={`w-full flex items-center justify-between rounded-sm px-4 py-3 text-sm font-medium transition-all ${item.active
                                ? "text-white border border-neutral-800"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900/50 border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-3 ">
                                <item.icon size={18} />
                                {item.name}
                            </div>
                            {item.active && <ChevronRight size={16} className="text-yellow-500" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <>
            <div className="flex justify-between items-center bg-black px-4 md:px-8 py-4 backdrop-blur-sm border-b border-neutral-800/70 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl text-gray-400 tracking-wide font-serif font-bold">Minder</h1>
                </div>
                <Link
                    href="https://github.com/Tiru-99/Minder"
                    target="_blank"
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:scale-105 active:scale-95 group"
                >
                    <Github className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    <span>Star on GitHub</span>
                </Link>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-black border-r border-neutral-800 z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl text-white">Menu</h2>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-neutral-400 hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <nav className="flex-1 space-y-8">
                                    <Section title="Categories" items={categories} />
                                    <Section title="Status" items={statuses} />
                                    <Section title="Feedback" items={feedback} />
                                </nav>

                                <div className="mt-auto pt-6">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white transition-colors border border-transparent hover:bg-neutral-900/50">
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}