import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentacaoCargaSoltaComponent } from './movimentacao-carga-solta.component';

describe('MovimentacaoCargaSoltaComponent', () => {
  let component: MovimentacaoCargaSoltaComponent;
  let fixture: ComponentFixture<MovimentacaoCargaSoltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentacaoCargaSoltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentacaoCargaSoltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
