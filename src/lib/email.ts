
//normal email and cron email 
import { transporter } from "@/utils/backend/nodemailer";

async function sendEmail({
  taskId,
  reminderType,
  userEmail,
  taskName,
  taskDueDate,
  userName,
}: {
  taskId: string;
  reminderType: string;
  userEmail: string;
  taskName: string;
  taskDueDate: Date;
  userName?: string;
}): Promise<string> {
  try {
    const emailContent = getEmailContentByType(reminderType, taskName, taskDueDate, taskId, userName);

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log(`✅ ${reminderType} email sent for task ${taskId}: ${info.messageId}`);
    return info.messageId;

  } catch (error) {
    console.error(`❌ Email failed for task ${taskId} (${reminderType}):`, error);
    throw error;
  }
}

function getEmailContentByType(
  reminderType: string,
  taskName: string,
  taskDueDate: Date,
  taskId: string,
  userName?: string
): { subject: string; html: string; text: string } {
  const greeting = userName ? `Hi ${userName}` : 'Hello';
  const formattedDate = formatDate(taskDueDate);
  const taskUrl = `${process.env.APP_URL}/tasks/${taskId}`;

  switch (reminderType) {
    case "before48h":
      return {
        subject: `📅 Reminder: "${taskName}" due in 2 days`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; }
                .task-card { background: white; padding: 25px; border-radius: 8px; 
                            border-left: 4px solid #667eea; margin: 20px 0; }
                .button { display: inline-block; background-color: #667eea; color: white !important; 
                         padding: 14px 28px; text-decoration: none; border-radius: 6px; 
                         margin-top: 20px; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                .icon { font-size: 48px; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">📅</div>
                  <h1 style="margin: 0;">Early Reminder</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">You have 2 days to prepare</p>
                </div>
                <div class="content">
                  <p>${greeting},</p>
                  <p>Just a heads up! Your task is coming up in <strong>48 hours</strong>. You still have plenty of time to prepare.</p>
                  
                  <div class="task-card">
                    <h2 style="margin-top: 0; color: #667eea;">📋 ${taskName}</h2>
                    <p style="margin: 10px 0;"><strong>Due Date:</strong> ${formattedDate}</p>
                    <p style="margin: 10px 0;"><strong>Time Remaining:</strong> 2 days</p>
                  </div>
                  
                  <p>💡 <strong>Tip:</strong> Start planning your approach now to avoid last-minute stress!</p>
                  
                  <a href="${taskUrl}" class="button">View Task Details</a>
                  
                  <div class="footer">
                    <p>This is an early reminder. You'll receive more reminders as the deadline approaches.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
                    📅 EARLY REMINDER

                    ${greeting},

                    Your task "${taskName}" is due in 48 hours (2 days).

                    Due Date: ${formattedDate}
                    Time Remaining: 2 days

                    You still have plenty of time to prepare. Start planning your approach now!

                    View task: ${taskUrl}
                            `.trim()
      };

    case "before24h":
      return {
        subject: `⏰ Reminder: "${taskName}" due tomorrow`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                          color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; }
                .task-card { background: white; padding: 25px; border-radius: 8px; 
                            border-left: 4px solid #f5576c; margin: 20px 0; }
                .alert { background: #fef3c7; padding: 15px; border-radius: 6px; 
                        border-left: 4px solid #f59e0b; margin: 20px 0; }
                .button { display: inline-block; background-color: #f5576c; color: white !important; 
                         padding: 14px 28px; text-decoration: none; border-radius: 6px; 
                         margin-top: 20px; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                .icon { font-size: 48px; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">⏰</div>
                  <h1 style="margin: 0;">24 Hour Notice</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Your task is due tomorrow!</p>
                </div>
                <div class="content">
                  <p>${greeting},</p>
                  <p>This is your <strong>24-hour reminder</strong>. Your task is due tomorrow!</p>
                  
                  <div class="task-card">
                    <h2 style="margin-top: 0; color: #f5576c;">📋 ${taskName}</h2>
                    <p style="margin: 10px 0;"><strong>Due Date:</strong> ${formattedDate}</p>
                    <p style="margin: 10px 0;"><strong>Time Remaining:</strong> 24 hours</p>
                  </div>
                  
                  <div class="alert">
                    <strong>⚠️ Action Required:</strong> Make sure you have everything you need to complete this task by tomorrow.
                  </div>
                  
                  <p>Now is a good time to:</p>
                  <ul>
                    <li>Review task requirements</li>
                    <li>Gather necessary resources</li>
                    <li>Block time on your calendar</li>
                  </ul>
                  
                  <a href="${taskUrl}" class="button">View Task Details</a>
                  
                  <div class="footer">
                    <p>You'll receive additional reminders as the deadline gets closer.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
⏰ 24-HOUR REMINDER

${greeting},

Your task "${taskName}" is due TOMORROW!

Due Date: ${formattedDate}
Time Remaining: 24 hours

⚠️ Action Required: Make sure you have everything you need to complete this task by tomorrow.

Now is a good time to:
- Review task requirements
- Gather necessary resources
- Block time on your calendar

View task: ${taskUrl}
        `.trim()
      };

    case "before12h":
      return {
        subject: `🔔 Important: "${taskName}" due in 12 hours`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); 
                          color: #333; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; }
                .task-card { background: white; padding: 25px; border-radius: 8px; 
                            border-left: 4px solid #fa709a; margin: 20px 0; }
                .urgent { background: #fee2e2; padding: 15px; border-radius: 6px; 
                         border-left: 4px solid #ef4444; margin: 20px 0; }
                .button { display: inline-block; background-color: #fa709a; color: white !important; 
                         padding: 14px 28px; text-decoration: none; border-radius: 6px; 
                         margin-top: 20px; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                .icon { font-size: 48px; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">🔔</div>
                  <h1 style="margin: 0;">12 Hour Warning</h1>
                  <p style="margin: 10px 0 0 0;">Time to take action!</p>
                </div>
                <div class="content">
                  <p>${greeting},</p>
                  <p>Your task deadline is approaching fast! Only <strong>12 hours</strong> remaining.</p>
                  
                  <div class="task-card">
                    <h2 style="margin-top: 0; color: #fa709a;">📋 ${taskName}</h2>
                    <p style="margin: 10px 0;"><strong>Due Date:</strong> ${formattedDate}</p>
                    <p style="margin: 10px 0;"><strong>Time Remaining:</strong> 12 hours</p>
                  </div>
                  
                  <div class="urgent">
                    <strong>⚡ Getting Close:</strong> If you haven't started yet, now is the time to begin!
                  </div>
                  
                  <p><strong>Quick checklist:</strong></p>
                  <ul>
                    <li>✓ Do you have all the information you need?</li>
                    <li>✓ Have you allocated time to work on this?</li>
                    <li>✓ Are there any blockers you need to address?</li>
                  </ul>
                  
                  <a href="${taskUrl}" class="button">Open Task Now</a>
                  
                  <div class="footer">
                    <p>Don't wait until the last minute!</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
🔔 12-HOUR WARNING

${greeting},

Your task "${taskName}" is due in 12 hours!

Due Date: ${formattedDate}
Time Remaining: 12 hours

⚡ Getting Close: If you haven't started yet, now is the time to begin!

Quick checklist:
✓ Do you have all the information you need?
✓ Have you allocated time to work on this?
✓ Are there any blockers you need to address?

View task: ${taskUrl}
        `.trim()
      };

    case "before6h":
      return {
        subject: `⚠️ Urgent: "${taskName}" due in 6 hours!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); 
                          color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; }
                .task-card { background: white; padding: 25px; border-radius: 8px; 
                            border-left: 4px solid #ff6b6b; margin: 20px 0; 
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                .critical { background: #fee2e2; padding: 20px; border-radius: 6px; 
                           border: 2px solid #ef4444; margin: 20px 0; text-align: center; }
                .button { display: inline-block; background-color: #ff6b6b; color: white !important; 
                         padding: 16px 32px; text-decoration: none; border-radius: 6px; 
                         margin-top: 20px; font-weight: bold; font-size: 16px; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                .icon { font-size: 52px; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">⚠️</div>
                  <h1 style="margin: 0;">URGENT REMINDER</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Only 6 hours left!</p>
                </div>
                <div class="content">
                  <p>${greeting},</p>
                  <p><strong>This is an urgent reminder!</strong> Your task is due in just <strong>6 hours</strong>.</p>
                  
                  <div class="task-card">
                    <h2 style="margin-top: 0; color: #ff6b6b;">📋 ${taskName}</h2>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Due Date:</strong> ${formattedDate}</p>
                    <p style="margin: 10px 0; font-size: 18px; color: #ff6b6b;"><strong>⏰ Time Remaining: 6 HOURS</strong></p>
                  </div>
                  
                  <div class="critical">
                    <h3 style="margin-top: 0; color: #dc2626;">🚨 Time Critical</h3>
                    <p style="margin: 0; font-size: 16px;">You need to work on this NOW if you haven't completed it yet!</p>
                  </div>
                  
                  <p><strong>Focus on:</strong></p>
                  <ul style="font-size: 15px;">
                    <li>Prioritize this task above others</li>
                    <li>Minimize distractions</li>
                    <li>Focus on completion, not perfection</li>
                  </ul>
                  
                  <center>
                    <a href="${taskUrl}" class="button">🔥 COMPLETE TASK NOW</a>
                  </center>
                  
                  <div class="footer">
                    <p>You'll receive a final reminder 1 hour before the deadline.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
⚠️ URGENT REMINDER - 6 HOURS LEFT!

${greeting},

Your task "${taskName}" is due in just 6 HOURS!

Due Date: ${formattedDate}
Time Remaining: 6 HOURS

🚨 TIME CRITICAL: You need to work on this NOW if you haven't completed it yet!

Focus on:
- Prioritize this task above others
- Minimize distractions
- Focus on completion, not perfection

🔥 COMPLETE TASK NOW: ${taskUrl}
        `.trim()
      };

    case "before3h":
      return {
        subject: `🚨 CRITICAL: "${taskName}" due in 3 hours!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); 
                          color: white; padding: 35px; border-radius: 8px 8px 0 0; text-align: center;
                          animation: pulse 2s infinite; }
                .content { background-color: #f9fafb; padding: 30px; }
                .task-card { background: white; padding: 25px; border-radius: 8px; 
                            border: 3px solid #eb3349; margin: 20px 0; 
                            box-shadow: 0 6px 12px rgba(235, 51, 73, 0.2); }
                .emergency { background: #fef2f2; padding: 25px; border-radius: 6px; 
                            border: 3px solid #dc2626; margin: 20px 0; text-align: center; }
                .button { display: inline-block; background-color: #dc2626; color: white !important; 
                         padding: 18px 36px; text-decoration: none; border-radius: 6px; 
                         margin-top: 20px; font-weight: bold; font-size: 18px;
                         box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3); }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                .icon { font-size: 56px; margin-bottom: 10px; }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.02); }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">🚨</div>
                  <h1 style="margin: 0; font-size: 28px;">CRITICAL DEADLINE</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 20px;">3 HOURS REMAINING!</p>
                </div>
                <div class="content">
                  <p style="font-size: 16px;"><strong>${greeting},</strong></p>
                  <p style="font-size: 16px;"><strong style="color: #dc2626;">CRITICAL:</strong> Your task deadline is in <strong style="color: #dc2626; font-size: 18px;">3 HOURS</strong>!</p>
                  
                  <div class="task-card">
                    <h2 style="margin-top: 0; color: #eb3349; font-size: 22px;">📋 ${taskName}</h2>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Due Date:</strong> ${formattedDate}</p>
                    <p style="margin: 10px 0; font-size: 20px; color: #dc2626;"><strong>⏰ ONLY 3 HOURS LEFT!</strong></p>
                  </div>
                  
                  <div class="emergency">
                    <h3 style="margin-top: 0; color: #991b1b; font-size: 20px;">⚡ LAST CHANCE</h3>
                    <p style="margin: 10px 0; font-size: 17px; font-weight: bold;">
                      Drop everything and focus on this task RIGHT NOW!
                    </p>
                  </div>
                  
                  <p style="font-size: 15px;"><strong>Emergency mode:</strong></p>
                  <ul style="font-size: 15px; line-height: 1.8;">
                    <li>🎯 <strong>This is your TOP priority</strong></li>
                    <li>🚫 Turn off ALL notifications</li>
                    <li>⚡ Work in short, focused bursts</li>
                    <li>✅ Aim for "done" rather than "perfect"</li>
                  </ul>
                  
                  <center>
                    <a href="${taskUrl}" class="button">⚡ START NOW - 3 HOURS LEFT!</a>
                  </center>
                  
                  <div class="footer">
                    <p style="color: #dc2626; font-weight: bold;">You'll receive one final reminder in 2 hours.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
🚨 CRITICAL DEADLINE - 3 HOURS LEFT!

${greeting},

CRITICAL: Your task "${taskName}" is due in 3 HOURS!

Due Date: ${formattedDate}
⏰ ONLY 3 HOURS LEFT!

⚡ LAST CHANCE
Drop everything and focus on this task RIGHT NOW!

Emergency mode:
🎯 This is your TOP priority
🚫 Turn off ALL notifications
⚡ Work in short, focused bursts
✅ Aim for "done" rather than "perfect"

⚡ START NOW: ${taskUrl}
        `.trim()
      };

    case "before1h":
      return {
        subject: `🔥 FINAL WARNING: "${taskName}" due in 1 HOUR!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #c31432 0%, #240b36 100%); 
                          color: white; padding: 40px; border-radius: 8px 8px 0 0; text-align: center;
                          animation: urgent-pulse 1s infinite; }
                .content { background-color: #fef2f2; padding: 30px; }
                .task-card { background: white; padding: 30px; border-radius: 8px; 
                            border: 4px solid #991b1b; margin: 20px 0; 
                            box-shadow: 0 8px 16px rgba(153, 27, 27, 0.3); }
                .final-warning { background: #991b1b; color: white; padding: 30px; 
                                border-radius: 6px; margin: 20px 0; text-align: center; }
                .button { display: inline-block; background-color: #7f1d1d; color: white !important; 
                         padding: 20px 40px; text-decoration: none; border-radius: 6px; 
                         margin-top: 20px; font-weight: bold; font-size: 20px;
                         box-shadow: 0 6px 12px rgba(127, 29, 29, 0.4);
                         animation: button-pulse 1.5s infinite; }
                .footer { text-align: center; margin-top: 30px; color: #991b1b; 
                         font-size: 15px; font-weight: bold; }
                .icon { font-size: 64px; margin-bottom: 10px; }
                @keyframes urgent-pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
                @keyframes button-pulse {
                  0%, 100% { box-shadow: 0 6px 12px rgba(127, 29, 29, 0.4); }
                  50% { box-shadow: 0 6px 20px rgba(127, 29, 29, 0.8); }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">🔥</div>
                  <h1 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    FINAL WARNING
                  </h1>
                  <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">
                    1 HOUR REMAINING!!!
                  </p>
                </div>
                <div class="content">
                  <p style="font-size: 18px;"><strong>${greeting},</strong></p>
                  
                  <div class="final-warning">
                    <h2 style="margin: 0; font-size: 28px;">⚠️ THIS IS YOUR FINAL REMINDER ⚠️</h2>
                    <p style="margin: 15px 0 0 0; font-size: 20px;">
                      Your deadline is in <strong style="font-size: 24px;">60 MINUTES</strong>!
                    </p>
                  </div>
                  
                  <div class="task-card">
                    <h2 style="margin-top: 0; color: #991b1b; font-size: 24px;">📋 ${taskName}</h2>
                    <p style="margin: 15px 0; font-size: 17px;"><strong>Due Date:</strong> ${formattedDate}</p>
                    <p style="margin: 15px 0; font-size: 22px; color: #991b1b; font-weight: bold;">
                      ⏰ DEADLINE IN 1 HOUR!
                    </p>
                  </div>
                  
                  <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; 
                              border-left: 5px solid #991b1b;">
                    <h3 style="margin-top: 0; color: #991b1b; font-size: 20px;">
                      🎯 Final 60 Minutes Strategy:
                    </h3>
                    <ul style="font-size: 16px; line-height: 2;">
                      <li><strong>DO NOT MULTITASK</strong> - This task only!</li>
                      <li><strong>Skip perfectionism</strong> - Done is better than perfect</li>
                      <li><strong>Work in 15-minute sprints</strong> with 2-min breaks</li>
                      <li><strong>Focus on essentials</strong> - What MUST be done?</li>
                      <li><strong>Have a submission plan</strong> - Don't wait until the last second</li>
                    </ul>
                  </div>
                  
                  <center>
                    <a href="${taskUrl}" class="button">
                      🔥 COMPLETE NOW - FINAL HOUR! 🔥
                    </a>
                  </center>
                  
                  <div class="footer">
                    <p style="font-size: 17px;">⚠️ THIS IS YOUR LAST REMINDER BEFORE THE DEADLINE! ⚠️</p>
                    <p>Make every minute count!</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
🔥🔥🔥 FINAL WARNING - 1 HOUR LEFT! 🔥🔥🔥

${greeting},

⚠️ THIS IS YOUR FINAL REMINDER ⚠️

Your task "${taskName}" is due in 60 MINUTES!

Due Date: ${formattedDate}
⏰ DEADLINE IN 1 HOUR!

🎯 Final 60 Minutes Strategy:
- DO NOT MULTITASK - This task only!
- Skip perfectionism - Done is better than perfect
- Work in 15-minute sprints with 2-min breaks
- Focus on essentials - What MUST be done?
- Have a submission plan - Don't wait until the last second

🔥 COMPLETE NOW: ${taskUrl}

⚠️ THIS IS YOUR LAST REMINDER BEFORE THE DEADLINE! ⚠️
Make every minute count!
        `.trim()
      };

    default:
      return {
        subject: `Reminder: "${taskName}"`,
        html: `
          <p>${greeting},</p>
          <p>This is a reminder about your task: <strong>${taskName}</strong></p>
          <p><strong>Due:</strong> ${formattedDate}</p>
          <p><a href="${taskUrl}">View Task</a></p>
        `,
        text: `${greeting},\n\nReminder: ${taskName}\nDue: ${formattedDate}\n\nView: ${taskUrl}`
      };
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
}

async function sendCronEmail(
  taskId: string,
  after_due_reminder: string,
  username: string,
  userEmail: string,
  taskName: string
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: `⏰ Task Overdue: ${taskName}`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e74c3c;">⚠️ Task Overdue</h2>
              <p>Hey ${username},</p>
              <p>Your task <strong>${taskName}</strong> is past its deadline.</p>
              <p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <strong>Action needed:</strong> This task requires your immediate attention.
              </p>
              <p>Get it done! 💪</p>
            </div>
          `,
      text: `Hey ${username},\n\nYour task "${taskName}" is past its deadline. Time to wrap it up!\n\nGet it done! 💪`
    });

    console.log(`${after_due_reminder} type mail sent to the user`);
    return info.messageId
  } catch (error) {
    console.error("Email failed for the task " + taskId, error);
    throw error;
  }
}

export { sendEmail, sendCronEmail };