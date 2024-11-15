import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { LoginData } from '@interfaces/auth.Interfaces';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }
  // Base URL for API calls (modify this according to your server's base URL)
  private baseUrl = environment.apiUrl;

  login(loginData: LoginData) {
    // Send the login request to the API
    return this.http.post(`${this.baseUrl}login/`, loginData);
  }
}