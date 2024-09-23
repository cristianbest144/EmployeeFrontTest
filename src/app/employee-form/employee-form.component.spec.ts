import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';  // Importa convertToParamMap
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LoadingService } from '../services/loading.service';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let routeStub: any;

  beforeEach(async () => {
    const employeeServiceMock = jasmine.createSpyObj('EmployeeService', ['getEmployeeById', 'createEmployee', 'updateEmployee']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', ['showLoading', 'hideLoading']);

    // Simula la ActivatedRouteSnapshot con convertToParamMap para el paramMap y otras propiedades
    routeStub = {
      snapshot: {
        paramMap: convertToParamMap({ id: '1' }),  // Si quieres simular con un id
        url: [],
        params: {},
        queryParams: {},
        fragment: null,
        data: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [EmployeeFormComponent],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: ActivatedRoute, useValue: routeStub }
      ]
    }).compileComponents();

    employeeServiceSpy = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee data when id is present (edit mode)', () => {
    const mockEmployee = { id: 1, name: 'John', position: 'Developer', description: 'Senior Developer', status: true };
    employeeServiceSpy.getEmployeeById.and.returnValue(of(mockEmployee));

    component.ngOnInit();

    expect(component.isEditMode).toBe(true);
    expect(employeeServiceSpy.getEmployeeById).toHaveBeenCalledWith(1);
    expect(component.employee).toEqual(mockEmployee);
    expect(loadingServiceSpy.showLoading).toHaveBeenCalled();
    expect(loadingServiceSpy.hideLoading).toHaveBeenCalled();
  });

  it('should not load employee data if no id is present (create mode)', () => {
    routeStub.snapshot.paramMap.get = (key: string) => null;
    component.ngOnInit();

    expect(component.isEditMode).toBe(false);
    expect(employeeServiceSpy.getEmployeeById).not.toHaveBeenCalled();
  });

  it('should create a new employee when form is submitted in create mode', () => {
    const mockEmployee = { id: 0, name: 'John', position: 'Developer', description: 'Senior Developer', status: true };
    employeeServiceSpy.createEmployee.and.returnValue(of(mockEmployee));
    component.isEditMode = false;
    component.employee = mockEmployee;

    component.onSubmit();

    expect(loadingServiceSpy.showLoading).toHaveBeenCalled();
    expect(employeeServiceSpy.createEmployee).toHaveBeenCalledWith(mockEmployee);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/employees']);
    expect(loadingServiceSpy.hideLoading).toHaveBeenCalled();
  });

  it('should update an existing employee when form is submitted in edit mode', () => {
    const mockEmployee = { id: 1, name: 'John', position: 'Developer', description: 'Senior Developer', status: true };
    employeeServiceSpy.updateEmployee.and.returnValue(of(void 0));
    component.isEditMode = true;
    component.employee = mockEmployee;

    component.onSubmit();

    expect(loadingServiceSpy.showLoading).toHaveBeenCalled();
    expect(employeeServiceSpy.updateEmployee).toHaveBeenCalledWith(mockEmployee);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/employees']);
    expect(loadingServiceSpy.hideLoading).toHaveBeenCalled();
  });

  it('should navigate to employee list when cancel is called', () => {
    component.cancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/employees']);
  });
});
