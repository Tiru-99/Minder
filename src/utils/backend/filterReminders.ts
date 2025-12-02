/**
 * Filters reminder keys based on how much time is left until the deadline.
 *
 * Each reminder represents "X hours before the deadline" (e.g., before3h = 3 hours before).
 *
 * This function compares the current time with the deadline and removes
 * all reminders that can no longer trigger—for example:
 * - If the deadline is 3 hours away, reminders like before48h, before24h, before12h,
 *   before6h, and before3h are removed because their trigger times have already passed.
 *
 * Rules:
 * - A reminder is considered valid ONLY if its hour value is strictly less than
 *   the remaining time until the deadline.
 * - Equal or greater values are removed (ex: exactly 3 hours left → before3h is removed).
 *
 * Returns two separate arrays:
 *  - validReminders:    reminders that can still fire
 *  - removedReminders:  reminders that are already invalid
 *
 * This helps prevent scheduling reminders that make no sense based on the user's deadline.
 */



const reminderHoursMap: Record<string, number> = {
  before48h: 48,
  before24h: 24,
  before12h: 12,
  before6h: 6,
  before3h: 3,
  before1h: 1,
  before0h: 0,
};

export function filterReminders(deadline: Date, reminders: string[]) {
  const now = Date.now();
  const deadlineMs = new Date(deadline).getTime();

  const remainingHours =
    (deadlineMs - now) / (1000 * 60 * 60); // convert ms → hours

  const validReminders: string[] = [];
  const removedReminders: string[] = [];

  reminders.forEach((key) => {
    const keyHours = reminderHoursMap[key];

    // If reminder time is strictly LESS than remaining time → valid
    // If equal or more → remove
    if (keyHours < remainingHours) {
      validReminders.push(key);
    } else {
      removedReminders.push(key);
    }
  });

  return { validReminders, removedReminders };
}
