
var console = window.console || {log: function () {}};

var CropLogo = function ($element) {
    this.$container = $element;

    this.$container = $element;

    this.$avatarView = this.$container.find('.avatar-view');
    this.$avatar = this.$avatarView.find('img');
    this.$avatarModal = $('#avatar-modal');
    
    //alert("this.$avatarModal : "+ this.$avatarModal);
    
    this.$loading = this.$container.find('.loading');

    this.$avatarForm = $("#frmBrowse");
    //this.$avatarUpload = this.$avatarForm.find('.avatar-upload');
    this.$avatarSrc = this.$avatarForm.find('.avatar-src');
    this.$avatarData = this.$avatarForm.find('.avatar-data');
    //this.$avatarInput = this.$avatarForm.find('.avatar-input');

    this.$avatarInput = this.$avatarForm.find('.avatar-input');
    this.$avatarSave = this.$container.find('.avatar-save');
    this.$avatarBtns = this.$container.find('.avatar-btns');

    this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper');
    this.$avatarPreview = this.$avatarModal.find('.avatar-preview');
    
    // alert("this.$avatarPreview : "+ this.$avatarPreview);

    this.init();
}

CropLogo.prototype = {
    constructor: CropLogo,
    support: {
        fileList: !!$('<input type="file">').prop('files'),
        blobURLs: !!window.URL && URL.createObjectURL,
        formData: !!window.FormData
    },
    init: function () {
        console.log("croppercustom init");
        console.log("$avatarInput length > " + this.$avatarInput.length);
        this.support.datauri = this.support.fileList && this.support.blobURLs;

        if (!this.support.formData) {
            this.initIframe();
        }

        this.initTooltip();
        this.initModal();
        this.addListener();
    },
    addListener: function () {

        this.$avatarView.on('click', $.proxy(this.click, this));
        this.$avatarInput.on('change', $.proxy(this.change, this));
        //this.$avatarInput.on('change', this.change);
        //this.$avatarForm.on('submit', $.proxy(this.submit, this));
        this.$avatarBtns.on('click', $.proxy(this.rotate, this));

        var self = this;
        this.$avatarModal.on('hide.bs.modal', function () {
            console.log("croppercustom $avatarModal closed");
            console.log(self.$avatarForm);
            self.$avatarForm[0].reset();
        });

        console.log("croppercustom addListener");
        console.log(this.$avatarInput);
    },
    initTooltip: function () {
        this.$avatarView.tooltip({
            placement: 'bottom'
        });
    },
    initModal: function () {
        this.$avatarModal.modal({
            show: false
        });
    },
    initPreview: function () {
        var url = this.$avatar.attr('src');

        //this.$avatarPreview.html('<img src="' + url + '">');
    },
//    initIframe: function () {
//        var target = 'upload-iframe-' + (new Date()).getTime();
//        var $iframe = $('<iframe>').attr({
//            name: target,
//            src: ''
//        });
//        var _this = this;
//
//        // Ready ifrmae
//        $iframe.one('load', function () {
//
//            // respond response
//            $iframe.on('load', function () {
//                var data;
//
//                try {
//                    data = $(this).contents().find('body').text();
//                } catch (e) {
//                    console.log(e.message);
//                }
//
//                if (data) {
//                    try {
//                        data = $.parseJSON(data);
//                    } catch (e) {
//                        console.log(e.message);
//                    }
//
//                    _this.submitDone(data);
//                } else {
//                    _this.submitFail('Image upload failed!');
//                }
//
//                _this.submitEnd();
//
//            });
//        });
//
//        this.$iframe = $iframe;
//        this.$avatarForm.attr('target', target).after($iframe.hide());
//    },
    click: function () {
        this.$avatarModal.modal('show');
        this.initPreview();
    },
    change: function () {
        this.click();

        console.log("croppercustom change ");
        var files;
        var file;

        if (this.support.datauri) {
            files = this.$avatarInput.prop('files');

            console.log(files);
            if (files.length > 0) {
                file = files[0];

                if (this.isImageFile(file)) {
                    if (this.url) {
                        URL.revokeObjectURL(this.url); // Revoke the old one
                    }

                    this.url = URL.createObjectURL(file);

                    var self = this;
                    setTimeout(function () {
                        self.startCropper();
                    }, 1000);

                }
            }
        } else {
            file = this.$avatarInput.val();

            if (this.isImageFile(file)) {
                this.syncUpload();
            }
        }

    },

    isImageFile: function (file) {
        if (file.type) {
            return /^image\/\w+$/.test(file.type);
        } else {
            return /\.(jpg|jpeg|png|gif)$/.test(file);
        }
    },
    startCropper: function () {
        var _this = this;

        if (this.active) {
            this.$img.cropper('replace', this.url);
        } else {
            this.$img = $('<img src="' + this.url + '">');
            this.$avatarWrapper.empty().html(this.$img);
            this.$img.cropper({
                aspectRatio: 1,
                preview: '.avatar-preview',//this.$avatarPreview.selector,
                // viewMode: 1,
                dragMode: 'move',
                cropBoxMovable: false,
                cropBoxResizable: false,
                checkOrientation: false,
                // guides: false,
                // highlight: false,
                // minCanvasWidth: 628,
                // minCanvasHeight: 364,
                // minCropBoxWidth: 628,
                // minCropBoxHeight: 364,
                built: function() {
                    // _this.$img.cropper("setData", {
                    //     "x": 0,
                    //     "y": 0,
                    //     "width": 270,
                    //     "height": 100,
                    //     "rotate":0,
                    //     "scaleX":1,
                    //     "scaleY":1
                    // })
                },
                crop: function (e) {
                    var json = [
                        '{"x":' + e.x,
                        '"y":' + e.y,
                        '"height":' + e.height,
                        '"width":' + e.width,
                        '"rotate":' + e.rotate + '}'
                    ].join();

                    _this.$avatarData.val(json);
                }
            });

            this.active = true;
        }

        this.$avatarModal.one('hidden.bs.modal', function () {
            _this.$avatarPreview.empty();
            _this.stopCropper();
        });
    },
    stopCropper: function () {
        if (this.active) {
            this.$img.cropper('destroy');
            this.$img.remove();
            this.active = false;
        }
    },

    syncUpload: function () {
        this.$avatarSave.click();
    },

    cropDone: function () {
        this.$avatarForm.get(0).reset();
        this.$avatar.attr('src', this.url);
        this.stopCropper();
        this.$avatarModal.modal('hide');
    },

};
