/**
 * Created by Ilan vachtel on 25/01/17.
 */

(function(window){


    var chromeExtensionMethods = {

        disableButtonSelector: 'disableOptions',

        getParams: function(callback){
            var params = _cm.getDefaultValues();
            if(Object.keys(params).length < 1){
                params = null;
            }
            //pass default params (if theres already they will pass out)
            chrome.storage.sync.get(params, function(items){
                callback.call(chromeExtensionMethods, items);
            });
        },

        setParams: function(fields, callback){
            /** @namespace chrome.storage */
            chrome.storage.sync.set(fields, function(/*items*/){
                callback();
            });
        },

        setPopup: function(popup){
            chrome.browserAction.setPopup({popup: popup})
        },

        getDefaultValues: function(){
            var fields = _cm.getInputsArray();
            var params = {};
            if(fields.length==0){
                return {
                    "socketUrl": true,
                    "apiUrl": true,
                    "extension": true,
                    "disableButton": true

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

        getFormParams: function(){
            var inputs = _cm.getInputsArray();

            var fields = {};
            inputs.map(function(field){
                var name = field.getAttribute('name');
                fields[name] = (name!=this.disableButtonSelector) ? field.value : ( !!(document.getElementById(name).checked) );
            }.bind(chromeExtensionMethods));
            return fields;
        },

        setFormParams: function(items){
            var inputs = _cm.getInputsArray();

            inputs.map(function(field){
                var name = field.getAttribute('name');
                document.querySelector("#" + name).value = items[name];
                if(name!=this.disableButtonSelector&&name!='extension'){
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

        getUrl: function(apiUrl, extension, phone){
            return apiUrl + "?exten=" + encodeURI(extension) + "&number=" + phone;
        },

        generateMessage: function(params){
            var message = {};
            Object.keys(params).forEach(function(key){
                message[key] = params[key];
            });
            return message;
        },


        initiateTabOnLoad: function(message, items, tabId){
            /** @namespace chrome.tabs.onUpdated */
            return new Promise(function(resolve, reject){
                chrome.tabs.onUpdated.addListener(function(tabid, info, tab){
                        if(_websocket.readyState==1&&tab.url.indexOf(message.url)!= -1&&_cm.tabId==tab.id){
                            if(info.status!='complete'){
                            } else{
                                resolve();
                            }
                        }
                    }
                );
            });

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
            console.info('response: ' + response);
        }
        ,
        getAjaxErrorMessages: function(xhr, status){

            switch(status){
                case 404:
                    console.warn('Unknown extension');
                    break;
                case 500:
                    console.warn('server error');
                    break;
                case 0:
                    console.warn('Request aborted: Unknown extension');
                    break;
                default:
                    console.warn('unknown error');
            }
        },

        updateTab: function(id, data, settings){
            return new Promise(function(resolve, reject){
                chrome.tabs.get(id, function(){
                    chrome.tabs.update(id, {url: "http://" + data.url}, function(){
                        setTimeout(function(){
                            return resolve();
                        }, 2000)
                    })
                })
            });
        },

        createTab: function(data, settings){
            return new Promise(function(resolve, reject){

                chrome.tabs.create({
                    url: "http://" + data.url,
                    active: true
                }, function(tab){
                    _cm.tabId = tab.id;
                    setTimeout(function(){
                        return resolve(tab);
                    }, 2000)
                });
            })
        },

        clearChromeStorage: function(){
            /** @namespace chrome.storage.local */
            chrome.storage.local.clear(function(){
                /** @namespace chrome.runtime.lastError */
                var error = chrome.runtime.lastError;
                if(error){
                    console.warn(error);
                }
            });
        },

        getInputsArray: function(){
            return Array.prototype.slice.call(document.querySelectorAll('input[type="text"],input[type="checkbox"]'));
        },
        checkIfYouNeedToUpdateOrCreateNewTab: function(){
            return _cm.tabId;
        }
    };

    window._cm = chromeExtensionMethods;

})(window);