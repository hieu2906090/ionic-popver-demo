import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverService } from '../popover.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  textAreaText = '';
  items: any = [
    { item: 'Test String 1 Here' },
    { item: 'Test String 2 Here' },
    { item: 'Test String 3 Here' },
    { item: 'Test String 4 Here' },
    { item: 'Test String 5 Here' },
    { item: 'Test String 6 Here' },
    { item: 'Test String 7 Here' },
    { item: 'Test String 8 Here' },
    { item: 'Test String 9 Here' },
    { item: 'Test String 10 Here' }
  ];

  dismisSubscription: any;

  keyBoardSubscription: any;

  constructor(public popoverCtrl: PopoverController,
              private popService: PopoverService) { }

  ionViewDidEnter() {
    this.dismisSubscription = this.popService.dismissPopEmitter.subscribe(data => {
      // tslint:disable-next-line: quotemark
      console.log("Dismiss roi hah! Item: " + data);
      this.textAreaText = this.replaceStringWithOptionsGet(this.textAreaText, data.item.item, data.positionDigit2, data.positionStrEnd);
    });
  }

  private replaceStringWithOptionsGet(targetStr: string, replaceStr: string, positionDigit2: number, positionStrEnd: number) {
    let newTargetStr: string;
    if (positionDigit2 === positionStrEnd) {
      const targetStrStart = targetStr.substring(0, positionDigit2);
      newTargetStr = targetStrStart + replaceStr;
    }
    if (positionStrEnd < targetStr.length) {
      const targetStrStart = targetStr.substring(0, positionDigit2);
      const targetStrEnd = targetStr.substring(positionStrEnd, targetStr.length);
      newTargetStr = targetStrStart + replaceStr + ' ' + targetStrEnd;
    } else {
      const targetStrStart = targetStr.substring(0, positionDigit2);
      newTargetStr = targetStrStart + replaceStr;
    }
    return newTargetStr;
  }

  public ionViewDidLeave() {
    this.dismisSubscription.unsubscribe();
    this.keyBoardSubscription.unsubscribe();
  }

  async prepresentPopover(ev: any) {
  const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: false,
      componentProps: {
        items: this.items,
        positionDigit2: ev.target.selectionStart,
        positionStrEnd: ev.target.selectionStart // Gán trước cho positionEnd = Start khi bấm @
      }
    });
  return await popover.present();
  }

  getKeyBoard(evt: KeyboardEvent) {
    // console.log(evt);
    if (evt.data === '@') {
      this.prepresentPopover(evt);
    }
    this.popService.keyboardEnterEmitter.next({ type: evt.inputType, data: evt.data, position: evt.target.selectionStart });
    console.log(evt.inputType);
  }
}
