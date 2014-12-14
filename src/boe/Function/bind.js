/*
 * Function.bind
 */
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['../global'], function (global) {
    // simply alias it
    var FUNCTION_PROTO = global.Function.prototype;
    var ARRAY_PROTO = global.Array.prototype;

    return FUNCTION_PROTO.bind || function(context) {
        var slice = ARRAY_PROTO.slice;
        var __method = this, args = slice.call(arguments);
        args.shift();
        return function wrapper() {
            if (this instanceof wrapper){
                context = this;
            }
            return __method.apply(context, args.concat(slice.call(arguments)));
        };
    };
});