import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';

/* Feature Modules */
import { UserModule } from './users/user.module';
import { StudentModule } from './students/student.module';
import { BoardModule } from './boards/board.module';
import { ResourceModule } from './resources/resource.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './users/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { VendorEditComponent } from './vendors/vendor-edit/vendor-edit.component';
import { VendorListComponent } from './vendors/vendor-list/vendor-list.component';
import { CollegeListComponent } from './colleges/college-list/college-list.component';
import { CollegeEditComponent } from './colleges/college-edit/college-edit.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    BoardModule,
    UserModule,
    StudentModule,
    ResourceModule,
    AppRoutingModule,
    SharedModule,
  ],
  declarations: [
    AppComponent,
    WelcomeComponent,
    PageNotFoundComponent,
    VendorEditComponent,
    VendorListComponent,
    CollegeListComponent,
    CollegeEditComponent,
//   FooterComponent, 
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ] 
})
export class AppModule { }
