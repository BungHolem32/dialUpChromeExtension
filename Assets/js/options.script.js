/**
 * Created by root on 25/01/17.
 */
(function(){
    //ON LOAD POPUP THE MODAL
    var button = $('.ModalButton');
    button.hide().click();

    $('.close').on('click', function(){
        window.close();
    });

    //FORM VALIDATION
    var form = $('.formOptions');
    form.validate({
        rules: {
            exten: {
                required: true
            },
            socketUrl: {
                required: true
            },
            apiUrl:{
                required:true
            }
        },
        messages: {
            exten: {
                required: "you must insert account id "
            },
            socketUrl: {
                required: "you must insert valid socket url"
            },
            apiUrl:{
                required:"you must insert valid apiUrl"
            }

        },

        submitHandler: function(form){
            var fields = window.cm.getParamsFromForm(form);
            window.cm.setParams(fields);
        }
    });

    $(document).bind('DOMContentLoaded', function(){
        cm.getParams(cm.setParamsToForm);
    });

})();