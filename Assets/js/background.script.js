// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


(function(){
    cm.updateIcons('icon-1');
    chrome.browserAction.onClicked.addListener(function(){
        cm.updateIcons('icon-2');
        // chrome.storage.local.clear(function() {
        //     var error = chrome.runtime.lastError;
        //     if (error) {
        //         console.error(error);
        //     }
        // });

        //get the new Params
        cm.getParams(ws.init);
    });


    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
        if(cm.tabId&&tabId==tabId){
            cm.tabId = '';
        }
    })
})();
