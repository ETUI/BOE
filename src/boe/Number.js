
/* 
 * Number extensions
 */
define(['./util'], function(util){
	"use strict";
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
	boeNumber = function(num){
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
    fn.toCurrency = function(fixedLength, formatFloat){
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
    };

    util.mixinAsStatic(boeNumber, fn);

    return boeNumber;
});
