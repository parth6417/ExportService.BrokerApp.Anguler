import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

import {
    AppCustomersServiceProxy,
    CreateOrEditAppCustomersDto,
    CreateOrEditAppCustomersPoliciesDto,
    CreateOrEditAppInsuranceCommissionDto,
    CreateOrEditAppSecurityCommissionDto
    

} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DateTime } from 'luxon';
import { forEach } from 'lodash-es';
import { tabCustomerModelComponent } from './tabCustomer.component';
import { tabCustomerPriceModelComponent } from './tabCustomerPrice.component';
import { tabCustomerPolicyModelComponent } from './tabCustomerPolicy.component';
import { tabInsuranceCommissionModelComponent } from './tabInsuranceCommission.component';
import { tabSecurityCommissionModelComponent } from './tabSecurityCommission.component';
import { TabsetComponent } from 'ngx-bootstrap/tabs';


@Component({
    selector: 'createOrEditAppCustomersModal',
    templateUrl: './create-or-edit-appCustomers-modal.component.html'
})
export class CreateOrEditAppCustomersModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild(tabCustomerModelComponent) tabCustomerModel: tabCustomerModelComponent;
    @ViewChild(tabCustomerPolicyModelComponent) tabCustomerPolicyModel: tabCustomerPolicyModelComponent;
    @ViewChild(tabCustomerPriceModelComponent) tabCustomerPriceModel: tabCustomerPriceModelComponent;
    @ViewChild(tabInsuranceCommissionModelComponent) tabInsuranceCommissionModel: tabInsuranceCommissionModelComponent;
    @ViewChild(tabSecurityCommissionModelComponent) tabSecurityCommissionModel: tabSecurityCommissionModelComponent;

    @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


    active = false;
    saving = false;
    activeTabIndex = 0;


    appCustomers: CreateOrEditAppCustomersDto = new CreateOrEditAppCustomersDto();



    constructor(
        injector: Injector,
        private _appCustomersServiceProxy: AppCustomersServiceProxy
    ) {

        super(injector);

    }

    show(appCustomersId?: number): void {
        this.activeTabIndex=0;
        this.staticTabs.tabs[ this.activeTabIndex].disabled = false;
        this.staticTabs.tabs[ this.activeTabIndex].active = true;

        
        if (!appCustomersId) {
            console.log("Form Load")
            this.appCustomers = new CreateOrEditAppCustomersDto();
            this.appCustomers.id = appCustomersId;
           
            this.appCustomers.customersPolicieList=[];
            this.appCustomers.insuranceCommissionList=[];
            this.appCustomers.securityCommissionList=[];

            this.initComponentData(appCustomersId);
            

            this.active = true;
            this.modal.show();
        } else {
            this._appCustomersServiceProxy.getAppCustomersForEdit(appCustomersId).subscribe(result => {
                this.appCustomers = result.appCustomers;
                this.initComponentData(result.appCustomers.id);
                this.active = true;
                this.modal.show();
            });
        }

    }

    initComponentData(appCustomersId?: number):void{
        
       

        this.tabCustomerModel.appCustomers = this.appCustomers;
        this.tabCustomerPolicyModel.appCustomers = this.appCustomers;
        this.tabCustomerPriceModel.appCustomers = this.appCustomers;
        this.tabInsuranceCommissionModel.appCustomers = this.appCustomers;
        this.tabSecurityCommissionModel.appCustomers = this.appCustomers;

        this.tabCustomerPolicyModel.show(appCustomersId);
        this.tabInsuranceCommissionModel.show(appCustomersId);
        this.tabSecurityCommissionModel.show(appCustomersId);
    }




    selectTabIndex(event): void {
        console.log("Tab Page Change : " + event)
        this.activeTabIndex = event;
        this.staticTabs.tabs[event + 1].disabled = false;
        this.staticTabs.tabs[event].disabled = false;
        this.staticTabs.tabs[event].active = true;

    }


    CustomerModelNext(): void {
        this.activeTabIndex = 1;
        this.staticTabs.tabs[this.activeTabIndex].disabled = false;
        this.staticTabs.tabs[this.activeTabIndex].active = true;
       // this.appCustomers = event;
        console.log(this.appCustomers);
    }
    CustomerPolicyModelNext(): void {
        this.activeTabIndex = 2;
        this.staticTabs.tabs[this.activeTabIndex].disabled = false;
        this.staticTabs.tabs[this.activeTabIndex].active = true;
       // this.appCustomers.customersPolicieList = event;
        console.log(this.appCustomers);
    }
    PriceModelNext(): void {
        this.activeTabIndex = 3;
        this.staticTabs.tabs[this.activeTabIndex].disabled = false;
        this.staticTabs.tabs[this.activeTabIndex].active = true;
        
      
        console.log(this.appCustomers);
    }
    InsuranceCommissionModelNext(): void {
        this.activeTabIndex = 4;
        this.staticTabs.tabs[this.activeTabIndex].disabled = false;
        this.staticTabs.tabs[this.activeTabIndex].active = true;
        console.log(event);
    }

    
    FainalySaveAll(): void {
        this.saving = true;

        // this.appCustomers.customersPolicie=new CreateOrEditAppCustomersPoliciesDto();

        // this.appCustomers.insuranceCommission =new CreateOrEditAppInsuranceCommissionDto();

        // this.appCustomers.securityCommission =new CreateOrEditAppSecurityCommissionDto();

        this._appCustomersServiceProxy.createOrEdit(this.appCustomers)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });

    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
    ngOnInit(): void {
        this.appCustomers = new CreateOrEditAppCustomersDto();
    };
}
