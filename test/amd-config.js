require.config({
    baseUrl: '../',
    packages: [
        {
            "name" : "mocha",
            "location" : "lib/mocha",
            "main" : "mocha"
        } ,
        {
            "name" : "chai",
            "location" : "lib/chai",
            "main" : "chai"
        } 
    ],
    shim: {
        'mocha/mocha': {
            exports: 'mocha'
        }
    }
});