/**
 * Created by Ilan vachtel on 25/01/17.
 */

(function(){
    window.cm = {
        getParams: function(callback){
            var params = cm.getDefaultValues();
            chrome.storage.sync.get(params, function(items){
                callback(items)
            });

        },
        getDefaultValues: function(){
            var fields = Array.prototype.slice.call(document.querySelectorAll('input[type="text"]'));
            var params = {};
            fields.map(function(field){
                params[field.getAttribute('name')] = field.getAttribute('default')||true;
            });
            return params
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