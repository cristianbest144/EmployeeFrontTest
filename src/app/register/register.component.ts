import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,  
  imports: [FormsModule, CommonModule] 
})
export class RegisterComponent {
  registerData = {
    username: '',
    password: '',
    role: 2  
  };

  constructor(
    private authService: AuthService, 
    private router: Router,   
    private modalService: NgbModal,
    private loadingService: LoadingService 
  ) {}

  onSubmit() {
    this.loadingService.showLoading();
    this.authService.register(this.registerData).subscribe(
      () => {
        this.loadingService.hideLoading();
        this.showModal('Usuario registrado exitosamente');
        this.router.navigate(['/login']);  
      },
      (error) => {
        this.loadingService.hideLoading();
        this.showModal('Error al registrar usuario: ' + error.error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/login']); 
  }

  showModal(message: string) {
    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.message = message;
  }
}
