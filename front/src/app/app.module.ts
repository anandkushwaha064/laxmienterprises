// app.module.ts

import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { ItemRegisterComponent } from './components/item/item-register/item-register.component';
import { CustomerRegisterComponent } from './components/customer/customer-register/customer-register.component';
import { AuthInterceptor } from './interceptors/auth-interceptor'
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Make sure to import 'withFetch'
import { DEFAULT_CURRENCY_CODE } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';  // Import Indian locale

registerLocaleData(localeIn, 'en-IN');  // Register the Indian locale

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HeaderComponent,
    FormsModule,
    ItemListComponent,
    ItemRegisterComponent,
    CustomerRegisterComponent,
    FooterComponent,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'en-IN' }, // Set locale to India
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' }, // Set default currency to INR
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
