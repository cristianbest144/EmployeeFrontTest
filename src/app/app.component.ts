import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { HttpClientModule } from '@angular/common/http'; 
import { LoginComponent } from './login/login.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { SpinnerComponent } from './spinner/spinner.component'; 

// Configuración de las rutas
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/edit/:id', component: EmployeeFormComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    SpinnerComponent     
  ]
})
export class AppComponent {
  title = 'EmployeeCatalog';
}
