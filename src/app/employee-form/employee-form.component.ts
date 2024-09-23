import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';
import { FormsModule } from '@angular/forms';  
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  standalone: true,  
  imports: [FormsModule]  
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    name: '',
    position: '',
    description: '',
    status: true,
    id: 0
  };
  isEditMode = false;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService 
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadingService.showLoading();
      this.employeeService.getEmployeeById(+id).subscribe(data => {
        this.employee = data;
        this.loadingService.hideLoading();
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.loadingService.showLoading();
      this.employeeService.updateEmployee(this.employee).subscribe(() => {
        this.loadingService.hideLoading();
        this.router.navigate(['/employees']);
      });
    } else {
      this.loadingService.showLoading();
      this.employeeService.createEmployee(this.employee).subscribe(() => {
        this.loadingService.hideLoading();
        this.router.navigate(['/employees']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
