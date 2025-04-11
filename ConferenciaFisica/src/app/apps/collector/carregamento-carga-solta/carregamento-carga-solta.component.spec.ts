import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarregamentoCargaSoltaComponent } from './carregamento-carga-solta.component';

describe('CarregamentoCargaSoltaComponent', () => {
  let component: CarregamentoCargaSoltaComponent;
  let fixture: ComponentFixture<CarregamentoCargaSoltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarregamentoCargaSoltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarregamentoCargaSoltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
