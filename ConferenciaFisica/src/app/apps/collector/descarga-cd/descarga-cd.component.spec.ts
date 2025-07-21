import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaCdComponent } from './descarga-cd.component';

describe('DescargaCdComponent', () => {
  let component: DescargaCdComponent;
  let fixture: ComponentFixture<DescargaCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargaCdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargaCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
