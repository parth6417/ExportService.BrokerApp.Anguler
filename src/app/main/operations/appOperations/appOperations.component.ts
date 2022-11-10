import { Component, Injector, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppOperationsServiceProxy, AppOperationsDto, CreateOrEditAppOperationsDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { FileUploadAppOperationsModalComponent } from './appOperations-FileUpload-modal.component';
import { HttpClient } from '@angular/common/http';
import { GenerateCertificateAppOperationsModalComponent } from './appOperations-GenerateCertificate-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { finalize } from 'rxjs/operators';
import { FileUpload } from 'primeng/fileupload';
import { CreateOrEditAppOperationsModalComponent } from './create-or-edit-appOperations-modal.component';
import { AuditAppOperationsModalComponent } from './appOperations-Audit-modal.component';

@Component({
    templateUrl: './appOperations.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./operation.component.less'],
    animations: [appModuleAnimation()]
})
export class AppOperationsComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createOrEditAppOperationsModal', { static: true }) createOrEditAppOperationsModal: CreateOrEditAppOperationsModalComponent;
    @ViewChild('fileUploadAppOperationsModal', { static: true }) fileUploadAppOperationsModal: FileUploadAppOperationsModalComponent;
    @ViewChild('generateCertificateAppOperationsModal', { static: true }) generateCertificateAppOperationsModal: GenerateCertificateAppOperationsModalComponent;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    @ViewChild('SeguridadExcelFileUpload', { static: false }) seguridadExcelFileUpload: FileUpload;
    @ViewChild('auditAppOperationsModal', { static: false }) auditAppOperationsModal: AuditAppOperationsModalComponent;
    uploadUrl: string;
    uploadSeguridadUrl: string;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxOperationDateFilter: DateTime;
    minOperationDateFilter: DateTime;
    appCommoditesTypesNameFilter = '';
    appPoliciesPolicyNameFilter = '';
    operationType = '';
    securityService = false;
    estadoText = '';

    constructor(
        injector: Injector,
        private _appOperationsServiceProxy: AppOperationsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient,
        private _localStorageService: LocalStorageService
    ) {
        super(injector);
    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
        this._activatedRoute.params.subscribe(params => {
            this.securityService = JSON.parse(params['securityService']);
            if (this.securityService) {
                this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Operation/ImportSeguridadFromExcel';
            } else {
                this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Operation/ImportFromExcel';
            }
            this.paginator.changePage(this.paginator.getPage());
        });
    }
    getAppOperations(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._appOperationsServiceProxy.getAll(
            this.securityService,
            this.estadoText,
            this.filterText,
            this.maxOperationDateFilter,
            this.minOperationDateFilter,
            this.operationType,
            this.appCommoditesTypesNameFilter,
            this.appPoliciesPolicyNameFilter,
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

    createAppOperations(): void {
        this.createOrEditAppOperationsModal.ClearValidation();
        this.createOrEditAppOperationsModal.functionWithInsurance = true;
        this.createOrEditAppOperationsModal.functionWithSequrity = this.securityService;
        this.createOrEditAppOperationsModal.show();
    }

    createAppOperationsWithSequrity(): void {
        this.createOrEditAppOperationsModal.ClearValidation();
        this.createOrEditAppOperationsModal.functionWithInsurance = false;
        this.createOrEditAppOperationsModal.functionWithSequrity = true;
        this.createOrEditAppOperationsModal.show();
    }

    EditOperationWithInsurance(appOperationsId?: number): void {
        this.createOrEditAppOperationsModal.ClearValidation();
        this.createOrEditAppOperationsModal.functionWithInsurance = true;
        this.createOrEditAppOperationsModal.functionWithSequrity = this.securityService;
        this.createOrEditAppOperationsModal.show(appOperationsId, false);
    }

    EditOperationWithSequrity(appOperationsId?: number): void {
        this.createOrEditAppOperationsModal.ClearValidation();
        this.createOrEditAppOperationsModal.functionWithInsurance = false;
        this.createOrEditAppOperationsModal.functionWithSequrity = true;
        this.createOrEditAppOperationsModal.show(appOperationsId, false);
    }

    deleteAppOperations(appOperations: AppOperationsDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._appOperationsServiceProxy.delete(appOperations.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._appOperationsServiceProxy.getAppOperationsToExcel(
            this.securityService,
            this.estadoText,
            this.filterText,
            this.maxOperationDateFilter,
            this.minOperationDateFilter,
            this.appPoliciesPolicyNameFilter,

        )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    uploadExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        formData.append('file', file, file.name);

        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .pipe(finalize(() => this.excelFileUpload.clear()))
            .subscribe(response => {
                if (response.success) {
                    this.notify.success(this.l('ImportOperationsProcessStart'));
                } else if (response.error != null) {
                    this.notify.error(this.l('ImportOperationsUploadFailed'));
                }
            });
    }

    onUploadExcelError(): void {
        this.notify.error(this.l('ImportOperationsUploadFailed'));
    }

    openLink(url: string){
        window.open(url, "_self");
    }
}
