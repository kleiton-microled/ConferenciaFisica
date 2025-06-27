import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountPixCardsComponent } from './count-pix-cards.component';

describe('CountPixCardsComponent', () => {
  let component: CountPixCardsComponent;
  let fixture: ComponentFixture<CountPixCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountPixCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountPixCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
