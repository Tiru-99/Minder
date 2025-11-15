export enum ScheduleReminder {
    REMINDER_ID = "schedule-reminder",
    CANCEL_EVENT = "delayed-job/reminder.delete",
    NOTIFICATION_EVENT = "delayed-job/reminder",
    OVERDUE_ID = "overdue-cron/trigger", 
    CRON_EVENT="overdue-task/cron"
}

export interface SchedulePayloadType {
    taskId : string ; 
    name : string ; 
    reminders : string[]; 
    userEmail : string ; 
    username : string ; 
    taskDueDate : Date ; 
}