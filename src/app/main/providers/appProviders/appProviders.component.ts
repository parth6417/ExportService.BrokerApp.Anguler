import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { AppProvidersServiceProxy, AppProvidersDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditAppProvidersModalComponent } from './create-or-edit-appProviders-modal.component';

import { ViewAppProvidersModalComponent } from './view-appProviders-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppProvidersLogoUploadModalComponent } from './appProviders-LogoUpload-modal.component';
import { AppProvidersCertificateTemplateModalComponent } from './appProviders-CertificateTemplate-modal.component';

@Component({
    templateUrl: './appProviders.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AppProvidersComponent extends AppComponentBase {
    
    @ViewChild('createOrEditAppProvidersModal', { static: true }) createOrEditAppProvidersModal: CreateOrEditAppProvidersModalComponent;
    @ViewChild('AppProvidersLogoUploadModal', { static: true }) AppProvidersLogoUploadModal: AppProvidersLogoUploadModalComponent;
    @ViewChild('AppProvidersCertificateTemplateModal', { static: true }) AppProvidersCertificateTemplateModal: AppProvidersCertificateTemplateModalComponent;


    @ViewChild('viewAppProvidersModalComponent', { static: true }) viewAppProvidersModal: ViewAppProvidersModalComponent;    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    businessNameFilter = '';
    cuitCuilFilter = '';
    serviceTypeFilter = '';

    providersServiceTypesList:any = [
        { value: '', text: this.l('SelectionofServiceType'), isSelected: true },
        { value: 'INSURANCES', text: 'Seguro', isSelected: false },
        { value: 'AUDIITS', text: 'Auditoria', isSelected: false },
        { value: 'MPP', text: 'MPP', isSelected: false },
        { value: 'CUSTODIANS', text: 'Custodia', isSelected: false },
    ];


    constructor(
        injector: Injector,
        private _appProvidersServiceProxy: AppProvidersServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getAppProviders(event?: LazyLoadEvent) {


        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._appProvidersServiceProxy.getAll(
            this.filterText,
            this.businessNameFilter,
            this.cuitCuilFilter,
            this.serviceTypeFilter,
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

    createAppProviders(): void {
        this.createOrEditAppProvidersModal.show();        
    }


    deleteAppProviders(appProviders: AppProvidersDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._appProvidersServiceProxy.delete(appProviders.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
    exportToExcel(): void {
        this._appProvidersServiceProxy.getAppProvidersToExcel(
            this.filterText,
            this.businessNameFilter,
            this.cuitCuilFilter,
        )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

}
