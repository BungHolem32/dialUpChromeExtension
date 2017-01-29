/**
 * Created by Ilan vachtel on 25/01/17.
 */

(function(){
    window.cm = {
        getParams: function(callback){
            chrome.storage.sync.get({
                'accountId': false,
                'url': true
            }, function(items){
                callback(items)
            });

        },
        setParams: function(fields){
            chrome.storage.sync.set(fields, function(items){
                // Notify that we saved.
                var feedback = document.querySelector('.feedback');
                feedback.innerHTML = 'Setting saved';
                setTimeout(function(){
                    feedback.innerHTML = '';
                    location.reload();
                }, 2000);
            });

        },
        getParamsFromForm: function(){
            var inputs = Array.prototype.slice.call(document.querySelectorAll('.formOptions input[type="text"]'));
            var fields = {};
            inputs.map(function(field){
                var name = field.getAttribute('name');
                fields[name] = field.value;
            });
            return fields;
        },
        setParamsToForm: function(items){
            var inputs = Array.prototype.slice.call(document.querySelectorAll('.formOptions input[type="text"]'));
            inputs.map(function(field){
                var name = field.getAttribute('name');
                console.log(document.querySelector("#" + name));
                document.querySelector("#" + name).value = items[name];
            });
        }
    };
})();