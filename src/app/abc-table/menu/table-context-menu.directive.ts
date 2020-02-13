import {
  ContentChild,
  Directive,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: '[appTableContextMenu]'
})
export class TableContextMenuDirective {
  @ContentChild(TemplateRef, {static: false}) public templateRef: TemplateRef<any>;

  constructor() { }
}
