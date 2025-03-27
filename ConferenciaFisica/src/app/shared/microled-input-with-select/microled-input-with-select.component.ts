import { Component, EventEmitter, Input, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'microled-input-with-select',
  templateUrl: './microled-input-with-select.component.html',
  styleUrls: ['./microled-input-with-select.component.scss']
})
export class MicroledInputWithSelectComponent {
  @Input() placeholder: string = 'Digite para buscar...';
  @Input() fetchData!: (term: string) => Observable<{ value: any, descricao: string }[]>;
  @Output() selectedItem = new EventEmitter<{ value: any, descricao: string }>();

  inputControl = new FormControl('');
  suggestions: { value: any, descricao: string }[] = [];
  showSuggestions = false;

  constructor() {
    this.inputControl.valueChanges.pipe(
      filter((term): term is string => !!term),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 3 && this.fetchData) {
          return this.fetchData(term);
        }
        return of([]);
      })
    ).subscribe(results => {
      this.suggestions = results.slice(0, 10);
      this.showSuggestions = this.suggestions.length > 0;
    });
  }
  

  onSelect(item: { value: any, descricao: string }) {
    this.inputControl.setValue(item.descricao);
    this.showSuggestions = false;
    this.selectedItem.emit(item);
  }
}
