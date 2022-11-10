import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppCustomersPoliciesAppPoliciesLookupTableDto, AppInsuranceCommissionServiceProxy, AppInsuranceCommissionUserLookupTableDto, CreateOrEditAppCustomersDto, CreateOrEditAppCustomersPoliciesDto, CreateOrEditAppInsuranceCommissionDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tabInsuranceCommissionModel',
  templateUrl: './tabInsuranceCommission.component.html'
})
export class tabInsuranceCommissionModelComponent extends AppComponentBase {

  @Input() appCustomers: CreateOrEditAppCustomersDto = new CreateOrEditAppCustomersDto();
  @Input() modal: ModalDirective;

  @Output() saveContinueCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeFormCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() previousTabCallBack: EventEmitter<any> = new EventEmitter<any>();



  allUsers: AppInsuranceCommissionUserLookupTableDto[];


  insuranceCommission: CreateOrEditAppInsuranceCommissionDto = new CreateOrEditAppInsuranceCommissionDto();


  active = false;
  saving = false;

  constructor(
    injector: Injector,
    private _appInsuranceCommissionServiceProxy: AppInsuranceCommissionServiceProxy
  ) {
    super(injector);
  }

  initDot(): void {
    this.insuranceCommission = new CreateOrEditAppInsuranceCommissionDto();
    this.insuranceCommission.userId = 0;

  }

  show(appCustomersId?: number): void {
    this.initDot();
    if (!appCustomersId) {
      this.appCustomers.insuranceCommissionList = [];
    }
    this.loadInsuranceCommission();


    this._appInsuranceCommissionServiceProxy.getAllUserForTableDropdown().subscribe(result => {
      this.allUsers = result;
    });
  }
  addInsuranceCommissionValidation(): boolean {
    var valid = true;
    if (this.insuranceCommission.userId == 0 || this.insuranceCommission.commissionPercentage == undefined) {
      valid = false;
    }
    return valid;

  }

  appInsuranceCommissionFormValid(): boolean {
    var valid = true;
    if (this.appCustomers.insuranceCalculationBase == undefined || this.appCustomers.insuranceToDistributeTotalPercentage == undefined) {
      valid = false;
    }

    return valid;
  }

  addInsuranceCommission(): void {

    this.insuranceCommission.userName = this.allUsers.find(e => e.id == this.insuranceCommission.userId).displayName;
    this.appCustomers.insuranceCommissionList.push(this.insuranceCommission);
    this.initDot();
    this.loadInsuranceCommission();
  }

  deleteInsuranceCommission(record: CreateOrEditAppInsuranceCommissionDto, rowIndex: any): void {
    this.message.confirm(
      '',
      this.l('AreYouSure'),
      (isConfirmed) => {
        if (isConfirmed) {
          if (record.id) {
            this._appInsuranceCommissionServiceProxy.delete(record.id)
              .subscribe(() => {
                let delRow = this.appCustomers.insuranceCommissionList.indexOf(rowIndex);
                this.appCustomers.insuranceCommissionList.splice(delRow, 1);
                this.loadInsuranceCommission();

                this.notify.success(this.l('SuccessfullyDeleted'));
              });

          } else {
            let delRow = this.appCustomers.insuranceCommissionList.indexOf(rowIndex);
            this.appCustomers.insuranceCommissionList.splice(delRow, 1);
            this.loadInsuranceCommission();
            this.notify.success(this.l('SuccessfullyDeleted'));
          }


        }
      }
    );
  }

  loadInsuranceCommission(): void {
    this.primengTableHelper.records = this.appCustomers.insuranceCommissionList;
    this.primengTableHelper.totalRecordsCount = this.appCustomers.insuranceCommissionList.length;
  }
  wizerdContinue(): void {
    console.log("Price Button Fire")
    this.saveContinueCallBack.emit(null);
  }
  close(): void {
    this.active = false;
    this.closeFormCallBack.emit(null);
  }
  returnPreviousTab(): void {
    this.active = false;
    this.previousTabCallBack.emit(2);
  }

  ngOnInit(): void {
    // this.appCustomers.insuranceCommission=new CreateOrEditAppInsuranceCommissionDto();
    // this.appCustomers.insuranceCommission.appCustomersId=this.appCustomers.id;
    // this.appCustomers.insuranceCommission.userId=0;
    // this.appCustomers.insuranceCommissionList=[];
  };
}