module.exports = {
    is: function ( req, resp, next) {
        if (!req.user) {
            // not logged in
            resp.redirect('/')
            
        } else {
            // logged in
            next()
        }
    },    
    not: function ( req, resp, next) {
        if (req.isAuthenticated()) {
            return resp.redirect('/dashboard')
        }
        next()
    }    
}