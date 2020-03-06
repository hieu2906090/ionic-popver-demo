import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverService } from '../popover.service';
const stringSim = require('string-similarity');

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
  positionDigit2: any;
  positionStrEnd: any;
  items: any;
  textFilter = '';
  filteredItems: any;
  inputType: string;
  tempInputData = '';
  tempInputDataIdx: number;

  constructor(
    public popoverCtrl: PopoverController,
    private popService: PopoverService) { }

  ionViewDidEnter() {
    this.popService.keyboardEnterEmitter.subscribe(evt => {
      this.handleKeyBoardChange(evt);
    });
  }

  async dismissPop(popItem) {
    this.popService.dismissPopEmitter.next({ positionDigit2: this.positionDigit2, positionStrEnd: this.positionStrEnd, item: popItem });
    await this.popoverCtrl.dismiss();
  }

  ngOnInit() {
    this.filteredItems = this.items;
  }

  handleKeyBoardChange(evt: any) {
      // 1. Trường hợp gõ vào dạng insertText (k phải tiếng Việt)
      if (evt.type === 'insertText') {
        this.inputType = 'it';
        this.textFilter += evt.data;
      }
      if (evt.type === 'deleteContentBackward' && evt.inputType === 'insertText') {
        this.textFilter = this.textFilter.substring(0, this.textFilter.length - 1);
      }
      // 2. Trường hợp gõ vào dạng insertCompositionText
      if (evt.type === 'insertCompositionText') {
        this.inputType = 'ict';
        if (evt.data.indexOf(' ') === -1) {
          this.textFilter = evt.data;
        }
        if (evt.data.indexOf(' ') !== -1) {
          if (this.tempInputData === '') {
            this.tempInputDataIdx = evt.position - evt.data.length;
            console.log('Index cua chuoi moi luu la: ' + this.tempInputDataIdx);
          }
          this.tempInputData += evt.data;
          console.log(this.tempInputData);
        }
        if (this.tempInputData !== '') {
          if (evt.data.length > 1) {
            this.textFilter = this.tempInputData + evt.data;
          }
          console.log(this.tempInputData);
        }
      }
      if (evt.position < this.positionDigit2) {
        this.popoverCtrl.getTop().then(data => {
          if (data === undefined) {
            return;
          } else {
            this.popoverCtrl.dismiss();
          }
        });
      }
      if (evt.type === 'deleteContentBackward' && evt.inputType === 'insertCompositionText') {
        // 1. trường hợp xoá hết bắt đầu từ đầu:
        // if (evt.selectionStart === this.tempInputDataIdx + 1) {
        //   this.filteredItems = this.items;
        //   this.tempInputData = '';
        // }
      }
      if (evt.data === null) {
        return;
      }
      console.log('Chuoi tim kiem la: ' + this.textFilter);
      this.filteredItems = this.filterPopList(this.items, this.textFilter);
      this.positionStrEnd = evt.position;
  }

  filterPopList(items: any, inputString: string) {
    if (inputString === '' || items.length === 0) {
      return items;
    } else {
      let resDemo = [];
      for (const i of items) {
        const strSim = stringSim.compareTwoStrings(i.name.toLowerCase(), inputString.toLowerCase());
        resDemo.push({ name: i.name, sim: strSim });
      }
      resDemo = resDemo.sort((n1, n2) => {
        if (n1.sim > n2.sim) {
          return -1;
        }
      });
      console.log(resDemo.slice(0, 10));
      return resDemo.slice(0, 10);
    }
  }
  // oldfilterPopList(items: any, inputString: string) {
  //   if (inputString === '' || items.length === 0) {
  //     return items;
  //   } else {
  //     let resultsArr = [];
  //     for (const i of items) {
  //       const strSim = stringSim.compareTwoStrings(i.item.toLowerCase(), inputString.toLowerCase());
  //       if (i.item.toLowerCase().includes(inputString.toLowerCase())) {
  //         resultsArr.push({ item: i.item, sim: strSim });
  //       }
  //       console.log('Ket Qua Chay String Sim: '
  //         + stringSim.compareTwoStrings(i.item.toLowerCase(), inputString.toLowerCase())
  //         + ' cho item: ' + i.item);
  //     }
  //     resultsArr = resultsArr.sort((n1, n2) => {
  //       if (n1.sim > n2.sim) {
  //         return -1;
  //       }
  //     });
  //     console.log(resultsArr);
  //     return resultsArr;
  //   }
  // }
}
