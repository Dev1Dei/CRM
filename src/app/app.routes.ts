import { Routes } from '@angular/router';
import {FormaComponent} from '../components/forma/forma.component';
import {DashboardView} from '../views/dashboard-view/dashboard-view';
import {AuthenticationForm} from '../components/authentication-form/authentication-form';
import {authGuard} from '../guards/auth-guard-guard';


export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardView, canActivate: [authGuard] },
  { path: 'registruoti', component: FormaComponent, canActivate: [authGuard] },
  { path: 'registruoti/:type', component: FormaComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthenticationForm},
  { path: '**', redirectTo: 'dashboard' }
];
