#Built-in Object Extension

Extend object or boxed primitive variable with loads of handy methods.

##Install

if you have bower installed:

		bower install boe
		
Or, simply download boe.js or boe.min.js

##Usage

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

##Build 

		npm install bower -g
		npm install
		grunt
		