import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppInsuranceCommissionServiceProxy, AppInsuranceCommissionUserLookupTableDto, AppSecurityCommissionServiceProxy, CreateOrEditAppCustomersDto, CreateOrEditAppCustomersPoliciesDto, CreateOrEditAppInsuranceCommissionDto, CreateOrEditAppSecurityCommissionDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tabSecurityCommissionModel',
  templateUrl: './tabSecurityCommission.component.html'
})
export class tabSecurityCommissionModelComponent extends AppComponentBase {

  @Input() appClientMainForm: Form;

  @Input() appCustomers: CreateOrEditAppCustomersDto = new CreateOrEditAppCustomersDto();
  @Input() modal: ModalDirective;

  @Output() saveContinueCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeFormCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() previousTabCallBack: EventEmitter<any> = new EventEmitter<any>();

  allUsers: AppInsuranceCommissionUserLookupTableDto[];

  active = false;
  saving = false;

  constructor(
    injector: Injector,
    private _appSecurityCommissionServiceProxy: AppSecurityCommissionServiceProxy
  ) {
    super(injector);
  }

  securityCommission = new CreateOrEditAppSecurityCommissionDto();

  initDot(): void {
    this.securityCommission = new CreateOrEditAppSecurityCommissionDto();

  }
  show(appCustomersId?: number): void {
    this.initDot();
    if (!appCustomersId) {
      this.appCustomers.securityCommissionList = [];
    }
    this.loadSequrityCommission();

    this._appSecurityCommissionServiceProxy.getAllUserForTableDropdown().subscribe(result => {
      this.allUsers = result;
    });
  }

  addSequrityCommissionValidation(): boolean {
    var valid = true;
    if (this.securityCommission.userId == undefined || this.securityCommission.commissionPercentage == undefined) {
      valid = false;
    }
    return valid;

  }

  appSecurityCommissionFormValidation(): boolean {
    var valid = true;
    if (this.appCustomers.securityCalculationBase == undefined || this.appCustomers.securityToDistributeTotalPercentage == undefined) {
      valid = false;
    }

    return valid;
  }


  addSequrityCommission(): void {
    this.securityCommission.userName = this.allUsers.find(e => e.id == this.securityCommission.userId).displayName;
    this.appCustomers.securityCommissionList.push(this.securityCommission);
    this.initDot();

    this.loadSequrityCommission();
  }
  deleteSecurityCommission(record: CreateOrEditAppSecurityCommissionDto, rowIndex: any): void {
    this.message.confirm(
      '',
      this.l('AreYouSure'),
      (isConfirmed) => {
        if (isConfirmed) {
          if (record.id) {
            this._appSecurityCommissionServiceProxy.delete(record.id)
              .subscribe(() => {
                let delRow = this.appCustomers.securityCommissionList.indexOf(rowIndex);
                this.appCustomers.securityCommissionList.splice(delRow, 1);
                this.loadSequrityCommission();

                this.notify.success(this.l('SuccessfullyDeleted'));
              });

          } else {
            let delRow = this.appCustomers.securityCommissionList.indexOf(rowIndex);
            this.appCustomers.securityCommissionList.splice(delRow, 1);
            this.loadSequrityCommission();
            this.notify.success(this.l('SuccessfullyDeleted'));
          }


        }
      }
    );
  }

  loadSequrityCommission(): void {
    this.primengTableHelper.records = this.appCustomers.securityCommissionList;
    this.primengTableHelper.totalRecordsCount = this.appCustomers.securityCommissionList.length;
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
    console.log('Return From Sequrity Comission')
    this.active = false;
    this.previousTabCallBack.emit(3);
  }

  ngOnInit(): void {
    // this.appCustomers.securityCommission=new CreateOrEditAppSecurityCommissionDto();
    // this.appCustomers.securityCommission.customersId=this.appCustomers.id;
    // this.appCustomers.securityCommission.userId=0;
    // this.appCustomers.securityCommissionList=[];
  };
}