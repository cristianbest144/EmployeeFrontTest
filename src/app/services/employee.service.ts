import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model'; 
import { environment } from '../../environments/environment'; 
import { EmployeeFilter } from '../models/employee-filter.model';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiUrl}/Employee`; 

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
    'Content-Type': 'application/json' 
  });

  constructor(private http: HttpClient) { }
 
  getEmployees(filter: EmployeeFilter): Observable<{ employees: Employee[], totalPages: number }> {
    const params: any = {
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      sortColumn: filter.sortColumn,
      ascending: filter.ascending
    };
  
    if (filter.name) {
      params.name = filter.name;
    }
  
    if (filter.position) {
      params.position = filter.position;
    }
  
    const url = `${this.apiUrl}`;
    return this.http.get<{ employees: Employee[], totalPages: number }>(url, { params, headers: this.headers });
  }

  getEmployeeById(id: number): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Employee>(url, { headers: this.headers });
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee, { headers: this.headers });
  }

  updateEmployee(employee: Employee): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${employee.id}`, employee, { headers: this.headers });
  }

  deleteEmployee(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.headers });
  }

  exportEmployees(name: string = '', position: string = ''): Observable<Blob> {
    const url = `${this.apiUrl}/export?name=${name}&position=${position}`;
    return this.http.get(url, { headers: this.headers, responseType: 'blob' });
  }

  downloadEmployeesCSV(name: string = '', position: string = '') {
    this.exportEmployees(name, position).subscribe((response: Blob) => {
      saveAs(response, 'employees.csv'); 
    }, error => {
      console.error('Error al exportar empleados:', error);
    });
  }
}
