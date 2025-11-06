import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

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
  ],
})
export class FormaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  formType: 'imone' | 'klientas' = 'imone';
  selectedTab = 0;

  addressForm = this.fb.group({
    // --- Įmonės ---
    companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    companyCode: ['', [Validators.pattern(/^[0-9]*$/)]],
    vatCode: ['', [Validators.pattern(/^(LT)?[0-9]+$/)]],
    address: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.pattern(/^\+370[0-9]{6,8}$/), Validators.minLength(10), Validators.maxLength(12)],
    ],

    // --- Klientas ---
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
  }
  onTabChange(index: number) {
    this.formType = index === 1 ? 'klientas' : 'imone';
    this.updateValidators();
    this.router.navigate(['/registruoti', this.formType]);
  }
  private updateValidators() {
    const c = this.addressForm.controls;

    if (this.formType === 'klientas') {
      // --- Disable company fields ---
      c.companyName.clearValidators();
      c.companyCode.clearValidators();
      c.vatCode.clearValidators();
      c.address.clearValidators();
      c.email.clearValidators();
      // Reset their values
      c.companyName.reset();
      c.companyCode.reset();
      c.vatCode.reset();
      c.address.reset();
      c.email.reset();

      // --- Enable klientas ---
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
      // --- Disable klientas ---
      c.firstName.clearValidators();
      c.lastName.clearValidators();
      c.position.clearValidators();
      c.firstName.reset();
      c.lastName.reset();
      c.position.reset();

      // --- Enable imone ---
      c.companyName.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ]);
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

    Object.values(c).forEach(control => control.updateValueAndValidity());
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const formValue = this.addressForm.value;

      if (this.formType === 'imone') {
        const companyData = {
          įmonėsPavadinimas: formValue.companyName,
          įmonėsKodas: formValue.companyCode,
          pvmKodas: formValue.vatCode,
          adresas: formValue.address,
          elPaštas: formValue.email,
          telefonas: formValue.phone,
        };

        console.log('Įmonės duomenys:', companyData);
        alert('Įmonės duomenys pateikti!');
      } else {
        const clientData = {
          vardas: formValue.firstName,
          pavardė: formValue.lastName,
          pareigos: formValue.position,
          telefonas: formValue.phone,
        };

        console.log('Kliento duomenys:', clientData);
        alert('Kliento duomenys pateikti!');
      }
    } else {
      this.addressForm.markAllAsTouched();
    }
  }
}
