import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSaidaCaminhaoModalComponent } from './registrar-saida-caminhao-modal.component';

describe('RegistrarSaidaCaminhaoModalComponent', () => {
  let component: RegistrarSaidaCaminhaoModalComponent;
  let fixture: ComponentFixture<RegistrarSaidaCaminhaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarSaidaCaminhaoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarSaidaCaminhaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
