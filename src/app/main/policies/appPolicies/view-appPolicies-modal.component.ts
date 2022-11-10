import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAppPoliciesForViewDto, AppPoliciesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewAppPoliciesModal',
    templateUrl: './view-appPolicies-modal.component.html'
})
export class ViewAppPoliciesModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAppPoliciesForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetAppPoliciesForViewDto();
        this.item.appPolicies = new AppPoliciesDto();
    }

    show(item: GetAppPoliciesForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
