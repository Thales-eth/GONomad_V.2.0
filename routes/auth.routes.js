const router = require("express").Router()

const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs")

const saltRounds = 10

const { isLoggedOut, isLoggedIn } = require("../middleware/session-guard")



router.get("/profile/create", isLoggedOut, (req, res, next) => {
    res.render("auth/signup")
})



router.post("/profile/create", isLoggedOut, (req, res, next) => {

    const { username, email, name, password: plainPassword, country, role } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, email, name, password: hashedPwd, country, role }))
        .then(() => res.redirect("/"))
        .catch(err => next(new Error(err)))
})



router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})



router.post('/login', isLoggedOut, (req, res, next) => {

    const { email, password: plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'You must fill in the mandatoy fields' })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'User not reconized' })
                return
            }
            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Invalid password' })
                return
            }
            req.session.currentUser = user
            res.redirect('/user')
        })
})



router.get('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})


module.exports = router