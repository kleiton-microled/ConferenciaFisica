import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoLacre } from '../models/tipo-lacre.model';

interface Lacre {
  NumeroLacre: string;
  TipoLacre: string;
  LacreFechamento: string;
}

@Component({
  selector: 'app-lacres-form',
  templateUrl: './lacres-form.component.html',
  styleUrls: ['./lacres-form.component.scss']
})
export class LacresFormComponent implements OnInit {
  lacresForm: FormGroup;
  lacresSalvos: Lacre[] = []; // Array para armazenar os lacres salvos

  @Input() tiposLacres: TipoLacre[] = [];
  @Output() numeroLacreBlurEvent = new EventEmitter<TipoLacre>();

  selectedIndex: number | null = null; // Índice do item selecionado

  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.lacresForm = this.fb.group({
      NumeroLacre: ['', Validators.required],
      TipoLacre: ['', Validators.required],
      LacreFechamento: ['']
    });
  }

  ngOnInit(): void { }


  selecionarLacre(index: number): void {
    this.selectedIndex = index;
    const lacreSelecionado = this.lacresSalvos[index];

    this.lacresForm.patchValue({
      NumeroLacre: lacreSelecionado.NumeroLacre,
      TipoLacre: this.tiposLacres.find(tipo => tipo.descricao === lacreSelecionado.TipoLacre)?.id || '',
      LacreFechamento: lacreSelecionado.LacreFechamento
    });
  }

  salvarOuAtualizarLacre(): void {
    if (this.selectedIndex !== null) {
      // Atualiza o registro existente
      this.lacresSalvos[this.selectedIndex] = {
        NumeroLacre: this.lacresForm.value.NumeroLacre,
        TipoLacre: this.tiposLacres.find(tipo => tipo.id == this.lacresForm.value.TipoLacre)?.descricao || '',
        LacreFechamento: this.lacresForm.value.LacreFechamento
      };
      this.selectedIndex = null; // Resetar o índice após a atualização
    } else {
      // Adiciona novo registro
      this.adicionarLacre();
    }

    this.lacresForm.reset();
  }

  adicionarLacre(): void {
    if (this.lacresForm.valid) {
      this.isLoading = true;
      const tipoLacreSelecionado = this.tiposLacres.find(tipo => tipo.id == this.lacresForm.value.TipoLacre);


      const novoLacre: Lacre = {
        NumeroLacre: this.lacresForm.value.NumeroLacre,
        TipoLacre: tipoLacreSelecionado ? tipoLacreSelecionado.codigo + ' - ' + tipoLacreSelecionado.descricao : '', // Pega a descrição
        LacreFechamento: this.lacresForm.value.LacreFechamento
      };


      setTimeout(() => {
        this.lacresSalvos.push(novoLacre);
        this.lacresForm.reset();
        this.isLoading = false;
      }, 1000);
    }
  }

  removerLacre(index: number): void {
    this.lacresSalvos.splice(index, 1);
  }

  onNumeroLacreBlur(): void {
    const numeroLacre = this.lacresForm.get('NumeroLacre')?.value;

    const tipoLacreEncontrado = this.tiposLacres.find(tipo => tipo.codigo === numeroLacre);
    if (tipoLacreEncontrado) {
      this.numeroLacreBlurEvent.emit(tipoLacreEncontrado);
    }
  }
}
