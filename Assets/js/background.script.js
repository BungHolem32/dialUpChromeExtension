(function(){
    //ON-LOAD SET ICON TO SAD-FACE(DISCONNECTED)
    _cm.updateIcons('1');

    //WAIT FOR ICON CLICK
    chrome.browserAction.onClicked.addListener(function(){
        _cm.updateIcons('2').then(function(){
            //get the new Params
            _cm.getParams(_ws.init);
        });

    });

    //ON REMOVE TAB
    chrome.tabs.onRemoved.addListener(function(tabId/*, removeInfo*/){
        if(_cm.tabId&&tabId==tabId){
            _cm.tabId = '';
        }
    })
})();
