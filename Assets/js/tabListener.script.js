/**
 * Created by ilanv on 21/02/2017.
 */
(function(){

    chrome.runtime.onMessage.addListener(function(message){
        message = JSON.parse(message);
        var url = _cm.getUrl(message['apiUrl'], message['extension'], message['phone']);
        _cm.makeNewAjaxCall('GET', url, null, _cm.getAjaxSuccessCallback, _cm.getAjaxErrorMessages, false);
    })
})();