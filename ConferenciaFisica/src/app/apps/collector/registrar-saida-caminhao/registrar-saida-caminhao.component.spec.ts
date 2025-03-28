import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSaidaCaminhaoComponent } from './registrar-saida-caminhao.component';

describe('IdentificacaoLoteComponent', () => {
  let component: RegistrarSaidaCaminhaoComponent;
  let fixture: ComponentFixture<RegistrarSaidaCaminhaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarSaidaCaminhaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarSaidaCaminhaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
