import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentaCargaComponent } from './movimenta-carga.component';

describe('MovimentaCargaComponent', () => {
  let component: MovimentaCargaComponent;
  let fixture: ComponentFixture<MovimentaCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentaCargaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentaCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
