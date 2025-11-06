import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterKlientasView } from './register-klientas-view';

describe('RegisterKlientasView', () => {
  let component: RegisterKlientasView;
  let fixture: ComponentFixture<RegisterKlientasView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterKlientasView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterKlientasView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
