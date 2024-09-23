import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component'; 
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LoadingService } from '../services/loading.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoading', 'hideLoading']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule], // Standalone components go in imports
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to register on goToRegister', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should show modal if fields are empty on submit', () => {
    component.username = '';
    component.password = '';
    component.onSubmit();
    expect(modalServiceSpy.open).toHaveBeenCalled();
  });

  it('should call login and navigate on successful login', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'testToken', role: 'Admin' }));
    component.username = 'testuser';
    component.password = 'testpassword';
    component.onSubmit();
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should show modal on login error', () => {
    authServiceSpy.login.and.returnValue(of({ error: 'Authentication failed' }));
    component.username = 'testuser';
    component.password = 'wrongpassword';
    component.onSubmit();
    expect(modalServiceSpy.open).toHaveBeenCalled();
  });
});
