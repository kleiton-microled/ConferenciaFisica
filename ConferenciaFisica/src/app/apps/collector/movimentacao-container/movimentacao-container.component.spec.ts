import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentacaoContainerComponent } from './movimentacao-container.component';

describe('MovimentacaoContainerComponent', () => {
  let component: MovimentacaoContainerComponent;
  let fixture: ComponentFixture<MovimentacaoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentacaoContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentacaoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
