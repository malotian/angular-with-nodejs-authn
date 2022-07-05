import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { HomeComponent } from './components/home/home.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminHomeComponent,
    ContactUsComponent,
    CustomerHomeComponent,
    HomeComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
