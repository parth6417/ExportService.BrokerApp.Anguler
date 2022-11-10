import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { tabCustomerModelComponent } from './customers/appCustomers/tabCustomer.component'
import { tabCustomerPriceModelComponent } from './customers/appCustomers/tabCustomerPrice.component'
import { tabCustomerPolicyModelComponent } from './customers/appCustomers/tabCustomerPolicy.component'


import { AppCommonModule } from '@app/shared/common/app-common.module';
import { AppInvoicesComponent } from './invoices/appInvoices/appInvoices.component';
import { ViewAppInvoicesModalComponent } from './invoices/appInvoices/view-appInvoices-modal.component';
import { CreateOrEditAppInvoicesModalComponent } from './invoices/appInvoices/create-or-edit-appInvoices-modal.component';
import { AppInvoicesAppCustomersLookupTableModalComponent } from './invoices/appInvoices/appInvoices-appCustomers-lookup-table-modal.component';

import { AppOperationsComponent } from './operations/appOperations/appOperations.component';
// import { ViewAppOperationsModalComponent } from './operations/appOperations/view-appOperations-modal.component';
import { CreateOrEditAppOperationsModalComponent } from './operations/appOperations/create-or-edit-appOperations-modal.component';
import { AppOperationsAppCustomersLookupTableModalComponent } from './operations/appOperations/appOperations-appCustomers-lookup-table-modal.component';

import { AppExchangeRatesComponent } from './exchangeRates/appExchangeRates/appExchangeRates.component';
import { ViewAppExchangeRatesModalComponent } from './exchangeRates/appExchangeRates/view-appExchangeRates-modal.component';
import { CreateOrEditAppExchangeRatesModalComponent } from './exchangeRates/appExchangeRates/create-or-edit-appExchangeRates-modal.component';

import { AppCustomersComponent } from './customers/appCustomers/appCustomers.component';
import { ViewAppCustomersModalComponent } from './customers/appCustomers/view-appCustomers-modal.component';
import { CreateOrEditAppCustomersModalComponent } from './customers/appCustomers/create-or-edit-appCustomers-modal.component';

import { AppPoliciesComponent } from './policies/appPolicies/appPolicies.component';
import { ViewAppPoliciesModalComponent } from './policies/appPolicies/view-appPolicies-modal.component';
import { CreateOrEditAppPoliciesModalComponent } from './policies/appPolicies/create-or-edit-appPolicies-modal.component';

import { AppProvidersComponent } from './providers/appProviders/appProviders.component';
import { ViewAppProvidersModalComponent } from './providers/appProviders/view-appProviders-modal.component';
import { CreateOrEditAppProvidersModalComponent } from './providers/appProviders/create-or-edit-appProviders-modal.component';



import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask';


import { TableModule } from 'primeng/table';

import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';

import { BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { tabInsuranceCommissionModelComponent } from './customers/appCustomers/tabInsuranceCommission.component';
import { tabSecurityCommissionModelComponent } from './customers/appCustomers/tabSecurityCommission.component';

import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MomentModule } from 'ngx-moment';
import { AppCustomersPolicyLookupTableModelComponent } from './operations/appOperations/appCustomers-Policy-lookup-table-modal.component';
import { AppTransportsLookupTableModalComponent } from './operations/appOperations/appTransports-lookup-table-modal.component';
import { FileUploadAppOperationsModalComponent } from './operations/appOperations/appOperations-FileUpload-modal.component';
import { FileUploadModule } from 'ng2-file-upload';
import { GenerateCertificateAppOperationsModalComponent } from './operations/appOperations/appOperations-GenerateCertificate-modal.component';
import { AppProvidersLogoUploadModalComponent } from './providers/appProviders/appProviders-LogoUpload-modal.component';
import { AppProvidersCertificateTemplateModalComponent } from './providers/appProviders/appProviders-CertificateTemplate-modal.component';
import { QuillModule } from 'ngx-quill'
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

import { FileUploadModule as PrimeNgFileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { AppInvoicesManualVoucherModalComponent } from './invoices/appInvoices/appInvoices-manualvoucher-modal.component';
import { AuditAppOperationsModalComponent } from './operations/appOperations/appOperations-Audit-modal.component';
@NgModule({
    imports: [

        FileUploadModule,
        AutoCompleteModule,
        PaginatorModule,
        PanelModule,
        EditorModule,
        InputMaskModule,
        TableModule,
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
        MomentModule,
        PrimeNgFileUploadModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        NgxMaskModule.forRoot(),
        QuillModule.forRoot(),


    ],
    declarations: [
        AppInvoicesManualVoucherModalComponent,
        AppInvoicesComponent,
        CreateOrEditAppInvoicesModalComponent,
        ViewAppInvoicesModalComponent,
        AppInvoicesAppCustomersLookupTableModalComponent,

        GenerateCertificateAppOperationsModalComponent,
        AppOperationsComponent,
        FileUploadAppOperationsModalComponent,
        //ViewAppOperationsModalComponent,
        AppTransportsLookupTableModalComponent,
        AppCustomersPolicyLookupTableModelComponent,
        CreateOrEditAppOperationsModalComponent,
        AppOperationsAppCustomersLookupTableModalComponent,
        AppExchangeRatesComponent,

        ViewAppExchangeRatesModalComponent,
        CreateOrEditAppExchangeRatesModalComponent,

        tabCustomerModelComponent,
        tabCustomerPriceModelComponent,
        tabCustomerPolicyModelComponent,
        tabInsuranceCommissionModelComponent,
        tabSecurityCommissionModelComponent,

        AppCustomersComponent,
        ViewAppCustomersModalComponent, CreateOrEditAppCustomersModalComponent,

        AppPoliciesComponent,
        ViewAppPoliciesModalComponent, CreateOrEditAppPoliciesModalComponent,

        AppProvidersComponent,
        AppProvidersLogoUploadModalComponent,
        AppProvidersCertificateTemplateModalComponent,
        ViewAppProvidersModalComponent, CreateOrEditAppProvidersModalComponent,
        DashboardComponent,
        AuditAppOperationsModalComponent
    ],
    providers: [
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ]
})
export class MainModule { }
