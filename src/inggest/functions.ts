import { inngest } from "./client";
import { sendReminderStep } from "./reminders";
import { ScheduleReminder } from "@/utils/types";
import { sendCronEmail } from "@/lib/email";
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
    const { taskId, name: taskName, reminders, userEmail, username, taskDueDate , after_due_reminder } = event.data;

    const reminderPromises = reminders.map((reminder: string, index: number) => {
      sendReminderStep(reminder, step, index, taskId, userEmail, taskName, username, taskDueDate , after_due_reminder)
    })

    Promise.all(reminderPromises);
  },
);

/*
  simulate a cron function by implementing infinite loop which 
  runs on specific duration
*/
export const moveToOverdue = inngest.createFunction(
  {
    id: ScheduleReminder.OVERDUE_ID,
    cancelOn: [
      {
        event: ScheduleReminder.CANCEL_CRON_EVENT,
        if: "async.data.taskId == event.data.taskId"
      }
    ]
  },
  { event: ScheduleReminder.CRON_TRIGGER_EVENT },
  async ({ event, step }) => {

    const {
      taskId,
      after_due_reminder,
      username,
      userEmail,
      taskName
    } = event.data;

    //extract time 
    const timeInterval = after_due_reminder.split("_").pop();
    while (true) {
      await sendCronEmail(
        taskId,
        after_due_reminder,
        username,
        userEmail,
        taskName
      );

      step.sleep(`${taskId}-sleep`, timeInterval);
    }
  }
)