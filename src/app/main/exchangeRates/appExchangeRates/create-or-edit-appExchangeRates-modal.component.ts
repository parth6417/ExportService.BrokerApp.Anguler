import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppExchangeRatesServiceProxy, CreateOrEditAppExchangeRatesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DateTime } from 'luxon';

@Component({
    selector: 'createOrEditAppExchangeRatesModal',
    templateUrl: './create-or-edit-appExchangeRates-modal.component.html'
})
export class CreateOrEditAppExchangeRatesModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    appExchangeRates: CreateOrEditAppExchangeRatesDto = new CreateOrEditAppExchangeRatesDto();



    constructor(
        injector: Injector,
        private _appExchangeRatesServiceProxy: AppExchangeRatesServiceProxy
    ) {
        super(injector);
    }

    show(appExchangeRatesId?: number): void {

        if (!appExchangeRatesId) {
            this.appExchangeRates = new CreateOrEditAppExchangeRatesDto();
            this.appExchangeRates.id = appExchangeRatesId;
            this.appExchangeRates.exchangeDate =  DateTime.fromJSDate(moment().startOf('day').toDate());
            this.appExchangeRates.currency="";

            this.active = true;
            this.modal.show();
        } else {
            this._appExchangeRatesServiceProxy.getAppExchangeRatesForEdit(appExchangeRatesId).subscribe(result => {
                this.appExchangeRates = result.appExchangeRates;


                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._appExchangeRatesServiceProxy.createOrEdit(this.appExchangeRates)
             .pipe(finalize(() => { this.saving = false;}))
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
