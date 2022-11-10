import { Component, ViewChild, Injector, Output, EventEmitter, ViewEncapsulation, Input } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AppInvoicesServiceProxy, AppInvoicesAppCustomersLookupTableDto, PendingInvoiceOperationTableDto, CreateOrEditAppInvoicesDto, AppOperationsInvoicesDto, AppOperationsDto } from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Table, TableCheckbox, TableHeaderCheckbox } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/api";
import { DateTime } from "luxon";
import { AppInvoicesAppCustomersLookupTableModalComponent } from "./appInvoices-appCustomers-lookup-table-modal.component";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";
import { finalize } from "rxjs/operators";
import { AppInvoicesManualVoucherModalComponent } from "./appInvoices-manualvoucher-modal.component";
@Component({
    selector: "createOrEditAppInvoicesModal",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./create-or-edit-appInvoices-modal.component.html",
})
export class CreateOrEditAppInvoicesModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild(AppInvoicesAppCustomersLookupTableModalComponent) appInvoicesAppCustomersLookupTableModal: AppInvoicesAppCustomersLookupTableModalComponent;

    @ViewChild(AppInvoicesManualVoucherModalComponent) appInvoicesManualVoucherModalModal: AppInvoicesManualVoucherModalComponent;


    customerId: number | null;
    appCustomersBusinessName = "";

    maxOperationDateFilter: DateTime;
    minOperationDateFilter: DateTime;


    PendingOperationsResult: PendingInvoiceOperationTableDto[];
    selectedOperations: PendingInvoiceOperationTableDto;
    selectedOperationsList: PendingInvoiceOperationTableDto[];


    appInvoices: CreateOrEditAppInvoicesDto = new CreateOrEditAppInvoicesDto();

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    saving = false;
    active = false;

    constructor(injector: Injector,
        private _appInvoicesServiceProxy: AppInvoicesServiceProxy
        , private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    show(appInvoicesId?: number): void {
        this.active = true;
        this.paginator.rows = 5;
        this.selectedOperationsList = [];
        this.VoucherNumber=undefined;
        this.VoucherPrefix=undefined;

        this.IsGroupInvoice=false;
        this.GeneralObservationInfo=undefined;

        if (!appInvoicesId) {
            this.appInvoices = new CreateOrEditAppInvoicesDto();
            this.appInvoices.id = appInvoicesId;
            this.appInvoices.appOperationsInvoices = [];
            this.appInvoices.invoiceDate = this._dateTimeService.getStartOfDay();
            this.setCustomerIdNull();
            this.modal.show();
        } else {
            this._appInvoicesServiceProxy.getAppInvoicesForEdit(appInvoicesId).subscribe((result) => {
                this.appInvoices = result.appInvoices;
                this.customerId = this.appInvoices.customerId;
                this.appCustomersBusinessName = result.appCustomersBusinessName;
                this.getAll();
                this.modal.show();
            });
        }


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
        this.PendingOperationsResult = [];
        this._appInvoicesServiceProxy
            .getAllPendingInvoiceOperation(
                this.customerId,
                this.maxOperationDateFilter,
                this.minOperationDateFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.PendingOperationsResult = result.items;
                this.primengTableHelper.hideLoadingIndicator();

            })
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }


    selectOperations(data: PendingInvoiceOperationTableDto, checkbox: TableCheckbox) {
        this.processSelectedOperation(data, checkbox.checked);
    }

    processSelectedOperation(data: PendingInvoiceOperationTableDto, check: boolean) {
        if (check) {
            // ADD
            let existingItem = this.selectedOperationsList.find(q => q.id == data.id);
            if (existingItem === undefined) {
                this.selectedOperationsList.push(data);
            }
        }
        else {
            this.selectedOperationsList = this.selectedOperationsList.filter(q => q.id != data.id);
        }
        this.processOperationToInvoice(data, check);
    }

    processOperationToInvoice(data: PendingInvoiceOperationTableDto, check: boolean) {
        this.appInvoices.invoiceDate = this._dateTimeService.getStartOfDay();
        this.appInvoices.customerId = this.customerId;
        if (check) {
            // ADD
            let existingItem = this.appInvoices.appOperationsInvoices.find(q => q.operationId == data.id);
            if (existingItem === undefined) {
                let operation: AppOperationsInvoicesDto = new AppOperationsInvoicesDto();
                operation.id = 0;
                operation.operationId = data.id;
                operation.operationFk = new AppOperationsDto();
                operation.operationFk.id = data.id;
                operation.operationFk.certificateNumber = data.certificateNumber;
                operation.operationFk.operationDate = data.operationDate;
                operation.operationFk.operationNumber = data.operationNumber;
                operation.operationFk.operationTotalARS = data.operationTotalARS;
                operation.operationFk.operationTotalUSD = data.operationTotalUSD;
                operation.operationFk.insuredAmountUSD = data.insuredAmountUSD;
                this.appInvoices.appOperationsInvoices.push(operation);
            }
        }
        else {
            let tempExtingdata = this.appInvoices.appOperationsInvoices.filter(q => q.id != 0);
            this.appInvoices.appOperationsInvoices = this.appInvoices.appOperationsInvoices.filter(q => q.operationId != data.id && q.id == 0);
            tempExtingdata.forEach(s => {
                this.appInvoices.appOperationsInvoices.push(s);
            })
        }

        this.appInvoices.invoiceTotal = this.appInvoices.appOperationsInvoices.reduce((sum, current) => sum + current.operationFk.operationTotalARS, 0);
    }


    selectHeaderOperation(headerCheckbox: TableHeaderCheckbox) {
        console.log(headerCheckbox)
        this.PendingOperationsResult.forEach((data: PendingInvoiceOperationTableDto) => {
            this.processSelectedOperation(data, headerCheckbox.checked);
        });
    }


    openSelectAppCustomersModal() {
        this.appInvoicesAppCustomersLookupTableModal.id = this.customerId;
        this.appInvoicesAppCustomersLookupTableModal.displayName = this.appCustomersBusinessName;
        this.appInvoicesAppCustomersLookupTableModal.show();
    }

    setCustomerIdNull() {
        this.customerId = null;
        this.appCustomersBusinessName = "";
        this.selectedOperationsList = [];
        this.appInvoices = new CreateOrEditAppInvoicesDto();
        this.appInvoices.appOperationsInvoices = [];
        this.getAll();
    }

    getNewCustomerId() {
        if (this.customerId != this.appInvoicesAppCustomersLookupTableModal.id) {
            this.selectedOperationsList = [];
            this.appInvoices = new CreateOrEditAppInvoicesDto();
            this.appInvoices.appOperationsInvoices = [];
        }
        this.customerId = this.appInvoicesAppCustomersLookupTableModal.id;
        this.appCustomersBusinessName = this.appInvoicesAppCustomersLookupTableModal.displayName;

        this.getAll();
    }

    VoucherNumber: number | null | undefined;
    VoucherPrefix: string | null | undefined;

    openManualVoucher(){
        this.appInvoicesManualVoucherModalModal.VoucherNumber = this.VoucherNumber;
        this.appInvoicesManualVoucherModalModal.VoucherPrefix = this.VoucherPrefix;
        this.appInvoicesManualVoucherModalModal.show();
    }
    getManualVoucherInfo(){
        this.VoucherNumber = this.appInvoicesManualVoucherModalModal.VoucherNumber;
        this.VoucherPrefix = this.appInvoicesManualVoucherModalModal.VoucherPrefix;
    }

    save(): void {
        if (this.appInvoices.appOperationsInvoices.length > 0) {
            this.saving = true;
            console.log(this.GeneralObservationInfo);

            this._appInvoicesServiceProxy
                .createOrEdit(this.IsGroupInvoice, this.GeneralObservationInfo,this.VoucherPrefix,this.VoucherNumber,this.appInvoices)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                )
                .subscribe(() => {
                    this.notify.info(this.l("SavedSuccessfully"));
                    this.close();
                    this.modalSave.emit(null);
                });
        } else {
            this.notify.info(this.l("PleaseSelectOperation"));
        }
    }

    IsGroupInvoice:boolean=false;
    GeneralObservationInfo:string="";
    close(): void {

        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }
}
