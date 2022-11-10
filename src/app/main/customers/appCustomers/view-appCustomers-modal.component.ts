import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAppCustomersForViewDto, AppCustomersDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewAppCustomersModal',
    templateUrl: './view-appCustomers-modal.component.html'
})
export class ViewAppCustomersModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAppCustomersForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetAppCustomersForViewDto();
        this.item.appCustomers = new AppCustomersDto();
    }

    show(item: GetAppCustomersForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
