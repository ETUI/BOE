require.config({
    baseUrl: '../',
    packages: [
        {
            "name" : "mocha",
            "location" : "components/mocha",
            "main" : "mocha"
        } ,
        {
            "name" : "chai",
            "location" : "components/chai",
            "main" : "chai"
        } 
    ],
    shim: {
        'mocha/mocha': {
            exports: 'mocha'
        }
    }
});