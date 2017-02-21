/**
 * Created by root on 25/01/17.
 */
(function(){

    window._websocket = window._websocket ? window._websocket : {};
    window._ws = {

        init: function(settings){
            settings.socketUrl = !settings.socketUrl ? 'ww.testNotWork.com' : settings.socketUrl;
            this.timeout = undefined;

            try{
                if(window._websocket.readyState==1){
                    _websocket.close();
                    clearTimeout(_ws.timeout);
                    return false;
                }

                window._websocket = new WebSocket(settings.socketUrl);

                if(window._websocket.readyState==1){
                    _ws.timeout = setTimeout(function(){
                        var message = "Cannot open CRM.";
                        _ws.onIdle(message)
                    }, 20000);
                }

            } catch(e){
                _ws.onError();
                return false;
            }

            if(typeof _websocket=='object'){
                _websocket.onopen = function(evt){
                    _ws.onOpen(evt, _websocket, this)
                };
                _websocket.onclose = function(evt, message){
                    _ws.onClose(evt, message)
                };
                _websocket.onmessage = function(evt){
                    _ws.onMessage(evt, this, settings, _ws.timeout)
                };
                _websocket.onerror = function(evt){
                    _ws.onError(evt, this)
                };
            }
        },

        onOpen: function(evt, _websocket){
            var that = this;
            _cm.updateIcons('3').then(function(){
                console.info('CONNECTED');
                that.doSend("WebSocket rocks", _websocket);
            });

        },

        onClose: function(evt, message){
            _cm.updateIcons('1').then(function(){
                console.warn('DISCONNECTED');
                if(message){
                    console.warn(message)
                }
            });
        },

        onMessage: function(evt, _websocket, settings, timeOutTillIdle){
            var data = JSON.parse(evt.data);
            if(data.url.indexOf('http://')!= -1){
                data.url = data.url.replace("http://", '');
            }

            if(data['extension']==settings['extension']){
                //if some connection was made cancel the timeout
                clearTimeout(timeOutTillIdle);

                if(_cm.tabId){
                    _cm.updateTab(_cm.tabId, data, settings)
                        .then(_cm.initiateTabOnLoad(data, settings, _cm.tabId))
                        .then(function(){
                                var url = _h.genUrl(settings['apiUrl'], settings['extension'], data['phone']);
                                _h.makeAjaxCall('GET', url, null, _h.getAjaxSuccessCallback, _h.getAjaxErrorMessages, false)
                            }
                        );
                } else{
                    _cm.createTab(data, settings)
                        .then(_cm.initiateTabOnLoad(data, settings, _cm.tabId))
                        .then(function(){
                            var url = _h.genUrl(settings['apiUrl'], settings['extension'], data['phone']);
                            _h.makeAjaxCall('GET', url, null, _h.getAjaxSuccessCallback, _h.getAjaxErrorMessages, false)
                        });
                }

            }
        },

        onError: function(/*evt, message*/){
            _cm.updateIcons('1').then(function(){
                if(_websocket.readyState==3){
                    console.warn('Cannot connect to Socket Server');
                } else{
                    console.warn('Some unknown error occurred');
                }
            });
        },

        doSend: function(message, _websocket){
            console.info("SENT: " + message);
            _websocket.send(message);

        }
        ,

        onIdle: function(message){
            _ws.onClose(null, message);
        }
    }
})
(window);