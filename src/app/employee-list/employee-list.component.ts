import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { EmployeeFilter } from '../models/employee-filter.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  standalone: true,  
  imports: [FormsModule, CommonModule]  
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  employeeFilter: EmployeeFilter = new EmployeeFilter();
  totalPages: number = 1;
  pages: number[] = []; 
  employeeToDelete: number | null = null;  
  alertMessage: string = '';  
  selectedEmployee: Employee | null = null;
  userRole: string = ''; 
  
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private modalService: NgbModal,
    private loadingService: LoadingService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
     this.userRole = localStorage.getItem('role') ?? '';
     this.loadEmployees();
  }

  loadEmployees() {
    this.loadingService.showLoading();
    this.employeeService.getEmployees(this.employeeFilter).subscribe(data => {
      this.employees = data.employees;
      this.totalPages = data.totalPages; 
      this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1); 
      this.loadingService.hideLoading();
    });
  }

  createEmployee() {
    this.router.navigate(['/employees/create']);  
  }

  editEmployee(employeeId: number) {
    this.router.navigate(['/employees/edit', employeeId]);  
  }

  openConfirmModal(id: number) {
    this.employeeToDelete = id;
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = '¿Estás seguro de que deseas eliminar este empleado?';
    modalRef.componentInstance.title = 'Confirmar Eliminación';

    modalRef.componentInstance.confirm.subscribe(() => {
      this.deleteEmployee(this.employeeToDelete!); 
    });
  }

  deleteEmployee(id: number) {
    this.loadingService.showLoading();
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadingService.hideLoading();
      this.showAlert('Empleado eliminado correctamente.');
      this.loadEmployees();
    }, error => {
      this.loadingService.hideLoading();
      this.showAlert('Hubo un problema al eliminar el empleado.');
    });
  }

  exportEmployees() {
    this.employeeService.downloadEmployeesCSV(this.employeeFilter.name, this.employeeFilter.position);
  }

  filterTable() {
    this.employeeFilter.pageNumber = 1; 
    this.loadEmployees();
  }

  sortTable(column: string) {
    if (this.employeeFilter.sortColumn === column) {
      this.employeeFilter.ascending = !this.employeeFilter.ascending;
    } else {
      this.employeeFilter.sortColumn = column;
      this.employeeFilter.ascending = true;  
    }
    this.loadEmployees();  
  }

  goToPage(page: number) {
    this.employeeFilter.pageNumber = page;
    this.loadEmployees();
  }

  previousPage() {
    if (this.employeeFilter.pageNumber > 1) {
      this.employeeFilter.pageNumber--;
      this.loadEmployees();
    }
  }

  nextPage() {
    if (this.employeeFilter.pageNumber < this.totalPages) {
      this.employeeFilter.pageNumber++;
      this.loadEmployees();
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);  
  }

  showAlert(message: string) {
    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.title = 'Operación Exitosa';  
  }
}
