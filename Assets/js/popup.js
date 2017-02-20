/**
 * Created by ilanv on 20/02/2017.
 */

(function(){

    $('.listenerBtn').on('click', function(){
        _cm.updateIcons('2').then(function(){
            //get the new Params
            _cm.getParams(_ws.init);
        });
    })

    //ON REMOVE TAB
    chrome.tabs.onRemoved.addListener(function(tabId/*, removeInfo*/){
        if(_cm.tabId&&tabId==tabId){
            _cm.tabId = '';
        }
    })
})();
