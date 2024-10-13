import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Import FormsModule and NgForm
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
import { availableItems as data } from './data'
@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], // Import necessary modules
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  // Customer details object
  customer = {
    name: '',
    address: '',
    mobileNumber: ''
  };

  // Invoice items array (dynamic rows)
  items = [
    {
      itemName: '',
      description: '',
      category: '',
      price: 0,
      quantity: 1,
      total: 0,
      customItem: false // Flag to indicate if the user entered a custom item
    }
  ];

  // Invoice items array (dynamic rows)
  return_items = [
    {
      itemName: '',
      description: '',
      category: '',
      price: 0,
      quantity: 1,
      total: 0,
      customItem: false // Flag to indicate if the user entered a custom item
    }
  ];

  // List of items fetched from the API
  availableItems: any[] = data;
  returnItems: any[] = data;

  // Constructor with HttpClient
  constructor(private http: HttpClient) {}

   // Today's date
  todayDate = new Date().toLocaleDateString();


  ngOnInit(): void {
    // this.fetchAvailableItems(); // Fetch the list of items when the component loads
  }

  // Fetch available items from the /items API
  // fetchAvailableItems() {
  //   this.http.get<any[]>('/items').subscribe(
  //     (data) => {
  //       this.availableItems = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching items:', error);
  //     }
  //   );
  // }

  // Add a new row for item
  addItemRow() {
    this.items.push({
      itemName: '',
      description: '',
      category: '',
      price: 0,
      quantity: 1,
      total: 0,
      customItem: false // Add flag for custom item
    });
  }

  // Remove an item row
  removeItemRow(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
      this.calculateOverallTotal(); // Recalculate total after removing row
    }
  }

  // Calculate the total price for each row
  calculateRowTotal(index: number) {
    const item = this.items[index];
    item.total = item.price * item.quantity;
    this.calculateOverallTotal(); // Recalculate the overall total
  }

  // Calculate the overall total for all rows
  calculateOverallTotal() {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  // Handle form submission and send data to server
  onSubmit(form: NgForm) {
    if (form.valid) {
      const invoiceData = {
        customer: this.customer,
        items: this.items,
        total: this.calculateOverallTotal() // Include total in invoice data
      };

      console.log('Invoice data:', invoiceData);

      // API call to submit invoice
      this.http.post('https://api.example.com/invoices', invoiceData)
        .subscribe(response => {
          console.log('Invoice submitted successfully!', response);
          alert('Invoice submitted successfully!');
          form.reset(); // Reset the form after submission
          this.items = [{ itemName: '', description: '', category: '', price: 0, quantity: 1, total: 0, customItem: false }]; // Reset items array
        }, error => {
          console.error('Error submitting invoice:', error);
          alert('Failed to submit invoice. Please try again.');
        });
    }
  }

  // Function to handle custom item selection
  onItemChange(index: number, selectedItem: string) {
    if (selectedItem === 'custom') {
      this.items[index].customItem = true; // Mark as custom item
      this.items[index].price = 0; // Reset price for custom item
    } else {
      const selectedItemDetails = this.availableItems.find(item => item.name === selectedItem);
      this.items[index].itemName = selectedItemDetails.name;
      this.items[index].price = selectedItemDetails.price;
      this.items[index].customItem = false; // Not a custom item
      this.calculateRowTotal(index); // Recalculate the total for this row
    }
  }
}
