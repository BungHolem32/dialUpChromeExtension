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
            accountId: {
                required: true,
                digits: true
            },
            url: {
                required: true
            }
        },
        messages: {
            accountId: {
                required: "you must insert account id ",
                digits: "you must insert only digits"
            },
            url: {
                required: "you must insert valid socket url"
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