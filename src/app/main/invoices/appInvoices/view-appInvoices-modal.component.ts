import { AppConsts } from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { GetAppInvoicesForViewDto, AppInvoicesDto } from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";

@Component({
    selector: "viewAppInvoicesModal",
    templateUrl: "./view-appInvoices-modal.component.html",
})
export class ViewAppInvoicesModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAppInvoicesForViewDto;

    constructor(injector: Injector) {
        super(injector);
        this.item = new GetAppInvoicesForViewDto();
        this.item.appInvoices = new AppInvoicesDto();
    }

    show(item: GetAppInvoicesForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
