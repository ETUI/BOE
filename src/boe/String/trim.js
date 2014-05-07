/*
 * Trim specified chars at the start and the end of current string.
 * @member String.prototype
 * @return {String} trimed string
 * @es5
 */
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['../util', './trimLeft', './trimRight'], function (util, trimLeft, trimRight) {
    var STRING_PROTO = util.g.String.prototype;
    return STRING_PROTO.trim || function() {
        var ret = trimLeft.call( this );
        ret = trimRight.call( ret );
        return ret;
    };
})