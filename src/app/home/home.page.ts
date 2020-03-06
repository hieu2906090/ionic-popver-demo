import { Component, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('textAreaRef', {static: true}) textAreaRef: ElementRef;
  items: any = [
    { name: 'Nguyễn Quang Hiếu' },
    { name: 'Đoàn Quang Hiếu' },
    { name: 'Đinh Quốc Hiếu' },
    { name: 'Hồ Quang Hiếu' },
    { name: 'Nguyễn Trọng Hiếu' },
    { name: 'Lê Trần Lam' },
    { name: 'Nguyễn Thị Anh Đào' },
    { name: 'Nguyễn Đức Thịnh' },
    { name: 'Đoàn Quốc Cường' },
    { name: 'Nguyễn Hải Lâm' },
    { name: 'Nguyễn Văn Định' },
    { name: 'Đoàn Nguyên Bảo' },
    { name: 'Nguyễn Văn Hoà' },
    { name: 'Văn Tiến Sỹ' },
    { name: 'Đoàn Kim Ngọc' }
  ];

  dismisSubscription: any;

  keyBoardSubscription: any;

  constructor(public popoverCtrl: PopoverController,
              private popService: PopoverService) { }

  ionViewDidEnter() {
    this.dismisSubscription = this.popService.dismissPopEmitter.subscribe(data => {
      // tslint:disable-next-line: quotemark
      console.log("Dismiss roi hah! Item: " + data);
      this.textAreaText = this.replaceStringWithOptionsGet(this.textAreaText, data.item.name, data.positionDigit2, data.positionStrEnd);
      this.textAreaRef.nativeElement.focus();
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

  async presentPopover(ev: any) {
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
      this.presentPopover(evt);
    }
    this.popService.keyboardEnterEmitter.next({ type: evt.inputType, data: evt.data, position: evt.target.selectionStart });
    console.log(evt);
  }
}
