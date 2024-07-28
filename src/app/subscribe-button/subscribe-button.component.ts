import { Component, Renderer2, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrl: './subscribe-button.component.css'
})
export class SubscribeButtonComponent {

  showForm: boolean = false;

  constructor(private renderer: Renderer2) {}

  toggleForm(): void {
    this.showForm = !this.showForm;
    if(this.showForm)
      this.toggleBlur(true)
    else
      this.toggleBlur(false)
  }

  toggleBlur(shouldBlur: boolean): void {
    const overlay = document.getElementById('blurred-overlay');
    if (overlay) {
      if (shouldBlur) {
        this.renderer.removeClass(overlay, 'hidden');
      } else {
        this.renderer.addClass(overlay, 'hidden');
      }
    }
  }

}
