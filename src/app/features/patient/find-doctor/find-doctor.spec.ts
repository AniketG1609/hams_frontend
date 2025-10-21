import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindDoctor } from './find-doctor';

describe('FindDoctor', () => {
  let component: FindDoctor;
  let fixture: ComponentFixture<FindDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindDoctor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindDoctor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
