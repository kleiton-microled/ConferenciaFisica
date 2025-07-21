import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroledSelectComponent } from './microled-select.component';

describe('MicroledSelectComponent', () => {
  let component: MicroledSelectComponent;
  let fixture: ComponentFixture<MicroledSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroledSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroledSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
