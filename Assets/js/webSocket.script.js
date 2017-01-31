/**
 * Created by root on 25/01/17.
 */
(function(){

    window.output = '';
    window._websocket = window._websocket ? window._websocket : {};
    window._ws = {

        init: function(settings){
            _ws.settings = settings;

            if(_websocket.readyState==1){
                _websocket.close();
                return false;
            }
            if(!settings.socketUrl){
                settings.socketUrl = 'ww.testNotWork.com';
            }
            try{
                window._websocket = new WebSocket(settings.socketUrl);
                var timeOutTillIdle = setTimeout(function(){
                    _ws.disconnectFromWebSocketOnIdle()
                }, 20000);

            } catch(e){
                _cm.updateIcons('1');
                alert('Please insert valid url socket');
                return false;
            }

            if(typeof _websocket=='object'){
                _websocket.onopen = function(evt){
                    _ws.onOpen(evt, _websocket, this)
                };
                _websocket.onclose = function(evt){
                    _ws.onClose(evt)
                };
                _websocket.onmessage = function(evt){
                    _ws.onMessage(evt, this, settings, timeOutTillIdle)
                };
                _websocket.onerror = function(evt){
                    _ws.onError(evt, this)
                };
            }
        },

        onOpen: function(evt, _websocket){
            this.writeToScreen("CONNECTED");
            this.doSend("WebSocket rocks", _websocket);
        },

        onClose: function(/*evt*/){
            _cm.updateIcons('1');
            this.writeToScreen("DISCONNECTED");
        },


        onMessage: function(evt, _websocket, settings, timeOutTillIdle){
            this.writeToScreen('RESPONSE: ' + evt.data);
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
                alert('Cannot connect to Socket Server');
                _cm.updateIcons('1');
            }
            this.writeToScreen('ERROR: ' + message);
        },

        doSend: function(message, _websocket){
            this.writeToScreen("SENT: " + message);
            _websocket.send(message);
            _cm.updateIcons('3')
        },

        writeToScreen: function(message){
            var pre = document.createElement("p");
            pre.style.wordWrap = "break-word";
            pre.innerHTML = message;
        },
        disconnectFromWebSocketOnIdle: function(){
            _websocket.close();

            alert('Cannot open CRM.');
            _cm.updateIcons('1');
        }

    }
})();