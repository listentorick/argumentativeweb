var ArgumentativeWeb = require('./app');
var ConfigurationProvider = require("./configurationprovider").ConfigurationProvider;

ArgumentativeWeb.listen(new ConfigurationProvider(), function(error, result) {

	console.log("woot");

});