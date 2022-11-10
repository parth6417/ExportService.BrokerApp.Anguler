import { Component, ViewChild, Injector, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AppInvoicesServiceProxy, AppInvoicesAppCustomersLookupTableDto } from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";

@Component({
    selector: "appInvoicesManualVoucherModalModal",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./appInvoices-manualvoucher-modal.component.html",
})
export class AppInvoicesManualVoucherModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    VoucherNumber: number | null | undefined;
    VoucherPrefix: string | null | undefined;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;

    constructor(injector: Injector) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }
    setAndSave() {
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }
    Clear(){
        this.active = false;
        this.VoucherNumber=undefined;
        this.VoucherPrefix=undefined;

        this.modal.hide();
        this.modalSave.emit(null);
    }
    close(): void {
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }
}
