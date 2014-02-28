/*
 * Function.bind
 */
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['../util'], function (util) {
    // simply alias it
    var FUNCTION_PROTO = util.g.Function.prototype;

    return FUNCTION_PROTO.bind || util.bind;
})