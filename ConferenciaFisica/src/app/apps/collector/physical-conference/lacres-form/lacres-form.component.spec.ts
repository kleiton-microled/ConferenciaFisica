import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LacresFormComponent } from './lacres-form.component';

describe('LacresFormComponent', () => {
  let component: LacresFormComponent;
  let fixture: ComponentFixture<LacresFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LacresFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LacresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
