import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoLacre } from '../models/tipo-lacre.model';
import { PhysicalConferenceService } from '../physical-conference.service';
import { LacresModel } from '../models/lacres.model';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { catchError, map, Observable, of, skip, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';

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

  idConferencia: number = 0;

  lacresForm: FormGroup;
  lacresSalvos: LacresModel[] = []; // Array para armazenar os lacres salvos

  currentLacre!: LacresModel;

  private conferenceSubscription!: Subscription;

  @Input() tiposLacres: TipoLacre[] = [];
  @Input() lacresConferencia: LacresModel[] = [];

  @Output() numeroLacreBlurEvent = new EventEmitter<TipoLacre>();

  selectedIndex: number | null = null; // Índice do item selecionado

  isLoading = false;

  constructor(private fb: FormBuilder, private service: PhysicalConferenceService, private notificationService: NotificationService) {
    this.lacresForm = this.fb.group({
      NumeroLacre: ['', Validators.required],
      TipoLacre: ['', Validators.required],
      LacreFechamento: ['']
    });
  }

  ngOnInit(): void {
    // 🔥 Escutar mudanças na conference e atualizar o formulário
    this.conferenceSubscription = this.service.getConference$()
      .pipe(skip(1)) // Evita rodar na primeira execução
      .subscribe(conference => {
        if (conference) {
          this.idConferencia = conference.id;
        }
      });

    this.lacresForm.valueChanges.subscribe(val => {
      if (this.currentLacre) {
        this.currentLacre.numero = val.NumeroLacre;
        this.currentLacre.tipo = val.TipoLacre;
        this.currentLacre.lacreFechamento = val.LacreFechamento;
      }
    });
  }


  selecionarLacre(index: number): void {
    this.selectedIndex = index;
    const lacreSelecionado = this.lacresConferencia[index];
    this.currentLacre = lacreSelecionado;

    console.log(this.currentLacre);
    this.lacresForm.patchValue({
      NumeroLacre: this.currentLacre.numero,
      TipoLacre: this.currentLacre.tipo,
      LacreFechamento: this.currentLacre.lacreFechamento
    });
  }

  /**
   * Insere ou atualiza um lacre
   */
  salvarOuAtualizarLacre(): void {
    if (this.currentLacre && this.currentLacre?.id !== null) {
      this.atualizarLacre(this.currentLacre).subscribe((result) => {
        if (result) {
          this.isLoading = true;
          this.service.getLacresConferencia(this.currentLacre.idConferencia).subscribe((ret: any) => {
            if (ret) {
              this.lacresConferencia = ret.result;
              this.isLoading = false;
            }
          });
          // Apenas limpa o currentLacre após a atualização bem-sucedida
          //this.currentLacre;
          this.lacresForm.reset();
        } else {
          console.log('Falha no cadastro.');
        }
      });
    } else {
      // Adiciona novo registro
      this.adicionarLacre();
    }
  }


  /**
   * COmplemnto do salve Lacre
   */
  adicionarLacre(): void {
    if (this.lacresForm.valid) {
      this.isLoading = true;
      const tipoLacreSelecionado = this.tiposLacres.find(tipo => tipo.id == this.lacresForm.value.TipoLacre);
      console.log('GetCurrentConference: ', this.service.getCurrentConference());
      const novoLacre: LacresModel = {
        id: null,
        idConferencia: this.service.getCurrentConference().id,
        numero: this.lacresForm.value.NumeroLacre,
        tipo: tipoLacreSelecionado?.id ?? 0,
        descricaoTipo: tipoLacreSelecionado?.codigo + ' - ' + tipoLacreSelecionado?.descricao,
        lacreFechamento: this.lacresForm.value.LacreFechamento
      };

      this.saveLacre(novoLacre).subscribe((result) => {
        if (result) {
          this.lacresConferencia.push(novoLacre);
        } else {
          console.log('Falha no cadastro.');
        }
      });

      // setTimeout(() => {
      //   this.lacresConferencia.push(novoLacre);
      //   this.lacresForm.reset();
      //   this.isLoading = false;
      // }, 1000);
    }
  }

  saveLacre(lacre: LacresModel): Observable<boolean> {
    return this.service.saveLacreConferencia(lacre).pipe(
      map((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
        return ret.status; // 🔥 Retorna um Observable<boolean>
      }),
      catchError((error) => {
        this.notificationService.showError(error);
        return of(false); // 🔥 Retorna um Observable com `false` em caso de erro
      })
    );
  }

  atualizarLacre(currentLacre: LacresModel): Observable<boolean> {
    return this.service.updateLacreConferencia(currentLacre).pipe(
      map((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
        return ret.status; // 🔥 Retorna um Observable<boolean>
      }),
      catchError((error) => {
        this.notificationService.showError(error);
        return of(false); // 🔥 Retorna um Observable com `false` em caso de erro
      })
    );
  }

  removerLacre(index: number): void {
    this.lacresConferencia.splice(index, 1);
  }

  onNumeroLacreBlur(): void {
    const numeroLacre = this.lacresForm.get('NumeroLacre')?.value;

    const tipoLacreEncontrado = this.tiposLacres.find(tipo => tipo.codigo === numeroLacre);
    if (tipoLacreEncontrado) {
      this.numeroLacreBlurEvent.emit(tipoLacreEncontrado);
    }
  }
}
