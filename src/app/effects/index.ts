import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { QuoteEffects } from './quote.effects';
import { AuthEffects } from './auth.effects';
import { RouterEffects } from './router.effects';
import { ProjectEffects } from './project.effects';
import { TaskListEffects } from './task-list.effects';
import { TaskEffects } from './task.effects';
import { UserEffects } from './user.effects';

@NgModule({
    imports: [
        EffectsModule.forRoot([
            QuoteEffects,
            AuthEffects,
            RouterEffects,
            ProjectEffects,
            TaskListEffects,
            TaskEffects,
            UserEffects
        ])
    ]
})
export class AppEffectsModule { }