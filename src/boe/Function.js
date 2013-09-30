/* 
 * Function extensions
 */
define(['./util'], function(util){
	"use strict";
	
	var global = util.g;
	var OBJECT_PROTO = global.Object.prototype;
	var ARRAY_PROTO = global.Array.prototype;
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
				var args = [ this, func ].concat( ARRAY_PROTO.slice.call(arguments) );
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
	!function(){
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
		
		fnCreator.once = function( callback ){
			
			if (callback != null && 
				OBJECT_PROTO.toString.call(callback).toLowerCase() !==
				'[object function]'){
				throw new Error('boeFunction.once.ownerNotFunction');
			}
			if (has(callback)){
				return null;
			}
			
			calledFuncs.push(callback);
			
			return callback.call.apply(callback, arguments);
			
		};
	}();
	
	/**
	 * @function boeFunction.memorize
	 **/
	!function(undef){
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
		
		fnCreator.memorize = function( callback ){
			
			if (callback != null && 
				OBJECT_PROTO.toString.call(callback).toLowerCase() !==
				'[object function]'){
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
					cursor.ret = callback.call.apply(callback, arguments);
					return cursor.ret;
				}
				else{
					cursor = argNode;
				}
				
			};
			
			ret = cursor.ret;
			
			return ret;
			
		};
	}();

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
	!function(){
		fn.cage = function(context) {
	        var slice = ARRAY_PROTO.slice;
	        var __method = this, args = slice.call(arguments);
	        args.shift();
	        return function() {
	            return __method.apply(context, args.concat(slice.call(arguments)));
	        };
	    };
	}();

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
