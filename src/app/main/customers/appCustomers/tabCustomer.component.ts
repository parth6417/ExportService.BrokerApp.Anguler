import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditAppCustomersDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tabCustomerModel',
  templateUrl: './tabCustomer.component.html'
})
export class tabCustomerModelComponent extends AppComponentBase {
  @Input() appCustomers: CreateOrEditAppCustomersDto = new CreateOrEditAppCustomersDto();
  @Input() modal: ModalDirective;

  @Output() saveContinueCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeFormCallBack: EventEmitter<any> = new EventEmitter<any>();


  active = false;
  saving = false;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  show(appCustomersId?: number): void {
    if (!appCustomersId) {
      this.appCustomers = new CreateOrEditAppCustomersDto();
      this.appCustomers.id = appCustomersId;
    }

  }

  wizerdContinue(): void {
    console.log("Forword From Customer Button Fire")
    this.saveContinueCallBack.emit(null);
  }
  close(): void {
    this.active = false;
    this.closeFormCallBack.emit(null);
  }

  ngOnInit(): void { 
    this.appCustomers = new CreateOrEditAppCustomersDto();
  };
}