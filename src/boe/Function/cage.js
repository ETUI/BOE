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
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
define(['../util'], function(util){
    function cage(context) {
        var __method = this, args = util.slice(arguments);
        args.shift();
        return function() {
            return __method.apply(context, args.concat(util.slice(arguments)));
        };
    };

    return cage;
});