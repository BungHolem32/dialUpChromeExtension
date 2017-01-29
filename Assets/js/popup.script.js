/**
 * Created by ilanv on 26/01/2017.
 */

(function(){
    var loc = location.hash;
    loc = loc.replace('#', '');
    $('.message').text(loc);
})();

