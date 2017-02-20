/**
 * Created by ilanv on 20/02/2017.
 */

(function(){

    //WAIT FOR ICON CLICK
    chrome.browserAction.onClicked.addListener(function(){
        _cm.getParams(_cm.checkIfNeedToListen)

    });

    //ON REMOVE TAB
    chrome.tabs.onRemoved.addListener(function(tabId/*, removeInfo*/){
        if(_cm.tabId&&tabId==tabId){
            _cm.tabId = '';
        }
    })
})();
