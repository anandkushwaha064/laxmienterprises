import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@services/api.service';  // Import ApiService
import { Item } from '@interfaces/commont.interfaces'
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptor } from '../../../interceptors/auth-interceptor'
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';  // Import Indian locale
import { NgModule, LOCALE_ID } from '@angular/core';
import { DEFAULT_CURRENCY_CODE } from '@angular/core';

registerLocaleData(localeIn, 'en-IN');  // Register the Indian locale


@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  // providers: []  // Provide ApiService3
  providers: [
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'en-IN' }, // Set locale to India
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' }, // Set default currency to INR
  ],
})
export class ItemListComponent implements OnInit {
  searchTerm: string = '';
  items: Item[] = [ ];  // Initialize an empty array to store items
  errorMessage: string = '';

  // Inject ApiService and Router
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Call the getItems method to fetch the items when the component initializes
    this.loadItems();
  }

  // Load items using ApiService
  loadItems() {
    this.apiService.getItems().subscribe(
      (data: Item[]) => {
        this.items = data;  // Bind the fetched items to the component's items array
      },
      (error) => {
        console.error('Error fetching items:', error);
        this.errorMessage = 'Failed to load items. Please try again later.';
      }
    );
  }
  
  // Filter items based on search term
  filteredItems(): Item[] {
    if (!this.searchTerm) {
      return this.items;
    }
    return this.items.filter(item =>
      (item.id && item.id.toString().includes(this.searchTerm.toLowerCase())) ||
      item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.quantity_type.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Navigate to the item registration page
  addItem() {
    this.router.navigate(['/item-register']);
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

  // Edit item (you can redirect to an edit page)
  editItem(item: Item) {
    // Navigate to the edit page with the item ID
    this.router.navigate(['/item-edit', item.id]);
  }

  // Delete item
  deleteItem(item: Item) {
    if(!item.id){
      alert("Id not found to delete");
      return;
    }
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deleteItem(item.id).subscribe(
        () => {
          // Reload the items list after deletion
          this.items = this.items.filter((it) => it.id !== item.id);
        },
        (error) => {
          console.error('Error deleting item:', error);
          this.errorMessage = 'Failed to delete item. Please try again later.';
        }
      );
    }
  }

}
