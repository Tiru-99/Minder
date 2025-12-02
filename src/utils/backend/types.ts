export enum ScheduleReminder {
    REMINDER_ID = "schedule-reminder",
    CANCEL_EVENT = "delayed-job/reminder.delete",
    NOTIFICATION_EVENT = "delayed-job/reminder",
    OVERDUE_ID = "overdue-cron/trigger", 
    CRON_TRIGGER_EVENT="overdue-task/cron",
    CRON_ID = "cron-trigger/job",
    CRON_EVENT="cron-event/trigger", 
    CANCEL_CRON_EVENT="cron-event/cancel",
    CLEANUP_CRON_EVENT="cron-event/cleanup"
}

export interface SchedulePayloadType {
    taskId : string ; 
    name : string ; 
    reminders : string[]; 
    userEmail : string ; 
    username : string ; 
    taskDueDate : Date ; 
    after_due_reminder : string; 
}

export interface ScheduleCronTrigger {
    taskId : string ; 
    after_due_reminder : string ; 
    username : string ; 
    userEmail : string ; 
    taskName : string
}