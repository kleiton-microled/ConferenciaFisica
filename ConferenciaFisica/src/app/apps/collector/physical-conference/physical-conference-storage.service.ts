import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PhysicalConferenceModel } from './models/physical-conference.model';

const STORAGE_KEY = 'physicalConferences';

@Injectable({
  providedIn: 'root'
})
export class PhysicalConferenceStorageService {
  private storage: PhysicalConferenceModel[] = [];
  private storageSubject = new BehaviorSubject<PhysicalConferenceModel[]>(this.loadFromStorage());

  constructor() {
    this.initializeStorage();
  }

  /**
   * 🔥 Carrega os dados do `localStorage` ao iniciar
   */
  private loadFromStorage(): PhysicalConferenceModel[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * 🔥 Inicializa a lista com um mock caso esteja vazia
   */
  private initializeStorage(): void {
    if (this.storage.length === 0) {
      // this.storage.push({
      //   id:1,
      //   cntr: "688876-JH",
      //   bl: "",
      //   operacao:"",
      //   tipoCarga: "CONTEINER",
      //   viagem: "XPTO123",
      //   dataPrevista: new Date(),
      //   motivoAbertura: "Teste Inicial",
      //   embalagem: 5,
      //   quantidade: 100,
      //   tipoConferencia: 1,
      //   inicioConferencia: new Date(),
      //   fimConferencia: new Date(),
      //   cpfCliente: "12345678900",
      //   nomeCliente: "Cliente Inicial",
      //   retiradaAmostra: false,
      //   cpfConferente: "98765432100",
      //   nomeConferente: "Conferente Inicial",
      //   qtdDocumento: 3,
      //   quantidadeDivergente: 2,
      //   quantidadeDeVolumeDivergente: 1,
      //   quantidadeDeRepresentantes: 2,
      //   quantidadeDeAjudantes: 3,
      //   quantidadeDeOperadores: 1,
      //   divergenciaDeQualificacao: 1,
      //   movimentacao: 1,
      //   desunitizacao: 0,
      //   observacao: "Nenhuma",
      //   lacres: []
        
      // });
      this.updateStorage();
    }
  }

  /**
   * 🔍 Obtém todas as conferências armazenadas
   */
  getConferences(): Observable<PhysicalConferenceModel[]> {
    return this.storageSubject.asObservable();
  }

  /**
   * ➕ Adiciona uma nova conferência e salva no `localStorage`
   */
  addConference(conference: PhysicalConferenceModel): void {
    this.storage.push(conference);
    this.updateStorage();
  }

  /**
   * 🔄 Atualiza o `localStorage` e notifica os inscritos
   */
  private updateStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
    this.storageSubject.next(this.storage);
  }

  /**
   * 🗑️ Limpa todas as conferências
   */
  clearStorage(): void {
    this.storage = [];
    localStorage.removeItem(STORAGE_KEY);
    this.storageSubject.next(this.storage);
  }

  searchByContainerNumber(cntr: string): Observable<PhysicalConferenceModel | undefined> {
    return of(this.storage.find(conference => conference.cntr === cntr));
  }

  searchConferences(filter: { conteiner?: string; lote?: string; numero?: string }): Promise<PhysicalConferenceModel[]> {
    console.log('Filter: ', filter);
    return new Promise(resolve => {
      const result = this.storage.filter(conference => {
        const matchesConteiner = filter.conteiner ? conference.cntr === filter.conteiner : true;
        //const matchesLote = filter.lote ? conference.Bl === filter.lote : true;
        //const matchesNumero = filter.numero ? conference.CpfCliente === filter.numero : true;
  
        return matchesConteiner //&& matchesLote && matchesNumero;
      });
  
      resolve(result);
    });
  }
  
  
  
  
}
