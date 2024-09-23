import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const employeeServiceMock = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'deleteEmployee', 'downloadEmployeesCSV']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const modalServiceMock = jasmine.createSpyObj('NgbModal', ['open']);
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', ['showLoading', 'hideLoading']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUserRole']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    employeeServiceSpy = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalServiceSpy = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on initialization', () => {
    const mockResponse = {
      employees: [
        {
          id: 1,
          name: 'John',
          position: 'Developer',
          description: 'Frontend Developer',
          status: true
        }
      ],
      totalPages: 1
    };
    employeeServiceSpy.getEmployees.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(employeeServiceSpy.getEmployees).toHaveBeenCalledWith(component.employeeFilter);
    expect(component.employees.length).toBe(1);
    expect(component.employees[0].name).toBe('John');
    expect(component.totalPages).toBe(1);
  });

  it('should navigate to create employee page', () => {
    component.createEmployee();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/employees/create']);
  });

  it('should navigate to edit employee page', () => {
    component.editEmployee(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/employees/edit', 1]);
  });

  it('should show confirm modal before deleting an employee', () => {
    const modalRefMock: Partial<NgbModalRef> = {
      componentInstance: {
        message: '',
        title: '',
        confirm: {
          subscribe: (fn: () => void) => fn()  // Simulación de la suscripción para el evento confirm
        }
      },
      result: Promise.resolve('confirmed')  // Simulación del resultado del modal
    };
    
    modalServiceSpy.open.and.returnValue(modalRefMock as NgbModalRef);

    spyOn(component, 'deleteEmployee');
    component.openConfirmModal(1);

    expect(modalServiceSpy.open).toHaveBeenCalled();
    expect(component.deleteEmployee).toHaveBeenCalledWith(1);
  }); // <- Este bloque it estaba incompleto, ahora está cerrado

  it('should delete an employee and reload the list', () => {
    const mockResponse = { employees: [], totalPages: 1 };
    employeeServiceSpy.getEmployees.and.returnValue(of(mockResponse));
    employeeServiceSpy.deleteEmployee.and.returnValue(of(undefined));

    component.deleteEmployee(1);

    expect(loadingServiceSpy.showLoading).toHaveBeenCalled();
    expect(employeeServiceSpy.deleteEmployee).toHaveBeenCalledWith(1);
    expect(employeeServiceSpy.getEmployees).toHaveBeenCalled();
    expect(loadingServiceSpy.hideLoading).toHaveBeenCalled();
  });

  it('should export employees', () => {
    component.exportEmployees();
    expect(employeeServiceSpy.downloadEmployeesCSV).toHaveBeenCalledWith(component.employeeFilter.name, component.employeeFilter.position);
  });

  it('should sort the table by column', () => {
    component.sortTable('name');
    expect(component.employeeFilter.sortColumn).toBe('name');
    expect(component.employeeFilter.ascending).toBe(true);
  });

  it('should handle pagination', () => {
    component.totalPages = 3;
    component.employeeFilter.pageNumber = 1;

    component.nextPage();
    expect(component.employeeFilter.pageNumber).toBe(2);

    component.previousPage();
    expect(component.employeeFilter.pageNumber).toBe(1);
  });

  it('should log out and navigate to login', () => {
    component.logout();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show an alert message', () => {
    const modalRefMock: Partial<NgbModalRef> = {
      componentInstance: {
        message: '',
        title: ''
      },
      result: Promise.resolve('confirmed')  // Simulación del resultado del modal
    };
  
    modalServiceSpy.open.and.returnValue(modalRefMock as NgbModalRef);

    component.showAlert('Test alert');
    expect(modalServiceSpy.open).toHaveBeenCalled();
    expect(modalRefMock.componentInstance.message).toBe('Test alert');
  });
});
