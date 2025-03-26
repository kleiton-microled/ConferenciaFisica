import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstufagemContainerComponent } from './estufagem-container.component';

describe('EstufagemContainerComponent', () => {
  let component: EstufagemContainerComponent;
  let fixture: ComponentFixture<EstufagemContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstufagemContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstufagemContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
