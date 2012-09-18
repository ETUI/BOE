/* 
 * String extensions
 */
define(['./util'], function(util){
    "use strict";

    var global = this;
    var STRING_PROTO = global.String.prototype;

    var fn = {};
    
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
    fn.toUpperCase = function(startIndex, endIndex){
        if (startIndex == null && endIndex == null){
            return STRING_PROTO.toUpperCase.call(this);
        }
        
        if (endIndex == null){
            endIndex = this.length;
        }
        
        var substr = this.substring(startIndex, endIndex).toUpperCase();
        // concat and return
        return this.substring(0, startIndex) + substr + this.substring(endIndex, this.length);
    };
    
    /*
     * similar to the String.Format function in C#
     * usage:
     * boe("helloworld {0}!").format(yourname);
     * output:
     * "helloworld {yourname}"
     */
    fn.format = function () {
        var str = this, a;
        for (a = 0; a < arguments.length; ++a) {
            str = str.replace(new RegExp("\\{" + a + "\\}", "g"), arguments[a]);
        }
        return str;
    };

    /*
     * Trim specified chars at the start and the end of current string.
     * @member String.prototype
     * @return {String} trimed string
     * @es5
     */
    STRING_PROTO.trim || (fn.trim = function() {
        var trimChar = '\\s';
        var re = new RegExp('(^' + trimChar + '*)|(' + trimChar + '*$)', 'g');
        return this.replace(re, "");
    });

    // Copy over fn to n.String, and make sure the 
    // first arg to the extension method is the context
    util.mixinAsStatic(boeString, fn);

    return boeString;
});
