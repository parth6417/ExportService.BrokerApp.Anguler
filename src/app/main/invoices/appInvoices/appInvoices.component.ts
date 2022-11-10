import { AppConsts } from "@shared/AppConsts";
import { Component, Injector, ViewEncapsulation, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppInvoicesServiceProxy, AppInvoicesDto } from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { CreateOrEditAppInvoicesModalComponent } from "./create-or-edit-appInvoices-modal.component";

import { ViewAppInvoicesModalComponent } from "./view-appInvoices-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { filter as _filter } from "lodash-es";
import { DateTime } from "luxon";

import { DateTimeService } from "@app/shared/common/timing/date-time.service";


@Component({
    templateUrl: "./appInvoices.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class AppInvoicesComponent extends AppComponentBase {
    
    @ViewChild(CreateOrEditAppInvoicesModalComponent) createOrEditAppInvoicesModal: CreateOrEditAppInvoicesModalComponent;


    @ViewChild("viewAppInvoicesModalComponent", { static: true }) viewAppInvoicesModal: ViewAppInvoicesModalComponent;

    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    maxInvoiceDateFilter: DateTime;
    minInvoiceDateFilter: DateTime;
    maxInvoiceTotalFilter: number;
    maxInvoiceTotalFilterEmpty: number;
    minInvoiceTotalFilter: number;
    minInvoiceTotalFilterEmpty: number;
    appCustomersBusinessNameFilter = "";

    constructor(
        injector: Injector,
        private _appInvoicesServiceProxy: AppInvoicesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    getAppInvoices(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._appInvoicesServiceProxy
            .getAll(
                this.filterText,
                this.maxInvoiceDateFilter === undefined
                    ? this.maxInvoiceDateFilter
                    : this._dateTimeService.getEndOfDayForDate(this.maxInvoiceDateFilter),
                this.minInvoiceDateFilter === undefined
                    ? this.minInvoiceDateFilter
                    : this._dateTimeService.getStartOfDayForDate(this.minInvoiceDateFilter),
                this.maxInvoiceTotalFilter == null ? this.maxInvoiceTotalFilterEmpty : this.maxInvoiceTotalFilter,
                this.minInvoiceTotalFilter == null ? this.minInvoiceTotalFilterEmpty : this.minInvoiceTotalFilter,
                this.appCustomersBusinessNameFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createAppInvoices(): void {
        this.createOrEditAppInvoicesModal.show();
    }

    deleteAppInvoices(appInvoices: AppInvoicesDto): void {
        this.message.confirm("", this.l("AreYouSure"), (isConfirmed) => {
            if (isConfirmed) {
                this._appInvoicesServiceProxy.delete(appInvoices.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.success(this.l("SuccessfullyDeleted"));
                });
            }
        });
    }

    exportToExcel(): void {
        this._appInvoicesServiceProxy
            .getAppInvoicesToExcel(
                this.filterText,
                this.maxInvoiceDateFilter === undefined
                    ? this.maxInvoiceDateFilter
                    : this._dateTimeService.getEndOfDayForDate(this.maxInvoiceDateFilter),
                this.minInvoiceDateFilter === undefined
                    ? this.minInvoiceDateFilter
                    : this._dateTimeService.getStartOfDayForDate(this.minInvoiceDateFilter),
                this.maxInvoiceTotalFilter == null ? this.maxInvoiceTotalFilterEmpty : this.maxInvoiceTotalFilter,
                this.minInvoiceTotalFilter == null ? this.minInvoiceTotalFilterEmpty : this.minInvoiceTotalFilter,
                this.appCustomersBusinessNameFilter
            )
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}
