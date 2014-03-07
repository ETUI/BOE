/*
 * Function.bind
 */
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['../util'], function (util) {
    // simply alias it
    var FUNCTION_PROTO = util.g.Function.prototype;

    return FUNCTION_PROTO.bind || util.bind;
})