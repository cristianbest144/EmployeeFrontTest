import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';
import { EmployeeFilter } from '../models/employee-filter.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Employee`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay solicitudes HTTP pendientes.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Prueba para obtener empleados con filtro
  it('should fetch employees with filter', () => {
    const mockEmployees: Employee[] = [
      { id: 1, name: 'John Doe', position: 'Developer', description: 'Frontend Developer', status: true },
    ];
    const filter: EmployeeFilter = { pageNumber: 1, pageSize: 10, sortColumn: 'name', ascending: true, name: '', position: '' };
    const mockResponse = { employees: mockEmployees, totalPages: 1 };

    service.getEmployees(filter).subscribe(response => {
      expect(response.employees.length).toBe(1);
      expect(response.totalPages).toBe(1);
      expect(response.employees[0].name).toBe('John Doe');
    });

    const req = httpMock.expectOne(`${apiUrl}?pageNumber=1&pageSize=10&sortColumn=name&ascending=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Simula la respuesta del servidor.
  });

  // Prueba para obtener un empleado por ID
  it('should fetch employee by ID', () => {
    const mockEmployee: Employee = { id: 1, name: 'John Doe', position: 'Developer', description: 'Frontend Developer', status: true };

    service.getEmployeeById(1).subscribe(employee => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
  });

  // Prueba para crear un empleado
  it('should create an employee', () => {
    const newEmployee: Employee = { id: 2, name: 'Jane Doe', position: 'Tester', description: 'QA Engineer', status: true };

    service.createEmployee(newEmployee).subscribe(employee => {
      expect(employee).toEqual(newEmployee);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newEmployee);
  });

  // Prueba para actualizar un empleado
  it('should update an employee', () => {
    const updatedEmployee: Employee = { id: 1, name: 'John Doe', position: 'Lead Developer', description: 'Team Leader', status: true };

    service.updateEmployee(updatedEmployee).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(null); // Simula una respuesta vacía ya que la actualización no devuelve nada.
  });

  // Prueba para eliminar un empleado
  it('should delete an employee', () => {
    service.deleteEmployee(1).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simula una respuesta vacía ya que la eliminación no devuelve nada.
  });

  // Prueba para exportar empleados
  it('should export employees', () => {
    const blob = new Blob(['dummy content'], { type: 'text/csv' });

    service.exportEmployees().subscribe(response => {
      expect(response.size).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(`${apiUrl}/export?name=&position=`);
    expect(req.request.method).toBe('GET');
    req.flush(blob);
  });

});
