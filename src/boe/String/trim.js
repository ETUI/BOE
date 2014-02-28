/*
 * Trim specified chars at the start and the end of current string.
 * @member String.prototype
 * @return {String} trimed string
 * @es5
 */
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['../util'], function (util) {
    var STRING_PROTO = util.g.String.prototype;
    return STRING_PROTO.trim || function() {
        var trimChar = '\\s';
        var re = new RegExp('(^' + trimChar + '*)|(' + trimChar + '*$)', 'g');
        return this.replace(re, "");
    };
})