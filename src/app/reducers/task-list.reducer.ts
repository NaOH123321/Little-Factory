import { TaskListDeleteSuccessAction, TaskListSwapSuccessAction } from './../actions/task-list.action';
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { TaskList } from './../domain';
import * as taskListAction from '../actions/task-list.action';
import * as projectAction from '../actions/project.action';

export interface State extends EntityState<TaskList> {
    // additional entities state properties
    // selectedTaskListId: string | null;
}

function selectTaskListId(a: TaskList): string {
    //In this case this would be optional since primary key is id
    return a.id;
}

function sortByOrder(a: TaskList, b: TaskList): number {
    return a.order > b.order ? 1 : a.order === b.order ? 0 : -1;
}

export const adapter: EntityAdapter<TaskList> = createEntityAdapter<TaskList>({
    selectId: selectTaskListId,
    sortComparer: sortByOrder
});

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
    // selectedTaskListId: null,
});

function swapTaskList(state: State, action: taskListAction.TaskListSwapSuccessAction) {
    const taskLists: TaskList[] = action.payload;
    return adapter.updateMany(taskLists.map((tl: TaskList) => ({ id: tl.id, changes: tl })), state);
}

function delListByProject(state: State, action: projectAction.ProjectDeleteSuccessAction) {
    const project = action.payload;
    const taskListIds = project.taskLists;
    if (taskListIds === undefined || taskListIds.length === 0) return state;
    return adapter.removeMany(taskListIds, state);
}

export function reducer(state = initialState, action: taskListAction.TaskListActions | projectAction.ProjectActions): State {
    switch (action.type) {
        case taskListAction.TaskListActionTypes.TASKLIST_ADD_SUCCESS:
            return adapter.addOne(action.payload, state);
        case taskListAction.TaskListActionTypes.TASKLIST_DELETE_SUCCESS:
            return adapter.removeOne(action.payload.id, state);
        case taskListAction.TaskListActionTypes.TASKLIST_UPDATE_SUCCESS:
            return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
        case taskListAction.TaskListActionTypes.TASKLIST_LOAD_SUCCESS:
            return adapter.addAll(action.payload, state);
        case taskListAction.TaskListActionTypes.TASKLIST_SWAP_SUCCESS:
            return swapTaskList(state, action);
        case projectAction.ProjectActionTypes.PROJECT_DELETE_SUCCESS:
            return delListByProject(state, action);
        default: {
            return state;
        }
    }
}