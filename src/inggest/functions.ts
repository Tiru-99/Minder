import { inngest } from "./client";
import { sendReminderStep } from "./reminders";
import { ScheduleReminder } from "@/utils/types";

/*
    multi step function to send all the reminders
*/

export const scheduleReminder = inngest.createFunction(
  {
    id: ScheduleReminder.REMINDER_ID,
    cancelOn: [
      {
        event: ScheduleReminder.CANCEL_EVENT,
        if: "async.data.taskId == event.data.taskId"
      }
    ]
  },
  { event: ScheduleReminder.NOTIFICATION_EVENT },
  async ({ event, step }) => {
    const { taskId, name: taskName, reminders, userEmail, username, taskDueDate } = event.data;

    const reminderPromises = reminders.map((reminder: string, index: number) => {
      sendReminderStep(reminder, step, index, taskId, userEmail, taskName, username, taskDueDate)
    })

    Promise.all(reminderPromises);
  },
);

export const moveToOverdue = inngest.createFunction(
  { id : ScheduleReminder.OVERDUE_ID } , 
  { event : ScheduleReminder.CRON_EVENT }, 
  async ({ event , step}) => {
    //send email every scheduled hour
    
  }
)