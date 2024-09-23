import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';  
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, 
  imports: [FormsModule] 
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private modalService: NgbModal,
    private loadingService: LoadingService 
  ) { }

  onSubmit() {
    if (!this.username || !this.password) {
      this.showModal('Por favor, completa todos los campos obligatorios.');
      return;
    }
    this.loadingService.showLoading();
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.loadingService.hideLoading();
        this.router.navigate(['/employees']);
      },
      error => {
        this.loadingService.hideLoading();
        console.error('Error de autenticación', error);
        this.showModal('Error de autenticación. Verifica tus credenciales.');
      }
    );
  }

  showModal(message: string) {
    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.message = message;
  }

  goToRegister() {
    this.router.navigate(['/register']);  
  }
}
