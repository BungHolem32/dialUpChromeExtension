/**
 * Created by ilanv on 20/02/2017.
 */


(function(){

    //DATA-TABLE EXTENSION
    $('#table').DataTable({
        paging: false,
        info: false,
        length: 180
    });

    //FOR ADD EVENT LISTENER I HAD TO CREATE ARRAY OF BUTTON AND ITERATE OVER THEM
    var callButtons = Array.prototype.slice.call(document.querySelectorAll('.button .call'));
    var chatButtons = Array.prototype.slice.call(document.querySelectorAll('.button .chat'));

    //CALLBACK CALL-BUTTONS
    var callButtonOnCallback = function(){

        //FILTER THE LEADS DETAIL AND CREATE OBJECT WITH ALL SPECIFIC DATA
        var tempArrayData = Array.prototype.slice.call(this.parentNode.parentNode.childNodes);

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
        _cm.queryTabs({}, function(tabs){
            var tabsLength = tabs.length;
            _cm.tabId = tabs[tabsLength - 1].id;

            /**
             * IF YOU WANT TO CREATE NEW TAB WHEN THE THERE'S LESS THEN TWO TABS
             * ENABLE THIS SECTION THERE WAS SOME PROBLEM WHEN ENABLE IT
             * todo: need to fix it
             * (THE REQUEST DOESN'T INITIATE)
             */

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

    var chatButtonsOnCallback = function(){
        /**
        ** todo - need to integrate with some chat api to connect with the chat before notify on it
        **/

        var message = {
            type: 'basic',
            iconUrl: '/assets/img/reminder.png',
            title: 'This Is A Test Reminder',
            message: 'You have things to do. Wake up, dude!'
        }
        //noinspection JSUnresolvedFunction
        /** @namespace chrome.notifications */
        chrome.notifications.create('reminder', message, function(notificationId){
        });
    };

    //ITERATE OVER ALL CALL-BUTTONS
    callButtons.map(function(el){
        el.onclick = callButtonOnCallback;
    });

    //ITERATE OVER ALL CHAT-BUTTONS
    chatButtons.map(function(el){
        el.onclick = chatButtonsOnCallback;
    })

})();
