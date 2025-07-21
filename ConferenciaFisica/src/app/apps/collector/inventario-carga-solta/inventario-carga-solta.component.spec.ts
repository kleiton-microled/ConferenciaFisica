import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioCargaSoltaComponent } from './inventario-carga-solta.component';

describe('InventarioCargaSoltaComponent', () => {
  let component: InventarioCargaSoltaComponent;
  let fixture: ComponentFixture<InventarioCargaSoltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioCargaSoltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioCargaSoltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
