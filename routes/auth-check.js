module.exports = {
    is: function ( req, resp, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        return resp.redirect('/')
    },    
    not: function ( req, resp, next) {
        if (req.isAuthenticated()) {
            resp.redirect('/dashboard')
        }
        next()
    }    
}