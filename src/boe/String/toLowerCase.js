/**
 * @function toLowerCase
 * Upper case specified substring
 *
 * @return {String} Upper cased string
 */
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['../global'], function(global){
    var STRING_PROTO = global.String.prototype;

    function toLowerCase(startIndex, endIndex){
        if (startIndex == null && endIndex == null){
            return STRING_PROTO.toLowerCase.call(this);
        }
        
        if (endIndex == null){
            endIndex = this.length;
        }
        
        var substr = this.substring(startIndex, endIndex).toLowerCase();
        // concat and return
        return this.substring(0, startIndex) + substr + this.substring(endIndex, this.length);
    }

    return toLowerCase;
});