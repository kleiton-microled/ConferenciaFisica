import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaExportacaoComponent } from './descarga-exportacao.component';

describe('DescargaExportacaoComponent', () => {
  let component: DescargaExportacaoComponent;
  let fixture: ComponentFixture<DescargaExportacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargaExportacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargaExportacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
