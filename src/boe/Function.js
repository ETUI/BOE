/* 
 * Function extensions
 */
define(['./util', './Function/once', './Function/memorize', './Function/cage'], 
    function(util, once, memorize, cage){

    "use strict";
    
    var global = util.g;
    var FUNCTION_PROTO = global.Function.prototype;

    var fnCreator = {};
    var fn = {};
    var nativeFn = {};
    
    /**
     * @function boeFunction
     * The function instance builder, copy over all our function helper to
     * the function instance
     * 
     * @usage var foo = function(){};
     * boeFunction(foo).once();
     * 
     */
    var boeFunction = function(func){
        if (this instanceof boeFunction){
            func = Function.apply(null, arguments);
        }

        // create sub methods
        util.mixin(func, fnCreator, function( key, value ){
            if ( typeof value != 'function' ) {
                return value;
            }
            // make sure the first argument is always point to the function instance
            // the reason we don't simply "bind" the member function's "this" to var "me", is because
            // we want to offer flexibility to user so that they can change the runtime context even when function is memorized or onced.
            return function() {
                var args = [ this, func ].concat( util.slice(arguments) );
                return value.call.apply( value, args );
            };
        });

        util.mixin(func, fn);

        return func;
    };

    /**
     * @function boeFunction.once
     * Do nothing if current function already executed once.
     * @param context the context to run the function
     * @param arguments the arguments to be passed.
     **/
    fnCreator.once = once;
    
    /**
     * @function boeFunction.memorize
     **/
    fnCreator.memorize = memorize;

    /**
     * @function boeFunction.cage

     * make sure the function was ran under certain context even it is 'newed'
     * try below code with bind and cage:

     * function foo(){console.log(this)}
     * bar = foo.cage(window);
     * new bar();
     * bar2 = foo.bind(window);
     * new bar2();
     **/
    fn.cage = cage;

    /**
     * Binds function execution context to specified object, locks its execution scope to an object.
     *
     * @member Function.prototype
     * @return {Function} Return a new function that its execution context is bond.
     * @param {Object} Context The context to be bond to.
     * @es5
     */
    FUNCTION_PROTO.bind ? (nativeFn.bind = FUNCTION_PROTO.bind):(fn.bind = util.bind);

    util.mixin(boeFunction, fnCreator);
    util.mixinAsStatic(boeFunction, fn);
    util.mixinAsStatic(boeFunction, nativeFn);

    return boeFunction;
});
