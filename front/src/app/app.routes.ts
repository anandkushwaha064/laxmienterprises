// app.routes.ts
import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ItemRegisterComponent } from './components/item/item-register/item-register.component';
import { CustomerRegisterComponent } from './components/customer/customer-register/customer-register.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { InvoiceFormComponent } from './components/invoice/invoice-form/invoice-form.component';
import { InvoiceListComponent } from './components/invoice/invoice-list/invoice-list.component';

export const routes: Routes = [
    // { path: 'login', loadComponent: () => LoginComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'customer-register', component: CustomerRegisterComponent },
    { path: 'edit-customer/:id', component: CustomerRegisterComponent },
    { path: 'item-edit/:id', component: ItemRegisterComponent },
    { path: 'customer-list', component: CustomerListComponent }, 
    { path: 'item-list', component: ItemListComponent }, 
    { path: 'item-register', component: ItemRegisterComponent }, 
    { path: 'sale-invoice', component: InvoiceFormComponent }, 
    { path: 'sale-invoice/:id/:action', component: InvoiceFormComponent }, 
    { path: 'sale-invoice-list', component: InvoiceListComponent },
    { path: 'home', component: InvoiceListComponent },
    { path: '**', redirectTo: '/sale-invoice' } 
];
