import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { AppExchangeRatesServiceProxy, AppExchangeRatesDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditAppExchangeRatesModalComponent } from './create-or-edit-appExchangeRates-modal.component';

import { ViewAppExchangeRatesModalComponent } from './view-appExchangeRates-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DateTime } from 'luxon';



@Component({
    templateUrl: './appExchangeRates.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AppExchangeRatesComponent extends AppComponentBase {
    
    @ViewChild('createOrEditAppExchangeRatesModal', { static: true }) createOrEditAppExchangeRatesModal: CreateOrEditAppExchangeRatesModalComponent;
    @ViewChild('viewAppExchangeRatesModalComponent', { static: true }) viewAppExchangeRatesModal: ViewAppExchangeRatesModalComponent;    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    currencyFilter = '';

    exchangeDateFilter:DateTime;

    constructor(
        injector: Injector,
        private _appExchangeRatesServiceProxy: AppExchangeRatesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getAppExchangeRates(event?: LazyLoadEvent) {

      console.log(  moment().format('MMMM Do YYYY, h:mm:ss a'));

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._appExchangeRatesServiceProxy.getAll(
            this.filterText,
            this.currencyFilter,
            this.exchangeDateFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createAppExchangeRates(): void {
        this.createOrEditAppExchangeRatesModal.show();        
    }


    deleteAppExchangeRates(appExchangeRates: AppExchangeRatesDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._appExchangeRatesServiceProxy.delete(appExchangeRates.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._appExchangeRatesServiceProxy.getAppExchangeRatesToExcel(
        this.filterText,
            this.currencyFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
