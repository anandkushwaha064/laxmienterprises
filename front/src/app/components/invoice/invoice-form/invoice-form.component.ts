import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Import FormsModule and NgForm
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
import { quantityTypes as qts } from '../../data'
import { Customer, Item } from '@interfaces/commont.interfaces';
import { ApiService } from '@services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Invoice, ReturnItem, SaleItem } from '@interfaces/invoice.interfaces';
import { RouterModule } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';  // Import Indian locale
import { NgModule, LOCALE_ID } from '@angular/core';
import { DEFAULT_CURRENCY_CODE } from '@angular/core';
import { AuthInterceptor } from '../../../interceptors/auth-interceptor'
registerLocaleData(localeIn, 'en-IN');  // Register the Indian locale


@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule], // Import necessary modules
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
  providers: [
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'en-IN' }, // Set locale to India
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' }, // Set default currency to INR
  ],
})
export class InvoiceFormComponent implements OnInit {

  // List of items fetched from the API
  availableItems: Item[] = [];
  customers: Customer[] = [];  // List of customers
  customer!: Customer;  // List of customers
  // saleItems: SaleItem[] = [];  // List of items
  // returnItem: ReturnItem[] = [];
  quantityTypes: any[] = qts;

  invoice: Invoice = {
    customer: 0,
    invoiceItems: [],
    returnItems: [],
    discount: 0,
    saleItemsTotal: 0,
    returnItemsTotal: 0,
    customerPay: 0,
    invoiceTotal: 0,
    customerReturn: 0,
    last_updated_by: '',
    creation_datetime: ''
  };

  // Inject ApiService and Router for API requests and navigation
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router

  ) {
  }

  navigateToCreateCustomer() {
    this.router.navigate(['/customer-register']);
  }


  // Add a new row for item
  addItemRow() {
    const newItemRow: SaleItem = {
      id: 0,
      item: 0,
      item_sale_price: 0,
      item_quantity: 1,
      item_quantity_type: '',
      invoice_id: 0,
      total: 0,
      customItem: false
    }
    this.invoice.invoiceItems.push(newItemRow);
  }



  // Function to load customer data
  loadCustomers() {
    this.apiService.getCustomers().subscribe(
      (data: Customer[]) => {
        this.customers = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  // Function to load item data
  loadItems() {
    this.apiService.getItems().subscribe(
      (data: Item[]) => {
        this.availableItems = data;
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  ngOnInit(): void {
    this.loadCustomers();  // Load customer data on initialization
    this.loadItems();  // Load item data on initialization
    this.addItemRow();
    this.addReturnItemRow();
  }

  // Today's date
  todayDate = new Date();


  // Remove an item row
  removeItemRow(index: number) {
    if (this.invoice.invoiceItems.length > index) {
      this.invoice.invoiceItems.splice(index, 1);
      this.calculateOverallTotal(); // Recalculate total after removing row
    }
  }

  // Add a new row for return items
  addReturnItemRow() {
    const newReturnItemRow: ReturnItem = {
      id: 0,
      item: 0, // item id
      item_sale_price: 0,
      item_quantity: 1,
      item_quantity_type: '',
      total: 0,
      customItem: false,
      name: '',
      debuction: 0,
      deduction_on_return: 0,
    };
    this.invoice.returnItems.push(newReturnItemRow);
  }

  // Remove a return item row
  removeReturnItemRow(index: number) {
    if (this.invoice.returnItems.length > index) {
      this.invoice.returnItems.splice(index, 1);
      this.calculateOverallTotal(); // Recalculate total after removing row
    }
  }

  // Calculate the total price for each row
  calculateRowTotal(index: number) {
    const item = this.invoice.invoiceItems[index];
    item.total = item.item_sale_price * item.item_quantity;
    this.calculateOverallTotal(); // Recalculate the overall total
  }

  // Calculate the total price for each return item row
  calculateReturnRowTotal(index: number) {
    const item = this.invoice.returnItems[index];
    item.total = item.item_sale_price * item.item_quantity;
    item.total = item.total - (item.total / 100 * (item.deduction_on_return ? item.deduction_on_return : 0));
    this.calculateOverallTotal(); // Recalculate the overall total
  }

  // Calculate the overall total for all sale items and return items
  calculateOverallTotal() {
    const saleItemsTotal = this.invoice.invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const returnItemsTotal = this.invoice.returnItems.reduce((sum, item) => sum + item.total, 0);
    this.invoice.saleItemsTotal = saleItemsTotal;
    this.invoice.returnItemsTotal = returnItemsTotal;
    this.invoice.invoiceTotal = saleItemsTotal - returnItemsTotal - this.invoice.discount;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Invoice data:', this.invoice);
      // API call to submit invoice
      this.apiService.createInvoice(this.invoice).subscribe(
        (response) => {
          console.log('Invoice submitted successfully!', response);
          alert('Invoice submitted successfully!');
          form.reset(); // Reset form after submission
        },
        (error) => {
          console.error('Error submitting invoice:', error);
          alert('Failed to submit invoice. Please try again.');
        }
      );
    }
  }

  // Function to handle custom item selection
  onItemChange(index: number, selectedItemId: number) {
    const selectedItemDetails = this.availableItems.find(item => item.id === selectedItemId);
    if (selectedItemDetails) {
      this.invoice.invoiceItems[index].item_sale_price = selectedItemDetails.item_sale_prize;
      this.invoice.invoiceItems[index].item_quantity_type = selectedItemDetails.quantity_type;
      this.calculateRowTotal(index); // Recalculate the total for this row
    }
  }

  // Function to handle custom item selection
  onReturnItemChange(index: number, selectedItemId: number) {
    const selectedItemDetails = this.availableItems.find(item => item.id === selectedItemId);
    if (selectedItemDetails) {
      this.invoice.returnItems[index].item_sale_price = selectedItemDetails.item_sale_prize;
      this.invoice.returnItems[index].item_quantity_type = selectedItemDetails.quantity_type;
      this.invoice.returnItems[index].deduction_on_return = selectedItemDetails.deduction_on_return;
      this.calculateReturnRowTotal(index); // Recalculate the total for this row
    }
  }

  // Function to handle custom item selection
  onCustomerSelect() {
    const selectedCustomer = this.customers.find(customer => customer.id === this.invoice.customer);

    if (selectedCustomer) {
      this.customer = selectedCustomer;
      console.log('Selected customer:', selectedCustomer);
      // Do something with the selectedCustomer, e.g., populate fields or calculate based on customer details
    }
  }
}
