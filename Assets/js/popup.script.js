/**
 * Created by ilanv on 20/02/2017.
 */

(function(){

    //FOR ADD EVENT LISTENER I HAD TO CREATE ARRAY OF BUTTON AND ITERATE OVER THEM
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.button'));
    var callBackOnClick = function(){

        //FILTER THE LEADS DETAIL AND CREATE OBJECT WITH ALL SPECIFIC DATA
        var tempArrayData = Array.prototype.slice.call(this.parentNode.childNodes);
        var leadDetails = {};
        var buildObject = function(domElem){
            if(domElem.tagName!=undefined&&domElem.className!="button"){
                if(domElem.className=='user_id'){
                    leadDetails['url'] = domElem.getAttribute('data-href');
                }
                leadDetails[domElem.className] = domElem.innerHTML;
            }
        };
        tempArrayData.forEach(buildObject);


        //GET ALL THE TABS IN THE CURRENT WINDOW
        chrome.tabs.query({}, function(tabs){
            var tabsLength = tabs.length;
            _cm.tabId = tabs[tabsLength - 1].id;


            // if(tabsLength > 1){
            //     _cm.tabId = tabs[tabsLength - 1].id;
            // }


            _cm.getParams(function(setting){

                var params = {
                    "apiUrl": setting['apiUrl'],
                    "extension": setting['extension'],
                    "url": leadDetails['url'],
                    "phone": leadDetails['phone']
                };
                var message = JSON.stringify(_h.genObject(params));

                if(_cm.tabId){
                    _cm.updateTab(_cm.tabId, leadDetails, setting).then(function(response){
                        chrome.tabs.sendMessage(_cm.tabId, message)
                    }).catch(function(e){
                        console.log(e);
                    });
                } else{
                    _cm.createTab(leadDetails, setting).then(function(response){
                        chrome.tabs.sendMessage(_cm.tabId, message)
                    }).catch(function(e){
                        console.log(e);
                    });
                }
            });
        })
    };


    //ITERATE OVER ALL BUTTONS
    buttons.map(function(el){
        el.onclick = callBackOnClick;
    });

    $('#table').DataTable({
        scrollY: 250,
        paging:false
    });


})();
