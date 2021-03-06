/* 
 * Array extensions
 */
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['./util', './global'], function(util, global){
    "use strict";
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
