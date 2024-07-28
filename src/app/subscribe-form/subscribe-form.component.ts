import { Component, EventEmitter, Output } from '@angular/core';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-subscribe-form',
  templateUrl: './subscribe-form.component.html',
  styleUrl: './subscribe-form.component.css'
})
export class SubscribeFormComponent {

  name: string = '';
  email: string = '';

  @Output() close = new EventEmitter<void>();

  constructor(private articleService: ArticleService) {}

  subscribe(): void {
    if(this.name === "" || this.email === ""){
      alert('Empty feilds');
    }else{
      this.articleService.subscribeToNewsletter(this.name, this.email).subscribe({
        next: (response) => {
          // Handle successful subscription
          this.name = '';
          this.email = '';
          alert('Thanks!! you have Subscribed!');
        },
        error: (error) => {
          // Handle subscription error
          alert('Subscription failed. Please try again.');
        }
      });
    }
  }

  closeForm(): void {
    this.close.emit();
  }

}
