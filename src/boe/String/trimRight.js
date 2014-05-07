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
define([], function () {
    return function() {
        var trimChar = '\\s';
        var re = new RegExp('(' + trimChar + '*$)', 'g');
        return this.replace(re, "");
    };
})