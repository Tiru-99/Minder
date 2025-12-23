import { sendEmail } from "@/lib/email";
import { changeTaskStatus } from "@/utils/backend/changeTaskStatus";
import { GetStepTools } from "inngest";
import { inngest } from "./client";
import { triggerCron } from "./events";

//inngest step type 
type StepTools = GetStepTools<typeof inngest>;
export const sendReminderStep = async (
  reminder: string,
  step: StepTools,
  index: number,
  taskId: string,
  userEmail: string,
  taskName: string,
  username: string,
  taskDueDate: Date,
  after_due_reminder: string
) => {
  console.log("Coming into execute step");

  // Calculate when to send this reminder
  const waitTime = getWaitTime(reminder);
  
  // Convert "3h" → 3 hours → milliseconds
  const hours = parseInt(waitTime.replace("h", ""), 10);
  const waitMs = hours * 60 * 60 * 1000;

  // Calculate target time = due date - wait time
  const dueMs = new Date(taskDueDate).getTime();
  const nowMs = Date.now();
  const targetMs = dueMs - waitMs;

  // Calculate how long to sleep
  const sleepMs = targetMs - nowMs;

  // If the reminder time has already passed, send immediately
  if (sleepMs > 0) {
    console.log(`Sleeping for ${sleepMs}ms (${sleepMs / 1000 / 60} minutes)`);
    await step.sleep(`sleep-before-reminder-${index}`, sleepMs);
    console.log("Sleep completed");
  } else {
    console.log(`Reminder time already passed, sending immediately`);
  }

  await step.run(`send-reminder-${index}`, async () => {
    console.log(`Sending ${reminder} reminder for task ${taskId}`);

    // If this is the "0h" (due time) reminder and there's an after-due reminder
    if (reminder === "before0h") {
      console.log("Task is now due, updating status and setting up after-due reminder");
      await changeTaskStatus(taskId);
      await triggerCron({
        taskId,
        after_due_reminder,
        username,
        userEmail,
        taskName
      });
    }

    // Send the reminder email
    await sendEmail({
      taskId,
      reminderType: reminder,
      userEmail,
      userName: username,
      taskName,
      taskDueDate: new Date(taskDueDate)
    });

    console.log(`Sent ${reminder} reminder for task ${taskId}`);
    return { sent: true, reminderType: reminder };
  });
};


const getWaitTime = (reminder: string): string => {
  switch (reminder) {
    case "before48h":
      return "48h";
    case "before24h":
      return "24h";
    case "before12h":
      return "12h";
    case "before6h":
      return "6h";
    case "before3h":
      return "3h";
    case "before1h":
      return "1h";
    case "before0h":
      return "0h";
    default:
      return "0h";
  }
};
