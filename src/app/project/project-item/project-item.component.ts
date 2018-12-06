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

  onInviteClick() {
    this.onInvite.emit();
  }

  onEditInvite() {
    this.onEdit.emit();
  }

  onDelInvite() {
    this.onDel.emit();
  }
}
