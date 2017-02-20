/**
 * Created by Ilan vachtel on 25/01/17.
 */

(function(){


    var cm = {

        disableButtonSelector: 'disableOptions',

        getParams: function(callback){
            var params = _cm.getDefaultValues();
            if(Object.keys(params).length < 1){
                params = null;
            }
            chrome.storage.sync.get(params, function(items){
                callback.call(cm, items);
            });
        },

        setPopup: function(popup){
            chrome.browserAction.setPopup({popup: popup})
        },
        checkIfNeedToListen: function(items){
            if(items[this.disableButtonSelector]){
                if(chrome.extension.getViews({type: "popup"})==[]){
                    _cm.popupList('./Assets/templates/popup.template.html');
                }
            } else{
                console.log(chrome.extension.getViews({type: "popup"}));
                _ws.init(items);
            }
        },

        setParams: function(fields, callback){
            /** @namespace chrome.storage */
            chrome.storage.sync.set(fields, function(/*items*/){
                callback();
            });
        },


        getDefaultValues: function(){
            var fields = _cm.getInputsArray();
            var params = {};

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


        getParamsFromForm: function(){
            var inputs = _cm.getInputsArray();

            var fields = {};
            inputs.map(function(field){
                var name = field.getAttribute('name');
                fields[name] = (name!=this.disableButtonSelector) ? field.value : ( !!(document.getElementById(name).checked) );
            }.bind(cm));
            return fields;
        },

        setParamsToForm: function(items){
            var inputs = _cm.getInputsArray();

            inputs.map(function(field){
                var name = field.getAttribute('name');
                document.querySelector("#" + name).value = items[name];
                if(name!=this.disableButtonSelector){
                    document.querySelector("#" + name).disabled = items[this.disableButtonSelector]==true;
                } else{
                    if(field.value=="true"){
                        document.querySelector("#" + name).checked = true;
                    }
                }
            }.bind(_cm));
        },

        updateIcons: function(iconNumber){
            return new Promise(function(resolve){

                setTimeout(function(){
                    var file = "/Assets/img/" + 'icon-' + iconNumber + ".png";
                    //noinspection JSUnresolvedVariable
                    chrome.browserAction.setIcon({path: file});
                    resolve();
                }, 200);
            });

        },

        initiateTabOnLoad: function(message, items /*,tabId*/){
            /** @namespace chrome.tabs.onUpdated */
            chrome.tabs.onUpdated.addListener(function(tabid, info, tab){

                    if(_websocket.readyState==1&&tab.url.indexOf(message.url)!= -1&&_cm.tabId==tab.id){
                        if(info.status!='complete'){
                            return false;
                        } else{
                            var url = items.apiUrl + "?exten=" + encodeURI(message.extension) + "&number=" + message.phone;

                            _cm.makeNewAjaxCall('GET', url, null, _cm.getAjaxSuccessCallback, _cm.getAjaxErrorMessages, false);


                            // _cm.makeAjaxCall(apiData);
                        }
                    }
                }
            );
        },

        makeNewAjaxCall: function(method, url, params, success, error, test){

            url = test ? 'http://localhost/errorPage.php' : url;

            var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

            xhr.open(method, url, true);
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4){
                    if(xhr.status==200||xhr.status==0){
                        success(xhr.responseText);
                        _websocket.close();
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
            alert('response: ' + response);
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
        },

        updateTab: function(id, items, data){
            chrome.tabs.get(id, function(/*tab*/){
                chrome.tabs.update(id, {url: "http://" + data.url}, function(){
                })
            });
        },

        clearChromeStorage: function(){
            /** @namespace chrome.storage.local */
            chrome.storage.local.clear(function(){
                /** @namespace chrome.runtime.lastError */
                var error = chrome.runtime.lastError;
                if(error){
                    console.error(error);
                }
            });
        },

        getInputsArray: function(){
            return Array.prototype.slice.call(document.querySelectorAll('input[type="text"],input[type="checkbox"]'));
        }
    };

    window._cm = cm;

})();