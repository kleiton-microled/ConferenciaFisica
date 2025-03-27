import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcanteCargaSoltaComponent } from './marcante-carga-solta.component';

describe('MarcanteCargaSoltaComponent', () => {
  let component: MarcanteCargaSoltaComponent;
  let fixture: ComponentFixture<MarcanteCargaSoltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcanteCargaSoltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcanteCargaSoltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
