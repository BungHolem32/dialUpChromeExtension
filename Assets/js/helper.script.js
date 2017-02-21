/**
 * Created by ilanv on 21/02/2017.
 */
(function(){
    var helper = {
        genUrl: function(apiUrl, extension, phone){
            return apiUrl + "?exten=" + encodeURI(extension) + "&number=" + phone;
        },
        genObject: function(params){
            var object = {};
            Object.keys(params).forEach(function(key){
                object[key] = params[key];
            });
            return object;
        },
        genArrayFromSelection: function(selector){
            return Array.prototype.slice.call(document.querySelectorAll(selector));

        }
    }


})();