import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Injector } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
        Injector
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockResponse = { message: 'User registered successfully' };
    const registerData = { username: 'testuser', password: 'password' };

    service.register(registerData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush(mockResponse);
  });

  it('should login a user and store token and role in localStorage', () => {
    const mockResponse = { token: 'fake-jwt-token', role: 'Admin' };
    const username = 'testuser';
    const password = 'password';

    service.login(username, password).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe(mockResponse.token);
      expect(localStorage.getItem('role')).toBe(mockResponse.role);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username, password });
    req.flush(mockResponse);
  });

  it('should check if the user is authenticated', () => {
    localStorage.setItem('authToken', 'fake-jwt-token');
    expect(service.isAuthenticated()).toBeTrue();

    localStorage.removeItem('authToken');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should initialize currentUser from localStorage if present', () => {
    const user: User = { id: 1, username: 'testuser', role: 'Admin' };
    localStorage.setItem('currentUser', JSON.stringify(user));

    const newService = TestBed.inject(AuthService); // Reinyecta para cargar de nuevo
    expect(newService.currentUserSubject.value).toEqual(user);

    localStorage.removeItem('currentUser');
  });

  it('should not initialize currentUser if no data in localStorage', () => {
    localStorage.removeItem('currentUser');
    const newService = TestBed.inject(AuthService);
    expect(newService.currentUserSubject.value).toBeNull();
  });
});
