import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToolsModel } from '../tools.model';
import { TOOLS } from '../data';
import { ToolsService } from '../tools.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit, OnChanges {

  tools: ToolsModel[] = TOOLS;
  @Input() isDisabled: boolean = true;


  constructor(private service: ToolsService) { }

  ngOnInit(): void {
    this.tools;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDisabled']) {
      this.applyDisableState();
    }
  }

  applyDisableState(): void {
    this.tools = TOOLS.map(tool => ({
      ...tool,
      isDisabled: this.isDisabled
    }));
  }

}
