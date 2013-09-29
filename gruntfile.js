/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-bumpup");
	grunt.loadNpmTasks("grunt-tagrelease");

	grunt.config.init({
		requirejs : {
			dist : {
				options : {
					baseUrl: './src',
					name: '../components/almond/almond',
					include: 'boe',
					out: 'boe.js',
					wrap: {
						start: 
							"(function() { \n" + 
							"var global = new Function('return this')();" + 
							"var parentDefine = global.define || (function(factory){ window.boe = factory(); }) ;",
						end: 
							"parentDefine(function() { return require('boe'); }); \n" + 
							"}());"
					},
					optimize : "none"
				}
			}
		},
		uglify : {
			options : {
				banner : '/* http://github.com/normanzb/ */',
			},
			dist : {
				src : [ "boe.js" ],
				dest : "boe.min.js"
			}
		},
		bumpup: {
	        files: ['package.json', 'bower.json']
	    },
	    tagrelease: {
	        file: 'package.json',
	        commit:  true,
	        message: 'Release %version%',
	        prefix:  '',
	        annotate: false
	    }
	});

	grunt.registerTask("dist", "requirejs:dist uglify".split(' '));
	grunt.registerTask("default", "dist".split(' '));
	grunt.registerTask("release", function (type) {
	    
	    if (type != null && type != false){
	    	grunt.task.run('bumpup:' + type);
	    	grunt.task.run('tagrelease');
	    }

	    grunt.task.run('dist');
	});
};