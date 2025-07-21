import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalConferenceHeaderComponent } from './physical-conference-header.component';

describe('PhysicalConferenceHeaderComponent', () => {
  let component: PhysicalConferenceHeaderComponent;
  let fixture: ComponentFixture<PhysicalConferenceHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalConferenceHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalConferenceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
