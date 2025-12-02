import { useState } from "react";
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "./DatePicker";
import { format } from "date-fns";
import TimePickerComponent from "./TimePicker";
import { formatDateTime } from "@/utils/frontend/formatDateTime";
import { addTask } from "@/hooks/taskCrud";
import { Task } from "@/utils/frontend/types";

import { toast } from "sonner";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTaskModal({
    isOpen,
    onClose
}: AddTaskModalProps) {
    const initialTask: Task = {
        name: "",
        type: "WORK",
        notes: "",
        deadline: null,
        after_due_reminder: "none",
        reminders: {
            before48h: false,
            before24h: true,
            before12h: false,
            before6h: false,
            before3h: false,
            before1h: true,
        },
    };
    const { mutate, isPending } = addTask();
    const [newTask, setNewTask] = useState<Task>(initialTask);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [time, setTime] = useState({
        time: "",
        errMsg: ""
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setNewTask(prev => ({ ...prev, due_date: format(date, "d MMM") }));
        } else {
            setNewTask(prev => ({ ...prev, due_date: "" }));
        }
    };

    const handleTimeChange = (newTime: string, errMsg: string) => {
        setTime({
            time: newTime,
            errMsg: errMsg
        });
        return;
    }


    const isReminderValid = (reminderKey: string, dueDate: Date | undefined) => {
        if (!dueDate) return true; // If no date selected, all are theoretically valid until date is picked

        const now = new Date();
        // Set due date time to end of day (or specific time if we had time picker)
        // For now assuming due date is at 23:59:59 of that day
        const dueDateTime = new Date(dueDate);
        dueDateTime.setHours(23, 59, 59, 999);

        const timeDiff = dueDateTime.getTime() - now.getTime();
        const hoursRemaining = timeDiff / (1000 * 60 * 60);

        const reminderHours = parseInt(reminderKey.replace("before", "").replace("h", ""));

        // Reminder must be set BEFORE the due time.
        // If I want a reminder 48h before, I must have at least 48h remaining.
        return hoursRemaining > reminderHours;
    };

    const handleReminderChange = (key: string) => {
        // Prevent toggling if invalid
        if (!isReminderValid(key, selectedDate)) return;

        setNewTask((prev) => ({
            ...prev,
            reminders: {
                ...prev.reminders,
                [key as keyof typeof prev.reminders]:
                    !prev.reminders[key as keyof typeof prev.reminders],
            },
        }));
    };


    const handleSubmit = () => {

        if (!newTask.name || !selectedDate) {
            // Basic validation
            toast.error("Please fill in Task Name and Due Date");
            return;
        }

        if (!selectedDate) {
            console.log("No date found");
            return;
        }

        if (!newTask.reminders || Object.values(newTask.reminders).every((value) => !value)) {
            toast.error("Please select at least one reminder");
            return;
        }

        const formattedDate = formatDateTime(time.time, selectedDate);
        if (!formattedDate) {
            return toast.error("Please select a valid time");
        }
        const dataToSend = {
            name: newTask.name,
            type: newTask.type,
            notes: newTask.notes,
            deadline: formattedDate,
            after_due_reminder: newTask.after_due_reminder,
            reminders: newTask.reminders,
        }
        mutate(dataToSend, {
            onSuccess: () => {
                toast.success("Task added successfully");
                onClose();
                setNewTask(initialTask);
                setSelectedDate(undefined);
            },
            onError: () => {
                toast.error("Failed to add task");
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Add New Task</h2>
                            <button className="text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
                                onClick={() => {
                                    onClose();
                                    setNewTask(initialTask);
                                    setSelectedDate(undefined);
                                }}
                                disabled={isPending}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    Task Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newTask.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter task name"
                                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    Category
                                </label>
                                <select
                                    name="type"
                                    value={newTask.type}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:border-neutral-500 focus:outline-none transition-colors"
                                >
                                    <option value="WORK">Work</option>
                                    <option value="PERSONAL">Personal</option>
                                    <option value="HEALTH">Health</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">
                                        Due Date
                                    </label>
                                    <DatePicker
                                        date={selectedDate}
                                        setDate={handleDateSelect}
                                    />
                                </div>

                                <div className="">
                                    <label className="block text-sm text-neutral-400 mb-1">
                                        Due Time
                                    </label>

                                    <TimePickerComponent onChange={handleTimeChange} />
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">
                                    Reminders
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.keys(newTask.reminders).map((key) => {
                                        const isValid = isReminderValid(key, selectedDate);
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleReminderChange(key)}
                                                disabled={!isValid}
                                                className={`px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${!isValid
                                                    ? "bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800"
                                                    : newTask.reminders[key as keyof typeof newTask.reminders]
                                                        ? "bg-white text-black shadow-lg shadow-white/10"
                                                        : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                    }`}
                                            >
                                                {key.replace("before", "").replace("h", "h")}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    After Due Reminder
                                </label>
                                <select
                                    name="after_due_reminder"
                                    value={newTask.after_due_reminder}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:border-neutral-500 focus:outline-none transition-colors"
                                >
                                    <option value="none">None</option>
                                    <option value="after_every_3h">Every 3h</option>
                                    <option value="after_every_6h">Every 6h</option>
                                    <option value="after_every_12h">Every 12h</option>
                                    <option value="after_every_24h">Every 24h</option>
                                    <option value="after_every_48h">Every 48h</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={newTask.notes}
                                    onChange={handleInputChange}
                                    placeholder="Add any extra details..."
                                    rows={3}
                                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none transition-colors resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    onClose();
                                    setNewTask(initialTask);
                                }}
                                disabled={isPending}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={time.errMsg.length > 0 || isPending}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${time.errMsg.length > 0 || isPending ? "bg-neutral-800 text-neutral-400 cursor-not-allowed" : "bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"}`}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Task"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
