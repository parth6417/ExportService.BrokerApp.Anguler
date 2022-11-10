import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from "@shared/common/app-component-base";
import { AppOperationsServiceProxy, CreateOrEditAppOperationsDto, GetOperationsCertificateOutput, GetSendCertificateByEmailInput } from "@shared/service-proxies/service-proxies";
import { ModalDirective } from 'ngx-bootstrap/modal';


import { DateTime } from 'luxon';
import moment from 'moment';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { asBlob } from 'html-docx-js-typescript'
// if you want to save the docx file, you need import 'file-saver'
import { saveAs } from 'file-saver'
import { TokenService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';

// import jspdf from 'jspdf';

declare let html2pdf: any;


@Component({
    selector: 'generateCertificateAppOperationsModal',
    templateUrl: './appOperations-GenerateCertificate-modal.component.html',

})
export class GenerateCertificateAppOperationsModalComponent extends AppComponentBase {


    @ViewChild('generateCertificateModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    filterText = '';
    TomadorParamiter = '';

    appOperationsId: number;

    constructor(
        injector: Injector,
        private _tokenService: TokenService,
        private _appOperationsServiceProxy: AppOperationsServiceProxy,
    ) {
        super(injector);
    }


    data: GetOperationsCertificateOutput = new GetOperationsCertificateOutput();
    appOperations: CreateOrEditAppOperationsDto = new CreateOrEditAppOperationsDto();

    providerLogoImage: any;
    providerSignatureImage: any;

    show(appOperationsId?: number): void {
        this.TomadorParamiter = '';

        this.active = false;
        this.data = new GetOperationsCertificateOutput();
        this.providerLogoImage = undefined;
        this.providerSignatureImage = undefined;

        this._appOperationsServiceProxy.getOperationsForCertificate(appOperationsId).subscribe(result => {
            this.data = result;
            this.appOperations = result.appOperations;
            this.appOperationsId = this.data.appOperations.id;
            this.appOperations.operationDate = DateTime.fromJSDate(moment(this.appOperations.operationDate).toDate());
            var output = '';

            if (this.data.providerCertificateTemplate) {

                Object.keys(this.data).forEach(prop => {
                    var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                    var dataValue = this.data[prop];
                    if (dataValue === undefined || dataValue === null) {
                        dataValue = "";
                    } else {
                        if (this.data[prop] instanceof DateTime) {
                            dataValue = this.convertToDate(this.data[prop])
                        }
                    }
                    this.data.providerCertificateTemplate = this.data.providerCertificateTemplate.replace(regexp, dataValue)
                });

                Object.keys(this.data.appOperations).forEach(prop => {
                    var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                    var dataValue = this.data.appOperations[prop];
                    if (dataValue === undefined || dataValue === null) {
                        dataValue = "";
                    } else {
                        if (this.data.appOperations[prop] instanceof DateTime) {
                            dataValue = this.convertToDate(this.data.appOperations[prop])
                        }
                    }
                    this.data.providerCertificateTemplate = this.data.providerCertificateTemplate.replace(regexp, dataValue)
                });
            }

            this.active = true;
            this.modal.show();
            if (this.data.providerLogoImage)
                this.providerLogoImage = 'data:image/png;base64,' + this.data.providerLogoImage;
            if (this.data.providerSignatureImage)
                this.providerSignatureImage = 'data:image/png;base64,' + this.data.providerSignatureImage;
        });

    }

    public getImage(imageData: string): Observable<string> {
        return Observable.create(imageData);
    }

    convertToDate(date: DateTime) {
        return formatDate(moment(this.appOperations.operationDate).toDate(), 'dd-MM-yyyy', 'en-US');
    }

    downlaodPdf() {

        // this.saving=true;
        let pdfReportContent = document.getElementById('pdfReportContent');
        var element = document.getElementById('pdfReportContent');
        var opt = {
            margin: 0.5,
            filename: 'Certificate.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();

    }


    downlaodDocx() {
        //Get the element to export into pdf
        let pdfReportContent = document.getElementById('FullReport');

        let htmlString = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
          <link rel="stylesheet" type="text/css" href="/src/assets/metronic/vendors/global/vendors.bundle.css">
          <link rel="stylesheet" type="text/css" href="/src/app/shared/core.less">
          <link rel="stylesheet" type="text/css" href="/src/app/shared/layout/layout.less">
          <link rel="stylesheet" type="text/css" href="/src/styles.css">
        </head>
        <body>
          ${pdfReportContent.innerHTML}
        </body>
        </html>`

        asBlob(htmlString).then((data: Blob) => {
            saveAs(data, 'Certificate.docx') // save as docx file
        });// asBlob() return Promise<Blob|Buffer>
    }

    SendCertificateByEmail() {
        
        let pdfReportContent = document.getElementById('pdfReportContent');
        var element = document.getElementById('pdfReportContent');
        var opt = {
            margin: 0.5,
            filename: 'Certificate.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).toPdf().output('datauristring').then((pdf:any)=> {
            //Convert to base 64
            var data = new FormData();
            data.append("CertificatePdf", pdf);
            data.append("ClientEmail", this.data.clientEmail);
            data.append("OperationNumber", this.data.appOperations.operationNumber);

            data.append("CertificateNumber", this.data.appOperations.certificateNumber.toString());


            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (function ( request: XMLHttpRequest, event: Event ): any {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        this.notify.success(this.l("SendCertificateSucessfully"));
                    }
                }
            }).bind(this, xhr);

            xhr.open('post',AppConsts.remoteServiceBaseUrl + '/Operation/SendCertificate', true); //Post to php Script to save to server
            xhr.setRequestHeader('Authorization', 'Bearer ' + this._tokenService.getToken());
            console.log("TET")
            xhr.send(data);

        });


    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
