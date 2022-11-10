import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import {
    AppOperationsServiceProxy, CreateOrEditAppOperationsDto, AppOperationsAppPortsLookupTableDto
    , AppOperationsAppCommoditesTypesLookupTableDto
    , AppOperationsAppLocationsLookupTableDto
    , AppOperationsAppZonesLookupTableDto
    , ClientPolicyListForTableDropdownDto,
    AppOperationsAppProvidersLookupTableDto,
    AppOperationsMppReasonsDto,
    AppReasonsForCheckBoxListDto,
    EntityState,
    AppOperationsCustodyReasonsDto,
    AppCustomersServiceProxy,
    CreateOrEditAppCustomersDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { AppOperationsAppCustomersLookupTableModalComponent } from './appOperations-appCustomers-lookup-table-modal.component';
import { DateTime } from 'luxon';
import { ScriptLoaderService } from '@shared/utils/script-loader.service';
import { NgForm } from '@angular/forms';
import { AppCustomersPolicyLookupTableModelComponent } from './appCustomers-Policy-lookup-table-modal.component';
import { AppTransportsLookupTableModalComponent } from './appTransports-lookup-table-modal.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'createOrEditAppOperationsModal',
    templateUrl: './create-or-edit-appOperations-modal.component.html'
})
export class CreateOrEditAppOperationsModalComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('AppOperations_OperationDate', { static: true }) AppOperations_OperationDate: ElementRef;
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('operationForm') public operationForm: NgForm;
    @ViewChild('appOperationsAppCustomersLookupTableModal', { static: true }) appOperationsAppCustomersLookupTableModal: AppOperationsAppCustomersLookupTableModalComponent;
    @ViewChild('appOperationsAppCustomersLookupTableModal2', { static: true }) appOperationsAppCustomersLookupTableModal2: AppOperationsAppCustomersLookupTableModalComponent;
    @ViewChild('appCustomersPolicyLookupTableModel', { static: true }) appCustomersPolicyLookupTableModel: AppCustomersPolicyLookupTableModelComponent;
    @ViewChild('appTransportsLookupTableModel', { static: true }) appTransportsLookupTableModel: AppTransportsLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    appOperations: CreateOrEditAppOperationsDto = new CreateOrEditAppOperationsDto();
    SelectedClient: CreateOrEditAppCustomersDto = new CreateOrEditAppCustomersDto();

    BillingClientBusinessName = '';
    ClientBusinessName = '';
    appPoliciesPolicyName = '';
    appTransportsName = '';

    allAppPortss: AppOperationsAppPortsLookupTableDto[];
    allAppCommoditesTypess: AppOperationsAppCommoditesTypesLookupTableDto[];
    allAppLocationss: AppOperationsAppLocationsLookupTableDto[];
    allAppZoness: AppOperationsAppZonesLookupTableDto[];
    allMppProviderList: AppOperationsAppProvidersLookupTableDto[];
    allCustodyProviderList: AppOperationsAppProvidersLookupTableDto[];
    allAuditoriaProviderList: AppOperationsAppProvidersLookupTableDto[];
    allOperationsMppReasons: AppReasonsForCheckBoxListDto[];
    allOperationsCustodiaReasons: AppReasonsForCheckBoxListDto[];

    _wizardEl: any;
    _formEl: any;
    _wizardObj: any;

    NumberOption1: any = {
        decimalPlaces: 5,
        minimumValue: 0,
        modifyValueOnWheel: false
    }


    NumberOption2: any = {
        decimalPlaces: 2,
        minimumValue: 0,
        modifyValueOnWheel: false
    }
    constructor(
        injector: Injector,
        private _dateTimeService: DateTimeService,
        private _appOperationsServiceProxy: AppOperationsServiceProxy,
        private _appCustomersServiceProxy: AppCustomersServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        new ScriptLoaderService().load('assets/metronic/common/js/components/wizard.js').then(() => {
            this._wizardEl = KTUtil.getById('kt_wizard_v3');
            this._formEl = KTUtil.getById('kt_form');
            this._initWizard();
        });
    }
    ClientBusinessNameValid = true;
    BillingClientBusinessNameValid = true;
    PoliciesPolicyNameValid = true;
    TransportsNameValid = true;

    ClearValidation(): void {

        this.operationForm.controls.OperationNumber.markAsUntouched();

        this.operationForm.controls.AppOperations_OperationState.markAsUntouched();

        this.ClientBusinessNameValid = true;

        this.BillingClientBusinessNameValid = true;

        this.operationForm.controls.AppOperations_OperationType.markAsUntouched();

        this.operationForm.controls.AppOperations_ContainerType.markAsUntouched();

        this.operationForm.controls.AppOperations_CurrencyType.markAsUntouched();

        this.operationForm.controls.appOperations_originLocationId.markAsUntouched();

        this.operationForm.controls.appOperations_destinyLocationId.markAsUntouched();

        this.operationForm.controls.appOperations_zoneId.markAsUntouched();
        /*
        // Tab2
        this.operationForm.controls.AppOperations_RateOfSale.markAsUntouched();
        //this.operationForm.controls.AppOperations_CostPercentage.markAsUntouched();
        this.PoliciesPolicyNameValid = true;

        // Tab3

        this.operationForm.controls.AppOperations_TransportType1.markAsUntouched();
        this.operationForm.controls.AppOperations_Tractor.markAsUntouched();
        this.operationForm.controls.AppOperations_Semi.markAsUntouched();
        this.operationForm.controls.AppOperations_DriverDni.markAsUntouched();
        */


    }


    validateOperationTab1(): Boolean {
        let valid = true;
        // const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');

        if (this.operationForm.controls.OperationNumber.invalid) {
            this.operationForm.controls.OperationNumber.markAsTouched();
            valid = false;
        }
        if (this.operationForm.controls.AppOperations_OperationState.invalid) {
            this.operationForm.controls.AppOperations_OperationState.markAsTouched();
            valid = false;
        }
        if (this.ClientBusinessName) {
            this.ClientBusinessNameValid = true;

        } else {
            this.ClientBusinessNameValid = false;
            valid = false;
        }
        if (this.BillingClientBusinessName) {
            this.BillingClientBusinessNameValid = true;
        } else {
            this.BillingClientBusinessNameValid = false;
            valid = false;
        }
        if (this.operationForm.controls.AppOperations_OperationType.invalid) {
            this.operationForm.controls.AppOperations_OperationType.markAsTouched();
            valid = false;
        }
        if (this.operationForm.controls.AppOperations_ContainerType.invalid) {
            this.operationForm.controls.AppOperations_ContainerType.markAsTouched();
            valid = false;
        }


        if (this.operationForm.controls.AppOperations_CurrencyType.invalid) {
            this.operationForm.controls.AppOperations_CurrencyType.markAsTouched();
            valid = false;
        }
        if (this.operationForm.controls.appOperations_originLocationId.invalid) {
            this.operationForm.controls.appOperations_originLocationId.markAsTouched();
            valid = false;
        }
        if (this.operationForm.controls.appOperations_destinyLocationId.invalid) {
            this.operationForm.controls.appOperations_destinyLocationId.markAsTouched();
            valid = false;
        }

        if (this.operationForm.controls.appOperations_zoneId.invalid) {
            this.operationForm.controls.appOperations_zoneId.markAsTouched();
            valid = false;
        }

        // if (invalidControl) {
        //     invalidControl.focus();
        //   }
        return valid;
    }

    validateOperationTab2(): Boolean {
        let valid = true;

        if (this.operationForm.controls.AppOperations_RateOfSale.invalid) {
            this.operationForm.controls.AppOperations_RateOfSale.markAsTouched();
            valid = false;
        }
        //if (this.operationForm.controls.AppOperations_CostPercentage.invalid) {
        //    this.operationForm.controls.AppOperations_CostPercentage.markAsTouched();
        //    valid = false;
        //}
        if (this.appPoliciesPolicyName) {
            this.PoliciesPolicyNameValid = true;
        } else {
            this.PoliciesPolicyNameValid = false;
            valid = false;
        }

        if (this.operationForm.controls.AppOperations_BillAmountARS.invalid) {
            this.operationForm.controls.AppOperations_BillAmountARS.markAsTouched();
            valid = false;
        }

        if (this.operationForm.controls.AppOperations_BillAmountUSD.invalid) {
            this.operationForm.controls.AppOperations_BillAmountUSD.markAsTouched();
            valid = false;
        }


        return valid;
    }

    validateOperationTab3(): Boolean {
        let valid = true;


        if (this.appTransportsName) {
            this.TransportsNameValid = true;
        } else {
            this.TransportsNameValid = false;
            valid = false;
        }

        if (this.operationForm.controls.AppOperations_Tractor.invalid) {
            this.operationForm.controls.AppOperations_Tractor.markAsTouched();
            valid = false;
        }
        if (this.operationForm.controls.AppOperations_Semi.invalid) {
            this.operationForm.controls.AppOperations_Semi.markAsTouched();
            valid = false;
        }
        if (this.operationForm.controls.AppOperations_DriverDni.invalid) {
            this.operationForm.controls.AppOperations_DriverDni.markAsTouched();
            valid = false;
        }


        // MPP
        // MPP + Custodia
        // Custodia
        // Custodia + Auditoría
        // Auditoría



        return valid;
    }

    validateSecurityServicesSelection(): Boolean {


        let valid = false;
        if (this.appOperations.mppService === false && this.appOperations.custodyService === false && this.appOperations.auditService === false) {
            valid = false;
        }
        else if (this.appOperations.mppService === true && this.appOperations.custodyService === true && this.appOperations.auditService === true) {
            valid = false;
        }

        else if ((this.appOperations.mppService === true || this.appOperations.custodyService === true) && this.appOperations.auditService === false) {
            valid = true;
        }
        else if (this.appOperations.mppService === false && (this.appOperations.custodyService === true || this.appOperations.auditService === true)) {
            valid = true;
        }

        return valid;

    }

    MppResoneSelected = false
    CustodiaResoneSelected = false



    validateSecurityServicesReasonSelection(): boolean {
        let valid: boolean = true;
        if (this.appOperations.mppService === true) {
            let selectedMppResoneList: AppReasonsForCheckBoxListDto[] = this.allOperationsMppReasons.filter((value, index) => {
                return value.isSelected
            });


            if (selectedMppResoneList.length == 0) {
                valid = false;
                this.MppResoneSelected = true
            } else {
                this.MppResoneSelected = false;
            }
        }
        else {
            this.MppResoneSelected = false;
        }

        if (this.appOperations.custodyService === true) {
            let selectedMppResoneList: AppReasonsForCheckBoxListDto[] = this.allOperationsCustodiaReasons.filter((value, index) => {
                return value.isSelected
            });
            if (selectedMppResoneList.length == 0) {
                valid = false;
                this.CustodiaResoneSelected = true
            }
            else {
                this.MppResoneSelected = false;
            }
        } else {
            this.MppResoneSelected = false;
        }

        return valid;

    }
    _initWizard(): void {
        // Initialize form wizard
        this._wizardObj = new KTWizard(this._wizardEl, {
            startStep: 1, // initial active step number
            clickableSteps: true,  // allow step clicking
        });

        this._wizardObj.on('change', wizard => {
            if (wizard.getStep() > wizard.getNewStep()) {
                return; // Skip if stepped back
            }
            switch (wizard.getStep()) {
                case 1: {
                    if (this.validateOperationTab1()) {
                        console.log("CALL BACK")
                        this.getClientRateOfSales();
                    } else {
                        wizard.stop();
                        this.notify.error(this.l('RequiredField', ""));
                    }
                    KTUtil.scrollTop();
                    break;
                }
                case 2: {

                    if (this.appOperations.insuranceService === true && this.appOperations.securityService === false) {
                        if (!this.validateOperationTab2()) {
                            wizard.stop();
                            this.notify.error(this.l('RequiredField', ""));
                        }
                    }
                    if (this.appOperations.insuranceService === false && this.appOperations.securityService === true) {
                        if (this.validateOperationTab3()) {
                            if (this.validateSecurityServicesSelection()) {
                                if (this.validateSecurityServicesReasonSelection()) {
                                    wizard.goTo(4);
                                }
                                else {
                                    wizard.stop();
                                    this.notify.error(this.l('RequiredField', "Debe seleccionar al menos  una opcion"));
                                }
                            }
                            else {
                                wizard.stop();
                                this.notify.error(this.l('RequiredField', "Security Services Selection"));
                            }
                        }
                        else {
                            wizard.stop();
                            this.notify.error(this.l('RequiredField', ""));
                        }
                    }
                    KTUtil.scrollTop();
                    break;
                }
                default: break;
            }
        });

        this._wizardObj.on('changed', wizard => {
            KTUtil.scrollTop();
            this.TabChangeRecalculate()
        });

        this._wizardObj.on('submit', wizard => {
            this.save();
        });

    }

    getClientRateOfSales(): void {
        this._appOperationsServiceProxy.getClientSalesRate(
            this.appOperations.customerId,
            this.appOperations.operationType,
            this.appOperations.containerType
        ).subscribe(data => {
            if (this.appOperations.id == undefined) {
                this.appOperations.rateOfSale = data.saleRatePercentage;
            }
            this.TabChangeRecalculate();
        })
    }

    functionAdd: boolean = false;
    functionEdit: boolean = false;
    functionDuplicate: boolean = false;
    functionWithInsurance: boolean = true; //Default
    functionWithSequrity: boolean = false;

    show(appOperationsId?: number, IsDuplicateOperation: boolean = false): void {
        this.active = false;
        this._wizardObj.goTo(1);
        this.functionAdd = false;
        this.functionEdit = false;
        this.functionDuplicate = false;

        if (!appOperationsId) {
            this.functionAdd = true;
            this.appOperations = new CreateOrEditAppOperationsDto();
            this.appOperations.id = appOperationsId;
            this.appOperations.operationDate = DateTime.fromJSDate(moment().startOf('day').toDate());
            this.ClientBusinessName = '';
            this.BillingClientBusinessName = '';
            this.appPoliciesPolicyName = '';
            this.appTransportsName = '';
            this.appOperations.insuranceService = this.functionWithInsurance;
            this.appOperations.securityService = this.functionWithSequrity;
            this.appOperations.appOperationsMppReasons = [];
            this.appOperations.appOperationsCustodyReasons = [];
            this.appOperations.costPercentage = 0;
            this.appOperations.rateOfSale = 0;
            this.appOperations.billAmountARS = 0;
            this.appOperations.freightAmountARS = 0;
            this.appOperations.dutiesAndChargesARS = 0;
            this.appOperations.imaginaryBenefitARS = 0;
            this.appOperations.billAmountUSD = 0;
            this.appOperations.freightAmountUSD = 0;
            this.appOperations.dutiesAndChargesUSD = 0;
            this.appOperations.imaginaryBenefitUSD = 0;
            this.appOperations.mppSubtotal_price = 0;
            this.appOperations.custodySubtotal = 0;
            this.appOperations.auditSubtotal = 0;

            this._appOperationsServiceProxy.getAllReasonsForDropdown("MPP").subscribe(result => {
                this.allOperationsMppReasons = result;
            });
            this._appOperationsServiceProxy.getAllReasonsForDropdown("Custodia").subscribe(result => {
                this.allOperationsCustodiaReasons = result;
            });

            this.active = true;
            this.getExchangeRate();
            this.modal.show();

        } else {
            this.functionEdit = true;
            this.appOperations.appOperationsMppReasons = [];
            this.appOperations.appOperationsCustodyReasons = [];
            this._appOperationsServiceProxy.getAppOperationsForEdit(appOperationsId).subscribe(result => {
                this.appOperations = result.appOperations;

                this.appOperations.insuranceService = this.functionWithInsurance;
                this.appOperations.securityService = this.functionWithSequrity;
                this.BillingClientBusinessName = result.billingClientBusinessName;
                this.ClientBusinessName = result.clientBusinessName;
                this.appPoliciesPolicyName = result.appPoliciesPolicyName;
                this.appTransportsName = result.appTransportsName;
                this.appOperationsAppCustomersLookupTableModal2.MppPrice = result.mppPrice;
                this.appOperationsAppCustomersLookupTableModal2.BasicModule = result.basicModule;
                this.appOperationsAppCustomersLookupTableModal2.PricePerExtraHour = result.pricePerExtraHour;
                this.appOperationsAppCustomersLookupTableModal2.PricePerKm = result.pricePerKm;

                this._appOperationsServiceProxy.getAllReasonsForDropdown("MPP").subscribe(result => {
                    this.allOperationsMppReasons = result;
                    this.updateMppReasonSelection();
                });

                this._appOperationsServiceProxy.getAllReasonsForDropdown("Custodia").subscribe(result => {
                    this.allOperationsCustodiaReasons = result;
                    this.updateCustodyReasonSelection();
                });

                this.GetClientCommissionsDetails();

                this.active = true;

                if (IsDuplicateOperation) {
                    this.functionDuplicate = true;
                    this.functionEdit = false;
                    this.appOperations.operationDate =  DateTime.fromJSDate(new Date());
                    this.processDuplicate();
                    //this.getExchangeRate();
                    this.TabChangeRecalculate();
                }

                this.modal.show();
            });
        }

        //#region Load Data For Dropdown
        this._appOperationsServiceProxy.getAllAppPortsForTableDropdown().subscribe(result => {
            this.allAppPortss = result;
        });
        this._appOperationsServiceProxy.getAllAppCommoditesTypesForTableDropdown().subscribe(result => {
            this.allAppCommoditesTypess = result;
        });
        const locations =this._appOperationsServiceProxy.getAllAppLocationsForTableDropdown();
        const zones = this._appOperationsServiceProxy.getAllAppZonesForTableDropdown();

        forkJoin([locations, zones]).subscribe(result => {
            this.allAppLocationss = result[0];
            this.allAppZoness = result[1];
          });
        // this._appOperationsServiceProxy.getAllAppLocationsForTableDropdown().subscribe(result => {
        //     this.allAppLocationss = result;
        // });


        // this._appOperationsServiceProxy.getAllAppZonesForTableDropdown().subscribe(result => {
        //     this.allAppZoness = result;
        // });

        this._appOperationsServiceProxy.getAllAppProvidersForMppDropdown().subscribe(result => {
            this.allMppProviderList = result;
        });
        this._appOperationsServiceProxy.getAllAppProvidersForCustodyDropdown().subscribe(result => {
            this.allCustodyProviderList = result;
        });

        this._appOperationsServiceProxy.getAllAppProvidersForAuditoriaDropdown().subscribe(result => {
            this.allAuditoriaProviderList = result;
        });

        //#endregion
    }

    processDuplicate(): void {
        this.appOperations.id = undefined;
        this.appOperations.certificateNumber = undefined;
        //this.appOperations.exchangeRate = undefined;
        this.appOperations.appOperationsMppReasons.forEach(e => {
            e.id = undefined;
            e.operationId = undefined;
            e.operationType = EntityState.Added;
        });

        this.appOperations.appOperationsCustodyReasons.forEach(e => {
            e.id = undefined;
            e.operationId = undefined;
            e.operationType = EntityState.Added;
        });
        //UI Fix-MIlestone-15
        //Reset Rate Of Sales
        this.getClientRateOfSales();
    }

    updateMppReasonSelection(): void {

        this.appOperations.appOperationsMppReasons.forEach(f => {
            if (this.allOperationsMppReasons)
                this.allOperationsMppReasons.forEach(e => {
                    if (e.id == f.mppReasonId) {
                        e.isSelected = true;
                    }
                });
        })

    }
    updateCustodyReasonSelection(): void {
        if (this.appOperations.appOperationsCustodyReasons) {
            this.appOperations.appOperationsCustodyReasons.forEach(f => {
                if (this.allOperationsCustodiaReasons)
                    this.allOperationsCustodiaReasons.forEach(e => {
                        if (e.id == f.custodyReasonId) {
                            e.isSelected = true;
                        }
                    });
            })
        }
    }

    populateOperationsMppReasons(): void {
        let TempList: AppOperationsMppReasonsDto[] = this.appOperations.appOperationsMppReasons;
        if (this.appOperations.mppService === true) {

            let selectedMppResoneList: AppReasonsForCheckBoxListDto[] = this.allOperationsMppReasons.filter((value, index) => {
                return value.isSelected
            });


            TempList.forEach(f => {
                let selectedItem = selectedMppResoneList.filter(e => {
                    return f.mppReasonId == e.id;
                });
                if (selectedItem.length == 0) {
                    f.operationType = EntityState.Delete
                }
            });

            selectedMppResoneList.forEach(f => {
                let selectedItem = TempList.filter(e => {
                    return f.id == e.mppReasonId;
                });
                if (selectedItem.length == 0) {
                    let NewItem: AppOperationsMppReasonsDto = new AppOperationsMppReasonsDto();
                    NewItem.mppReasonId = f.id;
                    NewItem.operationId = this.appOperations.id;
                    NewItem.operationType = EntityState.Added;
                    TempList.push(NewItem);
                }
            });


        } else {
            TempList.forEach(e => {
                e.operationType = EntityState.Delete;
            })
        }

        this.appOperations.appOperationsMppReasons = TempList;
    }

    populateOperationsCustodyReasons(): void {
        let TempList: AppOperationsCustodyReasonsDto[] = this.appOperations.appOperationsCustodyReasons;
        if (this.appOperations.custodyService === true) {

            let selectedCustodiaResoneList: AppReasonsForCheckBoxListDto[] = this.allOperationsCustodiaReasons.filter((value, index) => {
                return value.isSelected
            });


            TempList.forEach(f => {
                let selectedItem = selectedCustodiaResoneList.filter(e => {
                    return f.custodyReasonId == e.id;
                });
                if (selectedItem.length == 0) {
                    f.operationType = EntityState.Delete
                }
            });

            selectedCustodiaResoneList.forEach(f => {
                let selectedItem = TempList.filter(e => {
                    return f.id == e.custodyReasonId;
                });
                if (selectedItem.length == 0) {
                    let NewItem: AppOperationsCustodyReasonsDto = new AppOperationsCustodyReasonsDto();
                    NewItem.custodyReasonId = f.id;
                    NewItem.operationId = this.appOperations.id;
                    NewItem.operationType = EntityState.Added;
                    TempList.push(NewItem);
                }
            });
        } else {
            TempList.forEach(e => {
                e.operationType = EntityState.Delete;
            })
        }

        this.appOperations.appOperationsCustodyReasons = TempList;
    }

    CheckValidationBeforFormSubmit(): Boolean {
        let formvalidate: Boolean = true;
        formvalidate = this.validateOperationTab1();

        if (formvalidate === true) {
            if (this.appOperations.insuranceService === true && this.appOperations.securityService === false) {
                formvalidate = this.validateOperationTab2();
            }
            else if (this.appOperations.insuranceService === false && this.appOperations.securityService === true) {
                formvalidate = this.validateOperationTab3();
            }
            else if (this.appOperations.insuranceService === true && this.appOperations.securityService === true) {
                formvalidate = this.validateOperationTab2();
                if (formvalidate === true) {
                    formvalidate = this.validateOperationTab3();
                }
            }
        }

        return formvalidate;
    }

    save(): void {
        this.saving = true;
        let formvalidate: Boolean = true;
        formvalidate = this.CheckValidationBeforFormSubmit();


        if (formvalidate === true) {
            this.populateOperationsMppReasons();
            this.populateOperationsCustodyReasons();

            this._appOperationsServiceProxy.createOrEdit(this.appOperations)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe(() => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.close();
                    this.modalSave.emit(null);
                });
        }
    }

    openSelectBillingClientModal() {
        this.appOperationsAppCustomersLookupTableModal.id = this.appOperations.billingCustomerId;
        this.appOperationsAppCustomersLookupTableModal.displayName = this.BillingClientBusinessName;
        this.appOperationsAppCustomersLookupTableModal.show();
    }

    openSelectClientModal() {
        this.appOperationsAppCustomersLookupTableModal2.id = this.appOperations.customerId;
        this.appOperationsAppCustomersLookupTableModal2.displayName = this.ClientBusinessName;
        this.appOperationsAppCustomersLookupTableModal2.MppPrice = this.appOperations.mppSubtotal_price;
        this.appOperationsAppCustomersLookupTableModal2.BasicModule = this.appOperations.custodySubtotal;
        this.appOperationsAppCustomersLookupTableModal2.show();
    }

    setBillingCustomerIdNull() {
        this.appOperations.billingCustomerId = null;
        this.BillingClientBusinessName = '';
    }
    setCustomerIdNull() {
        this.appOperations.customerId = null;
        this.ClientBusinessName = '';
        this.setClientPolicyIdNull();
    }

    getNewBillingCustomerId() {
        this.appOperations.billingCustomerId = this.appOperationsAppCustomersLookupTableModal.id;
        this.BillingClientBusinessName = this.appOperationsAppCustomersLookupTableModal.displayName;
    }
    getNewCustomerId() {
        this.appOperations.customerId = this.appOperationsAppCustomersLookupTableModal2.id;
        this.ClientBusinessName = this.appOperationsAppCustomersLookupTableModal2.displayName;
        this.appOperations.mppSubtotal_price = this.appOperationsAppCustomersLookupTableModal2.MppPrice;
        this.setClientPolicyIdNull();
        this.GetClientCommissionsDetails();
        this.appOperations.billingCustomerId =  this.appOperationsAppCustomersLookupTableModal2.id;
        this.BillingClientBusinessName = this.appOperationsAppCustomersLookupTableModal2.displayName;
    }

    ClientPolicyList: ClientPolicyListForTableDropdownDto[];

    setClientPolicyIdNull() {
        this.appOperations.policyId = null;
        this.appPoliciesPolicyName = '';
        this.appOperations.rateOfSale = undefined;
        this.appOperations.costPercentage = undefined;
    }

    openSelectClientPoliciesModal() {
        this.appCustomersPolicyLookupTableModel.id = this.appOperations.policyId;
        this.appCustomersPolicyLookupTableModel.displayName = this.appPoliciesPolicyName;
        this.appCustomersPolicyLookupTableModel.customerId = this.appOperations.customerId;
        this.appCustomersPolicyLookupTableModel.operationType = this.appOperations.operationType;
        this.appCustomersPolicyLookupTableModel.containerType = this.appOperations.containerType;
        this.appCustomersPolicyLookupTableModel.CostPercentage = this.appOperations.costPercentage;
        this.appCustomersPolicyLookupTableModel.show();
    }

    getNewClientPolicy(): void {
        this.appOperations.policyId = this.appCustomersPolicyLookupTableModel.id;
        this.appPoliciesPolicyName = this.appCustomersPolicyLookupTableModel.displayName;
        this.appOperations.costPercentage = this.appCustomersPolicyLookupTableModel.CostPercentage;
    }

    openSelectTransportModal() {
        this.appTransportsLookupTableModel.id = this.appOperations.transportId;
        this.appTransportsLookupTableModel.displayName = this.appTransportsName;
        this.appTransportsLookupTableModel.show();
    }

    getTransportId(): void {
        this.appOperations.transportId = this.appTransportsLookupTableModel.id;
        this.appTransportsName = this.appTransportsLookupTableModel.displayName;
    }

    setTransportIdNull() {
        this.appOperations.transportId = null;
        this.appTransportsName = '';
    }

    mppServiceChange(): void {
        this.MppResoneSelected = true;
        if (this.appOperations.mppService === true) {
            this.appOperations.mppSubtotal_price = this.SelectedClient.mppPrice;
        } else {
            this.appOperations.mppSubtotal_price = 0;
            this.appOperations.mppProviderId = undefined;

        }
    }

    CustodiaServiceChange(): void {
        this.CustodiaResoneSelected = true;
        if (this.appOperations.custodyService === true) {
            this.appOperations.kmQuantity = 0;
            this.appOperations.extraHours = 0;
            this.appOperations.tollPrice = 0;
            this.appOperations.custodySubtotal = this.SelectedClient.basicModule;

        } else {
            this.appOperations.custodyProviderId = undefined;

            this.appOperations.custodySubtotal = 0;
            this.appOperations.extraHours = undefined;
            this.appOperations.tollPrice = undefined;
            this.appOperations.extraHours = undefined;

        }
    }
    auditServiceChange(): void {
        if (this.appOperations.auditService === true) {
            this.appOperations.auditSubtotal = this.appOperationsAppCustomersLookupTableModal2.AuditPrice;
        } else {
            this.appOperations.auditProviderId = undefined;
            this.appOperations.auditSubtotal = 0;
        }
    }

    PricePerKmCalculation(): void {
        this.appOperations.pricePerKm = this.appOperations.kmQuantity * this.appOperationsAppCustomersLookupTableModal2.PricePerKm;
        this.calculateCustodySubTotal();
    }
    PricePerExtraHourCalculation(): void {
        this.appOperations.pricePerExtraHour = this.appOperations.extraHours * this.appOperationsAppCustomersLookupTableModal2.PricePerExtraHour;
        this.calculateCustodySubTotal();
    }

    calculateCustodySubTotal(): void {
        var custodyTotal = ((this.appOperations.kmQuantity * this.SelectedClient.pricePerKm) +
            (this.appOperations.extraHours * this.SelectedClient.pricePerExtraHour) +
            this.appOperations.tollPrice);

        if (custodyTotal > this.SelectedClient.basicModule) {
            this.appOperations.custodySubtotal = custodyTotal;
        } else {
            this.appOperations.custodySubtotal = this.SelectedClient.basicModule;
        }
    }

    onInsuredAmountARSChange(): void {
        this.appOperations.insuredAmountARS = this.appOperations.billAmountARS
            + this.appOperations.freightAmountARS
            + this.appOperations.dutiesAndChargesARS
            + this.appOperations.imaginaryBenefitARS;

        this.appOperations.insuredAmountUSD = parseFloat((this.appOperations.insuredAmountARS / this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.billAmountUSD = parseFloat((this.appOperations.billAmountARS / this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.freightAmountUSD = parseFloat((this.appOperations.freightAmountARS / this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.dutiesAndChargesUSD = parseFloat((this.appOperations.dutiesAndChargesARS / this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.imaginaryBenefitUSD = parseFloat((this.appOperations.imaginaryBenefitARS / this.appOperations.exchangeRate).toFixed(2));
    };

    onInsuredAmountUSDChange(): void {
        this.appOperations.insuredAmountUSD = this.appOperations.billAmountUSD
            + this.appOperations.freightAmountUSD
            + this.appOperations.dutiesAndChargesUSD
            + this.appOperations.imaginaryBenefitUSD;

        this.appOperations.insuredAmountARS = parseFloat((this.appOperations.insuredAmountUSD * this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.billAmountARS = parseFloat((this.appOperations.billAmountUSD * this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.freightAmountARS = parseFloat((this.appOperations.freightAmountUSD * this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.dutiesAndChargesARS = parseFloat((this.appOperations.dutiesAndChargesUSD * this.appOperations.exchangeRate).toFixed(2));
        this.appOperations.imaginaryBenefitARS = parseFloat((this.appOperations.imaginaryBenefitUSD * this.appOperations.exchangeRate).toFixed(2));
    };

    onsecurityInsuredAmountUSDChnage(): void {
        this.appOperations.securityInsuredAmountARS = this.appOperations.securityInsuredAmountUSD * this.appOperations.exchangeRate;
    }

    onSecurityInsuredAmountARSChange(): void {
        this.appOperations.securityInsuredAmountUSD = this.appOperations.securityInsuredAmountARS / this.appOperations.exchangeRate;
    }

    GetClientCommissionsDetails(): void {
        this._appCustomersServiceProxy.getAppCustomersForEdit(this.appOperations.customerId).subscribe(result => {
            this.SelectedClient = result.appCustomers;
        });
    }

    getExchangeRate(): void {
        if (this.active && (!this.functionEdit)) {
            this._appOperationsServiceProxy.getExchangeRate
                (
                    //this.appOperations.currencyType,
                    "USD",
                    this.appOperations.operationDate,
            ).subscribe(result => {
                if (result && result.appExchangeRates) {
                    this.appOperations.exchangeRate = result.appExchangeRates.exchangeRate;
                }
            });
        }
    }
    operationTypes: any[] = ['NATIONAL', 'INTERNATIONAL'];
    getMinimunSalesRate() {
        if (this.SelectedClient !== null && this.appOperations.operationType === this.operationTypes[0]) {
            return this.SelectedClient.nationalMinSaleRate;
        }
        if (this.SelectedClient !== null && this.appOperations.operationType === this.operationTypes[1]) {
            return this.SelectedClient.internationalMinSaleRate;
        }
    };

    operationState: any[] = ['AVAILABLE', 'CANCELLED'];

    insuranceSubtotalCost: number = 0;
    calculateInsurancesTotals(): void {

        if (this.appOperations.operationState === this.operationState[1]) {
            this.appOperations.subtotalInsuranceBilling = 0;
            this.appOperations.insuranceSubtotalCost = 0;

        } else {

            if (this.appOperations.rateOfSale === null || this.appOperations.rateOfSale === undefined ||
                this.appOperations.insuredAmountARS === null || this.appOperations.insuredAmountARS === undefined
            ) {
                return;
            }

            this.insuranceSubtotalCost = parseFloat((this.appOperations.insuredAmountARS * this.appOperations.rateOfSale).toFixed(2));
            this.appOperations.insuranceSubtotalCost = this.insuranceSubtotalCost;
        }
    }

    securitySubTotal: number = 0;
    operationTotalARS: number = 0;
    operationTotalUSD: number = 0;
    nationalMinSaleRateInUDS: number = 0;
    calculateOperationTotals(): void {
        if (this.appOperations.operationState === this.operationState[1]) {
            this.appOperations.operationTotalARS = 0;
            this.appOperations.operationTotalARS = 0;
            this.securitySubTotal = 0;
        } else {

            this.securitySubTotal = 0;
            if (this.appOperations.securityService == true)
                this.securitySubTotal = this.appOperations.mppSubtotal_price + this.appOperations.custodySubtotal + this.appOperations.auditSubtotal;

            this.operationTotalARS = parseFloat((this.appOperations.insuranceSubtotalCost + this.securitySubTotal).toFixed(2));
            this.operationTotalUSD = parseFloat((this.appOperations.operationTotalARS / this.appOperations.exchangeRate).toFixed(2));
            this.nationalMinSaleRateInUDS = this.SelectedClient.nationalMinSaleRate * this.appOperations.exchangeRate;
            this.appOperations.operationTotalARS =  (this.operationTotalARS < this.nationalMinSaleRateInUDS) ?  this.nationalMinSaleRateInUDS : this.operationTotalARS;
            this.appOperations.operationTotalUSD = (this.operationTotalUSD < this.SelectedClient.internationalMinSaleRate) ? this.SelectedClient.internationalMinSaleRate : this.operationTotalUSD;
        }
    }

    TabChangeRecalculate(): void {

        this.onInsuredAmountARSChange();
        this.onInsuredAmountUSDChange();

        this.onsecurityInsuredAmountUSDChnage();
        this.onSecurityInsuredAmountARSChange();
        this.calculateInsurancesTotals();
        this.calculateOperationTotals();
    }

    close(): void {

        this.active = false;
        this.modal.hide();
    }
}
