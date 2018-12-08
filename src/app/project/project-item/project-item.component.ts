import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { cardAnim } from './../../anim/card.anim';
import { listAnimation } from './../../anim/list.anim';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [
    cardAnim,
    listAnimation
  ]
})
export class ProjectItemComponent implements OnInit {

  @Input()
  item;
  @Output()
  onInvite = new EventEmitter<void>();
  @Output()
  onEdit = new EventEmitter<void>();
  @Output()
  onDel = new EventEmitter<void>();
  @Output()
  onSelected = new EventEmitter<void>();
  @HostBinding("@card") cardState = "out";
  @HostBinding("@listAnim") listAnimState;

  constructor() { }

  @HostListener("mouseenter")
  onmouseenter() {
    this.cardState = "hover";
  }
  @HostListener("mouseleave")
  onmouseleave() {
    this.cardState = "out";
  }

  ngOnInit() {
  }

  onInviteClick(ev: Event) {
    ev.stopPropagation();
    this.onInvite.emit();
  }

  onEditInvite(ev: Event) {
    ev.stopPropagation();
    this.onEdit.emit();
  }

  onDelInvite(ev: Event) {
    ev.stopPropagation();
    this.onDel.emit();
  }

  onClick() {
    this.onSelected.emit();
  }
}
