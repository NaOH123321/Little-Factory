import { DragDropService } from './../drag-drop.service';
import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[app-Draggable][dragTag][dragData][draggableClass]'
})
export class DragDirective {
  private _isDraggable = false;

  @Input()
  draggableClass: string;

  @Input("app-Draggable")
  set isDraggable(val: boolean) {
    this._isDraggable = val;
    this.rd.setAttribute(this.el.nativeElement, "draggable", `${val}`);
  }

  get isDraggable() {
    return this._isDraggable;
  }

  @Input()
  dragTag: string;
  @Input()
  dragData: any;

  constructor(private el: ElementRef, private rd: Renderer2, private service: DragDropService) { }

  @HostListener("dragstart", ["$event"])
  ondragstart(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.addClass(this.el.nativeElement, this.draggableClass);
      this.service.setDragData({
        tag: this.dragTag,
        data: this.dragData
      });
      console.log("dragstart");
    }
  }

  @HostListener("dragend", ["$event"])
  ondragend(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.removeClass(this.el.nativeElement, this.draggableClass);
      this.service.clearDragData();
      console.log("dragend");
    }
  }
}
