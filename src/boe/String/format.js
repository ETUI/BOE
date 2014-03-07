//>>excludeStart("release", pragmas.release);
if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}
//>>excludeEnd("release");
define(function () {
    
    function format() {
        var str = this, a;
        for (a = 0; a < arguments.length; ++a) {
            str = str.replace(new RegExp("\\{" + a + "\\}", "g"), arguments[a]);
        }
        return str;
    }

    return format;
});