/**
 * @function boeFunction.memorize
 **/
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['../util'], function(util){
    var undef;

    function Node(){
        this.subs = [];
        this.value = null;
    };
    
    Node.prototype.get = function(value){
        var subs = this.subs;
        var l = subs.length;
        while(l--){
            if (subs[l].value === value){
                return subs[l];
            }
        }
        
        return undef;
    };
    
    Node.prototype.add = function(value){
        var subs = this.subs;
        var ret = new Node;
        ret.value = value;
        subs[subs.length] = ret;
        return ret;
    };
    
    function memorize( callback ){
        var callbackArgs = util.slice(arguments);
        callbackArgs[0] = this;

        if (callback != null && 
            util.type(callback) !== 'Function'){
            throw new Error('boeFunction.memorize.ownerNotFunction');
        }
        
        if (!callback.__memorizeData__){
            callback.__memorizeData__ = new Node;
        }
        
        var root = callback.__memorizeData__;
        var i, l, cursor = root;
        
        var ret = null;
        
        
        // cache it and then return it
        for(i = 0, l= arguments.length; i < l; i++){
            var arg = arguments[i],
                argNode = cursor.get(arg);
                
            if (argNode === undef){
                
                // cache the arguments to the tree
                for(;i < l; i++){
                    cursor = cursor.add(arguments[i]);
                }
                
                // call original function and cache the result
                cursor.ret = callback.call.apply(callback, callbackArgs);
                return cursor.ret;
            }
            else{
                cursor = argNode;
            }
            
        };
        
        ret = cursor.ret;
        
        return ret;
        
    };

    return memorize;
});