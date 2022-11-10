import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from "@shared/common/app-component-base";
import { AppOperationsServiceProxy, CreateOrEditAppOperationsDto, ProfileServiceProxy } from "@shared/service-proxies/service-proxies";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';

@Component({
    selector: 'auditAppOperationsModal',
    templateUrl: './appOperations-Audit-modal.component.html',

})
export class AuditAppOperationsModalComponent extends AppComponentBase {
    @ViewChild('auditModal', { static: true }) modal: ModalDirective;
    @ViewChild('auditdataTable', { static: true }) auditdataTable: Table;
    @ViewChild('auditpaginator', { static: true }) auditpaginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    filterText = '';
    appOperationsId: number;

    constructor(
        injector: Injector,
        private _appOperationsServiceProxy: AppOperationsServiceProxy
    ) {
        super(injector);
    }


    getAllOperationAudits(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.auditpaginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._appOperationsServiceProxy.getOperationsAudits(
            this.filterText,
            this.appOperationsId,
            this.primengTableHelper.getSorting(this.auditdataTable),
            this.primengTableHelper.getSkipCount(this.auditpaginator, event),
            this.primengTableHelper.getMaxResultCount(this.auditpaginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.auditpaginator.changePage(this.auditpaginator.getPage());
    }

    appOperations: CreateOrEditAppOperationsDto = new CreateOrEditAppOperationsDto();

    ClientBusinessName: string;
    show(appOperationsId?: number): void {
        this.active = false;
        this.ClientBusinessName = '';
        this._appOperationsServiceProxy.getAppOperationsForEdit(appOperationsId).subscribe(result => {
            this.appOperations = result.appOperations;
            this.ClientBusinessName = result.clientBusinessName;
            this.appOperationsId = this.appOperations.id;
            this.getAllOperationAudits();
            this.active = true;
            this.modal.show();
        });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    getOperationTypeDisplay(operationType: string) {
        switch (operationType) {
            case 'NATIONAL': return 'Nacional';
            case 'INTERNATIONAL': return 'Internacional';
        }
    };
    
    getOperationStateDisplay(operationState: string) {
        switch (operationState) {
            case 'AVAILABLE': return 'Habilitada';
            default: return 'Anulada';
        }
    };

    getActionDisplay(operationState: string) {
        switch (operationState) {
            case 'NEW_OPERATION': return 'Nueva Operación';
            default: return 'Operación Modificada';
        }
    };
}
