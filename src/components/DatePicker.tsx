import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export default function DatePicker({ date, setDate }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setIsOpen(false);
    };


    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-2 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm transition-colors focus:outline-none focus:border-neutral-500 ${date ? "text-white" : "text-neutral-400"
                    }`}
            >
                <CalendarIcon size={16} className="text-neutral-400" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 left-0 z-50 p-3 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl"
                    >
                        <style>{`
                            .rdp {
                                --rdp-cell-size: 40px;
                                --rdp-accent-color: #fff;
                                --rdp-background-color: #262626;
                                margin: 0;
                            }
                            .rdp-day_selected:not([disabled]), .rdp-day_selected:focus:not([disabled]), .rdp-day_selected:active:not([disabled]), .rdp-day_selected:hover:not([disabled]) {
                                background-color: white;
                                color: black;
                                font-weight: bold;
                            }
                            .rdp-day:hover:not([disabled]) {
                                background-color: #262626;
                                color: white;
                            }
                            .rdp-button:hover:not([disabled]) {
                                background-color: #262626;
                            }
                            .rdp-caption_label {
                                color: white;
                                font-weight: 600;
                            }
                            .rdp-nav_button {
                                color: #a3a3a3;
                            }
                            .rdp-nav_button:hover {
                                color: white;
                            }
                            .rdp-head_cell {
                                color: #737373;
                                font-weight: 500;
                                font-size: 0.875rem;
                            }
                            .rdp-day {
                                color: #d4d4d4;
                                font-size: 0.875rem;
                            }
                            .rdp-day_today {
                                font-weight: bold;
                                color: #fff;
                            }
                        `}</style>
                        <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            showOutsideDays
                            className="bg-transparent"
                            disabled={{ before: new Date() }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
