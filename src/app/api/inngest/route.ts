import { serve } from "inngest/next";
import { inngest } from "@/inggest/client";
import { scheduleReminder , moveToOverdue , cleanupCron} from "@/inggest/functions";
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    scheduleReminder,
    moveToOverdue, 
    cleanupCron
  ],
});