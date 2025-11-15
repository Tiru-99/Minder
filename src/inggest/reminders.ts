import { sendEmail } from "@/lib/email";
import { changeTaskStatus } from "@/utils/changeTaskStatus";
import { GetStepTools } from "inngest";
import { inngest } from "./client";
import { triggerCron } from "./events";
import { after } from "node:test";

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
  taskDueDate: Date , 
  after_due_reminder : string 
) => {
  return step.run(`send-reminder-${index}`, async () => {
    const waitTime = getWaitTime(reminder);
    //calculate the time to sleep 
    // 1) Convert "3h" → 3 → 10800000 ms
    const hours = parseInt(waitTime.replace("h", ""), 10);
    const waitMs = hours * 60 * 60 * 1000;

    // 2) Calculate target time = due - wait
    const dueMs = new Date(taskDueDate).getTime();
    const nowMs = Date.now();
    const targetMs = dueMs - waitMs;

    // 3) Calculate how long to sleep
    const sleepMs = targetMs - nowMs;

    // 4) Avoid negative values
    if( sleepMs < 0){
      throw new Error("time can't be negative error");
    }
    //sleep
    await step.sleep(`sleep-for-${waitTime}` , waitMs)

    if(reminder === "0h"){
      await changeTaskStatus(taskId);
      await triggerCron({taskId , after_due_reminder , username , userEmail , taskName}); 
    }

    // Send the actual reminder
    await sendEmail({
      taskId,
      reminderType: reminder,
      userEmail,
      userName: username,
      taskName,
      taskDueDate
    });

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
