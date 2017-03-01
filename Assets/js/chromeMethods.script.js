/**
 * Created by Ilan vachtel on 25/01/17.
 */

(function(window){

    var chromeExtensionMethods = {

        disableButtonSelector: 'disableOptions',

        /**
         *
         * @param callback
         * @param selector
         */
        getParams: function(callback, selector){
            var params = _h.getDefaultValues(selector);
            if(Object.keys(params).length < 1){
                params = null;
            }
            //pass default params (if there's already they will pass out)
            //noinspection JSUnresolvedVariable
            chrome.storage.sync.get(params, function(items){
                callback.call(chromeExtensionMethods, items, selector);
            });
        },
        /**
         *
         * @param fields
         * @param callback
         */
        setParams: function(fields, callback){
            /** @namespace chrome.storage.sync */
            /** @namespace chrome.storage */
            chrome.storage.sync.set(fields, function(/*items*/){
                callback();
            });
        },

        /**
         *
         * @param popup
         */
        setPopup: function(popup){
            /** @namespace chrome.browserAction */
            chrome.browserAction.setPopup({popup: popup})
        },

        /**
         *
         * @param iconNumber
         * @returns {Promise}
         */
        updateIcons: function(iconNumber){
            return new Promise(function(resolve){

                setTimeout(function(){
                    var file = "/Assets/img/" + 'icon-' + iconNumber + ".png";
                    //noinspection JSUnresolvedFunction
                    chrome.browserAction.setIcon({path: file});
                    resolve();
                }, 200);
            });
        },
        /**
         *
         * @param message
         * @param items
         * @param tabId
         * @returns {Promise}
         */
        initiateTabOnLoad: function(message, items, tabId){
            /** @namespace chrome.tabs.onUpdated */
            return new Promise(function(resolve){
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
        /**
         *
         * @param id
         * @param data
         * @param settings
         * @returns {Promise}
         */
        updateTab: function(id, data, settings){
            return new Promise(function(resolve){
                chrome.tabs.get(id, function(){
                    chrome.tabs.update(id, {url: "http://" + data.url}, function(){
                        setTimeout(function(){
                            return resolve();
                        }, 2000)
                    })
                })
            });
        },
        /**
         *
         * @param data
         * @param settings
         * @returns {Promise}
         */
        createTab: function(data, settings){
            return new Promise(function(resolve){

                //noinspection JSUnresolvedFunction
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
        /**
         * Clear chrome storage
         */
        clearChromeStorage: function(){
            /** @namespace chrome.storage.local */
            chrome.storage.local.clear(function(){
                /** @namespace chrome.runtime.lastError */
                var error = chrome.runtime.lastError;
                if(error){
                    console.warn(error);
                }
            });
        }
    };

    window._cm = chromeExtensionMethods;

})(window);