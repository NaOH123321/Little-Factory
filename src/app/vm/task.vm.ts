import { User } from "../domain";

export interface TaskVM {
    id?: string;
    desc: string;
    completed: boolean;
    priority: number;
    dueDate?: Date;
    reminder?: Date;
    remark?: string;
    createDate: Date;
    ownerId: string;
    participantIds?: string[];
    taskListId: string;
    owner: User;
    participants?: User[];
}