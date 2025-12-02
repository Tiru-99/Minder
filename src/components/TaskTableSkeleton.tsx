import { Skeleton } from "@/components/ui/skeleton"

export default function TaskTableSkeleton() {
    return (
        <div className="w-full animate-pulse">
            {/* Desktop View Skeleton */}
            <div className="hidden md:block overflow-x-auto relative min-h-[17vh]">
                <table className="w-full border border-neutral-200/12">
                    <thead>
                        <tr>
                            {[...Array(7)].map((_, i) => (
                                <th key={i} className="px-6 py-3 text-left">
                                    <div className="h-4 w-24 bg-neutral-800 rounded" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-t border-neutral-200/9">
                                <td className="px-6 py-4">
                                    <div className="h-5 w-32 bg-neutral-800 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-6 w-20 bg-neutral-800 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-6 w-24 bg-neutral-800 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <div className="h-5 w-16 bg-neutral-800 rounded" />
                                        <div className="h-5 w-16 bg-neutral-800 rounded" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-5 w-20 bg-neutral-800 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-5 w-28 bg-neutral-800 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-8 w-8 bg-neutral-800 rounded-full" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View Skeleton */}
            <div className="md:hidden space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-6 w-40 bg-neutral-800 rounded" />
                                <div className="h-4 w-24 bg-neutral-800 rounded" />
                            </div>
                            <div className="h-6 w-20 bg-neutral-800 rounded" />
                        </div>
                        <div className="h-6 w-16 bg-neutral-800 rounded" />
                        <div className="pt-2 border-t border-neutral-800 space-y-2">
                            <div className="h-4 w-20 bg-neutral-800 rounded" />
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-neutral-800 rounded" />
                                <div className="h-5 w-16 bg-neutral-800 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
