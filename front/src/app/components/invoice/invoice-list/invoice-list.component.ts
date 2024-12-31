import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@services/api.service';  // Import ApiService
import { Invoice } from '@interfaces/invoice.interfaces'
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';  // Import Indian locale
import { NgModule, LOCALE_ID } from '@angular/core';
import { DEFAULT_CURRENCY_CODE } from '@angular/core';

registerLocaleData(localeIn, 'en-IN');  // Register the Indian locale


@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  // providers: []  // Provide ApiService3
  providers: [
    ApiService,
    { provide: LOCALE_ID, useValue: 'en-IN' }, // Set locale to India
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' }, // Set default currency to INR
  ],
})
export class InvoiceListComponent implements OnInit {
  searchTerm: string = '';
  invoice: Invoice[] = [ ];  // Initialize an empty array to store invoice
  errorMessage: string = '';

  // Inject ApiService and Router
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Call the getInvoices method to fetch the invoice when the component initializes
    this.loadInvoices();
  }

  // Load invoice using ApiService
  showInvoice(invoice:Invoice) {
    this.router.navigate(['/sale-invoice', invoice.id, 'view']);
  }
  
  // Load invoice using ApiService
  loadInvoices() {
    this.apiService.getInvoices().subscribe(
      (data: Invoice[]) => {
        this.invoice = data;  // Bind the fetched invoice to the component's invoice array
      },
      (error) => {
        console.error('Error fetching invoice:', error);
        this.errorMessage = 'Failed to load invoice. Please try again later.';
      }
    );
  }
  
  // Filter invoice based on search term
  filteredInvoices(): Invoice[] {
    if (!this.searchTerm) {
      return this.invoice;
    }
    return this.invoice.filter(invoice =>
      (invoice.id && invoice.id.toString().includes(this.searchTerm.toLowerCase())) ||
      (invoice.sale_date_time && invoice.sale_date_time.toString().includes(this.searchTerm.toLowerCase())) ||
      (invoice.last_updated_by && invoice.last_updated_by.toString().includes(this.searchTerm.toLowerCase())) ||
      invoice.customerName && invoice.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
  }

  // Navigate to the invoice registration page
  addInvoice() {
    this.router.navigate(['/sale-invoice']);
  }

  // Display human-readable quantity type
  displayQuantityType(quantity_type: string): string {
    const quantityTypeChoices = {
      pieces: 'Pieces',
      kg: 'Kilogram',
      gram: 'Gram',
      liters: 'Liters'
    };
    return quantityTypeChoices[quantity_type as keyof typeof quantityTypeChoices] || quantity_type;
  }

  // Edit invoice (you can redirect to an edit page)
  editInvoice(invoice: Invoice) {
    // Navigate to the edit page with the invoice ID
    this.router.navigate(['/sale-invoice', invoice.id, 'edit']);
  }

  // Delete invoice
  deleteInvoice(invoice: Invoice) {
    if(!invoice.id){
      alert("Id not found to delete");
      return;
    }
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.apiService.deleteInvoice(invoice.id).subscribe(
        () => {
          // Reload the invoice list after deletion
          this.invoice = this.invoice.filter((it) => it.id !== invoice.id);
        },
        (error) => {
          console.error('Error deleting invoice:', error);
          this.errorMessage = 'Failed to delete invoice. Please try again later.';
        }
      );
    }
  }

  
  printInvoice(id:any){
    // Open the URL in a new window
    window.open('/api/invoice/getPDF/'+id, '_blank');
  }
}
