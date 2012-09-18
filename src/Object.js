/* 
 * Object extensions
 */
define(['util'], function(util){
	"use strict";
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
	boeObject = function(obj){
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
	!function(undef){

	    var chn = function(){
	        return new wrapperCtor(this);
	    };
	    
	   
	    var wrappers = {
	        func: function(context, propName){
	            return function(){
	                var ret = context[propName].apply(context, arguments);
	                    
	                // if no return value, return myself
	                if (ret === undef){
	                    return this;
	                }
	                return ret;
	            };
	        },
	        prop: function(context, propName){
	            return function(value){
	                if (value === undef){
	                    return context[propName];
	                }
	                else{
	                    context[propName] = value;
	                    return this;
	                }
	            };
	        }
	    };
	    
	    /**
	     * Wrapper Private Methods
	     */
	    var wrapperPrvt = {
	        /**
	         * @function init
	         * Copy over all members from obj and create corresponding chain-style
	         * wrapping function.
	         */
	        init: function(obj){
	            this._0_target = obj;
	            var type;
	            for(var name in obj){
	                type = Object.prototype.toString.call(obj[name]).toUpperCase();
	                if (type.indexOf('FUNCTION') > 0){
	                    this[name] = wrappers.func(obj, name);
	                }
	                else{
	                    this[name] = wrappers.prop(obj, name);
	                }
	            }
	        }
	    };
	    
	    var wrapperCtor = function(obj){
	        wrapperPrvt.init.call(this, obj);
	    };
	    
	    wrapperCtor.prototype = {
	        _0_rebuild: function(){
	            wrapperPrvt.init.call(this, this._0_target);
	            return this;
	        }
	    };
	    
	    fn.chainable = chn;
	    
	}();

	/**
	 * @function boeObject.shadow
	 * Fast clone the object
	 * that object 'chain-style'.
	 **/
	!function(){
		function Cloner(){
		}

		fn.shadow = function boeObjectFastClone(deep){
		    var ret,
		    	obj = this;
		    
		    Cloner.prototype = obj;
		    
		    ret = new Cloner();

		    if (deep){
		    	for(var key in ret){
			        var cur = ret[key];
			        if (typeof cur == 'object'){
			            ret[key] = deepClone(cur);
			        }
			    }
		    }

		    return ret;
		}
	}();

	util.mixinAsStatic(boeObject, fn);

	return boeObject;
});
