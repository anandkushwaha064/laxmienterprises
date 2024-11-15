// app.routes.ts
import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { ItemRegisterComponent } from './components/item/item-register/item-register.component';
import { CustomerRegisterComponent } from './components/customer/customer-register/customer-register.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { InvoiceFormComponent } from './components/invoice/invoice-form/invoice-form.component';
import { OcrCameraComponent } from './ocr/ocr.component';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
    { path: 'login', loadComponent: () => LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'customer-register', component: CustomerRegisterComponent }, // Item register route
    { path: 'edit-customer/:id', component: CustomerRegisterComponent }, // Item register route
    { path: 'item-edit/:id', component: ItemRegisterComponent },
    { path: 'customer-list', component: CustomerListComponent }, // Item register route
    { path: 'item-list', component: ItemListComponent }, // Item list route
    { path: 'item-register', component: ItemRegisterComponent }, // Item register route
    { path: 'sale-invoice', component: InvoiceFormComponent }, // Item register route
    { path: 'ocr', component: OcrCameraComponent }, // Item register route
    { path: '**', redirectTo: '/item-list' } // Wildcard route to catch undefined routes
];
