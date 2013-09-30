

define(['./boe/util', './boe/Array', './boe/Function', './boe/Number', './boe/Object', './boe/String'], 
    function(util, boeArray, boeFunction, boeNumber, boeObject, boeString){
    var undef, boe;
    var chainableWrapper = function(wrappee){
        return function(){
            var ret = wrappee.apply(this, arguments);
            if (ret === undef){
                return this;
            }
            return ret;
        };
    };
    
    /**
     * @function boe
     * attach helpers according to the type of obj
     * @param chainable enable the calling can be chain-style 
     **/
    boe = function(obj, chainable /* optional */ ){
        var 
            typ = util.type(obj),
            creator = boe[typ];
            
        if (creator != null && util.type(creator) === 'Function'){
            var ret = creator(obj);
            if (chainable==true){
                for(var key in ret){
                    if (util.type(ret[key]) === 'Function'){
                        ret[key] = chainableWrapper(ret[key]);
                    }
                }
            }

            return ret;
        }
        
        return obj;
    };

    /**
     * @function type
     * return the actual type of object
     */
    boe.type = util.type;

    boe.mixin = util.mixin;

    boe.Array = boeArray;

    boe.Function = boeFunction;

    boe.Number = boeNumber;

    boe.Object = boeObject;

    boe.String = boeString;

    return boe;
});