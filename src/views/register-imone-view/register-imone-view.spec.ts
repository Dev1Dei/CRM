import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterImoneView } from './register-imone-view';

describe('RegisterImoneView', () => {
  let component: RegisterImoneView;
  let fixture: ComponentFixture<RegisterImoneView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterImoneView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterImoneView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
