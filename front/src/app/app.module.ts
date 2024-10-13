import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { ItemRegisterComponent } from './components/item/item-register/item-register.component';
import { CustomerRegisterComponent } from './components/customer/customer-register/customer-register.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HeaderComponent,
    FormsModule,
    AppRoutingModule,
    ItemListComponent,
    ItemRegisterComponent,
    CustomerRegisterComponent,
    FooterComponent,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
