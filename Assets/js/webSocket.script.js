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
                var that = this;
                that.onerror();
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
                console.log('CONNECTED');
                that.doSend("WebSocket rocks", _websocket);
            });

        },

        onClose: function(evt, message){
            var that = this;
            _cm.updateIcons('1').then(function(){
                console.log('DISCONNECTED');
                if(message){
                    alert(message)
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
                    _cm.updateTab(_cm.tabId, settings, data);
                    return false;
                }

                chrome.tabs.create({
                    url: "http://" + data.url,
                    active: true
                }, function(tab){
                    _cm.initiateTabOnLoad(data, settings, tab.id);
                    _cm.tabId = tab.id;
                });
            }
        },

        onError: function(evt, message){
            if(_websocket.readyState==3){
                var that = this;
                _cm.updateIcons('1').then(function(){
                    alert('Cannot connect to Socket Server');
                });
            }
        },

        doSend: function(message, _websocket){
            console.log("SENT: " + message);
            _websocket.send(message);

        },

        onIdle: function(message){
            _ws.onClose(null, message);
        }
    }
})(window);