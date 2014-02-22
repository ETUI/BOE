/**
 * @function boeFunction.once
 * Do nothing if current function already executed once.
 * @param context the context to run the function
 * @param arguments the arguments to be passed.
 **/
define(['../util'], function(util){
    var global = util.g;

    var calledFuncs = [];
    
    function has(callback){
        var l = calledFuncs.length;
        while(l--){
            if (calledFuncs[l] === callback){
                return true;
            }
        }
        
        return false;
    };
    
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