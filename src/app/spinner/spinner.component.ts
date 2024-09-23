import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div *ngIf="isLoading | async" class="loading-overlay">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `,
  styleUrls: ['./spinner.component.css'],
  standalone: true,  
  imports: [CommonModule]  
})
export class SpinnerComponent {
  isLoading: any;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.isLoading = this.loadingService.loading$;
  }
}
