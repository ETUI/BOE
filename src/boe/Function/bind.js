/*
 * Function.bind
 */
define(['../util'], function (util) {
    // simply alias it
    var FUNCTION_PROTO = global.Function.prototype;

    return FUNCTION_PROTO.bind || util.bind;
})