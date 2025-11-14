import { sendEmail } from "@/lib/email";
export const sendReminderStep = async (
  reminder: string,
  step: any,
  index: number,
  taskId: string,
  userEmail : string ,
  taskName : string , 
  username : string , 
  taskDueDate : Date 
) => {
  return step.run(`send-reminder-${index}`, async () => {
    const waitTime = getWaitTime(reminder);
    
    await step.sleep(waitTime);
    
    // Send the actual reminder
    await sendEmail({
      taskId,
      reminderType: reminder,
      userEmail ,
      userName : username , 
      taskName,
      taskDueDate
    });
    
    return { sent: true, reminderType: reminder };
  });
};

const getWaitTime = (reminder: string): string => {
  switch(reminder) {
    case "before48h":
      return "48h";
    case "before24h":
      return "24h";
    case "before12h":
      return "12h";
    case "before 6h":
      return "6h";
    case "before 3h":
      return "3h";
    case "before1h":
      return "1h";
    default:
      return "0h";
  }
};