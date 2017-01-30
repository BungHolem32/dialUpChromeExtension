

(function(){

    //ON-LOAD SET ICON TO SAD-FACE(DISCONNECTED)
    cm.updateIcons('icon-1');

    //WAIT FOR ICON CLICK
    chrome.browserAction.onClicked.addListener(function(){
        cm.updateIcons('icon-2');
        //get the new Params
        cm.getParams(ws.init);
    });

    //ON REMOVE TAB
    chrome.tabs.onRemoved.addListener(function(tabId/*, removeInfo*/){
        if(cm.tabId&&tabId==tabId){
            cm.tabId = '';
        }
    })
})();
