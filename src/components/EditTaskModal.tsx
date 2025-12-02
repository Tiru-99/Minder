import { useState} from "react";
import { X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "./DatePicker";
import TimePickerComponent from "./TimePicker"; 
import { formatDateTime } from "@/utils/frontend/formatDateTime";
import { toast } from "sonner";
import { useSnoozeTask } from "@/hooks/taskCrud";

interface Task {
    id : string ; 
    name: string;
    type: string;
    status: string;
    deadline: string;
    reminder: {
        before48h: boolean;
        before24h: boolean;
        before12h: boolean;
        before6h: boolean;
        before3h: boolean;
        before1h: boolean;
        after_due_reminder: string;
    };
}

interface EditTaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditTaskModal({
    task,
    isOpen,
    onClose
}: EditTaskModalProps) {
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string>("");
    const { mutate , isPending } = useSnoozeTask();


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "after_due_reminder") {
            setEditedTask((prev) => ({
                ...prev,
                reminder: {
                    ...prev.reminder,
                    after_due_reminder: value
                }
            }));
        } else {
            setEditedTask((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time: string, errMsg: string) => {
        setSelectedTime(time);
    };

    const handleReminderChange = (key: string) => {
        setEditedTask((prev) => ({
            ...prev,
            reminder: {
                ...prev.reminder,
                [key as keyof typeof prev.reminder]:
                    !prev.reminder[key as keyof typeof prev.reminder],
            },
        }));
    };

    const isReminderValid = (key: string) => {
        if (!selectedDate) return true;

        const now = new Date();
        const dueDateTime = new Date(selectedDate);
        if (selectedTime) {
            const [h, m] = selectedTime.split(':').map(Number);
            dueDateTime.setHours(h, m, 0, 0);
        } else {
            dueDateTime.setHours(23, 59, 59, 999);
        }

        const timeDiff = dueDateTime.getTime() - now.getTime();
        const hoursRemaining = timeDiff / (1000 * 60 * 60);

        let reminderHours = 0;
        const val = key.replace("before", "");
        if (val.includes("h")) reminderHours = parseInt(val.replace("h", ""));
        if (val.includes("min")) reminderHours = parseInt(val.replace("min", "")) / 60;

        return hoursRemaining > reminderHours;
    };

    const handleSave = () => {
        if(!selectedDate || !selectedTime){
            toast.error("Please select a date and time");
            return;
        }  

        const allBeforeFalse = Object.entries(editedTask.reminder).filter(
            ([key]) => key.startsWith("before"))
            .every(([_ ,value]) => value === false)
        
        if(allBeforeFalse){
            toast.error("Please select a reminder");
            return;
        }

        const formattedDate = formatDateTime(selectedTime, selectedDate); 
        if(!formattedDate){
            toast.error("Please select a date and time");
            return;
        }

        const dataToSend = { 
            deadline : formattedDate,
            id : task.id,
            reminder : editedTask.reminder,
        }

        mutate(dataToSend, {
            onSuccess: () => {
                toast.success("Task updated successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to update task");
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
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-xl font-semibold text-white">Snooze</h2>
                                <span className="text-xs text-neutral-500 font-medium">(Snoozing is for pussies)</span>
                            </div>
                            <button className="text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
                                onClick={onClose}
                                disabled={isPending}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
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
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">
                                        Due Time
                                    </label>
                                    <TimePickerComponent
                                        onChange={handleTimeChange}
                                        initialValue={selectedTime}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">
                                    Reminders
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.keys(editedTask.reminder)
                                        .filter((key) => key.startsWith("before"))
                                        .map((key) => {
                                            const isValid = isReminderValid(key);
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => handleReminderChange(key)}
                                                    disabled={!isValid}
                                                    className={`px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${!isValid
                                                        ? "bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800"
                                                        : editedTask.reminder[key as keyof typeof editedTask.reminder]
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
                                    value={editedTask.reminder.after_due_reminder}
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
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isPending}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
