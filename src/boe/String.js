/* 
 * String extensions
 */
//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['./util', './global', './String/toUpperCase', './String/toLowerCase', './String/format', './String/trim', './String/trimLeft', './String/trimRight'], 
    function(util, global, toUpperCase, toLowerCase, format, trim, trimLeft, trimRight){

    "use strict";

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
