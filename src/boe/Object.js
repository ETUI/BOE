/* 
 * Object extensions
 */
define(['./util'], function(util){
    "use strict";

    var FUNCTION = 'function';
    var OBJECT = 'object';
    var UNDEF;

    var FUNCTION_PROTO = Function.prototype;

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
                    type = (typeof obj[name]);
                    if (type.indexOf(FUNCTION) >= 0){
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
     **/
    !function(){
        function Cloner(){
        }

        var objectCache = [];
        var traverseMark = '__boeObjectShadow_Traversed';

        fn.shadow = function boeObjectFastClone(deep){
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
    }();

    util.mixinAsStatic(boeObject, fn);

    return boeObject;
});
