import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snack = inject(MatSnackBar);

  success(message: string, duration = 3000): void {
    this.snack.open(message, '✖', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  error(message: string): void {
    const ref = this.snack.open(message, '✖', {
      duration: undefined,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
    ref.onAction().subscribe(() => ref.dismiss());
  }

  info(message: string, duration = 3000): void {
    this.snack.open(message, '✖', {
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
