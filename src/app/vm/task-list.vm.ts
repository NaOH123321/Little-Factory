import { TaskVM } from "./task.vm";

export interface TaskListVM {
    id?: string;
    name: string;
    order: number;
    projectId: string;
    taskIds?: string[];
    tasks?: TaskVM[];
}