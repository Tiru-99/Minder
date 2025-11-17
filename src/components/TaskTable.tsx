export default function TaskTable() {
  const firstColumn = [
    { key: "task_name", value: "Task Name" },
    { key: "category", value: "Category" },
    { key: "status", value: "Status" },
    { key: "reminders", value: "Reminders" },
    { key: "after_due", value: "After Due Reminders" },
    { key: "due_date", value: "Due Date" },
  ];

  const categoryStyles: Record<string, string> = {
    Work: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
    Personal: "border-blue-400/40 bg-blue-400/10 text-blue-300",
    Health: "border-green-400/40 bg-green-400/10 text-green-300",
  };

  const statusStyles: Record<string, string> = {
    Incoming: "bg-yellow-500/20 text-yellow-300",
    Pending: "bg-orange-500/20 text-orange-300",
    Ongoing: "bg-blue-500/20 text-blue-300",
    Due: "bg-red-500/25 text-red-300",
  };

  const tasks = [
    {
      task_name: "Mutthi",
      category: "Work",
      status: "Incoming",
      due_date: "12 Nov",
      after_due_reminder: "after_every_24h",
      reminders: {
        before48h: true,
        before24h: true,
        before12h: true,
        before6h: true,
        before3h: true,
        before1h: true,
      },
    },
    {
      task_name: "Groceries",
      category: "Personal",
      status: "Pending",
      due_date: "18 Nov",
      after_due_reminder: "none",
      reminders: {
        before48h: false,
        before24h: true,
        before12h: false,
        before6h: false,
        before3h: false,
        before1h: false,
      },
    },
    {
      task_name: "Blood Test",
      category: "Health",
      status: "Due",
      due_date: "20 Nov",
      after_due_reminder: "after_every_12h",
      reminders: {
        before48h: false,
        before24h: false,
        before12h: false,
        before6h: true,
        before3h: true,
        before1h: true,
      },
    },
    {
      task_name: "Project Review",
      category: "Work",
      status: "Ongoing",
      due_date: "22 Nov",
      after_due_reminder: "after_every_48h",
      reminders: {
        before48h: true,
        before24h: true,
        before12h: false,
        before6h: false,
        before3h: false,
        before1h: false,
      },
    },
  ];

  const categoryBadge = (text: string, style: string) => (
    <span
      className={`inline-block rounded-md border px-2 py-1 text-[13px] font-medium ${style}`}
    >
      {text}
    </span>
  );

  const statusBadge = (text: string, style: string) => (
    <span
      className={`inline-block rounded-md px-2 py-1 text-[13px] font-medium ${style}`}
    >
      {text}
    </span>
  );

  const formatAfterDue = (val: string) => {
    if (val === "none") return "none";
    return val.replace("after_every_", "").replace("h", "h");
  };

  return (
    <div className="p-24">
      <div className="overflow-x-auto">
        <table className="w-full border border-neutral-200/12">
          <thead>
            <tr>
              {firstColumn.map(({ key, value }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-sm font-medium text-neutral-400 text-left"
                >
                  {value}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="text-white border-t border-neutral-200/9"
              >
                <td className="px-6 py-4 text-sm font-medium">
                  {task.task_name}
                </td>

                <td className="px-6 py-4 text-sm">
                  {categoryBadge(
                    task.category,
                    categoryStyles[task.category] ?? ""
                  )}
                </td>

                <td className="px-6 py-4 text-sm">
                  {statusBadge(task.status, statusStyles[task.status] ?? "")}
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(task.reminders)
                      .filter(([_, v]) => v === true)
                      .map(([k], i) => (
                        <span
                          key={i}
                          className="text-[12px] text-neutral-400 bg-white/10 rounded px-2 py-0.5"
                        >
                          {k.replace("before", "").replace("h", "h")}
                        </span>
                      ))}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm">
                    <span className="text-[12px] text-neutral-400 bg-white/10 rounded px-2 py-0.5">
                      {formatAfterDue(task.after_due_reminder)}
                    </span>
                </td>

                <td className="px-6 py-4 text-sm font-medium">
                  {task.due_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
