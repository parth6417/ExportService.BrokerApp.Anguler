import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/api';

import {
    AppPoliciesServiceProxy,
    AppSecurityRequirementsServiceProxy,
    CreateOrEditAppPoliciesDto,
    AppPoliciesAppProvidersLookupTableDto,
    AppSecurityRequirementsAppRequirementsTypesLookupTableDto,
    AppSecurityRequirementsAppCommoditesTypesLookupTableDto,
    CreateOrEditAppSecurityRequirementsDto,
    GetAppSecurityRequirementsForViewDto,
    AppSecurityRequirementsDto,
    GetAppPoliciesForEditOutput,
    GetAppSecurityRequirementsForEditOutput

} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DateTime } from 'luxon';
import { forEach } from 'lodash-es';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';


@Component({
    selector: 'createOrEditAppPoliciesModal',
    templateUrl: './create-or-edit-appPolicies-modal.component.html'
})
export class CreateOrEditAppPoliciesModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    appPolicies: CreateOrEditAppPoliciesDto = new CreateOrEditAppPoliciesDto();



    appProvidersBusinessName = '';

    allAppProviderss: AppPoliciesAppProvidersLookupTableDto[];


    appSecurityRequirementsDto: CreateOrEditAppSecurityRequirementsDto = new CreateOrEditAppSecurityRequirementsDto();
    appSecurityRequirementsForViewDto: GetAppSecurityRequirementsForViewDto[] = [];


    allRequirementsTypes: AppSecurityRequirementsAppRequirementsTypesLookupTableDto[];

    allCommoditesTypes: AppSecurityRequirementsAppCommoditesTypesLookupTableDto[];


    constructor(
        injector: Injector,
        private _appPoliciesServiceProxy: AppPoliciesServiceProxy,
        private _appSecurityRequirementsServiceProxy: AppSecurityRequirementsServiceProxy
    ) {
        super(injector);
    }

    show(appPoliciesId?: number): void {

        this._appPoliciesServiceProxy.getAllAppProvidersForTableDropdown().subscribe(result => {
            this.allAppProviderss = result;
        });

        this._appSecurityRequirementsServiceProxy.getAllAppCommoditesTypesForTableDropdown().subscribe(result => {

            this.allCommoditesTypes = result;
        });

        this._appSecurityRequirementsServiceProxy.getAllAppRequirementsTypesForTableDropdown().subscribe(result => {

            this.allRequirementsTypes = result;
        })

        this.appSecurityRequirementsForViewDto = [];
        this.appSecurityRequirementsDto = new CreateOrEditAppSecurityRequirementsDto();

        if (!appPoliciesId) {
            this.appPolicies = new CreateOrEditAppPoliciesDto();
            this.appPolicies.id = appPoliciesId;


            this.appPolicies.validSince = DateTime.fromJSDate(moment().startOf('day').toDate());
            this.appPolicies.validUntil = DateTime.fromJSDate(moment().startOf('day').toDate());
            this.appPolicies.operationType=''
            this.appProvidersBusinessName = '';



            this.active = true;
            this.modal.show();
        } else {
            this._appPoliciesServiceProxy.getAppPoliciesForEdit(appPoliciesId).subscribe(result => {
                this.appPolicies = result.appPolicies;

                this.appProvidersBusinessName = result.appProvidersBusinessName;

                this.getSecurityRequirements(result.securityRequirements);

                this.active = true;
                this.modal.show();
            });
        }


    }

    getSecurityRequirements(securityRequirements: GetAppSecurityRequirementsForEditOutput[]): void {
        this.appSecurityRequirementsForViewDto = [];

        securityRequirements.forEach(single => {
            let appSecurityRequirementsForView: GetAppSecurityRequirementsForViewDto = new GetAppSecurityRequirementsForViewDto();
            appSecurityRequirementsForView.appSecurityRequirements = new AppSecurityRequirementsDto();

            appSecurityRequirementsForView.appSecurityRequirements.id = single.appSecurityRequirements.id;
            appSecurityRequirementsForView.policiesSecurityRequirementId = single.policiesSecurityRequirementId;

            appSecurityRequirementsForView.appSecurityRequirements.commoditeTypesId = single.appSecurityRequirements.commoditeTypesId;
            appSecurityRequirementsForView.appCommoditesTypesName = single.appCommoditesTypesName;
            appSecurityRequirementsForView.appSecurityRequirements.requirementTypesId = single.appSecurityRequirements.requirementTypesId;
            appSecurityRequirementsForView.appRequirementsTypesName = single.appRequirementsTypesName;
            appSecurityRequirementsForView.appSecurityRequirements.minimumAmount = single.appSecurityRequirements.minimumAmount;
            appSecurityRequirementsForView.appSecurityRequirements.maximumAmount = single.appSecurityRequirements.maximumAmount;


            this.appSecurityRequirementsForViewDto.push(appSecurityRequirementsForView);

        });
        this.getAppSecurityRequirements();
        this.appSecurityRequirementsDto = new CreateOrEditAppSecurityRequirementsDto();

    }

    addSecurityRequirements(): void {

        if (this.appSecurityRequirementsDto.commoditeTypesId && this.appSecurityRequirementsDto.requirementTypesId && this.appSecurityRequirementsDto.minimumAmount && this.appSecurityRequirementsDto.maximumAmount) {
            let appSecurityRequirementsForView: GetAppSecurityRequirementsForViewDto = new GetAppSecurityRequirementsForViewDto();
            appSecurityRequirementsForView.appSecurityRequirements = new AppSecurityRequirementsDto();
            appSecurityRequirementsForView.appSecurityRequirements.id = this.appSecurityRequirementsDto.id;
            appSecurityRequirementsForView.appSecurityRequirements.commoditeTypesId = this.appSecurityRequirementsDto.commoditeTypesId;
            appSecurityRequirementsForView.appCommoditesTypesName = this.allCommoditesTypes.find(e => e.id == this.appSecurityRequirementsDto.commoditeTypesId).displayName;
            appSecurityRequirementsForView.appSecurityRequirements.requirementTypesId = this.appSecurityRequirementsDto.requirementTypesId;
            appSecurityRequirementsForView.appRequirementsTypesName = this.allRequirementsTypes.find(e => e.id == this.appSecurityRequirementsDto.requirementTypesId).displayName;
            appSecurityRequirementsForView.appSecurityRequirements.minimumAmount = this.appSecurityRequirementsDto.minimumAmount;
            appSecurityRequirementsForView.appSecurityRequirements.maximumAmount = this.appSecurityRequirementsDto.maximumAmount;


            let checkItemIsExsits = this.appSecurityRequirementsForViewDto.some(element => {
                return element.appSecurityRequirements.commoditeTypesId == this.appSecurityRequirementsDto.commoditeTypesId && element.appSecurityRequirements.requirementTypesId == this.appSecurityRequirementsDto.requirementTypesId;
            });

            if (!this.appSecurityRequirementsDto.id && !checkItemIsExsits) {

                this.appSecurityRequirementsForViewDto.push(appSecurityRequirementsForView);
            }
            this.appSecurityRequirementsDto = new CreateOrEditAppSecurityRequirementsDto();
            this.getAppSecurityRequirements();
        } else {
            this.notify.warn(this.l('AppSecurityRequirementsDetailRequiredFieldMissing'));
        }
    }

    getAppSecurityRequirements() {
        this.primengTableHelper.records = this.appSecurityRequirementsForViewDto;
        this.primengTableHelper.totalRecordsCount = this.appSecurityRequirementsForViewDto.length;
    }

   
    save(): void {


        this.saving = true;

        this.appPolicies.appSecurityRequirements = [];

        this.appSecurityRequirementsForViewDto.forEach(element => {
            this.appSecurityRequirementsDto = new CreateOrEditAppSecurityRequirementsDto();
            this.appSecurityRequirementsDto.id = element.appSecurityRequirements.id;
            this.appSecurityRequirementsDto.commoditeTypesId = element.appSecurityRequirements.commoditeTypesId;
            this.appSecurityRequirementsDto.requirementTypesId = element.appSecurityRequirements.requirementTypesId;
            this.appSecurityRequirementsDto.minimumAmount = element.appSecurityRequirements.minimumAmount;
            this.appSecurityRequirementsDto.maximumAmount = element.appSecurityRequirements.maximumAmount;
            this.appPolicies.appSecurityRequirements.push(this.appSecurityRequirementsDto);
        });

        this._appPoliciesServiceProxy.createOrEdit(this.appPolicies)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });

    }


    deleteAppSecurityRequirements(SecurityRequirementId: any, PoliciesSecurityRequirementId: any, commoditeTypesId: any, requirementTypesId: any): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    if (!SecurityRequirementId) {
                        this.appSecurityRequirementsForViewDto = this.appSecurityRequirementsForViewDto.filter(item => item.appSecurityRequirements.commoditeTypesId !== commoditeTypesId && item.appSecurityRequirements.requirementTypesId !== requirementTypesId);
                        this.getAppSecurityRequirements();
                    }
                    else {
                        this._appPoliciesServiceProxy.deleteAppSecurityRequirements(SecurityRequirementId, PoliciesSecurityRequirementId)
                            .subscribe(() => {
                                //  this.reloadPage();
                                this.appSecurityRequirementsForViewDto = this.appSecurityRequirementsForViewDto.filter(item => item.appSecurityRequirements.id != SecurityRequirementId && item.policiesSecurityRequirementId !== PoliciesSecurityRequirementId);
                                this.getAppSecurityRequirements();
                                this.notify.success(this.l('SuccessfullyDeleted'));
                            });
                    }


                }
            }
        );
    }

    RemoveAllSecurityRequirements(): void {

        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {

                    if (this.appPolicies.id) {
                        this._appPoliciesServiceProxy.deleteAllSecurityRequirements(this.appPolicies.id).subscribe(result => {
                            this._appPoliciesServiceProxy.getAppPoliciesForEdit(this.appPolicies.id).subscribe(reload => {
                                console.log("TEST")
                                console.log(reload.securityRequirements);
                                this.getSecurityRequirements(reload.securityRequirements);
                            })

                        });
                    }
                    else {
                        this.appSecurityRequirementsForViewDto = [];
                        this.getAppSecurityRequirements();
                    }
                }
            }
        );


    }




    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
