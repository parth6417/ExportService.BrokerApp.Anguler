import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppProvidersServiceProxy, CreateOrEditAppProvidersDto, GetOperationsCertificateOutput, SelectedServiceTypeInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

const fontSizeArr = [ '12px', '14px', '16px', '20px', '24px', '30px'];

var Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);


// specify the fonts you would 
var fonts = ['Arial'
// , 'Courier', 'Garamond', 'Tahoma', 'Times New Roman', 'Verdana'
];
// generate code friendly names
function getFontName(font) {
    return font.toLowerCase().replace(/\s/g, "-");
}
var fontNames = fonts.map(font => getFontName(font));
// add fonts to style
var fontStyles = "";
fonts.forEach(function(font) {
    var fontName = getFontName(font);
    fontStyles += ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" + fontName + "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" + fontName + "]::before {" +
        "content: '" + font + "';" +
        "font-family: '" + font + "', sans-serif;" +
        "}" +
        ".ql-font-" + fontName + "{" +
        " font-family: '" + font + "', sans-serif;" +
        "}";
});
var node = document.createElement('style');
node.innerHTML = fontStyles;
document.body.appendChild(node);


// Add fonts to whitelist
let Font = Quill.import('formats/font');
// We do not add Sans Serif since it is the default
Font.whitelist = fontNames ;
Quill.register(Font, true);


@Component({
    selector: 'AppProvidersCertificateTemplateModal',
    templateUrl: './appProviders-CertificateTemplate-modal.component.html'
})
export class AppProvidersCertificateTemplateModalComponent extends AppComponentBase {

    @ViewChild('AppProvidersCertificateTemplateModal', { static: true }) modal: ModalDirective;
    @ViewChild('editor') editor: QuillNamespace.Quill;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    appProviders: CreateOrEditAppProvidersDto = new CreateOrEditAppProvidersDto();
    providersServiceTypesList: SelectedServiceTypeInput[] = [];
    constructor(
        injector: Injector,
        private _appProvidersServiceProxy: AppProvidersServiceProxy
    ) {
        super(injector);
    }


    public selectedProperty: string;

    blured = false
    focused = false


    quillEditorRef: any;
    quillConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
           // [{ 'header': 1 }, { 'header': 2 }], // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            //[{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
            [{ 'direction': 'rtl' }], // text direction
            [{ 'size': fontSizeArr  }], // custom dropdown
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
            [{ 'font': fontNames   }],
            [{ 'align': [] }],
            ['clean'], // remove formatting button
            ['link', 'image'], // link and image, video
        ],
        imageResize: true
    };

    created(quill: QuillNamespace.Quill) {
        this.editor = quill;
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    }

    focus($event) {
        this.focused = true
        this.blured = false
    }

    blur($event) {
        this.focused = false
        this.blured = true
    }

    InsertPlaceHolder(): void {
        if (this.selectedProperty != '') {
            const selection = this.editor.getSelection(); // get position of cursor (index of selection)
            if (selection) {
                this.editor.insertText(selection.index, '{' + this.selectedProperty + '}');
                this.selectedProperty = "";
            }
        }
    }

    propertyList: string[] = [
        "certificateNumber",
        "policyNumber",
        "policyName",
        "clientBusinessName",
        "billingClientBusinessName",
        "operationType",
        "generalObservations",
        "insuredAmountUSD",
        "insuredAmountARS",
        "exchangeRate",
        "originalAddress",
        "destinyAddress",
        "transportsName",
        "certificateObservations",
        "operationDate"
    ]

    show(appProvidersId?: number): void {
        this._appProvidersServiceProxy.getAppProvidersForEdit(appProvidersId).subscribe(result => {
            this.appProviders = result.appProviders;
            this.active = true;
            this.modal.show();
        });
    }

    save(): void {
        this.saving = true;
        this.appProviders.selectedServiceType = [];
        this._appProvidersServiceProxy.createOrEdit(this.appProviders)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
