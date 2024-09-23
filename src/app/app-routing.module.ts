import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { RoleGuard } from './services/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { 
    path: 'employees/create', 
    component: EmployeeFormComponent, 
    canActivate: [RoleGuard], 
    data: { expectedRole: 'Admin' } // Solo accesible para usuarios con rol Admin
  },
  { 
    path: 'employees/edit/:id', 
    component: EmployeeFormComponent, 
    canActivate: [RoleGuard], 
    data: { expectedRole: 'Admin' } // Solo accesible para Admins
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];