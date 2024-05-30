import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TagListComponent} from './pages/tag-list/tag-list.component';
import {appCanActivate} from './guard/app.auth.guard';
import {ProcessorListComponent} from './pages/processor-list/processor-list.component';
import {TopicListComponent} from './pages/topic-list/topic-list.component';
import {TaskListComponent} from './pages/task-list/task-list.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {NoAccessComponent} from './pages/no-access/no-access.component';
import {TagDetailComponent} from './pages/tag-detail/tag-detail.component';
import {AppRoles} from '../app.roles';
import {TopicDetailComponent} from './pages/topic-detail/topic-detail.component';
import {ProcessorDetailComponent} from './pages/processor-detail/processor-detail.component';
import {TaskDetailComponent} from './pages/task-detail/task-detail.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'tags', component: TagListComponent, canActivate: [appCanActivate], data: {roles: [AppRoles.Admin]}},
  {
    path: 'tag', canActivate: [appCanActivate], component: TagDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Read]}
  },
  {
    path: 'tag/:id', canActivate: [appCanActivate], component: TagDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Admin]}
  },
  { path: 'processors',
    component: ProcessorListComponent,
    canActivate: [appCanActivate],
    data: {roles: [AppRoles.Update]}
  },
  {
    path: 'processor', canActivate: [appCanActivate], component: ProcessorDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Read]}
  },
  {
    path: 'processor/:id', canActivate: [appCanActivate], component: ProcessorDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Update]}
  },
  {
    path: 'topics',
    component: TopicListComponent,
    canActivate: [appCanActivate],
    data: {roles: [AppRoles.Admin]}
  },
  {
    path: 'topic', canActivate: [appCanActivate], component: TopicDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Read]}
  },
  {
    path: 'topic/:id', canActivate: [appCanActivate], component: TopicDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Admin]}
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [appCanActivate],
    data: {roles: [AppRoles.Update]}
  },
  {
    path: 'task', canActivate: [appCanActivate], component: TaskDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Read]}
  },
  {
    path: 'task/:id', canActivate: [appCanActivate], component: TaskDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Update]}
  },
  {path: 'noaccess', component: NoAccessComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
