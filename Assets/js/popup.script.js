/**
 * Created by ilanv on 26/01/2017.
 */

(function(){
    var loc = location.hash;
    loc = loc.replace('#', '');
    document.querySelector('.message').innerHTML = loc;
})();

