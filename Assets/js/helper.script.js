/**
 * Created by ilanv on 21/02/2017.
 */
(function(window){
    var helper = {
        genUrl: function(apiUrl, extension, phone){
            return apiUrl + "?exten=" + encodeURI(extension) + "&number=" + phone;

        },
        genObject: function(params){
            var object = {};
            Object.keys(params).forEach(function(key){
                object[key] = params[key];
            });
            return object;
        },
        genArrayFromSelection: function(selector){
            return Array.prototype.slice.call(document.querySelectorAll(selector));

        },
        getDefaultValues: function(selector){
            var fields = this.genArrayFromSelection(selector);
            var params = {};
            if(fields.length==0){
                return {
                    "socketUrl": "localhost:8886",
                    "apiUrl": "http://172.10.170.20/dailer.php",
                    "extension": "SIP/2004",
                    "disableButton": false
                }
            }

            fields.map(function(field){

                var name = field.getAttribute('name');
                if(field.getAttribute('name')==this.disableButtonSelector){
                    params[name] = document.getElementById(name).checked;
                } else{
                    params[name] = field.getAttribute('data-default')||'';
                }
            });
            return params
        },
        getFormParams: function(selector){
            var inputs = this.genArrayFromSelection(selector);

            var fields = {};
            inputs.map(function(field){
                var name = field.getAttribute('name');
                fields[name] = (name!=this.disableButtonSelector) ? field.value : ( !!(document.getElementById(name).checked) );
            }.bind(_cm));
            return fields;
        },


        setFormParams: function(items, selector){
            var inputs = _h.genArrayFromSelection(selector);

            inputs.map(function(field){
                var name = field.getAttribute('name');
                document.querySelector("#" + name).value = items[name];
                if(name!=this.disableButtonSelector&&name=='socketUrl'){
                    document.querySelector("#" + name).disabled = items[this.disableButtonSelector]==true;
                } else{
                    if(field.value=="true"){
                        document.querySelector("#" + name).checked = true;
                    }
                }
            }.bind(_cm));
        },

        makeAjaxCall: function(method, url, params, success, error, test){

            url = test ? 'http://localhost/errorPage.php' : url;

            var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

            xhr.open(method, url, true);
            xhr.onreadystatechange = function(e){
                if(xhr.readyState==4){
                    if(xhr.status==200||xhr.status==0){
                        success(xhr.responseText);
                    } else{
                        error(xhr, xhr.status);
                    }
                }
            };
            xhr.onerror = function(){
                error(xhr, xhr.status);
            };
            xhr.send(params);
        },
        getAjaxSuccessCallback: function(response){
            console.info('response: ' + response);
        }
        ,
        getAjaxErrorMessages: function(xhr, status){

            switch(status){
                case 404:
                    alert('Unknown extension');
                    break;
                case 500:
                    alert('server error');
                    break;
                case 0:
                    alert('Request aborted: Unknown extension');
                    break;
                default:
                    alert('unknown error');
            }
        }
    };

    window._h = helper;
})(window);