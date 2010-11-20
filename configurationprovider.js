var configurationSchema = require("./configurationschema");
var schemaValidator = require("./lib/commonjs-utils/lib/json-schema").validate;
	
/**
* Eventually this object will reference a configuration server of some sort.....
*/
var ConfigurationProvider = function(rootDir) {
	this._rootDir = rootDir;
};

ConfigurationProvider.prototype = {	
	
	getConfiguration: function(callback) {
		
		var config = {
			api: {
				//databaseName: "accompany_test",
				//databasePort: 27017,
				//databaseServer: "localhost", 
				//httpPort: 3000,
				//pathToSchema: this._rootDir + '/schema'
			},
			shared: {
				session: {
					databaseName: "argumentative_session_test",
					databaseHost: "localhost",
					databasePort: 27017,
					cookie:{domain: ".accompany.com"}
				}
			},
			web: {
				httpPort: 4000,
			}
		}
		
		//This should be some sort of configuration server?
		try {
			var config = require(this._rootDir + '/config');
		}
		catch(e) {
		  console.log('No configuration found, using default configuration....');
		}
		
		var result = schemaValidator(config,configurationSchema);
	
		if(!result.valid) {
			//we need some error code here
			callback(error, null);
			return;
		}
	
		callback(null, config);
	
	}
}

exports.ConfigurationProvider = ConfigurationProvider;