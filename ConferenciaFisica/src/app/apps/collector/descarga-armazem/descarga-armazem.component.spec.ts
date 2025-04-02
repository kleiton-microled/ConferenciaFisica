import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaArmazemComponent } from './descarga-armazem.component';

describe('DescargaArmazemComponent', () => {
  let component: DescargaArmazemComponent;
  let fixture: ComponentFixture<DescargaArmazemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargaArmazemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargaArmazemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
