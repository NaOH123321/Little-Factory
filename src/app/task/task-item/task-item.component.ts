import { Component, OnInit, Input, EventEmitter, Output, HostBinding, HostListener } from '@angular/core';
import { itemAnim } from './../../anim/item.anim';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [
    itemAnim
  ]
})
export class TaskItemComponent implements OnInit {

  @Input()
  item;

  avatar;

  @Output()
  taskClick = new EventEmitter<void>();

  widerPriority = "in";

  constructor() { }

  @HostListener("mouseenter")
  onmouseenter() {
    this.widerPriority = "out";
  }
  @HostListener("mouseleave")
  onmouseleave() {
    this.widerPriority = "in";
  }

  ngOnInit() {
    this.avatar = this.item.owner ? this.item.owner.avatar : "unassigned";
  }

  onItemClick() {
    this.taskClick.emit();
  }

  onCheckBoxClick(ev: Event) {
    ev.stopPropagation();
  }
}
