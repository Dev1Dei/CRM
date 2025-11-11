import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {DbService} from '../../services/db/db-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {SnackbarService} from '../../services/snackbar/snackbar-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, skip, debounceTime, delay, filter } from 'rxjs/operators';

@Component({
  selector: 'app-forma',
  standalone: true,
  templateUrl: './forma.component.html',
  styleUrls: ['./forma.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressBar,
  ],
})
export class FormaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dbService = inject(DbService);
  private snack = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(SnackbarService);

  formType: 'imone' | 'klientas' = 'imone';
  selectedTab = 0;
  saving = false;
  showForm = true;
  statusMessage: string | null = null;
  statusType: 'success' | 'error' | 'info' | null = null;


  addressForm = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    companyCode: ['', [Validators.pattern(/^[0-9]*$/)]],
    vatCode: ['', [Validators.pattern(/^(LT)?[0-9]+$/)]],
    address: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\+370[0-9]{6,8}$/), Validators.minLength(10), Validators.maxLength(12)]],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    position: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const type = params['type'];
      this.formType = type === 'klientas' ? 'klientas' : 'imone';
      this.selectedTab = this.formType === 'klientas' ? 1 : 0;
      this.updateValidators();
    });

    this.dbService.getConnectionStatus$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        debounceTime(500),
        delay(2000),
        skip(1),
        filter(val => val !== null && val !== undefined)
      )
      .subscribe((connected) => {
        if (!connected) {
          this.statusMessage = 'Ryšys su duomenų baze nutrūko';
          this.statusType = 'error';
          this.snackBar.error('Ryšys su duomenų baze nutrūko')
        } else {
          this.statusMessage = 'Ryšys su duomenų baze atkurtas';
          this.statusType = 'success';
          this.snackBar.success('Ryšys su duomenų baze atkurtas')
        }
      });
  }

  onTabChange(index: number) {
    this.formType = index === 1 ? 'klientas' : 'imone';
    this.updateValidators();
    this.router.navigate(['/registruoti', this.formType]);
    this.addressForm.updateValueAndValidity();
    this.router.navigate(['/registruoti', this.formType]);
  }

  private updateValidators() {
    const c = this.addressForm.controls;

    if (this.formType === 'klientas') {
      c.companyName.clearValidators();
      c.companyCode.clearValidators();
      c.vatCode.clearValidators();
      c.address.clearValidators();
      c.email.clearValidators();

      c.firstName.setValidators([Validators.required, Validators.minLength(2)]);
      c.lastName.setValidators([Validators.required, Validators.minLength(2)]);
      c.position.setValidators([Validators.required, Validators.minLength(2)]);
      c.phone.setValidators([
        Validators.required,
        Validators.pattern(/^\+370[0-9]{6,8}$/),
        Validators.minLength(10),
        Validators.maxLength(12),
      ]);
    } else {
      c.firstName.clearValidators();
      c.lastName.clearValidators();
      c.position.clearValidators();

      c.companyName.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(30)]);
      c.companyCode.setValidators([Validators.pattern(/^[0-9]*$/)]);
      c.vatCode.setValidators([Validators.pattern(/^(LT)?[0-9]+$/)]);
      c.address.setValidators([Validators.required]);
      c.email.setValidators([Validators.required, Validators.email]);
      c.phone.setValidators([
        Validators.pattern(/^\+370[0-9]{6,8}$/),
        Validators.minLength(10),
        Validators.maxLength(12),
      ]);
    }
    Object.values(c).forEach(control => {
      control.updateValueAndValidity({ emitEvent: false });
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  async onSubmit(): Promise<void> {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.addressForm.value;

    try {
      if (this.formType === 'imone') {
        await this.dbService.addCompany({
          companyName: formValue.companyName!,
          companyCode: formValue.companyCode!,
          vatCode: formValue.vatCode!,
          address: formValue.address!,
          email: formValue.email!,
          phone: formValue.phone!,
        });
        this.statusMessage = 'Įmonės duomenys išsaugoti';
        this.statusType = 'success';
        this.snackBar.success('Įmonės duomenys išsaugoti')
        this.resetForm()
        this.refreshForm()

      } else {
        await this.dbService.addClient({
          firstName: formValue.firstName!,
          lastName: formValue.lastName!,
          position: formValue.position!,
          phone: formValue.phone!,
        });
        this.statusMessage = 'Kliento duomenys išsaugoti';
        this.statusType = 'success';
        this.snackBar.success('Kliento duomenys išsaugoti')
        this.resetForm()
        this.refreshForm()
      }
    } catch (err) {
      console.error(err);
      this.statusMessage = 'Klaida išsaugant duomenis';
      this.statusType = 'error';
      this.snackBar.error('Klaida išsaugant duomenis')

    } finally {
      this.saving = false;
    }
  }
  private resetForm(): void {
    this.addressForm.reset();
    this.addressForm.markAsPristine();
    this.addressForm.markAsUntouched();
    Object.keys(this.addressForm.controls).forEach(k =>
      this.addressForm.get(k)?.setErrors(null)
    );
  }

  private refreshForm(): void{
    this.showForm = false;
    setTimeout(() => {
      this.showForm = true;
      this.updateValidators();
    }, 10)
  }

  isFieldInvalid(name: string): boolean {
    const control = this.addressForm.get(name);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
