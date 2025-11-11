import { Routes } from '@angular/router';
import {FormaComponent} from '../components/forma/forma.component';
import {DashboardView} from '../views/dashboard-view/dashboard-view';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardView },
  { path: 'registruoti', component: FormaComponent },
  { path: 'registruoti/:type', component: FormaComponent },
  { path: '**', redirectTo: 'imone' }
];
