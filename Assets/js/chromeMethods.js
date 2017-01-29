/**
 * Created by root on 25/01/17.
 */

(function(){
    window.cm = {
        getParams: function(callback){
            chrome.storage.sync.get({
                'extension': 123456,
                'socketUrl': 'www.socketdemo.com',
                'apiUrl': 'www.google.co.il'
            }, function(items){
                console.log(items);
                callback(items)
            });

        },
        setParams: function(fields){
            chrome.storage.sync.set(fields, function(items){
                // Notify that we saved.
                var feedback = $('.feedback');
                feedback.text('Setting saved');
                setTimeout(function(){
                    feedback.text('');
                    location.reload();
                }, 2000);
            });

        },
        getParamsFromForm: function(form){
            var inputs = $(form).find('input');
            var fields = {};
            $.each(inputs, function(index, field){
                var $field = $(field);
                if($field.attr('type')=='text'){
                    var name = $field.attr('name');
                    fields[name] = $(field).val();
                }
            });
            return fields;
        },
        setParamsToForm: function(items){
            var fields = $('.formOptions').find('input[type="text"]');
            fields.each(function(index, field){
                var name = $(field).attr('name');
                $(field).val(items[name]);
            });

        },
        updateIcons: function(iconImg){
            var file = "/Assets/img/" + iconImg + ".png";
            chrome.browserAction.setIcon({path: file});
        },
        initiateOnLoad: function(data, items){
            chrome.tabs.onUpdated.addListener(function(tabid, info, tab){

                if(info.status!="complete"){
                    return false;
                }

                $.get("http://" + items.apiUrl, {
                    extension: data['extension'],
                    phone: data['phone']
                }).done(function(data){
                    console.log(data);
                })

            });
        },
        updateTab: function(id, items, data){


            $(chrome.tabs.get(id, function(tab){
                chrome.tabs.update(id, {url: 'http://' + data.url}, function(){
                })
            }));

        }
    };

})();