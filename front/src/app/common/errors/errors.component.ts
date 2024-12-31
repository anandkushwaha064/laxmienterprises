import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss'
})
export class ErrorsComponent {

@Input() errors: any = {};

formattedErrors: string[] = [];

ngOnInit() {
  // Convert nested errors into readable sentences
  for (const [key, value] of Object.entries(this.errors)) {
      this.formattedErrors.push(`${key} : ${value}`);
  }
}
}
