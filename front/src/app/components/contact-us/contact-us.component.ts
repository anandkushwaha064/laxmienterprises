import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClient for API calls
import { CommonModule } from '@angular/common';
import { ApiService } from '@services/api.service'; // Import ApiService
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '@interfaces/commont.interfaces';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ CommonModule, HttpClientModule, RouterModule],  // Import FormsModule for template-driven forms
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  providers: [ApiService]
})

export class ContactUsComponent implements OnInit {
  settings : any= {} 

  // Inject the ApiService for making API requests
  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {    
  }

  // Load the item details for editing
  loadDetails(): void {
      // Fetch customer details if in edit mode
      this.apiService.getSettings().subscribe(
        (response) => {
          for (let i=0; i<=response.length; i++){
            this.settings[response[i].name] = response[i].value
          }
        },
        (error) => {
          console.error('Error fetching customer details:', error);
        }
      );
  }

  ngOnInit(): void {
      this.loadDetails(); // Load item details for editing
  }

}
