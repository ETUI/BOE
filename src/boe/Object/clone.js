//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(['../util'], function(util){

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