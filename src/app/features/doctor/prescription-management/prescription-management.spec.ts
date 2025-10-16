import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionManagement } from './prescription-management';

describe('PrescriptionManagement', () => {
  let component: PrescriptionManagement;
  let fixture: ComponentFixture<PrescriptionManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
