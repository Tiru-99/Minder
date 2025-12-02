"use client";

import { motion } from "framer-motion";
import { Check, MoreHorizontal } from "lucide-react";

export default function HeroMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            style={{ perspective: "1000px" }}
            className="relative w-full max-w-5xl mx-auto mt-16"
        >
            <div className="relative rounded-xl bg-neutral-900/50 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
                {/* Mockup Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="h-2 w-32 bg-white/10 rounded-full" />
                </div>

                {/* Mockup Content */}
                <div className="p-6 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wider px-4">
                        <div className="w-1/3">Task</div>
                        <div className="w-1/4">Status</div>
                        <div className="w-1/4">Priority</div>
                        <div className="w-10"></div>
                    </div>

                    {/* Task Rows */}
                    {[
                        {
                            title: "Design System Update",
                            status: "In Progress",
                            priority: "High",
                            statusColor: "text-blue-400 bg-blue-400/10",
                            priorityColor: "text-orange-400",
                        },
                        {
                            title: "Q4 Marketing Strategy",
                            status: "Review",
                            priority: "Medium",
                            statusColor: "text-purple-400 bg-purple-400/10",
                            priorityColor: "text-yellow-400",
                        },
                        {
                            title: "Mobile App Handoff",
                            status: "Completed",
                            priority: "High",
                            statusColor: "text-green-400 bg-green-400/10",
                            priorityColor: "text-orange-400",
                        },
                        {
                            title: "Client Meeting Preparation",
                            status: "To Do",
                            priority: "Low",
                            statusColor: "text-neutral-400 bg-neutral-400/10",
                            priorityColor: "text-neutral-400",
                        },
                    ].map((task, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-1/3 flex items-center gap-3">
                                <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                                    {task.status === "Completed" && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-neutral-200">
                                    {task.title}
                                </span>
                            </div>
                            <div className="w-1/4">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${task.statusColor}`}
                                >
                                    {task.status}
                                </span>
                            </div>
                            <div className="w-1/4">
                                <span className={`text-xs font-medium ${task.priorityColor}`}>
                                    {task.priority}
                                </span>
                            </div>
                            <div className="w-10 flex justify-end">
                                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Gradient Overlay for Fade Effect */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
        </motion.div>
    );
}
