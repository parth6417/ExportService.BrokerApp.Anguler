import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditAppCustomersDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tabCustomerPriceModel',
  templateUrl: './tabCustomerPrice.component.html'
})
export class tabCustomerPriceModelComponent extends AppComponentBase {
  
  @Input() appCustomers: CreateOrEditAppCustomersDto = new CreateOrEditAppCustomersDto();
  @Input() modal: ModalDirective;
  
  @Output() saveContinueCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeFormCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() previousTabCallBack: EventEmitter<any> = new EventEmitter<any>();



  active = false;
  saving = false;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  
  
  wizerdContinue():void{
    this.saveContinueCallBack.emit(null);
  }
  close():void{
    this.active = false;
    this.closeFormCallBack.emit(null);
  }
  returnPreviousTab():void{
    this.active = false;
    this.previousTabCallBack.emit(1);
  }

  
  ngOnInit(): void {};
}