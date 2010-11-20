

//Gives us access to the express support folders
require.paths.unshift('./lib/express/support');

//Give us access to our code
require.paths.unshift('./lib/connectmiddleware');

var express = require('./lib/express/lib/express');
//var   = require('./lib/connect-auth/lib/auth');

var auth= require('./lib/connect-auth/lib');

var authenticationRoute = require('./authenticationroute');
var requiresAuthentication = require('./requiresAuthentication');
var MongoSessionStore = require('./lib/connectmiddleware/mongosessionstore');

var ArgumentativeAPI = require('./lib/argumentativeapi/lib/argumentativeapi/argumentativeapi').ArgumentativeAPI;


exports.listen = function(configurationProvider, callback) {

	configurationProvider.getConfiguration(function(error, config) {
		if(error) {
			callback(error);
		} else {
			
			//construct an instance of ArgumentativeApi
			var argumentativeApi = new ArgumentativeAPI();

			
			// config.shared.session.host
			// config.shared.session.port
			// config.shared.session.databaseName
			var mongoSessionStore = new MongoSessionStore(config.shared.session);
			
			//Bring up the web tier
			
			var twitterConsumerKey = "NqZk8uDuLQRJKEwEpKyVw";
			var twitterConsumerSecret = "MZhZUyxuxsXZrqFYohMi6hezeGqgW5NnZkIwYSvLM";
						
			var web = express.createServer(
			
				// Required by session() middleware
				express.cookieDecoder(),
			
			    // Populates:
				// - req.session
				// - req.sessionStore
				// - req.sessionID
				//express.session({ store: mongoSessionStore, secret: config.shared.session.secret}),
				express.session({ store: mongoSessionStore, key: config.shared.session.key}),
				
				//express.session({key:'whatever'}),
				 auth( [
					auth.Twitter({consumerKey: twitterConsumerKey, consumerSecret: twitterConsumerSecret}),
				])
				
			);	
			
			//used be requires authentication
			web.set('authenticationRoute', '/auth');
			web.set('view engine', 'ejs');
			
			//var mongoUserAdapter = new MongoUserAdapter();
			//var mongoUserProvider = new MongoUserProvider(config.api.databasePort, config.api.databasePort, config.api.databaseName, mongoUserAdapter);
			//var userManager = new UserManager(mongoUserProvider);
			
			//Set up the authentication stuff
			
			web.get('/auth', function(req,res,params) {
				res.render('auth', {
					locals: {
						redirectUrl: encodeURIComponent(req.param('redirectUrl'))
					}
				});
			});
			
			authenticationRoute(
				web, 
				'/auth/twitter', 
				'twitter',  
				function(strategyAuthDetails) {
					return {
							providerId: 1,
							providerUserId: strategyAuthDetails.user.user_id,
							providerUsername: strategyAuthDetails.user.username
					}
				},
				argumentativeApi
			);
			
			//set up our example route
			
			web.get('/hello', requiresAuthentication(), function(req,res,params) {
				res.writeHead(200, {'Content-Type': 'text/html'})
				res.end("<html><h1>Hey " +  req.getAuthDetails().user.username + ". If you can see this then you must be authenticated!</h1></html>")	
			});
			
				
			web.listen(config.web.httpPort);
			
			callback(null,null);
		}
	});

}


