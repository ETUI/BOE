/**
 * @function boeFunction.once
 * Do nothing if current function already executed once.
 * @param context the context to run the function
 * @param arguments the arguments to be passed.
 **/
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['../util', '../global'], function(util, global){

    var calledFuncs = [];
    
    function has(callback){
        var l = calledFuncs.length;
        while(l--){
            if (calledFuncs[l] === callback){
                return true;
            }
        }
        
        return false;
    }
    
    function once( callback ){
        var callbackArgs = util.slice(arguments);
        callbackArgs[0] = this;

        if (callback != null && 
            util.type(callback) !== 'Function'){
            throw new Error('boeFunction.once.ownerNotFunction');
        }
        if (has(callback)){
            return null;
        }
        
        calledFuncs.push(callback);
        
        return callback.call.apply(callback, callbackArgs);
        
    };

    return once;
});