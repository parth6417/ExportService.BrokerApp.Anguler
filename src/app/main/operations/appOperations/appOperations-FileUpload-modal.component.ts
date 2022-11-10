import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { FileUploader, FileUploaderOptions, FileItem, FileDropDirective } from 'ng2-file-upload';

import { AppComponentBase } from "@shared/common/app-component-base";
import { AppAttachmentsFilesDto, AppOperationsServiceProxy, CreateOrEditAppOperationsDto, ProfileServiceProxy } from "@shared/service-proxies/service-proxies";
import { IAjaxResponse, TokenService } from "@node_modules/abp-ng2-module";
import { AppConsts } from "@shared/AppConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
    selector: 'fileUploadAppOperationsModal',
    templateUrl: './appOperations-FileUpload-modal.component.html',
    
})
export class FileUploadAppOperationsModalComponent extends AppComponentBase {


    @ViewChild('fileUploadModal', { static: true }) modal: ModalDirective;
    @ViewChild('filedataTable', { static: true }) filedataTable: Table;
    @ViewChild('filepaginator', { static: true }) filepaginator: Paginator;


    // @ViewChild('ng2FileDrop', { static: true }) ng2FileDrop: FileDropDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    filterText='';

    public operationFileUploader: FileUploader;
    private _uploaderOptions: FileUploaderOptions = {};

    appOperationsId: number;

    constructor(
        injector: Injector,
        private _appOperationsServiceProxy: AppOperationsServiceProxy,
        private _tokenService: TokenService,
        private http: HttpClient

    ) {
        super(injector);
        this.operationFileUploader = new FileUploader({});
    }

    initFileUploader(): void {
        this.operationFileUploader = new FileUploader({
             url: AppConsts.remoteServiceBaseUrl + '/FileUpload/UploadOperationsFile',
            });

        this._uploaderOptions.autoUpload = false;
        this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        this._uploaderOptions.removeAfterUpload = true;
        this.operationFileUploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.operationFileUploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
            form.append('OperationsId', this.appOperationsId);
        };

        this.operationFileUploader.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
            } else {
                this.message.error(resp.error.message);
            }
        };
        this._uploaderOptions.removeAfterUpload = true;
        this.operationFileUploader.setOptions(this._uploaderOptions);

        this.operationFileUploader.onCompleteAll = () => {
            this.operationFileUploader.clearQueue();
            this.notify.success(this.l("FileSavedSuccessfully"));
            this.getAllAttachment();
        };
    }

    fileChangeEvent(event: any): void {
        this.operationFileUploader.clearQueue();
        this.operationFileUploader.addToQueue([event.target.files[0]]);
    }
    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
      }
    hasBaseDropZoneOver:boolean;

    getAllAttachment(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.filepaginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._appOperationsServiceProxy.getOperationsAudits(
            this.filterText,
            this.appOperationsId,
            this.primengTableHelper.getSorting(this.filedataTable),
            this.primengTableHelper.getSkipCount(this.filepaginator, event),
            this.primengTableHelper.getMaxResultCount(this.filepaginator, event)
        ).subscribe(result =>{
            console.log(result);
        });
        this._appOperationsServiceProxy.getOperationsUploadedFile(
            this.filterText,
            this.appOperationsId,
            this.primengTableHelper.getSorting(this.filedataTable),
            this.primengTableHelper.getSkipCount(this.filepaginator, event),
            this.primengTableHelper.getMaxResultCount(this.filepaginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();

        });
    }

    reloadPage(): void {
        this.filepaginator.changePage(this.filepaginator.getPage());
    }



    appOperations: CreateOrEditAppOperationsDto = new CreateOrEditAppOperationsDto();

    ClientBusinessName:string;
    show(appOperationsId?: number): void {
        this.active = false;
        this.ClientBusinessName='';

        this._appOperationsServiceProxy.getAppOperationsForEdit(appOperationsId).subscribe(result => {
            this.appOperations = result.appOperations;
            this.ClientBusinessName = result.clientBusinessName;
            this.appOperationsId = this.appOperations.id;
            
            

            this.initFileUploader();
            this.getAllAttachment();
            this.operationFileUploader.clearQueue()
            this.active = true;
            this.hasBaseDropZoneOver = false;
            this.modal.show();
        });

    }
   

    deleteAttachemnt(record: AppAttachmentsFilesDto): void {
        this.http.request(new HttpRequest(
            'GET',
            `${this.DeleteFileUrl()}?Id=${record.id}`
        )).subscribe(() => {
            this.getAllAttachment();
            this.notify.success(this.l("FileDeleteSuccessfully"));
        });
    }

    getDownloadUrl(): string {
        return AppConsts.remoteServiceBaseUrl + '/FileUpload/DownloadOperationsFile';
    }

    DeleteFileUrl(): string {
        return AppConsts.remoteServiceBaseUrl + '/FileUpload/DeleteOperationsFile';
    }


    public downloadFile(record: AppAttachmentsFilesDto): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
            'GET',
            `${this.getDownloadUrl()}?Id=${record.id}`,
            null,
            {
                reportProgress: true,
                responseType: 'blob'
            }));
    }


    downloadAttachemnt(record: AppAttachmentsFilesDto): void {
        this.downloadFile(record).subscribe(
            data => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        //   this.downloadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100)});
                        break;
                    case HttpEventType.Response:
                        //   this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = record.name;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
            },
            error => {
                //   this.downloadStatus.emit( {status: ProgressStatusEnum.ERROR});
            }
        );
        var headers = new HttpHeaders();
        headers.append('Authorization', `Bearer ${this._tokenService.getToken()}`)
        headers.append('Content-Type', 'application/json');

        let params = new HttpParams();

        // Begin assigning parameters
        params = params.append('Id', record.id.toString());


        this.http.get(this.getDownloadUrl(), { headers: headers, params: params }).subscribe(data => {
            console.log(data);
        })

    }

    close(): void {
        this.operationFileUploader.clearQueue()
        this.active = false;
        this.modal.hide();
    }
}
