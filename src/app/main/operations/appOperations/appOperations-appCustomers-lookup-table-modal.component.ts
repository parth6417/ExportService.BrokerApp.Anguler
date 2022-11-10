import { Component, ViewChild, Injector, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {AppOperationsServiceProxy, AppOperationsAppCustomersLookupTableDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
@Component({
    selector: 'appOperationsAppCustomersLookupTableModal',
    styleUrls: ['./appOperations-appCustomers-lookup-table-modal.component.less'],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './appOperations-appCustomers-lookup-table-modal.component.html'
})
export class AppOperationsAppCustomersLookupTableModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    filterText = '';
    id: number;
    displayName: string;

    MppPrice:number;
    BasicModule:number;
    PricePerExtraHour:number;
    PricePerKm:number;
    AuditPrice:number;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _appOperationsServiceProxy: AppOperationsServiceProxy
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.paginator.rows = 5;
        this.getAll();
        this.modal.show();
    }

    getAll(event?: LazyLoadEvent) {
        if (!this.active) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._appOperationsServiceProxy.getAllAppCustomersForLookupTable(
            this.filterText,
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

    setAndSave(appCustomers: AppOperationsAppCustomersLookupTableDto) {
        this.id = appCustomers.appCustomer.id;
        this.displayName = appCustomers.appCustomer.businessName;
        this.BasicModule = appCustomers.appCustomer.basicModule;
        this.MppPrice = appCustomers.appCustomer.mppPrice;

        this.PricePerExtraHour = appCustomers.appCustomer.pricePerExtraHour;
        this.PricePerKm = appCustomers.appCustomer.pricePerKm;
        this.AuditPrice=appCustomers.appCustomer.auditPrice;



        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }
}
