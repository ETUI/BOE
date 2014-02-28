/**
 * @function toLowerCase
 * Upper case specified substring
 *
 * @return {String} Upper cased string
 */
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['../util'], function(util){
    var STRING_PROTO = util.g.String.prototype;

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
    };

    return toLowerCase;
});