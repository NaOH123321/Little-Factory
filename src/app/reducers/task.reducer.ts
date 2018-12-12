import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Task } from './../domain';
import * as taskAction from '../actions/task.action';
import * as projectAction from '../actions/project.action';

export interface State extends EntityState<Task> {
    // additional entities state properties
    // selectedTaskId: string | null;
}

function selectTaskId(a: Task): string {
    //In this case this would be optional since primary key is id
    return a.id;
}

function sortByDesc(a: Task, b: Task): number {
    return a.desc.localeCompare(b.desc);
}

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>({
    selectId: selectTaskId,
    sortComparer: sortByDesc
});

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
    // selectedTaskId: null,
});

function moveAllTask(state: State, action: taskAction.TaskMoveAllSuccessAction) {
    const tasks: Task[] = action.payload;
    return adapter.updateMany(tasks.map((tl: Task) => ({ id: tl.id, changes: tl })), state);
}

function delTasksByProject(state: State, action: projectAction.ProjectDeleteSuccessAction) {
    const project = action.payload;
    const taskListIds = project.taskLists;
    if (taskListIds === undefined || taskListIds.length === 0) return state;
    const taskIds = (<string[]>state.ids).filter(id => taskListIds.indexOf(state.entities[id].taskListId) !== -1);
    return adapter.removeMany(taskIds, state);
}

export function reducer(state = initialState, action: taskAction.TaskActions | projectAction.ProjectActions): State {
    switch (action.type) {
        case taskAction.TaskActionTypes.TASK_ADD_SUCCESS:
            return adapter.addOne(action.payload, state);
        case taskAction.TaskActionTypes.TASK_DELETE_SUCCESS:
            return adapter.removeOne(action.payload.id, state);
        case taskAction.TaskActionTypes.TASK_COMPLETE_SUCCESS:
        case taskAction.TaskActionTypes.TASK_MOVE_SUCCESS:
        case taskAction.TaskActionTypes.TASK_UPDATE_SUCCESS:
            return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
        case taskAction.TaskActionTypes.TASK_LOAD_BY_LISTS_SUCCESS:
            return adapter.addAll(action.payload, state);
        case taskAction.TaskActionTypes.TASK_MOVE_ALL_SUCCESS:
            return moveAllTask(state, action);
        case projectAction.ProjectActionTypes.PROJECT_DELETE_SUCCESS:
            return delTasksByProject(state, action);
        default: {
            return state;
        }
    }
}