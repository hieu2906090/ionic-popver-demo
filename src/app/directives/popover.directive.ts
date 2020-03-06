import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective {

  constructor() { }

  @HostListener('keyup', ['$event'])
  keyEventListen(evt: KeyboardEvent) {
    console.log(evt);
  }
}
