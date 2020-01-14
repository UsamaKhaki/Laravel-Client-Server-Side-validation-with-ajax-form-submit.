$.fn.commonValidator = function(options) {

    "use strict";
    var $this = this;

    var defaults = {
        rules: {},
        errorType: "validator",
        data: 'default',
        showErrors: "normal",
        formAutocomplete: true,
        reponseDelay: 1000,
        useDefualtLoader: true,
        showLoadingParent: "body",
        loaderBody: '<div class="loader-wrapper" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-flow: column; text-align: center; font-weight: 600; font-size: 14px; background: rgba(255, 255, 255, 0.9); z-index: 10000000"><div style="margin-bottom: 10px; border: 5px solid #f3f3f3;border-top: 5px solid #8bc34a;border-radius: 50%;width: 40px;height: 40px;animation: spin 2s linear infinite;" id="custom-loader"></div>Submitting Form <br> please wait....</div>',
        errorCss: {
            "color": "red",
            "font-size": "13px",
            "display": "block",
            "font-weight": "600",
            "margin-top": "2px",
            "margin-bottom": "0",
        },
        beforeSubmit: function() {
            return true;
        },
        success: (response) => {
            alert("Form submitted Successfully");
        },
        error: (xhr, ajaxOptions, thrownError) => {
            alert("Form submit failed!");
        },
    };

    // Loader function
    var loaderCounter = 0;
    function rotate() {
        var elem2 = document.getElementById('custom-loader');
        if($(elem2).length){
            elem2.style.MozTransform = 'rotate('+loaderCounter+'deg)';
            elem2.style.WebkitTransform = 'rotate('+loaderCounter+'deg)';
            if (loaderCounter==360) { loaderCounter = 0 }
            loaderCounter+=5;
            window.setTimeout(rotate, 10);
        }
    }

    // Settings
    var settings = $.extend({}, defaults, options);

    return this.each(function() {
        if(settings.formAutocomplete){
            $this.attr("autocomplete", "Off");
        }
        var _validator = $this.validate({
            ignore: "[name*='']",
            submitHandler: function(form) {
                if (settings.beforeSubmit()) {
                    // Showing Loader
                    if(settings.useDefualtLoader){
                        var $parent = $(settings.showLoadingParent);
                        $parent.css('position', 'relative');
                        $($parent).append(settings.LoaderBody);
                        window.setTimeout(rotate, 100);
                    }
                    // Getting Form Data
                    if(settings.data == "default"){
                        var data = new FormData(form);
                    }else{
                        var data = settings.data;
                    }
                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        url: $(form).attr("action"),
                        type: "POST",
                        data: data,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            setTimeout(() => {
                                if(settings.useDefualtLoader){
                                    $(".loader-wrapper").remove();
                                }
                                if(data.status == "Error") {
                                    if(settings.errorType == 'custom'){
                                        $('label[data-server-error]').html('');
                                        $.each(data.errors, function (ii, ele) {
                                            $.each($('input:visible, select:visible, textarea:visible'), function (index, element) {
                                                if($(element).attr('name') == ii){
                                                    if($('label[data-server-error="'+ii+'-error"]').length){
                                                        $('label[data-server-error="'+ii+'-error"]').html(ele);
                                                    }else{
                                                        var $css = '';
                                                        $.each(settings.errorCss, function (ii, ele) {
                                                            $css += ii+": "+ele+"; ";
                                                        });
                                                        var $errorHtml = '<label style="'+$css+'" data-server-error="'+ii+'-error">'+ele+'</label>';
                                                        if ($(element).parent(".input-group").length) {
                                                            $($errorHtml).insertAfter($(element).parent());
                                                        } else if ($(element).data("select2")) {
                                                            $(element).parent(".form-group").append($($errorHtml));
                                                        } else if ($(element).parent("td").length) {
                                                            $($errorHtml).insertAfter($(element).parent());
                                                        } else if ($(element).closest("div").length) {
                                                            $(element).closest("div").append($($errorHtml));
                                                        } else {
                                                            $($errorHtml).insertAfter($(element));
                                                        }
                                                    }
                                                }
                                            })
                                        })
                                    }
                                    else if(settings.errorType === 'validator')
                                    {
                                        var jsonError = {};
                                        $.each(data.errors,function (ii, ele) {
                                            $.each(ele,function (iii, elee) {
                                                jsonError[ii] = elee;
                                            });
                                        })
                                        _validator.showErrors(jsonError);
                                    }
                                }
                                else if(data.status == "Success"){

                                    $($this)[0].reset();
                                    settings.success(data);

                                }else{
                                    alert("Something went wrong, please contact admin");
                                    console.error(data);
                                }
                            }, settings.reponseDelay);
                        },
                        error:function (xhr, ajaxOptions, thrownError) {
                            setTimeout(() => {
                                if(settings.useDefualtLoader){
                                    $(".loader-wrapper").remove();
                                }
                                settings.error(xhr, ajaxOptions, thrownError);
                            }, settings.reponseDelay);
                        }
                    });
                }else{
                    console.error("Before submit is "+settings.beforeSubmit());
                }
            },
            errorElement: "label",
            errorClass: "error",
            showErrors: function(errorMap, errorList) {
                if(settings.showErrors == "tooltip"){
                    $.each(this.successList, function(index, value) {
                        var $this = $(value);
                        var formGroup = $this.closest(".form-group");
                        formGroup.removeClass("has-error").addClass("has-success");
                        if($this.hasClass("select2-hidden-accessible")){
                            $this = formGroup.find(".select2");
                        }
                        formGroup.removeClass('has-success')
                        return $this.tooltip("destroy");
                    });
                    return $.each(errorList, function(index, value) {
                        var $this = $(value.element);
                        var formGroup = $this.closest(".form-group");

                        if($this.hasClass("select2-hidden-accessible")){
                            $this = formGroup.find(".select2");
                        }
                        if(!formGroup.hasClass("has-error")){
                            formGroup.removeClass("has-success").addClass("has-error")
                        }
                        $this.attr("data-toggle","tooltip").attr("title",value.message);
                        return $this.tooltip('fixTitle').tooltip();
                    });
                }else if(settings.showErrors == "normal"){
                    this.defaultShowErrors();
                }
            },
            errorPlacement: function(error, element) {
                error.css(settings.errorCss);
                if (element.parent(".input-group").length) {
                    error.insertAfter(element.parent());
                } else if (element.data("select2")) {
                    element.parent(".form-group").append(error);
                } else if (element.parent("td").length) {
                    error.insertAfter(element.parent());
                } else if (element.closest("div").length) {
                    element.closest("div").append(error);
                } else {
                    error.insertAfter(element);
                }
            },
            rules: settings.rules
        });

        $("input, select, textarea").on("change", function() {
            $(this).valid();
            $("label[data-server-error='"+$(this).attr('name')+"-error']").remove();
        });

        $(document).on("input", "input[type='tel']", function() {
            this.value = this.value.replace(/\D/g, "");
        });

    });
};
