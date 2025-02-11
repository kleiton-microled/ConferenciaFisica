import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalConferenceComponent } from './physical-conference.component';

describe('PhysicalConferenceComponent', () => {
  let component: PhysicalConferenceComponent;
  let fixture: ComponentFixture<PhysicalConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalConferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
