import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPoliciesServiceProxy, AppPoliciesDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditAppPoliciesModalComponent } from './create-or-edit-appPolicies-modal.component';

import { ViewAppPoliciesModalComponent } from './view-appPolicies-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './appPolicies.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AppPoliciesComponent extends AppComponentBase {

    @ViewChild('createOrEditAppPoliciesModal', { static: true }) createOrEditAppPoliciesModal: CreateOrEditAppPoliciesModalComponent;
    @ViewChild('viewAppPoliciesModalComponent', { static: true }) viewAppPoliciesModal: ViewAppPoliciesModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    policyNumberFilter = '';
    policyNameFilter = '';
    operationTypeFilter = '';
    appProvidersBusinessNameFilter = '';




    constructor(
        injector: Injector,
        private _appPoliciesServiceProxy: AppPoliciesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getAppPolicies(event?: LazyLoadEvent) {

        console.log(moment().startOf('day'));

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._appPoliciesServiceProxy.getAll(
            this.filterText,
            this.policyNumberFilter,
            this.policyNameFilter,
            this.operationTypeFilter,
            this.appProvidersBusinessNameFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
            console.log(result.items)
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createAppPolicies(): void {
        this.createOrEditAppPoliciesModal.show();
    }


    deleteAppPolicies(appPolicies: AppPoliciesDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._appPoliciesServiceProxy.delete(appPolicies.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._appPoliciesServiceProxy.getAppPoliciesToExcel(
            this.filterText,
            this.policyNumberFilter,
            this.policyNameFilter,
            this.operationTypeFilter,
            this.appProvidersBusinessNameFilter,
        )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}
