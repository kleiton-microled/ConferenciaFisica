import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixMonitoringComponent } from './pix-monitoring.component';

describe('PixMonitoringComponent', () => {
  let component: PixMonitoringComponent;
  let fixture: ComponentFixture<PixMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
