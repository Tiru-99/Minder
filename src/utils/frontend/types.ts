export interface Task {
    name: string;
    notes: string;
    deadline: Date | null;
    type: string;
    after_due_reminder: string;
    reminders: {
        before48h: boolean;
        before24h: boolean;
        before12h: boolean;
        before6h: boolean;
        before3h: boolean;
        before1h: boolean;
    };
}