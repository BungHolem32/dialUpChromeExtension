/**
 * Created by root on 25/01/17.
 */
(function(){

    window.output = '';
    window.websocket = window.websocket ? window.websocket : {};
    window.ws = {
        init: function(items){

            ws.items = items;
            if(websocket.readyState==1){
                websocket.close();
                return false;
            }

            if(!items.socketUrl){
                items.socketUrl = 'ww.testNotWork.com';
            }
            window.websocket = new WebSocket(items.socketUrl);

            if(typeof websocket=='object'){
                websocket.onopen = function(evt){
                    ws.onOpen(evt, websocket, this)
                };
                websocket.onclose = function(evt){
                    ws.onClose(evt)
                };
                websocket.onmessage = function(evt){
                    ws.onMessage(evt, this, items)
                };
                websocket.onerror = function(evt){
                    ws.onError(evt, this)
                };
            }
        },

        onOpen: function(evt, websocket){
            this.writeToScreen("CONNECTED");
            console.log(evt.data);
            this.doSend("WebSocket rocks", websocket);
        },

        onClose: function(evt){
            cm.updateIcons('icon-1');
            this.writeToScreen("DISCONNECTED");
        },


        onMessage: function(evt, websocket, items){
            this.writeToScreen('RESPONSE: ' + evt.data);
            console.log(evt.data);
            var data = JSON.parse(evt.data);
            if(data['extension']==items['extension']){

                if(cm.tabId){
                    cm.updateTab(cm.tabId,items,data);
                    return false;
                }

                chrome.tabs.create({
                    url: data.url,
                    active: true
                }, function(tab){
                    cm.initiateOnLoad(data, items);
                    cm.tabId = tab.id;
                });
            }
        },

        onError: function(evt){
            this.writeToScreen('ERROR: ' + evt.data);
            console.log(evt.data)
        },

        doSend: function(message, websocket){
            this.writeToScreen("SENT: " + message);
            websocket.send(message);
            cm.updateIcons('icon-3')
        },

        writeToScreen: function(message){
            var pre = document.createElement("p");
            pre.style.wordWrap = "break-word";
            pre.innerHTML = message;
        }
    }
})();