var requiresAuthentication = exports = module.exports = function() {
	return function (req,res,next) {
		if(req.isAuthenticated()) {
			next();
		} else {				
			if(req.app.set('authenticationRoute')){
				res.redirect(req.app.set('authenticationRoute') + "?redirectUrl=" + escape(req.url));
			} else {
				throw "An authentication route must be configured";
			}
		}
	}		
}