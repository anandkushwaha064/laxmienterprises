import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient for API calls
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { Router } from '@angular/router'; // For navigation to the edit page
import { ApiService } from '@services/api.service'; // Import ApiService
import { Customer } from '@interfaces/commont.interfaces';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // Import necessary modules
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [ApiService] // Provide ApiService
})
export class CustomerListComponent {
  // Array to store the list of customers fetched from the API
  customers: Customer[] = [];

  // Search term for filtering customer data
  searchTerm: string = '';

  // Inject ApiService and Router for API requests and navigation
  constructor(private apiService: ApiService, private router: Router) {
    this.getCustomers(); // Fetch customers on component initialization
  }

  // Function to fetch customers from the API
  getCustomers() {
    this.apiService.getCustomers().subscribe(
      (data: any[]) => {
        this.customers = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
        alert('Failed to load customer data.');
      }
    );
  }

  // Function to filter the customer list based on the search term
  filteredCustomers() {
    if (!this.searchTerm) {
      return this.customers;
    }
    return this.customers.filter(customer =>
      (customer.id && customer.id.toString().includes(this.searchTerm.toLowerCase())) ||
      customer.customer_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.customer_address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.mobile_number.toString().includes(this.searchTerm) // Convert number to string for filtering
    );
  }

  // Function to navigate to the edit customer page
  editItem(customer: Customer) {
    this.router.navigate(['/edit-customer', customer.id]); // Navigate to edit customer page with customer ID
  }

  // Function to delete a customer
  deleteItem(customer: Customer) {
    if (!customer.id){
      console.error('Customer ID not found');
      return;      
    }
    if (confirm('Are you sure you want to delete this customer?')) {
      this.apiService.deleteCustomer(customer.id).subscribe(
        (response) => {
          console.log('Customer deleted successfully!', response);
          alert('Customer deleted successfully!');
          this.getCustomers(); // Refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting customer:', error);
          alert('Failed to delete customer.');
        }
      );
    }
  }

  // Function to handle adding a new customer
  addItem() {
    this.router.navigate(['/customer-register']); // Navigate to customer registration page
  }
}
