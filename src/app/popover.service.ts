import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {
  dismissPopEmitter = new Subject<any>();
  keyboardEnterEmitter = new Subject<any>();

  constructor() { }
}
