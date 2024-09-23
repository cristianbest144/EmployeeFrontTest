import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmación';  
  @Input() message: string = '';           

  @Output() confirm: EventEmitter<void> = new EventEmitter();  

  constructor(public activeModal: NgbActiveModal) {}

  onConfirm() {
    this.confirm.emit();  
    this.activeModal.close();  
  }

  closeModal() {
    this.activeModal.dismiss();  
  }
}
