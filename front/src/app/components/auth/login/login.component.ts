import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Standalone Component
  imports: [CommonModule, FormsModule], // Include necessary modules here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // Handle the login form submission
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    const loginData = {
      username: form.value.username,
      password: form.value.password,
    };

  }
}
