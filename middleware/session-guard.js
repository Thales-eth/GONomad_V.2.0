const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('auth/login', { errorMessage: 'Please sign in' })
    }
    next()
}
const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
        return res.redirect('/user')
    }
    next()
}

module.exports = { isLoggedIn, isLoggedOut }