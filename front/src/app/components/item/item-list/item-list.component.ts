import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm} from '@angular/forms'; 

// Updated Item interface to include quantityType
interface Item {
  itemName: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  quantityType: string;  // Added quantityType field
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent {

  constructor(private router: Router) {}

  searchTerm: string = '';
  
  // Updated items array to include quantityType for each item
  items: Item[] = [
    { itemName: 'Laptop', description: 'Gaming Laptop', category: 'Electronics', price: 1200, quantity: 5, quantityType: 'pieces' },
    { itemName: 'Chair', description: 'Comfortable chair', category: 'Furniture', price: 150, quantity: 10, quantityType: 'pieces' },
    { itemName: 'T-Shirt', description: '100% Cotton', category: 'Clothing', price: 25, quantity: 20, quantityType: 'pieces' },
    { itemName: 'Headphones', description: 'Noise-cancelling', category: 'Electronics', price: 200, quantity: 8, quantityType: 'pieces' }
  ];

  // Filter items based on search term
  filteredItems(): Item[] {
    if (!this.searchTerm) {
      return this.items;
    }
    return this.items.filter(item =>
      item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.quantityType.toLowerCase().includes(this.searchTerm.toLowerCase())  // Include quantityType in filter
    );
  }

  addItem() {
    this.router.navigate(['/item-register']);
  }

}
