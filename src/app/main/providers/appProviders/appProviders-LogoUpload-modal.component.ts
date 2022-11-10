import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppProvidersServiceProxy, CreateOrEditAppProvidersDto, SelectedServiceTypeInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { FileItem, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { AppConsts } from '@shared/AppConsts';

import { IAjaxResponse, TokenService } from 'abp-ng2-module';

@Component({
    selector: 'AppProvidersLogoUploadModal',
    templateUrl: './appProviders-LogoUpload-modal.component.html'
})
export class AppProvidersLogoUploadModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('LogoUploadModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    appProviders: CreateOrEditAppProvidersDto = new CreateOrEditAppProvidersDto();
    logoUploader: FileUploader;
    signatureUploader: FileUploader;


    constructor(
        injector: Injector,
        private _appProvidersServiceProxy: AppProvidersServiceProxy,
        private _tokenService: TokenService

    ) {

        super(injector);

    }

    ngOnInit(): void {
        this.initUploaders();
    }

    initUploaders(): void {
        this.logoUploader = this.createUploader(
            '/ProviderLogo/UploadLogo',
            result => {
                this.notify.success(this.l("LogoUploadSucessfully"));
                this.reloadLogo();
            }
        );

        this.signatureUploader = this.createUploader(
            '/ProviderLogo/UploadSignature',
            result => {
                this.notify.success(this.l("SignatureUploadSucessfully"));
                this.reloadLogo();
            }
        );


    }


    createUploader(url: string, success?: (result: any) => void): FileUploader {
        const uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + url });

        uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
            form.append('ProviderId', this.appProvidersId);
        };

        uploader.onSuccessItem = (item, response, status) => {
            const ajaxResponse = <IAjaxResponse>JSON.parse(response);
            if (ajaxResponse.success) {
                this.notify.info(this.l('SavedSuccessfully'));
                if (success) {
                    success(ajaxResponse.result);
                }
            } else {
                this.message.error(ajaxResponse.error.message);
            }
        };

        const uploaderOptions: FileUploaderOptions = {};
        uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        uploaderOptions.removeAfterUpload = true;
        uploader.setOptions(uploaderOptions);
        return uploader;
    }

    appProvidersId: number;
    ProviderLogoImage: string;
    ProviderSignatureImage: string;

    show(appProvidersId?: number): void {
        this.appProvidersId = appProvidersId;
        this._appProvidersServiceProxy.getAppProvidersForEdit(appProvidersId).subscribe(result => {
            this.appProviders = result.appProviders;
            this.ProviderLogoImage = 'data:image/png;base64,' + result.providerLogoImage;
            this.ProviderSignatureImage = 'data:image/png;base64,' + result.providerSignatureImage;

            this.active = true;
            this.modal.show();
        });
    }

    uploadLogo(): void {
        this.logoUploader.uploadAll();

    }
    uploadSignature(): void {
        this.signatureUploader.uploadAll();
    }

    reloadLogo(): void {
        this._appProvidersServiceProxy.getAppProvidersForEdit(this.appProvidersId).subscribe(result => {
            this.appProviders = result.appProviders;
            this.ProviderLogoImage = 'data:image/png;base64,' + result.providerLogoImage;
            this.ProviderSignatureImage = 'data:image/png;base64,' + result.providerSignatureImage;
        });
    }


    save(): void {
        this.saving = true;
        this.close();
        this.modalSave.emit(null);
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
