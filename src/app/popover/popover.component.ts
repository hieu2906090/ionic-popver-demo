import { Component, OnInit } from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { PopoverService } from '../popover.service';

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

  constructor(
    public popoverCtrl: PopoverController,
    private popService: PopoverService) { }

  ionViewDidEnter() {
    this.popService.keyboardEnterEmitter.subscribe(evt => {
      if (evt.type === 'deleteContentBackward') {
        this.textFilter = this.textFilter.substring(0, this.textFilter.length - 1);
        this.filteredItems = this.filterPopList(this.items, this.textFilter);
        console.log(this.textFilter);
      }
      if (evt.data === null) {
        return;
      } else {                                        // Xử lý khi itemType là xoá ở đây
        this.textFilter += evt.data;
        console.log(this.textFilter);
      }
      this.filteredItems = this.filterPopList(this.items, this.textFilter);
      this.positionStrEnd = evt.position;
    });
  }

  filterPopList(items: any, inputString: string) {
    if (inputString === '' || items.length === 0) {
      return items;
    } else {
      const resultsArr = [];
      for (const i of items) {
        if (i.item.toLowerCase().includes(inputString)) {
          resultsArr.push(i);
        }
      }
      return resultsArr;
    }
  }

  async dismissPop(popItem) {
    this.popService.dismissPopEmitter.next({positionDigit2: this.positionDigit2, positionStrEnd: this.positionStrEnd, item: popItem});
    await this.popoverCtrl.dismiss();
  }

  ngOnInit() {
    this.filteredItems = this.items;
  }
}
