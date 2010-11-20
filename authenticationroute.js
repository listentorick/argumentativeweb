var authenticationRoute = exports = module.exports = function(app, route, strategy, authDetailsAdapter, argumentativeApi) {
			
	app.get(route, function(req,res) {
	
		req.authenticate([strategy], function(error, authenticated) { 
			
			if( authenticated ) {

				var authDetails = authDetailsAdapter(req.getAuthDetails());

				argumentativeApi.Users.add(authDetails, function(error, result){
					//update the user object with our representation
					req.getAuthDetails().user = result;
					res.redirect(req.param('redirectUrl'))
				});
		
			}
			else {
				res.writeHead(200, {'Content-Type': 'text/html'})
				res.end("<html><h1>Twitter authentication failed :( </h1></html>")
			}
		});
	
	});

}