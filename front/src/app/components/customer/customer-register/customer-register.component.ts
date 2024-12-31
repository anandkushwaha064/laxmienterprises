import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Import FormsModule and NgForm
import { HttpClientModule } from '@angular/common/http'; // Import HttpClient for API calls
import { CommonModule } from '@angular/common';
import { ApiService } from '@services/api.service'; // Import ApiService
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '@interfaces/commont.interfaces';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],  // Import FormsModule for template-driven forms
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.scss'],
  providers: [ApiService]
})

export class CustomerRegisterComponent implements OnInit {
  existing_customers : Customer[]= [] 
  mobileNumberBelongsTo: Customer | null = null;; 
  // Define the customer object with default values according to the Django model
  customer : Customer = {
    customer_name: '',  // Matches `customer_name` in the Django model
    customer_address: '',  // Matches `customer_address`
    mobile_number: '',  // Matches `mobile_number`, we'll use string for flexibility
    balance: 0.00,  // Matches `balance`
    last_updated_by: '',  // Assuming this will be populated dynamically
    lastBought: ''  // Assuming this will be populated dynamically
  };

  isEditMode = false;  // Flag to check if in edit mode
  customerId!: number;  // This will hold the customer ID in edit mode

  // Inject the ApiService for making API requests
  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    
  this.getCustomers(); // Fetch customers on component initialization
}

// Function to fetch customers from the API
getCustomers() {
  this.apiService.getCustomers().subscribe(
    (data: any[]) => {
      this.existing_customers = data;
    },
    (error) => {
      console.error('Error fetching customers:', error);
      alert('Failed to load customer data.');
      
    }
  );
}

checkMobileNumber(mobile_number: any) {
  const mobileNumber:string = this.customer.mobile_number;
  
  // Check if the mobile number is at least 10 characters and consists of digits
  if (mobileNumber.length >= 10 && /^\d+$/.test(mobileNumber)) {
    // Check if the mobile number belongs to any existing customer in the array of Customer objects
    const foundCustomer = this.existing_customers.find((cust: Customer) => cust.mobile_number === mobileNumber);
    console.log("sdfdas");
    if (foundCustomer && foundCustomer.id!=this.customer.id) {
      this.mobileNumberBelongsTo = foundCustomer; // Assign the customer details to mobileNumberBelongsTo
      console.log("Customer found")
      // Mark the mobile_number control as invalid and set the custom error
      mobile_number.control.setErrors({ duplicate: true });
    } else {
      this.mobileNumberBelongsTo = null;
      mobile_number.control.setErrors(null); // Clear any existing errors if no duplicate is found
    }
  }
}

  // Load the item details for editing
  loadCustomer(): void {
    if (this.customerId) {
      this.isEditMode = true;
      // Fetch customer details if in edit mode
      this.apiService.getCustomerById(this.customerId).subscribe(
        (response) => {
          this.customer = response;  // Populate the form with existing customer data
        },
        (error) => {
          console.error('Error fetching customer details:', error);
        }
      );
    }
  }

  ngOnInit(): void {
    // Check if this component is in "edit mode" by checking if customerId is set
    // This can be passed as a route parameter or set elsewhere in the app
    // Example: this.customerId = some logic to get the customer ID
    this.route.params.subscribe((params) => {
      this.customerId = params['id'];
      if (this.customerId) {
        this.isEditMode = true;
        this.loadCustomer(); // Load item details for editing
      } else {
        this.isEditMode = false; // Default to add mode
      }
    });

  }

  // Handle form submission and API call
  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isEditMode && this.customerId) {
        // Update customer if in edit mode
        this.apiService.updateCustomer(this.customerId, this.customer).subscribe(
          (response) => {
            console.log('Customer updated successfully!', response);
            alert('Customer updated successfully!');
            form.reset();  // Reset form after successful submission
            this.router.navigate(['/customer-list']); // Navigate to customer registration page
          },
          (error) => {
            console.error('Error updating customer:', error);
            alert('Failed to update customer. Please try again.');
          }
        );
      } else {
        // Create new customer if not in edit mode
        this.apiService.createCustomer(this.customer).subscribe(
          (response) => {
            console.log('Customer saved successfully!', response);
            alert('Customer saved successfully!');
            
            form.reset();  // Reset form after successful submission
            this.router.navigate(['/customer-list']); // Navigate to customer registration page
          },
          (error) => {
            console.error('Error saving customer:', error);
            alert('Failed to save customer details. Please try again.');
          }
        );
      }
    }
  }
}
