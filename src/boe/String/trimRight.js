/*
 * Trim specified chars at the end of current string.
 * @member String.prototype
 * @return {String} trimed string
 */
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['../util'], function (util) {
    return function( trimChar ) {
        var hex;
        if ( util.type(trimChar) == 'String' ) {
            hex = trimChar.charCodeAt(0).toString(16);
            trimChar = hex.length <= 2 ? '\\x' + hex : '\\u' + hex;
        }
        else if ( trimChar instanceof RegExp ) {
            // leave it as is
        }
        else {
            trimChar = '\\s';
        }
        var re = new RegExp('(' + trimChar + '*$)', 'g');
        return this.replace(re, "");
    };
})