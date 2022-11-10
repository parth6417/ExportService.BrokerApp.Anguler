import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppCustomersPoliciesAppPoliciesLookupTableDto, AppCustomersPoliciesServiceProxy, CreateOrEditAppCustomersDto, CreateOrEditAppCustomersPoliciesDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tabCustomerPolicyModel',
  templateUrl: './tabCustomerPolicy.component.html'
})
export class tabCustomerPolicyModelComponent extends AppComponentBase {

  @Input() appCustomers: CreateOrEditAppCustomersDto = new CreateOrEditAppCustomersDto();
  @Input() modal: ModalDirective;

  @Output() saveContinueCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeFormCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() previousTabCallBack: EventEmitter<any> = new EventEmitter<any>();



  allAppPoliciess: AppCustomersPoliciesAppPoliciesLookupTableDto[];

  customersPolicie: CreateOrEditAppCustomersPoliciesDto = new CreateOrEditAppCustomersPoliciesDto();

  active = false;
  saving = false;

  constructor(
    injector: Injector,
    private _appCustomersPoliciesServiceProxy: AppCustomersPoliciesServiceProxy
  ) {
    super(injector);
  }

  initDot(): void {
    this.customersPolicie = new CreateOrEditAppCustomersPoliciesDto();

    this.customersPolicie.applyDry = false;
    this.customersPolicie.applyReefer = false;
  }

  show(appCustomersId?: number): void {
    this.initDot();
    if (!appCustomersId) {
      this.appCustomers.customersPolicieList = [];

    }

    this.loadCustomerPolicy()

    this._appCustomersPoliciesServiceProxy.getAllAppPoliciesForTableDropdown().subscribe(result => {
      this.allAppPoliciess = result;
    });
  }
  addCustomerPolicy(): void {
    this.customersPolicie.policyName = this.allAppPoliciess.find(e => e.id == this.customersPolicie.policyId).displayName;

    switch (this.customersPolicie.operationType) {
      case "NATIONAL":
        {
          this.customersPolicie.operationTypeDisplayText = "Nacional";
          break;
        }
      case "INTERNATIONAL":
        {
          this.customersPolicie.operationTypeDisplayText = "Internacional";
          break;
        }
      case "NATIONAL_INTERNATIONAL":
        {
          this.customersPolicie.operationTypeDisplayText = "Nacional/Internacional";
          break;
        }
      default:
        {
          this.customersPolicie.operationTypeDisplayText = "";
          break;
        }
    }
    this.appCustomers.customersPolicieList.push(this.customersPolicie);
    this.initDot();
    this.loadCustomerPolicy();
  }
  loadCustomerPolicy(): void {
    this.primengTableHelper.records = this.appCustomers.customersPolicieList;
    this.primengTableHelper.totalRecordsCount = this.appCustomers.customersPolicieList.length;
  }
  wizerdContinue(): void {
    this.saveContinueCallBack.emit(null);
  }
  close(): void {
    this.active = false;
    this.closeFormCallBack.emit(null);
  }

  returnPreviousTab(): void {
    this.active = false;
    this.previousTabCallBack.emit(0);
  }
  deleteCustomerPolicy(record: CreateOrEditAppCustomersPoliciesDto, rowIndex: any): void {
    this.message.confirm(
      '',
      this.l('AreYouSure'),
      (isConfirmed) => {
        if (isConfirmed) {
          if (record.id) {
            this._appCustomersPoliciesServiceProxy.delete(record.id)
              .subscribe(() => {
                let delRow = this.appCustomers.customersPolicieList.indexOf(rowIndex);
                this.appCustomers.customersPolicieList.splice(delRow, 1);
                this.loadCustomerPolicy();

                this.notify.success(this.l('SuccessfullyDeleted'));
              });

          } else {
            let delRow = this.appCustomers.customersPolicieList.indexOf(rowIndex);
            this.appCustomers.customersPolicieList.splice(delRow, 1);
            this.loadCustomerPolicy();
            this.notify.success(this.l('SuccessfullyDeleted'));
          }


        }
      }
    );
  }

  ngOnInit(): void {
    // this.appCustomers.customersPolicie=new CreateOrEditAppCustomersPoliciesDto();
    // this.appCustomers.customersPolicie.operationType="";
    // this.appCustomers.customersPolicie.policiesId=null;
    // this.appCustomers.customersPolicie.customersId=this.appCustomers.id;
    // this.appCustomers.customersPolicieList=[];
  };
}