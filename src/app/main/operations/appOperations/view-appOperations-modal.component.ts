import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAppOperationsForViewDto, AppOperationsDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewAppOperationsModal',
    templateUrl: './view-appOperations-modal.component.html'
})
export class ViewAppOperationsModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAppOperationsForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetAppOperationsForViewDto();
        this.item.appOperations = new AppOperationsDto();
    }

    show(item: GetAppOperationsForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
