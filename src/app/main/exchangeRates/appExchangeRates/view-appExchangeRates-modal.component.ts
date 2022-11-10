import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAppExchangeRatesForViewDto, AppExchangeRatesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewAppExchangeRatesModal',
    templateUrl: './view-appExchangeRates-modal.component.html'
})
export class ViewAppExchangeRatesModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAppExchangeRatesForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetAppExchangeRatesForViewDto();
        this.item.appExchangeRates = new AppExchangeRatesDto();
    }

    show(item: GetAppExchangeRatesForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
