import { Component, OnInit, ViewChild, inject, DestroyRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DbService, Company, Client } from '../../services/db/db-service';
import { DatePipe, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import {SnackbarService} from '../../services/snackbar/snackbar-service';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  templateUrl: './dashboard-view.html',
  styleUrls: ['./dashboard-view.css'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatSortModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DatePipe
  ]
})
export class DashboardView implements OnInit {
  private dbService = inject(DbService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(SnackbarService);

  displayedColumnsCompanies = ['companyName', 'companyCode', 'vatCode', 'address', 'email', 'phone', 'createdAt'];
  displayedColumnsClients = ['firstName', 'lastName', 'position', 'phone', 'createdAt'];

  dataSourceCompanies = new MatTableDataSource<Company>([]);
  dataSourceClients = new MatTableDataSource<Client>([]);
  loading = true;

  @ViewChild('paginatorCompanies') paginatorCompanies!: MatPaginator;
  @ViewChild('paginatorClients') paginatorClients!: MatPaginator;
  @ViewChild('sortCompanies') sortCompanies!: MatSort;
  @ViewChild('sortClients') sortClients!: MatSort;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.dbService
      .getCompanies$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          console.error('Error loading companies:', err);
          this.snackBar.error('Nepavyko užkrauti duomenų.');
          return of([]);
        })
      )
      .subscribe(data => {
        this.dataSourceCompanies.data = data.sort((a, b) => b.createdAt - a.createdAt);
        this.dataSourceCompanies.paginator = this.paginatorCompanies;
        this.dataSourceCompanies.sort = this.sortCompanies;
      });

    this.dbService
      .getClients$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          console.error('Error loading clients:', err);
          this.snackBar.error('Nepavyko užkrauti duomenų.');
          return of([]);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(data => {
        this.dataSourceClients.data = data.sort((a, b) => b.createdAt - a.createdAt);
        this.dataSourceClients.paginator = this.paginatorClients;
        this.dataSourceClients.sort = this.sortClients;
      });
  }
}
