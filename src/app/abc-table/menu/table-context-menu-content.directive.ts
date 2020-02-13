import {AfterContentInit, ChangeDetectorRef, Directive, ElementRef, HostBinding, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Directive({
  selector: '[appTableContextMenuContent]'
})
export class TableContextMenuContentDirective implements AfterContentInit {
  @HostBinding('class.abc-table-context-menu') class = true;
  @HostBinding('class.top') top = false;
  @HostBinding('class.bottom') bottom = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterContentInit(): void {
    this.calculateFloatingPosition();
  }

  getNativeElement() {
    return this.elementRef && this.elementRef.nativeElement;
  }

  /**
   * calculate options floating position
   */
  private calculateFloatingPosition() {
    if (isPlatformBrowser(this.platformId)) {
      this.changeDetectorRef.detectChanges();

      const el = this.getNativeElement();

      if (el) {
        let target = el;
        let position = 0;
        let height = 0;

        while (target) {
          position += target.offsetTop;
          target = target.offsetParent as HTMLElement;

          const overflowY = window.getComputedStyle(target).overflowY;

          if (overflowY !== 'visible') {
            height = target.offsetHeight;
            break;
          }
        }

        const reversePosition = position - el.offsetHeight;

        position += el.offsetHeight;

        if (position > height && reversePosition > 0) {
          this.top = true;
        } else {
          this.bottom = true;
        }
      }
    }
  }
}
