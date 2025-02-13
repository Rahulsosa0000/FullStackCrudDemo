import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FormComponent } from './component/form/form.component';
import { AuthGuard } from './auth/auth.service';


export const routes: Routes = [
  { path: '', component: LoginComponent },  // Default Login Page
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'form', 
    component: FormComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' }  // Invalid URL pe redirect
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
