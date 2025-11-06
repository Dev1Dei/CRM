import { Routes } from '@angular/router';
import {RegisterView} from '../views/register-view/register-view';
import {DashboardView} from '../views/dashboard-view/dashboard-view';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardView },
  { path: 'registruoti', component: RegisterView },
  { path: 'registruoti/:type', component: RegisterView },
  { path: '**', redirectTo: 'imone' }
];
