import { Directive, HostListener, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { DragDropService, DragData } from '../drag-drop.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[app-Droppable][dropTags][droppableClass]'
})
export class DropDirective {

  @Input()
  droppableClass: string;
  @Input()
  dropTags: string[] = [];
  @Output()
  dropped = new EventEmitter<DragData>();

  private data$;

  constructor(private el: ElementRef, private rd: Renderer2, private service: DragDropService) {
    this.data$ = this.service.getDragData().pipe(take(1));
  }

  @HostListener("dragenter", ["$event"])
  ondragenter(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.addClass(this.el.nativeElement, this.droppableClass);
        }
        console.log("dragenter");
      });
    }
  }

  @HostListener("dragover", ["$event"])
  ondragover(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.setProperty(ev, "dataTransfer.effectAllowed", "all");
          this.rd.setProperty(ev, "dataTransfer.dropEffect", "move");
        } else {
          this.rd.setProperty(ev, "dataTransfer.effectAllowed", "none");
          this.rd.setProperty(ev, "dataTransfer.dropEffect", "none");
        }
        console.log("dragover");
      });
    }
  }

  @HostListener("dragleave", ["$event"])
  ondragleave(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.removeClass(this.el.nativeElement, this.droppableClass);
        }
        console.log("dragleave");
      });
    }
  }

  @HostListener("drop", ["$event"])
  ondrop(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.removeClass(this.el.nativeElement, this.droppableClass);
          this.dropped.emit(dragData);
          // this.service.clearDragData();
          console.log("drop");
        }
      });
    }
  }
}
