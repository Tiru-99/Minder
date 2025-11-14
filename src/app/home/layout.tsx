
import { requireAuth } from "@/lib/session";

export default async function Layout({ children }: { children: React.ReactNode }) {
    await requireAuth();
    return (
        <div>
            {children}
        </div>
    );
}