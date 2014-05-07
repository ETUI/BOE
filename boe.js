(function() { 
var global = new Function('return this')();var myDefine = (function(factory){ var ret = factory();typeof module != 'undefined' && (module.exports = ret);global.define && global.define(function(){return ret;});global.boe = ret; });
var require, define;
(function (undef) {
    var mod = {}, g = this;
    function resolvePath(base, relative){
        var ret, upCount = 0, l;

        base = base.split('/');
        relative = relative.split('/');
        base.pop();
        ret = base.concat(relative);

        for(l = ret.length ; l--; ){
            if ( ret[l] == '.' ) {
                ret.splice( l, 1 );
            }
            else if ( ret[l] == '..' ) {
                upCount++;
            }
            else {
                if ( upCount > 0 ) {
                    ret.splice( l, 2 );
                    upCount--;
                }
            }
        }
        return ret.join('/');
    }
    define = function( id, deps, factory ){
        mod[id] = {
            p: id,
            d: deps,
            f: factory
        };
    };
    define.amd = true;
    require = function(deps, factory){
        var module = this;
        var resolved = [], cur, relative, absolute;

        if ( module == null || module === g ) {
            module = { p: '_NE_' };
        }

        if ( typeof deps == 'string' && factory == null ) {
            deps = [deps];
        }

        for(var i = 0; i < deps.length; i++) {
            relative = deps[i];
            absolute = resolvePath( module.p, relative );
            if ( absolute == "require" ) {
                cur = {
                    p: '_NE_',
                    d: [],
                    f: function(){ return require }
                };
            }
            else {
                cur = mod[absolute];
            }
            if ( !cur ) {throw "module not found"}
            resolved.push( require.call( cur, cur.d, cur.f ) );
        }

        resolved.push(require, {});
        if ( factory ) {
            return factory.apply(g, resolved);
        }
        else {
            return resolved[0];
        }
    };
}());
define("../lib/amdshim/amdshim", function(){});

define('boe/util',[],function(){
    
    
    var global = (Function("return this"))();

    var OBJECT_PROTO = global.Object.prototype;
    var ARRAY_PROTO = global.Array.prototype;
    var FUNCTION_PROTO = global.Function.prototype;
    var FUNCTION = 'function';

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
        mixin: function(target, source, map){

            // in case only source specified
            if (source == null){
                source = target;
                target= {};
            }

            for(var key in source){
                if (!source.hasOwnProperty(key)){
                    continue;
                }

                target[key] = ( typeof map == FUNCTION ? map( key, source[key] ) : source[key] );
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
        slice: function(arr) {
            return ARRAY_PROTO.slice.call(arr);
        },
        g: global
    };

    return ret;
});
/* 
 * Array extensions
 */
define('boe/Array',['./util'], function(util){
    
    var global = util.g;
    var ARRAY_PROTO = global.Array.prototype;
    var UNDEF;
    
    var fn = {};
    var nativeFn = {};
    
    /**
     * @function etui.n.Function
     * The function instance builder, copy over all our function helper to
     * the function instance
     * 
     * @usage var foo = function(){};
     * etui.n.Function(foo).once();
     * 
     */
    var boeArray  = function(arr){
        if (this instanceof boeArray){
            arr = Array.apply(null, arguments);
        }
        util.mixin(arr, fn);
        return arr;
    };

    /*
     * Creates a new array with all of the elements of this array for which the provided
     * filtering function returns true.
     * @es5
     */
    ARRAY_PROTO.filter ? (fn.filter = function(fun /*, thisp */){  
      
        if (this === void 0 || this === null)  
            throw new TypeError();  
      
        var t = Object(this);  
        var len = t.length >>> 0;  
        if (typeof fun !== "function"){
            throw new TypeError();
        }
      
        var res = [];  
        var thisp = arguments[1];  
        for (var i = 0; i < len; i++)  
        {  
            if (i in t)  
            {  
                var val = t[i]; // in case fun mutates this  
                if (fun.call(thisp, val, i, t)){
                    res.push(val);
                }
            }  
        }  
      
        return res;  
    }): (nativeFn.filter = ARRAY_PROTO.filter);

    /*
     * Creates a new array with the results of calling a provided function on every element in this array.
     * @member Array.prototype

     * Production steps of ECMA-262, Edition 5, 15.4.4.19  
     * Reference: http://es5.github.com/#x15.4.4.19  
     * @es5
     */
    ARRAY_PROTO.map ? (fn.map = function(callback, thisArg) {  
      
        var T, A, k;  
      
        if (this == null) {  
          throw new TypeError(" this is null or not defined");  
        }  
      
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.  
        var O = Object(this);  
      
        // 2. Let lenValue be the result of calling the Get internal method of O with the 
        // argument "length".  
        // 3. Let len be ToUint32(lenValue).  
        var len = O.length >>> 0;  
      
        // 4. If IsCallable(callback) is false, throw a TypeError exception.  
        // See: http://es5.github.com/#x9.11  
        if (Object.prototype.toString.call(callback) != "[object Function]") {  
          throw new TypeError(callback + " is not a function");  
        }  
      
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.  
        if (thisArg) {  
          T = thisArg;  
        }  
      
        // 6. Let A be a new array created as if by the expression new Array(len) where Array is  
        // the standard built-in constructor with that name and len is the value of len.  
        A = new Array(len);  
      
        // 7. Let k be 0  
        k = 0;  
      
        // 8. Repeat, while k < len  
        while(k < len) {  
      
          var kValue, mappedValue;  
      
          // a. Let Pk be ToString(k).  
          //   This is implicit for LHS operands of the in operator  
          // b. Let kPresent be the result of calling the HasProperty internal method of O with 
          //   argument Pk.  
          //   This step can be combined with c  
          // c. If kPresent is true, then  
          if (k in O) {  
      
            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.  
            kValue = O[ k ];  
      
            // ii. Let mappedValue be the result of calling the Call internal method of callback  
            // with T as the this value and argument list containing kValue, k, and O.  
            mappedValue = callback.call(T, kValue, k, O);  
      
            // iii. Call the DefineOwnProperty internal method of A with arguments  
            // Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, 
            // Configurable: true},  
            // and false.  
      
            // In browsers that support Object.defineProperty, use the following:  
            // Object.defineProperty(A, Pk, 
            // { value: mappedValue, writable: true, enumerable: true, configurable: true });  
      
            // For best browser support, use the following:  
            A[ k ] = mappedValue;  
          }  
          // d. Increase k by 1.  
          k++;  
        }  
      
        // 9. return A  
        return A;  
    }): (nativeFn.map = ARRAY_PROTO.map);
    
    /*
     * Returns the last index at which a given element can be found in the array,
     * or -1 if it is not present. The array is searched backwards, starting at fromIndex.
     * @es5
     */
    ARRAY_PROTO.lastIndexOf ? (fn.lastIndexOf = function(searchElement /*, fromIndex*/){

        if (this === void 0 || this === null){
          throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0){
            return -1;
        }

        var n = len;
        if (arguments.length > 1){
            n = Number(arguments[1]);
            if (n !== n){
                n = 0;
            }
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)){
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }

        var k = n >= 0
              ? Math.min(n, len - 1)
              : len - Math.abs(n);

        for (; k >= 0; k--){
            if (k in t && t[k] === searchElement){
              return k;
            }
        }
        return -1;
    }): (nativeFn.lastIndexOf = ARRAY_PROTO.lastIndexOf); 

    /*
     * Returns the first index at which a given element can be found in the array,
     * or -1 if it is not present.
     * @es5
     */
    ARRAY_PROTO.indexOf ? (fn.indexOf = function (searchElement /*, fromIndex */ ) {  
        
        if (this === void 0 || this === null) {  
            throw new TypeError();  
        }  
        var t = Object(this);  
        var len = t.length >>> 0;  
        if (len === 0) {  
            return -1;  
        }  
        var n = 0;  
        if (arguments.length > 0) {  
            n = Number(arguments[1]);  
            if (n !== n) { // shortcut for verifying if it's NaN  
                n = 0;  
            } else if (n !== 0 && n !== window.Infinity && n !== -window.Infinity) {  
                n = (n > 0 || -1) * Math.floor(Math.abs(n));  
            }  
        }  
        if (n >= len) {  
            return -1;  
        }  
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
        for (; k < len; k++) {  
            if (k in t && t[k] === searchElement) {  
                return k;  
            }  
        }  
        return -1;  
    }):(nativeFn.indexOf = ARRAY_PROTO.indexOf);

    /*
     * Executes a provided function once per array element.
     * @es5
     */
    // Production steps of ECMA-262, Edition 5, 15.4.4.18  
    // Reference: http://es5.github.com/#x15.4.4.18  
    ARRAY_PROTO.forEach ? (fn.forEach = function( callback, thisArg ) {  
      
        var T, k;  

        if ( this == null ) {  
            throw new TypeError( " this is null or not defined" );  
        }  

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.  
        var O = Object(this);  

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument 
        //  "length".  
        // 3. Let len be ToUint32(lenValue).  
        var len = O.length >>> 0;  

        // 4. If IsCallable(callback) is false, throw a TypeError exception.  
        // See: http://es5.github.com/#x9.11  
        if ( Object.prototype.toString.call(callback) != "[object Function]" ) {  
            throw new TypeError( callback + " is not a function" );  
        }  

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.  
        if ( thisArg ) {  
            T = thisArg;  
        }  

        // 6. Let k be 0  
        k = 0;  

        // 7. Repeat, while k < len  
        while( k < len ) {  

            var kValue;  

            // a. Let Pk be ToString(k).  
            //   This is implicit for LHS operands of the in operator  
            // b. Let kPresent be the result of calling the HasProperty internal method of O with 
            //  argument Pk.  
            //   This step can be combined with c  
            // c. If kPresent is true, then  
            if ( k in O ) {  

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.  
                kValue = O[ k ];  

                // ii. Call the Call internal method of callback with T as the this value and  
                // argument list containing kValue, k, and O.  
                callback.call( T, kValue, k, O );  
            }  
            // d. Increase k by 1.  
            k++;  
        }  
        // 8. return undefined  
    }): (nativeFn.forEach = ARRAY_PROTO.forEach); 

    /**
     * Tests whether all elements in the array pass the test implemented by the provided function.
     */
    ARRAY_PROTO.every ? (fn.every = function(fun /*, thisp */){
        if (this === void 0 || this === null){
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function"){
            throw new TypeError();
        }

        var thisp = arguments[1];
        for (var i = 0; i < len; i++){
            if (i in t && !fun.call(thisp, t[i], i, t)){
                return false;
            }
        }

        return true;
    }):(nativeFn.every = ARRAY_PROTO.every);

    /**
     * Tests whether some element in the array passes the test implemented by the provided function.
     * @es5
     */
    ARRAY_PROTO.some ? (fn.some = function(fun /*, thisp */){

        if (this === void 0 || this === null){
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function"){
            throw new TypeError();
        }

        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
          if (i in t && fun.call(thisp, t[i], i, t)){
              return true;
          }
        }

        return false;
    }): (nativeFn.some = ARRAY_PROTO.some);

    /*
     * Apply a function against an accumulator and each value of the array 
     * (from left-to-right) as to reduce it to a single value.
     * @es5
     */
    ARRAY_PROTO.reduce ? (fn.reduce = function reduce(accumlator){  
        var i, l = this.length, curr;  
          
          // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."  
        if(typeof accumlator !== "function") {
            throw new TypeError("First argument is not callable");  
        }
  
        // == on purpose to test 0 and false.  
        if((l == 0 || l === null) && (arguments.length <= 1)){
            throw new TypeError("Array length is 0 and no second argument");  
        }
          
        if(arguments.length <= 1){  
          curr = this[0]; // Increase i to start searching the secondly defined element in the array  
          i = 1; // start accumulating at the second element  
        }  
        else{  
          curr = arguments[1];  
        }  
          
        for(i = i || 0 ; i < l ; ++i){  
            if(i in this)  {
              curr = accumlator.call(undefined, curr, this[i], i, this);  
            }
        }  
          
        return curr;  
    }): (nativeFn.reduce = ARRAY_PROTO.reduce);

    /*
     * Apply a function simultaneously against two values of the array
     * (from right-to-left) as to reduce it to a single value.
     * @es5
     */
    ARRAY_PROTO.reduceRight ? (fn.reduceRight = function(callbackfn /*, initialValue */){
        if (this === void 0 || this === null){
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof callbackfn !== "function"){
            throw new TypeError();
        }

        // no value to return if no initial value, empty array
        if (len === 0 && arguments.length === 1){
            throw new TypeError();
        }

        var k = len - 1;
        var accumulator;
        if (arguments.length >= 2){
            accumulator = arguments[1];
        }
        else{
            do{
                if (k in this){
                    accumulator = this[k--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--k < 0){
                    throw new TypeError();
                }
            }
            while (true);
        }

        while (k >= 0){
            if (k in t){
                accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
            }
            k--;
        }

        return accumulator;
    }): (nativeFn.reduceRight = ARRAY_PROTO.reduceRight);

    /*
     * Shuffle current array
     */
    fn.shuffle = function() {
        var len = this.length;
        var l = len;
        while (l--) {
            var p = parseInt(Math.random()*len);
            var t = this[l];
            this[l] = this[p];
            this[p] = t;
        }
    };

    /*
     * Pop random item from array
     * @param popIt default to true, false to not remove it from array
     */

    fn.random = function(popIt){
        if (popIt === UNDEF){
            popIt = true;
        }
        var idx = ~~(Math.random() * this.length);
        var ret = this[idx];

        if (popIt){
            this.splice(idx, 1);
        }

        return ret;
    };

    /*
     * Returns true if an object is an array, false if it is not.
     * @es5
     */
    boeArray.isArray = function (arg) {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };

    util.mixinAsStatic(boeArray, fn);
    util.mixinAsStatic(boeArray, nativeFn);

    return boeArray;
});

/**
 * @function boeFunction.once
 * Do nothing if current function already executed once.
 * @param context the context to run the function
 * @param arguments the arguments to be passed.
 **/
define('boe/Function/once',['../util'], function(util){
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
/**
 * @function boeFunction.memorize
 **/
define('boe/Function/memorize',['../util'], function(util){
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
define('boe/Function/cage',['../util'], function(util){
    function cage(context) {
        var __method = this, args = util.slice(arguments);
        args.shift();
        return function() {
            return __method.apply(context, args.concat(util.slice(arguments)));
        };
    };

    return cage;
});
/* 
 * Function extensions
 */
define('boe/Function',['./util', './Function/once', './Function/memorize', './Function/cage'], 
    function(util, once, memorize, cage){

    
    
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

/**
 * @function toCurrency
 * Return a string that with commas seperated every 3 char.
 *
 * @return {String} a string that represent the number and seperated with commas every 3 chars.
 */
define('boe/Number/toCurrency',[],function () {

    function toCurrency(fixedLength, formatFloat){
        var formated = this.valueOf() + '';
        var floatIndex = formated.indexOf('.');
        var chars = formated.split('');
        var result = [];
        var delimiterIndex, len = chars.length, fixedCounter=0, tmpChar;
        
        if (floatIndex < 0){
            // means the dot actually is at the end of the string
            floatIndex = len;
        }
        
        for(var i = 0; i < len; i++){
            // don't put commas to the end
            if (i > len - 1 || 
                (fixedLength != null && i > fixedLength + floatIndex)
                ) continue;
                
            tmpChar = chars[i];
            if (i < floatIndex - 1 ){
                delimiterIndex = (floatIndex - 1 - i);
                if (delimiterIndex != 0 && delimiterIndex % 3 == 0){
                    tmpChar = chars[i] + ',';
                }

            }
            else if (formatFloat && i > floatIndex - 1){
                
                if (fixedCounter++ <= fixedLength){
                    delimiterIndex = (i - floatIndex);
                    if (delimiterIndex != 0 && delimiterIndex % 3 == 0 &&
                        // check it is not the last char
                        i < fixedLength + floatIndex){
                        tmpChar = chars[i] + ',';
                    }
                }

            }

            result.push(tmpChar);
        }
        
        if (result[result.length - 1] == '.' ) {
            result.pop();
        }
        
        formated = result.join('');
        
        return formated;
    }

    return toCurrency;
});
/* 
 * Number extensions
 */
define('boe/Number',['./util', './Number/toCurrency'], function(util, toCurrency){
    
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

/**
 * @function boeObject.chainable
 * Convert members of any object to return object itself so we can use
 * that object 'chain-style'.
 **/
define('boe/Object/chainable',['../util'], function(util){

    var undef;

    function chainable(){
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
                if (util.type(obj[name]) == 'Function'){
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
    
    return chainable;

});
define('boe/Object/shadow',['../util'], function (util) {

    var FUNCTION = 'function';
    var OBJECT = 'object';
    var FUNCTION_PROTO = util.g.Function.prototype;
    var UNDEF;

    function Cloner(){
    }

    var objectCache = [];
    var traverseMark = '__boeObjectShadow_Traversed';

    function boeObjectFastClone(deep){
        var ret,
            obj = this;

        if ( traverseMark in this ) {
            // current object is already traversed
            // no need to clone, return the clone directly
            return this[traverseMark];
        }

        // push to stack
        objectCache.push( this );

        if (typeof this == FUNCTION) {
            ret = window.eval("true?(" + FUNCTION_PROTO.toString.call(this) + "):false");
            this[traverseMark] = ret;
            util.mixin( ret, this, ( deep ? function( key, value ){
                if ( key == traverseMark ) {
                    return UNDEF;
                }
                if (typeof value == OBJECT || typeof value == FUNCTION) {
                    return boeObjectFastClone.call( value, deep );
                }
                else {
                    return value;
                }
            } : UNDEF ) );
            // remove unneccesary copy of traverseMark
            delete ret[traverseMark];
        }
        else {
            Cloner.prototype = obj;
            ret = new Cloner();
            this[traverseMark] = ret;
            if (deep){
                for(var key in ret){
                    if ( key == traverseMark && ret.hasOwnProperty(key) == false ) {
                        // if it is the traverseMark on the proto, skip it
                        continue;
                    }
                    var cur = ret[key];
                    if (typeof cur == OBJECT || typeof cur == FUNCTION) {
                        ret[key] = boeObjectFastClone.call( cur, deep );
                    }
                }
            }
        }

        if ( objectCache.pop( ) != this ) {
            throw "boe.Object.shadow: stack corrupted."
        }

        delete this[traverseMark];

        return ret;
    }

    return boeObjectFastClone;
});
define('boe/Object/clone',['../util'], function(util){

    var FUNCTION = 'function';
    var OBJECT = 'object';
    var FUNCTION_PROTO = util.g.Function.prototype;

    var objectCache = [];
    var traverseMark = '__boeObjectClone_Traversed';

    function boeObjectClone( deep ){
        var ret,
            obj = this;

        if ( traverseMark in this ) {
            // current object is already traversed
            // no need to clone, return the clone directly
            return this[traverseMark];
        }

        // push to stack
        objectCache.push( this );

        // clone starts
        if (typeof this == FUNCTION) {
            ret = window.eval("true?(" + FUNCTION_PROTO.toString.call(this) + "):false");
        }
        else if (util.type(this) == "Array") {
            ret = [];
        }
        else {
            ret = {};
        }

        this[traverseMark] = ret;

        for( var key in this ) {

            if ( this.hasOwnProperty(key) == false || key == traverseMark ) {
                // if it is the traverseMark on the proto, skip it
                continue;
            }

            var cur = this[key];

            if ( deep && (typeof cur == OBJECT || typeof cur == FUNCTION) ) {
                ret[key] = boeObjectClone.call( cur, deep );
            }
            else {
                ret[key] = cur;
            }
        }

        // clone ends

        if ( objectCache.pop( ) != this ) {
            throw "boe.Object.shadow: stack corrupted."
        }

        delete this[traverseMark];

        return ret;
    };

    return boeObjectClone;
});
/* 
 * Object extensions
 */
define('boe/Object',['./util', './Object/chainable', './Object/shadow', './Object/clone'], 
    function(util, chainable, shadow, clone){
    

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

/**
 * @function toUpperCase
 * Lower case specified substring
 *
 * @return {String} Upper cased string
 */
define('boe/String/toUpperCase',['../util'], function(util){
    var STRING_PROTO = util.g.String.prototype;

    function toUpperCase(startIndex, endIndex){
        if (startIndex == null && endIndex == null){
            return STRING_PROTO.toUpperCase.call(this);
        }
        
        if (endIndex == null){
            endIndex = this.length;
        }
        
        var substr = this.substring(startIndex, endIndex).toUpperCase();
        // concat and return
        return this.substring(0, startIndex) + substr + this.substring(endIndex, this.length);
    }

    return toUpperCase;
});
/**
 * @function toLowerCase
 * Upper case specified substring
 *
 * @return {String} Upper cased string
 */
define('boe/String/toLowerCase',['../util'], function(util){
    var STRING_PROTO = util.g.String.prototype;

    function toLowerCase(startIndex, endIndex){
        if (startIndex == null && endIndex == null){
            return STRING_PROTO.toLowerCase.call(this);
        }
        
        if (endIndex == null){
            endIndex = this.length;
        }
        
        var substr = this.substring(startIndex, endIndex).toLowerCase();
        // concat and return
        return this.substring(0, startIndex) + substr + this.substring(endIndex, this.length);
    };

    return toLowerCase;
});
define('boe/String/format',[],function () {
    
    function format() {
        var str = this, a;
        for (a = 0; a < arguments.length; ++a) {
            str = str.replace(new RegExp("\\{" + a + "\\}", "g"), arguments[a]);
        }
        return str;
    }

    return format;
});
/*
 * Trim specified chars at the start of current string.
 * @member String.prototype
 * @return {String} trimed string
 */
define('boe/String/trimLeft',[],function () {
    return function() {
        var trimChar = '\\s';
        var re = new RegExp('(^' + trimChar + '*)', 'g');
        return this.replace(re, "");
    };
});
/*
 * Trim specified chars at the end of current string.
 * @member String.prototype
 * @return {String} trimed string
 */
define('boe/String/trimRight',[], function () {
    return function() {
        var trimChar = '\\s';
        var re = new RegExp('(' + trimChar + '*$)', 'g');
        return this.replace(re, "");
    };
});
/*
 * Trim specified chars at the start and the end of current string.
 * @member String.prototype
 * @return {String} trimed string
 * @es5
 */
define('boe/String/trim',['../util', './trimLeft', './trimRight'], function (util, trimLeft, trimRight) {
    var STRING_PROTO = util.g.String.prototype;
    return STRING_PROTO.trim || function() {
        var ret = trimLeft.call( this );
        ret = trimRight.call( ret );
        return ret;
    };
});
/* 
 * String extensions
 */
define('boe/String',['./util', './String/toUpperCase', './String/toLowerCase', './String/format', './String/trim', './String/trimLeft', './String/trimRight'], 
    function(util, toUpperCase, toLowerCase, format, trim, trimLeft, trimRight){

    

    var global = util.g;
    var STRING_PROTO = global.String.prototype;

    var fn = {};
    var nativeFn = {};
    
    /**
     * @function boeString
     * The String object builder, copy over all our helpers to
     * the instance
     * 
     * @usage var foo = 'abc';
     * boeString(foo).toUpperCase(1,2);
     * 
     */
    var boeString = function(str){
        str = new String(str);
        util.mixin(str, fn);
        return str;
    };
    
    /**
     * @function toUpperCase
     * Upper case specified substring
     *
     * @return {String} Upper cased string
     */
    fn.toUpperCase = toUpperCase;

    /**
     * @function toLowerCase
     * Lower case specified substring
     *
     * @return {String} Upper cased string
     */
    fn.toLowerCase = toLowerCase;
    
    /*
     * similar to the String.Format function in C#
     * usage:
     * boe("helloworld {0}!").format(yourname);
     * output:
     * "helloworld {yourname}"
     */
    fn.format = format;

    /*
     * Trim specified chars at the start of current string.
     * @member String.prototype
     * @return {String} trimed string
     */
    fn.trimLeft = trimLeft

    /*
     * Trim specified chars at the end of current string.
     * @member String.prototype
     * @return {String} trimed string
     */
    fn.trimRight = trimRight

    /*
     * Trim specified chars at the start and the end of current string.
     * @member String.prototype
     * @return {String} trimed string
     * @es5
     */
    STRING_PROTO.trim ? (fn.trim = trim):(nativeFn = STRING_PROTO.trim);

    // Copy over fn to n.String, and make sure the 
    // first arg to the extension method is the context
    util.mixinAsStatic(boeString, fn);
    util.mixinAsStatic(boeString, nativeFn);

    return boeString;
});

if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define('boe',['./boe/util', './boe/Array', './boe/Function', './boe/Number', './boe/Object', './boe/String'], 
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
});myDefine(function() { return require('boe'); }); 
}());