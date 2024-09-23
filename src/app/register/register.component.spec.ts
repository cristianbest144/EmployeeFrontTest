import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../services/loading.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['register']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const modalServiceMock = jasmine.createSpyObj('NgbModal', ['open']);
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', ['showLoading', 'hideLoading']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalServiceSpy = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and navigate to login on successful registration', () => {
    component.registerData = {
      username: 'testuser',
      password: 'password',
      role: 2
    };

    authServiceSpy.register.and.returnValue(of({}));

    component.onSubmit();

    expect(loadingServiceSpy.showLoading).toHaveBeenCalled();
    expect(authServiceSpy.register).toHaveBeenCalledWith(component.registerData);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(loadingServiceSpy.hideLoading).toHaveBeenCalled();
  });

  it('should show error modal on registration failure', () => {
    const errorResponse = { error: 'Error de registro' };
    authServiceSpy.register.and.returnValue(throwError(errorResponse));

    const modalRefMock = { componentInstance: { message: '' } };
    modalServiceSpy.open.and.returnValue(modalRefMock as any);

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith(component.registerData);
    expect(modalServiceSpy.open).toHaveBeenCalled();
    expect(modalRefMock.componentInstance.message).toBe('Error al registrar usuario: ' + errorResponse.error);
  });

  it('should navigate back to login on goBack', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show a success modal on successful registration', () => {
    authServiceSpy.register.and.returnValue(of({}));

    const modalRefMock = { componentInstance: { message: '' } };
    modalServiceSpy.open.and.returnValue(modalRefMock as any);

    component.onSubmit();

    expect(modalServiceSpy.open).toHaveBeenCalled();
    expect(modalRefMock.componentInstance.message).toBe('Usuario registrado exitosamente');
  });
});
