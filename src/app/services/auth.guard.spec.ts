import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when token is present in localStorage', () => {
    // Simular que existe el token en el localStorage
    spyOn(localStorage, 'getItem').and.returnValue('fakeToken');

    const canActivate = guard.canActivate();

    expect(canActivate).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // No se debe redirigir
  });

  it('should deny access and navigate to login when token is not present', () => {
    // Simular que no existe token en el localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const canActivate = guard.canActivate();

    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']); // Debe redirigir al login
  });
});
