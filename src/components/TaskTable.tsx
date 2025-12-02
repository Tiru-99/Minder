"use client"
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import AddTaskModal from "./AddTaskModal";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, ChevronsLeftRightEllipsis, Loader2 } from "lucide-react";
import { getTasks, deleteTask, moveToComplete } from "@/hooks/taskCrud";
import { toast } from "sonner";
import TaskTableSkeleton from "./TaskTableSkeleton";
import { Task } from "@prisma/client";

interface TaskTableProps {
  activeFilter?: string;
}

export default function TaskTable({ activeFilter = "All Tasks" }: TaskTableProps) {
  const firstColumn = [
    { key: "name", value: "Task Name" },
    { key: "category", value: "Category" },
    { key: "status", value: "Status" },
    { key: "reminders", value: "Reminders" },
    { key: "after_due", value: "After Due Reminders" },
    { key: "deadline", value: "Due Date" },
    { key: "actions", value: "" },
  ];

  const categoryStyles: Record<string, string> = {
    WORK: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
    PERSONAL: "border-blue-400/40 bg-blue-400/10 text-blue-300",
    HEALTH: "border-green-400/40 bg-green-400/10 text-green-300",
  };

  const statusStyles: Record<string, string> = {
    INCOMING: "bg-yellow-500/20 text-yellow-300",
    PENDING: "bg-orange-500/20 text-orange-300",
    ONGOING: "bg-blue-500/20 text-blue-300",
    DUE: "bg-red-500/25 text-red-300",
    COMPLETED: "bg-green-500/20 text-green-300",
  };


  const { data, isLoading } = getTasks();
  const { mutate: deleteMutate, isPending: isDeleting } = deleteTask();
  const { mutate: moveComplete, isPending: isMoving } = moveToComplete();
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredTasks = data?.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "All Tasks") return matchesSearch;
    if (activeFilter === "Incoming") return task.status === "INCOMING" && matchesSearch;
    if (activeFilter === "Completed") return task.status === "COMPLETED" && matchesSearch;
    if (activeFilter === "Overdue") return task.status === "DUE" && matchesSearch;

    if (["Work", "Health", "Personal"].includes(activeFilter)) {
      return task.type === activeFilter.toUpperCase() && matchesSearch;
    }

    return matchesSearch;
  }) ?? [];

  // Reset to first page when filter or search changes
  if (currentPage > 1 && filteredTasks.length > 0 && (currentPage - 1) * ITEMS_PER_PAGE >= filteredTasks.length) {
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);

  console.log("The data from be is ", data);
  const categoryBadge = (text: string, style: string) => (
    <span
      className={`inline-block rounded-md border px-2 py-1 text-[13px] font-medium ${style}`}
    >
      {text}
    </span>
  );

  const statusBadge = (text: string, style: string) => (
    <span
      className={`inline-block rounded-md px-2 py-1 text-[13px] font-medium ${style}`}
    >
      {text}
    </span>
  );

  const formatAfterDue = (val: string) => {
    if (!val) return "";
    if (val === "none") return "none";
    return val.replace("after_every_", "").replace("h", "h");
  };

  const formatReadableDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }



  const handleDeleteTask = (taskId: string) => {
    deleteMutate(taskId, {
      onSuccess: () => {
        toast.success("Task deleted successfully");
        setActiveMenuIndex(null);
      },
      onError: () => {
        toast.error("Failed to delete task");
      }
    });
  };

  const handleCompleteTask = (taskId: string) => {
    moveComplete(taskId, {
      onSuccess: () => {
        toast.success("Task moved to completed");
        setActiveMenuIndex(null);
      },
      onError: () => {
        toast.error("Failed to update task status");
      }
    });
  };

  const handleEditTask = (taskId: string) => {
    // We need to find the index in 'data' to set currentTaskIndex if we want to keep using it for EditModal
    // Or we can just pass the task to EditModal directly if we change the state.
    // The EditModal takes 'task={data[currentTaskIndex]}'.
    // Let's find the index in 'data'.
    const index = data?.findIndex(t => t.id === taskId) ?? 0;
    setCurrentTaskIndex(index);
    setIsEditModalOpen(true);
    setActiveMenuIndex(null);
  };


  const handleOpenAddModal = () => {
    let count = 0;

    data?.map((data) => {
      if (data.status === "INCOMING") {
        count++;
      }
    })

    if (count >= 7) {
      toast.error("You can only have up to 7 incoming tasks at a time.");
      return;
    }
    setIsAddModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:px-18 md:pt-8">
        {/* Aesthetic Search Bar */}
        <div className="mb-8 relative group max-w-2xl">
          <h1 className="text-gray-400 text-5xl font-bold tracking-wide pb-4">TASKS</h1>
          <div className="absolute -inset-px bg-linear-to-r from-transparent via-white/10 to-transparent rounded-xl opacity-50 blur-sm group-hover:opacity-75 transition duration-500" />
        </div>

        <div className="flex flex-col md:flex-row justify-between w-full items-center pb-4 gap-4 md:gap-0">
          <div className="relative flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-3.5 rounded-xl shadow-2xl w-full md:w-96 transition-all duration-300">
            <Search className="w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search for tasks..."
              className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
              readOnly
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto flex justify-center items-center gap-2 px-5 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
        <TaskTableSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:px-18 md:pt-8">
      {data && currentTaskIndex !== null && (
        <EditTaskModal
          task={data[currentTaskIndex]}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Aesthetic Search Bar */}
      <div className="mb-8 relative group max-w-2xl">
        <h1 className="text-gray-400 text-5xl font-bold tracking-wide pb-4">TASKS</h1>
        <div className="absolute -inset-px bg-linear-to-r from-transparent via-white/10 to-transparent rounded-xl opacity-50 blur-sm group-hover:opacity-75 transition duration-500" />
      </div>

      <div className="flex flex-col md:flex-row justify-between w-full items-center pb-4 gap-4 md:gap-0">
        <div className="relative flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-3.5 rounded-xl shadow-2xl w-full md:w-96 transition-all duration-300">
          <Search className="w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search for tasks..."
            className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="w-full md:w-auto flex justify-center items-center gap-2 px-5 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto relative min-h-[400px]">
        {paginatedTasks.length === 0 ? (
          activeFilter !== "All Tasks" ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-neutral-400 font-medium text-xl">
                No tasks found for {activeFilter}
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-neutral-400 font-medium text-xl">
                No tasks found
              </p>
            </div>
          )

        ) : (
          <>
            <table className="w-full border border-neutral-200/12">
              <thead>
                <tr>
                  {firstColumn.map(({ key, value }) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-sm font-medium text-neutral-400 text-left"
                    >
                      {value}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedTasks.map((task, index) => (
                  <tr
                    key={index}
                    className="text-white border-t border-neutral-200/9 group"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {task.name}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {categoryBadge(
                        task.type,
                        categoryStyles[task.type] ?? ""
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {statusBadge(task.status, statusStyles[task.status] ?? "")}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(task?.reminder ?? {})
                          .filter(([_, v]) => v === true)
                          .map(([k], i) => (
                            <span
                              key={i}
                              className="text-[12px] text-neutral-400 bg-white/10 rounded px-2 py-0.5"
                            >
                              {k.replace("before", "").replace("h", "h")}
                            </span>
                          ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span className="text-[12px] text-neutral-400 bg-white/10 rounded px-2 py-0.5">
                        {formatAfterDue(task.reminder.after_due_reminder)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium">
                      {formatReadableDate(task.deadline)}
                    </td>

                    <td className="px-6 py-4 text-sm relative">
                      <div
                        className="relative"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const spaceBelow = window.innerHeight - rect.bottom;
                          const menuHeight = 120; // Approx height of menu

                          // If space below is less than menu height, open upwards
                          const top = spaceBelow < menuHeight
                            ? rect.top - menuHeight
                            : rect.bottom + 4;

                          setMenuPosition({
                            top,
                            left: rect.right - 192 // 192px is w-48
                          });
                          setActiveMenuIndex(index);
                        }}
                        onMouseLeave={() => {
                          setActiveMenuIndex(null);
                          setMenuPosition(null);
                        }}
                      >
                        <button className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white">
                          <ChevronsLeftRightEllipsis size={16} />
                        </button>

                        <AnimatePresence>
                          {activeMenuIndex === index && menuPosition && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              style={{
                                position: 'fixed',
                                top: menuPosition.top,
                                left: menuPosition.left,
                                zIndex: 50
                              }}
                              className="w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden origin-top-right"
                            >
                              {task.status !== "COMPLETED" && (
                                <button
                                  onClick={() => handleEditTask(task.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                >
                                  Edit Task
                                </button>
                              )}
                              {task.status !== "COMPLETED" && (
                                <button
                                  onClick={() => handleCompleteTask(task.id)}
                                  disabled={isMoving}
                                  className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isMoving ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Moving...
                                    </>
                                  ) : (
                                    "Move to Completed"
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                disabled={isDeleting}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeleting ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  "Delete Task"
                                )}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-8 px-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-neutral-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}


      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedTasks.map((task, index) => (
          <div
            key={index}
            className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 space-y-3 relative"
          >
            <div className="absolute top-4 right-4 ">
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenuIndex(activeMenuIndex === index ? null : index)
                  }
                  className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                >
                  <ChevronsLeftRightEllipsis size={16} />
                </button>

                <AnimatePresence>
                  {activeMenuIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-10 overflow-hidden origin-top-right"
                    >
                      {task.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleEditTask(task.id)}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        >
                          Edit Task
                        </button>
                      )}
                      {task.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={isMoving}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isMoving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Moving...
                            </>
                          ) : (
                            "Move to Completed"
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={isDeleting}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Task"
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-between items-start pr-8">
              <div>
                <h3 className="text-white font-medium text-lg">
                  {task.name}
                </h3>
                <p className="text-neutral-400 text-sm mt-1">
                  Due: {task.deadline}
                </p>
              </div>
              {statusBadge(task.status, statusStyles[task.status] ?? "")}
            </div>

            <div className="flex items-center gap-2">
              {categoryBadge(task.type, categoryStyles[task.type] ?? "")}
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <p className="text-xs text-neutral-500 mb-2 uppercase font-semibold">
                Reminders
              </p>
              <div className="flex gap-2 flex-wrap mb-2">
                {Object.entries(task.reminder)
                  .filter(([_, v]) => v === true)
                  .map(([k], i) => (
                    <span
                      key={i}
                      className="text-[12px] text-neutral-400 bg-white/10 rounded px-2 py-0.5"
                    >
                      {k.replace("before", "").replace("h", "h")}
                    </span>
                  ))}
              </div>
              {task.reminder.after_due_reminder !== "none" && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-neutral-500">After Due:</span>
                  <span className="text-[12px] text-neutral-400 bg-white/10 rounded px-2 py-0.5">
                    {formatAfterDue(task.reminder.after_due_reminder)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Mobile Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 px-2 pb-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Productivity Overview Section - Fills empty space */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-white">{data?.length}</p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-400">
            {data?.filter(t => t.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {data?.filter(t => t.status !== 'COMPLETED').length}
          </p>
        </div>
      </div>
    </div>
  );
}
