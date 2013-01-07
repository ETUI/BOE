define(function(){
	"use strict";
	
	var global = (Function("return this"))();

	var OBJECT_PROTO = global.Object.prototype;
	var ARRAY_PROTO = global.Array.prototype;
	var FUNCTION_PROTO = global.Function.prototype;

	var ret = {
		mixinAsStatic: function(target, fn){
	        for(var key in fn){
	            if (!fn.hasOwnProperty(key)){
	                continue;
	            }

	            target[key] = ret.bind.call(FUNCTION_PROTO.call, fn[key]);
	        }

	        return target;
	    },
	    type: function(obj){
	        var typ = OBJECT_PROTO.toString.call(obj);
	        var closingIndex = typ.indexOf(']');
	        return typ.substring(8, closingIndex);
	    },
	    mixin: function(target, source){

		    // in case only source specified
		    if (source == null){
		        source = target;
		        target= {};
		    }

		    for(var key in source){
		        if (!source.hasOwnProperty(key)){
		            continue;
		        }

		        target[key] = source[key]
		    }

		    return target;
		},
		bind: function(context) {
	        var slice = ARRAY_PROTO.slice;
	        var __method = this, args = slice.call(arguments);
	        args.shift();
	        return function wrapper() {
	            if (this instanceof wrapper){
	                context = this;
	            }
	            return __method.apply(context, args.concat(slice.call(arguments)));
	        };
	    },
	    g: global
	};

	return ret;
});