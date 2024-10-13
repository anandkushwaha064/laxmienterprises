import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Import FormsModule and NgForm
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient for API calls
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [FormsModule,CommonModule, HttpClientModule],  // Import FormsModule for template-driven forms
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.scss']
})
export class CustomerRegisterComponent {
  // Define the customer object with default values
  customer = {
    name: '',
    address: '',
    mobileNumber: '',
    creditBalance: 0,
    lastBought: ''
  };

  // Inject HttpClient for making API requests
  constructor(private http: HttpClient) {}

  // Handle form submission and API call
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Customer details:', this.customer);

      // Make an API call to save customer details
      this.http.post('https://api.example.com/customers', this.customer)
        .subscribe(response => {
          console.log('Customer saved successfully!', response);
          alert('Customer saved successfully!');
          form.reset(); // Reset form after successful submission
        }, error => {
          console.error('Error saving customer:', error);
          alert('Failed to save customer details. Please try again.');
        });
    }
  }
}
