/**
 * Created by Ilan vachtel on 25/01/17.
 */

(function(){

    window._cm = {
        getParams: function(callback){
            var params = _cm.getDefaultValues();
            if(Object.keys(params).length < 1){
                params = null;
            }
            //noinspection JSUnresolvedVariable
            chrome.storage.sync.get(params, function(items){
                callback(items)
            });
        },
        setParams: function(fields, callback){
            chrome.storage.sync.set(fields, function(/*items*/){
                callback();
            });
        },
        getDefaultValues: function(){
            var fields = Array.prototype.slice.call(document.querySelectorAll('input[type="text"]'));
            var params = {};

            fields.map(function(field){
                params[field.getAttribute('name')] = field.getAttribute('data-default')||true;
            });
            return params
        },
        getParamsFromForm: function(){
            var inputs = Array.prototype.slice.call(document.querySelectorAll('.formOptions input[type="text"]'));
            var fields = {};
            inputs.map(function(field){
                var name = field.getAttribute('name');
                fields[name] = field.value;
            });
            return fields;
        },

        setParamsToForm: function(items){
            var inputs = Array.prototype.slice.call(document.querySelectorAll('.formOptions input[type="text"]'));
            inputs.map(function(field){
                var name = field.getAttribute('name');
                console.log(document.querySelector("#" + name));
                document.querySelector("#" + name).value = items[name];
            });
        },

        updateIcons: function(iconNumber){
            var file = "/Assets/img/" + 'icon-' + iconNumber + ".png";
            chrome.browserAction.setIcon({path: file});
        },

        initiateTabOnLoad: function(message, items /*,tabId*/){
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
            chrome.storage.local.clear(function(){
                var error = chrome.runtime.lastError;
                if(error){
                    console.error(error);
                }
            });
        }
    };
})();