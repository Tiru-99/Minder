"use client";

import { useState } from "react";

import {
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
    Loader2
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";
import { toast } from "sonner";

interface SidebarProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

interface ItemProps {
    name: string;
    icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
}

export default function Sidebar({ activeFilter, onFilterChange }: SidebarProps) {

    const categories = [
        { name: "All Tasks", icon: LayoutGrid },
        { name: "Work", icon: Briefcase },
        { name: "Health", icon: Heart },
        { name: "Personal", icon: User },
    ];

    const statuses = [
        { name: "All Status", icon: List },
        { name: "Incoming", icon: Clock },
        { name: "Overdue", icon: AlertCircle },
        { name: "Completed", icon: CheckCircle2 },
    ];

    const feedback = [
        { name: "Suggest Feature", icon: Sparkles },
        { name: "Report Bug", icon: Bug },
    ];

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await authClient.signOut();
            router.push("/auth");
        } catch (error) {
            console.log("Something went wrong while signing out", error);
            toast.error("Something went wrong while signing out");
            setIsLoading(false);
        }
    }

    const Section = ({ title, items }: { title: string, items: ItemProps[] }) => (
        <div>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">
                {title}
            </h3>
            <ul className="space-y-1">
                {items.map((item) => {
                    const isActive = activeFilter === item.name;
                    return (
                        <li key={item.name}>
                            {title === "Feedback" ? (
                                <button
                                    onClick={() => window.location.href = "https://github.com/Tiru-99/minder/issues/new/choose"}
                                    className={`group w-full flex items-center justify-between rounded-sm px-3 py-2 text-xs md:text-sm font-medium transition-all duration-300 ease-out ${isActive
                                        ? "text-white border border-neutral-800 bg-neutral-900/30 animate-[fadeInScale_0.3s_ease-out]"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900/50 border border-transparent hover:scale-[1.02] hover:border-neutral-800/50"
                                        }`}
                                >
                                    <div className={`flex items-center gap-2 md:gap-3 transition-transform duration-300 ease-out ${isActive ? "animate-[slideIn_0.3s_ease-out]" : "group-hover:translate-x-1"}`}>
                                        <item.icon size={16} className={`transition-transform duration-300 ease-out ${isActive ? "animate-[scaleIn_0.3s_ease-out]" : "group-hover:scale-110"}`} />
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight size={16} className="text-yellow-500 animate-[fadeIn_0.3s_ease-out]" />}
                                </button>
                            ) : (
                                <button
                                    onClick={() => onFilterChange(item.name)}
                                    className={`group w-full flex items-center justify-between rounded-sm px-3 py-2 text-xs md:text-sm font-medium transition-all duration-300 ease-out ${isActive
                                        ? "text-white border border-neutral-800 bg-neutral-900/30 animate-[fadeInScale_0.3s_ease-out]"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900/50 border border-transparent hover:scale-[1.02] hover:border-neutral-800/50"
                                        }`}
                                >
                                    <div className={`flex items-center gap-2 md:gap-3 transition-transform duration-300 ease-out ${isActive ? "animate-[slideIn_0.3s_ease-out]" : "group-hover:translate-x-1"}`}>
                                        <item.icon size={16} className={`transition-transform duration-300 ease-out ${isActive ? "animate-[scaleIn_0.3s_ease-out]" : "group-hover:scale-110"}`} />
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight size={16} className="text-yellow-500 animate-[fadeIn_0.3s_ease-out]" />}
                                </button>)}
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <div className="hidden md:flex w-64 h-full bg-black border-r border-neutral-800/70 flex-col p-3 md:p-4">
            {/* Logo Area */}
            <div className="mb-3 md:mb-4 px-2">
                {/* Placeholder */}
            </div>

            <nav className="flex-1 space-y-3 md:space-y-4">
                <Section title="Categories" items={categories} />
                <Section title="Status" items={statuses} />
                <Section title="Feedback" items={feedback} />
            </nav>

            {/* Footer / Sign Out */}
            <div className="mt-auto pt-3 md:pt-4">
                <button
                    className="group w-full flex items-center gap-2 md:gap-3 px-3 py-2 text-xs md:text-sm font-medium text-neutral-400 hover:text-white transition-all duration-300 ease-out border border-transparent hover:bg-neutral-900/50 hover:scale-[1.02] hover:border-neutral-800/50 rounded-sm disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleSignOut}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <LogOut size={16} className="transition-transform duration-300 ease-out group-hover:scale-110" />
                    )}
                    <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                        {isLoading ? "Signing Out..." : "Sign Out"}
                    </span>
                </button>
            </div>
        </div>
    );
}
