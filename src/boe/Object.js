/* 
 * Object extensions
 */
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['./util', './Object/chainable', './Object/shadow', './Object/clone'], 
    function(util, chainable, shadow, clone){
    "use strict";

    var UNDEF;

    var fn = {};

    /**
     * @function boeObject
     * The object builder, copy over all our object helper to
     * the instance
     * 
     * @usage var foo = {};
     * boeObject(foo).chainable();
     * 
     */
    var boeObject = function(obj){
        if (this instanceof boeObject){
            obj = new Object(obj, arguments[1]);
        }
        util.mixin(obj, fn);
        return obj;
    };

    /**
     * @function boeObject.chainable
     * Convert members of any object to return object itself so we can use
     * that object 'chain-style'.
     **/
    fn.chainable = chainable;

    /**
     * @function boeObject.shadow
     * Fast clone the object
     **/
    fn.shadow = shadow;

    /**
     * @function boeObject.clone
     * Clone the object
     **/
    fn.clone = clone;

    util.mixinAsStatic(boeObject, fn);

    return boeObject;
});
