#Built-in Object Extension

Extend object or boxed primitive variable with loads of handy methods.

##Install

if you have bower installed:

		bower install boe
		
Or, simply download boe.js or boe.min.js

##Usage

###Referencing

In non amd env, boe is exposed by global variable:

		window.boe
		
In amd env, you can require the merged boe file:

		require(['path to the merged boe file'], function(){
		   ...
		});
		
Or rather, you can git clone this repo and use the very specific extension:

		require(['boe-source-folder/boe/String'], function(String){
		   console.log(String("hello world").toUpperCase(0,1));
		})

###Method calling

You can call into those handy methods by using the boe() shortcut, it will automatically detect the type of input and converted to boe wrapped object:
		
		var arr = boe(["abc", "def"]);
		
		arr.map(function(item){return item + "foo"});
		
		arr.lastIndexOf('deffoo');

Or if feel it is a waste of time to converting the object, static methods are available as well:

		boe.String.format("hello {0}", "Norman");
		
		// is equavalent to:

		boe("hello {0}").format("Norman");

##Build 

		npm install bower -g
		npm install
		grunt
		
##API

###util

boe.mixin(target, source, map): Copy members from source to target

* target (optional): target object to mixin to, omittable, if not provided, a new object will be created and returned.
* source: source object to mixin from
* map (optional): Must be a function, will be called each time the a member is iterated, the argument will be (memberName, member), and the return value will be copied to target object instead.

boe.type(obj): Return the type of the specified argument

* obj: the object to be determined

###Array

Array.isArray(obj): Return true if argument is an array

Array.prototype.shuffle(): Shuffle current array

Array.prototype.random(): Return a random item from current array

Array.prototype.filter(func): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.map(func): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.lastIndexOf(searchItem): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.indexOf(searchItem): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.forEach(): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.every(): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.some(): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.reduce(): Shim of the original ecmascript method, see ecmascript spec pls

Array.prototype.reduceRight(): Shim of the original ecmascript method, see ecmascript spec pls

###Function

Function.prototype.once(): redirect the call to the original function if once() is never called; do nothing if once() is called.

Function.prototype.memorize(): if the inputs do not hit the cache, redirect the call to the original function, and then cache the input and output. Below is an example of using it.

		function fab(index, self){
	        if (index < 0){
	            throw "error";
	        }
	        else if (index == 0){
	            return 1;
	        }  
	        else if (index == 1){
	            return 2;
	        }
	        return self( index - 2, self ) + self( index - 1, self );
	    }
		
		var tmp, boeFab;   
        var normalTimeSpan = 0;
        var memorizedTimeSpan = 0;

        tmp = Date.now();
        fab( 35, fab ) // this line will take a while to finish
        normalTimeSpan = Date.now() - tmp;

        console.log('normalTimeSpan', normalTimeSpan)

        tmp = Date.now();
        boeFab = boe(fab);
        boeFab.memorize( 35, boeFab.memorize );
        memorizedTimeSpan = Date.now() - tmp;

        console.log('memorizedTimeSpan', memorizedTimeSpan)

        expect( memorizedTimeSpan ).to.be.below( normalTimeSpan );
		
Function.prototype.cage(): simiar to bind(), however it make sure the function was ran under certain context even it is 'newed', try below code with bind and cage to find out difference:

		function foo(){console.log(this)}
		
		foo = boe(foo);

		bar = foo.cage(window);
		new bar();
		bar2 = foo.bind(window);
		new bar2();

Function.prototype.bind(): Shim of the original ecmascript method, see ecmascript spec pls

###Number

Number.prototype.toCurrency(fixedLength, formatFloat): Return a formatted string which has commas between every 3 digit.

* fixedLength: 
* formatFloat: true to format the fraction as well.

###Object

Object.prototype.chainable(): Convert the object's members to methods that either return the original value or return the object itself.

		var foo = {
			hello: 1,
			world: 2,
			bar: function(){
				this.hello += 1;
			}
		}
		
		foo = boe(foo).chainable();
		
		console.log( foo.hello() );
		console.log( foo.bar().hello() );

Object.prototype.clone(deepClone): Object clone

* deepClone: default to false, true to indicate clone sub objects and functions as well.

Object.prototype.shadow(deepShadow): Persudo clone, return a new object which its __proto__ point to the original object. shadow() usually faster than clone() when doing shallow copy.

* deepShadow: default to false, true to indicate clone sub objects and functions as well.

###String

String.prototype.toUpperCase(): Similar to the original toUpperCase(), the only difference is it allow you to specify the a range.

* startIndex: Start index of upper casing
* endIndex: End index of upper casing

String.prototype.toLowerCase(): Similar to the original toLowerCase(), the only difference is it allow you to specify the a range.

* startIndex: Start index of upper casing
* endIndex: End index of upper casing

String.prototype.format(): Similar to c# String.format(), replace {N}, with the argument on index N.

String.prototype.trim(): Shim of the original ecmascript method, see ecmascript spec pls
