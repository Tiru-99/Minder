import Navbar from "@/components/Navbar"
import TaskTable from "@/components/TaskTable"
export default function Home(){
    return(
        <>
            <div className="">
                {/* Navbar component */}
                <Navbar/>
                {/* Main component */}
                <TaskTable/>
                {/* Sidebar component */}
            </div>
        </>
    )
}