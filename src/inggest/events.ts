import { inngest } from "./client";
import { ScheduleReminder , ScheduleCronTrigger , SchedulePayloadType } from "@/utils/types";
import { filterReminders } from "@/utils/filterReminders";


export async function scheduleEvent(data : SchedulePayloadType){
    //function to remove unncessary reminders 
    const { validReminders } = filterReminders(data.taskDueDate , data.reminders); 
    return await inngest.send({
        name : ScheduleReminder.NOTIFICATION_EVENT,
        data : { ...data , reminders : validReminders}
    });
}

export async function cancelEvent(taskId : string){
    return await inngest.send({
        name : ScheduleReminder.CANCEL_EVENT,
        data : {
            taskId
        }
    });
}

export async function updateEvent(data : SchedulePayloadType){
    await cancelEvent(data.taskId); 
    return await scheduleEvent(data);
}

//trigger cron 
export async function triggerCron(data : ScheduleCronTrigger){
    return await inngest.send({
        name : ScheduleReminder.CRON_TRIGGER_EVENT,
        data 
    })
}

//cancel cron 
export async function cancelCron(taskId : string){
    return await inngest.send(
        {
            name : ScheduleReminder.CANCEL_CRON_EVENT, 
            data : {
                taskId
            }
        }
    )
};