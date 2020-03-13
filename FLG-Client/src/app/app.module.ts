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
import { LicenseModule } from './licenses/license.module';
import { AuthorityModule } from './authorities/authority.module';
import { ResourceModule } from './resources/resource.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './users/auth.interceptor';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AuthorityModule,
    UserModule,
    LicenseModule,
    ResourceModule,
    AppRoutingModule,
    SharedModule,
  ],
  declarations: [
    AppComponent,
    WelcomeComponent,
    PageNotFoundComponent,
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
