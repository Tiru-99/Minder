"use client";
import Navbar from "@/components/Navbar";
import TaskTable from "@/components/TaskTable";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
    const [activeFilter, setActiveFilter] = useState("All Tasks");

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            {/* Navbar component - Fixed at the top */}
            <Navbar />

            {/* Main Content Area - Takes remaining height */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Fixed width, sits on the left */}
                <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                {/* TaskTable - Takes remaining width and is scrollable */}
                <main className="flex-1 overflow-y-auto bg-black relative">
                    <TaskTable activeFilter={activeFilter} />
                </main>
            </div>
        </div>
    );
}