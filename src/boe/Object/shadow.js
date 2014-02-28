if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['../util'], function (util) {

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
})