import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Project } from './../domain';
import * as projectAction from '../actions/project.action';

export interface State extends EntityState<Project> {
    // additional entities state properties
    selectedProjectId: string | null;
}

function selectProjectId(a: Project): string {
    //In this case this would be optional since primary key is id
    return a.id;
}

function sortByName(a: Project, b: Project): number {
    return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<Project> = createEntityAdapter<Project>({
    selectId: selectProjectId,
    sortComparer: sortByName
});

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
    selectedProjectId: null,
});


export function reducer(state = initialState, action: projectAction.ProjectActions): State {
    switch (action.type) {
        case projectAction.ProjectActionTypes.PROJECT_ADD_SUCCESS:
            return { ...adapter.addOne(action.payload, state), selectedProjectId: null };
        case projectAction.ProjectActionTypes.PROJECT_DELETE_SUCCESS:
            return { ...adapter.removeOne(action.payload.id, state), selectedProjectId: null };
        case projectAction.ProjectActionTypes.PROJECT_INVITE_SUCCESS:
        case projectAction.ProjectActionTypes.PROJECT_UPDATE_SUCCESS:
            return { ...adapter.updateOne({ id: action.payload.id, changes: action.payload }, state), selectedProjectId: null };
        case projectAction.ProjectActionTypes.PROJECT_LOAD_SUCCESS:
            return { ...adapter.addAll(action.payload, state), selectedProjectId: null };
        case projectAction.ProjectActionTypes.PROJECT_SELECT:
            return { ...state, selectedProjectId: action.payload.id };
        default: {
            return state;
        }
    }
}

export const getSelectedId = (state: State) => state.selectedProjectId;