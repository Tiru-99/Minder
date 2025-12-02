import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '@/utils/frontend/types';

interface ResponseTask {
    id: string;
    type: string;
    name: string;
    status: string;
    notes: string;
    deadline: string;
    reminder: {
        before48h: boolean;
        before24h: boolean;
        before12h: boolean;
        before6h: boolean;
        before3h: boolean;
        before1h: boolean;
        after_due_reminder: string;
    }
}

interface SnoozeTask {
    id: string;
    deadline: Date;
    reminder: {
        before48h: boolean;
        before24h: boolean;
        before12h: boolean;
        before6h: boolean;
        before3h: boolean;
        before1h: boolean;
        after_due_reminder: string;
    }
}

export const useGetTasks = () => {
    return useQuery<ResponseTask[]>({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await axios.get("/api/task");
            return response.data.tasks;
        }
    })
}

export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task: Task) => {
            const response = await axios.post("/api/task", task);
            return response.data;
        },
        // to refetch data 
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"]
            })
        }
    })
}

export const useSnoozeTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SnoozeTask) => {
            const response = await axios.patch("/api/task", data);
            return response.data;
        },
        // to refetch data 
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"]
            })
        }
    })
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId: string) => {
            const response = await axios.delete(`/api/task?taskId=${taskId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });
        },
    });
};


export const useMoveToComplete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskId: string) => {
            const response = await axios.get(`/api/complete?taskId=${taskId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"]
            })
        }
    })
}

