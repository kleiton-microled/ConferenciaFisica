import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroledInputWithSelectComponent } from './microled-input-with-select.component';

describe('MicroledInputWithSelectComponent', () => {
  let component: MicroledInputWithSelectComponent;
  let fixture: ComponentFixture<MicroledInputWithSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroledInputWithSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroledInputWithSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
