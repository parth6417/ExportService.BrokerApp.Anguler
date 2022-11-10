import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppProvidersServiceProxy, CreateOrEditAppProvidersDto, SelectedServiceTypeInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditAppProvidersModal',
    templateUrl: './create-or-edit-appProviders-modal.component.html'
})
export class CreateOrEditAppProvidersModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    appProviders: CreateOrEditAppProvidersDto = new CreateOrEditAppProvidersDto();

    providersServiceTypesList: SelectedServiceTypeInput[] = [];


    constructor(
        injector: Injector,
        private _appProvidersServiceProxy: AppProvidersServiceProxy
    ) {

        super(injector);

    }


    show(appProvidersId?: number): void {

        
        //#region Service Type
        this.providersServiceTypesList=[];
        
        let ServiceTypeObj: SelectedServiceTypeInput = new SelectedServiceTypeInput();
        ServiceTypeObj.id = 0;
        ServiceTypeObj.value = "INSURANCES";
        ServiceTypeObj.text = "Seguro";
        ServiceTypeObj.isSelected = false;
        ServiceTypeObj.providerId = 0;

        this.providersServiceTypesList.push(ServiceTypeObj);

        ServiceTypeObj = new SelectedServiceTypeInput();
        ServiceTypeObj.id = 0;
        ServiceTypeObj.value = "AUDIITS";
        ServiceTypeObj.text = "Auditoria";
        ServiceTypeObj.isSelected = false;
        ServiceTypeObj.providerId = 0;
        this.providersServiceTypesList.push(ServiceTypeObj);

        ServiceTypeObj = new SelectedServiceTypeInput();
        ServiceTypeObj.id = 0;
        ServiceTypeObj.value = "MPP";
        ServiceTypeObj.text = "MPP";
        ServiceTypeObj.isSelected = false;
        ServiceTypeObj.providerId = 0;
        this.providersServiceTypesList.push(ServiceTypeObj);

        ServiceTypeObj = new SelectedServiceTypeInput();
        ServiceTypeObj.id = 0;
        ServiceTypeObj.value = "CUSTODIANS";
        ServiceTypeObj.text = "Custodia";
        ServiceTypeObj.isSelected = false;
        ServiceTypeObj.providerId = 0;
        this.providersServiceTypesList.push(ServiceTypeObj);
        //#endregion


        if (!appProvidersId) {
            this.appProviders = new CreateOrEditAppProvidersDto();
            this.appProviders.id = appProvidersId;



            this.active = true;
            this.modal.show();
        } else {
            this._appProvidersServiceProxy.getAppProvidersForEdit(appProvidersId).subscribe(result => {
                this.appProviders = result.appProviders;

                this.appProviders.selectedServiceType.forEach(Savedelement => {
                    this.providersServiceTypesList.forEach(element => {
                        if (Savedelement.value == element.value) {
                            element.id = Savedelement.id;
                            element.providerId = Savedelement.providerId;
                            element.isSelected = true;
                        }
                    });

                });

                this.active = true;
                this.modal.show();
            });
        }

    }




    save(): void {
        this.saving = true;

        this.appProviders.selectedServiceType = this.providersServiceTypesList;

        this._appProvidersServiceProxy.createOrEdit(this.appProviders)
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
}
