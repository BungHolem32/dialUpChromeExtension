/**
 * Created by ilanv on 21/02/2017.
 */
(function(){
    chrome.runtime.onMessage.addListener(function(message){
        message = JSON.parse(message);
        if(message.hasOwnProperty('apiUrl')){
            var url = _h.genUrl(message['apiUrl'], message['extension'], message['phone']);
            _h.makeAjaxCall('GET', url, null, _h.getAjaxSuccessCallback, _h.getAjaxErrorMessages, false);
        }
    })
})();