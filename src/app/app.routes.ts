//app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainpageComponent } from './mainpage/mainpage.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mainpage', component: MainpageComponent }
];
