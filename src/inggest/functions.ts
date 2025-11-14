import { inngest } from "./client";
import { sendReminderStep } from "./reminders";

/*
    multi step function to send all the reminders
*/

export const scheduleReminder = inngest.createFunction(
  { id: "schedule-reminder" },
  { event: "delayed-job/reminder" },
  async ({ event, step }) => {
    const { taskId , name , reminders , userEmail , taskName , username , taskDueDate } = event.data;
    
    const reminderPromises = reminders.map((reminder : string , index : number) => {
        sendReminderStep(reminder , step , index , taskId , userEmail , taskName , username , taskDueDate)
    })

    Promise.all(reminderPromises);
  },
);