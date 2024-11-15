import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
    providedIn: 'root' 
}
)
export class ApiService {

    constructor(private http: HttpClient) { }
    // Base URL for API calls (modify this according to your server's base URL)
    private baseUrl = environment.apiUrl;

    /**
     * Admin-related APIs
     */

    // Fetch admin data
    getAdmin(): Observable<any> {
        return this.http.get(`${this.baseUrl}admin/`);
    }

    /**
     * User-related APIs
     */

    // Fetch all users
    getUsers(): Observable<any> {
        return this.http.get(`${this.baseUrl}user/`);
    }

    // Fetch a user by their ID
    getUserById(userId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}user/${userId}/`);
    }

    // Create a new user
    createUser(userData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}user/create/`, userData);
    }

    // Update a user by their ID
    updateUser(userId: number, userData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}user/update/${userId}/`, userData);
    }

    // Delete a user by their ID
    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}user/delete/${userId}/`);
    }

    /**
     * Sales-related APIs
     */

    // Create a new sales record
    createSales(salesData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}sales/create/`, salesData);
    }

    /**
     * Item-related APIs
     */

    // Fetch all items
    getItems(): Observable<any> {
        return this.http.get(`${this.baseUrl}item/`);
    }

    // Fetch an item by its ID
    getItemById(itemId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}item/${itemId}/`);
    }

    // Create a new item
    createItem(itemData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}item/create/`, itemData);
    }

    // Update an existing item by its ID
    updateItem(itemId: number, itemData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}item/update/${itemId}/`, itemData);
    }

    // Delete an item by its ID
    deleteItem(itemId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}item/delete/${itemId}/`);
    }

    /**
     * Customer-related APIs
     */

    // Fetch all customers
    getCustomers(): Observable<any> {
        return this.http.get(`${this.baseUrl}customer/`);
    }

    // Fetch a customer by their ID
    getCustomerById(customerId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}customer/${customerId}/`);
    }

    // Create a new customer
    createCustomer(customerData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}customer/`, customerData);
    }

    // Update an existing customer by their ID
    updateCustomer(customerId: number, customerData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}customer/${customerId}/`, customerData);
    }

    // Delete a customer by their ID
    deleteCustomer(customerId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}customer/${customerId}/`);
    }

    /**
     * Sale Items-related APIs
     */

    // Fetch all sale items
    getInvoices(): Observable<any> {
        return this.http.get(`${this.baseUrl}invoice/`);
    }

    // Fetch a sale item by its ID
    getInvoiceById(saleItemId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}invoice/${saleItemId}/`);
    }

    // Create a new sale item
    createInvoice(saleItemData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}invoice/create/`, saleItemData);
    }

    // Update an existing sale item by its ID
    updateInvoice(saleItemId: number, saleItemData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}invoice/update/${saleItemId}/`, saleItemData);
    }

    // Delete a sale item by its ID
    deleteInvoice(saleItemId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}invoice/delete/${saleItemId}/`);
    }
}
