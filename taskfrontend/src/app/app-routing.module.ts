import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { ProjectComponent } from './project/project.component';
import { TimeFormComponent } from './time-form/time-form.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { TaskFormComponent } from './task-form/task-form.component';

const routes: Routes = [
  { path: '', component: ProjectComponent }, // ✅ Project selection page (default)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },  // ✅ protected route
  { path: 'add-time', component: TimeFormComponent, canActivate: [AuthGuard] },
  { path: 'all-time', component: TimeTableComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' } ,// ✅ fallback
  { path: 'taskform', component: TaskFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
