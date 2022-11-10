import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAppProvidersForViewDto, AppProvidersDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewAppProvidersModal',
    templateUrl: './view-appProviders-modal.component.html'
})
export class ViewAppProvidersModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAppProvidersForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetAppProvidersForViewDto();
        this.item.appProviders = new AppProvidersDto();
    }

    show(item: GetAppProvidersForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
