import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { CommonModule } from '@angular/common';
import { Item } from '@interfaces/commont.interfaces';
import { RouterModule } from '@angular/router';
import { quantityTypes as qts } from '../../data'
@Component({
  selector: 'app-item-register',
  standalone: true,
  templateUrl: './item-register.component.html',
  styleUrls: ['./item-register.component.scss'],
  imports: [FormsModule, CommonModule,  RouterModule],
  providers: [ApiService]
})
export class ItemRegisterComponent implements OnInit {

  quantityTypes: any[] = qts;
  existing_items: Item[] = [];
  itemNameBelongsTo?: Item | null;
  isEditMode = false; // To differentiate between add and edit mode

  item: Item = {
    item_name: '',
    item_quantity: 0,
    quantity_type: this.quantityTypes.length > 0 ? this.quantityTypes[0][0] : '',
    category: 'electronics',
    item_prize: 0,
    item_sale_prize: 0,
    description: '',
    is_active: true,
    deduction_on_return: 0
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      const itemId = params['id'];
      if (itemId) {
        this.isEditMode = true;
        this.loadItem(itemId); // Load item details for editing
      } else {
        this.isEditMode = false; // Default to add mode
      }
    });
    this.loadItems();
  }

  // Load items using ApiService
  loadItems() {
    this.apiService.getItems().subscribe(
      (data: Item[]) => {
        this.existing_items = data;  // Bind the fetched items to the component's items array
      },
      (error) => {
        console.error('Error fetching items:', error);
        // this.errorMessage = 'Failed to load items. Please try again later.';
      }
    );
  }

  // Load the item details for editing
  loadItem(id: number): void {
    this.apiService.getItemById(id).subscribe(
      (item) => {
        this.item = item; // Populate the form with the item data
      },
      (error) => {
        console.error('Error fetching item details:', error);
        alert('Failed to load item details.');
      }
    );
  }

  // Handle form submission for both add and edit
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.isEditMode && this.item.id) {
        // Update the existing item
        this.apiService.updateItem(this.item.id, this.item).subscribe(
          (response) => {
            console.log('Item updated successfully:', response);
            alert('Item updated successfully!');
            this.router.navigate(['/items']); // Navigate back to the items list
          },
          (error) => {
            console.error('Error updating item:', error);
            alert('Failed to update item. Please try again.');
          }
        );
      } else {
        // Create a new item
        this.apiService.createItem(this.item).subscribe(
          (response) => {
            console.log('Item created successfully:', response);
            alert('Item registered successfully!');
            form.reset(); // Reset form after successful submission
            this.router.navigate(['/items']); // Navigate back to the items list
          },
          (error) => {
            console.error('Error creating item:', error);
            alert('Failed to register item. Please try again.');
          }
        );
      }
    }
  }



  checkItemName(item_name_box: any) {
    const item_name: string = this.item.item_name;

    // Check if the mobile number is at least 10 characters and consists of digits
    if (item_name) {
      // Check if the mobile number belongs to any existing customer in the array of Customer objects
      const foundItem = this.existing_items.find((it: Item) => it.item_name.toLowerCase() === item_name.toLowerCase());

      if (foundItem && foundItem.id !== this.item.id) {
        this.itemNameBelongsTo = foundItem; // Assign the customer details to mobileNumberBelongsTo
        // Mark the mobile_number control as invalid and set the custom error
        item_name_box.control.setErrors({ duplicate: true });
      } else {
        this.itemNameBelongsTo = null;
        item_name_box.control.setErrors(null); // Clear any existing errors if no duplicate is found
      }
    }
  }
}
