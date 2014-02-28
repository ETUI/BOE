/* 
 * Number extensions
 */
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['./util', './Number/toCurrency'], function(util, toCurrency){
    "use strict";
    var fn = {};

    /**
     * @function boeNumber
     * The Number object builder, copy over all our number helper to
     * the instance
     * 
     * @usage var foo = 123;
     * boeNumber(foo).toCurrency();
     * 
     */
    var boeNumber = function(num){
        num = new Number(num);
        util.mixin(num, fn);
        return num;
    };
    
    /**
     * @function toCurrency
     * Return a string that with commas seperated every 3 char.
     *
     * @return {String} a string that represent the number and seperated with commas every 3 chars.
     */
    fn.toCurrency = toCurrency;

    util.mixinAsStatic(boeNumber, fn);

    return boeNumber;
});
