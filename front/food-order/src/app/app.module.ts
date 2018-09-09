import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationComponent} from './navigation/navigation.component';
import {LayoutModule} from '@angular/cdk/layout';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSidenavModule, MatSlideToggle, MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {OrderComponent} from './pages/order/order.component';
import {HistoryComponent} from './pages/history/history.component';
import {FormsModule} from "@angular/forms";
import {AngularFireModule} from "angularfire2";
import {environment} from "../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AuthServiceConfig, GoogleLoginProvider} from "angular-6-social-login";
import {SocialLoginModule} from 'angular-6-social-login';
import { UserSignInComponent } from './user-sign-in/user-sign-in.component';
import {AngularFireAuthModule} from "angularfire2/auth";
import { AdminComponent } from './pages/admin/admin.component';

const appRoutes: Routes = [
  { path: 'new-order', component: OrderComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'admin', component: AdminComponent },
];

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("262760377594-jgpk4hd37pfj3cl1vlqd1uvusdhvb5oq.apps.googleusercontent.com")
      }
    ]
  )
  ;
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    OrderComponent,
    HistoryComponent,
    UserSignInComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSlideToggleModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // for database,
    AngularFireAuthModule,
    SocialLoginModule
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
