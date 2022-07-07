const router = require("express").Router()

const User = require("../models/User.model")

const { isLoggedIn } = require('./../middleware/session-guard')

const { isOwnerOrAdmin } = require('./../middleware/is-owner')

const House = require("../models/House.model")

const { rolesChecker } = require("../utils/roles-checker")


// My profile
router.get('/', isLoggedIn, (req, res) => {

    const roles = rolesChecker(req.session.currentUser)
    const { isUser, isAdmin, isPremium } = roles

    User
        .findById(req.session.currentUser._id)
        .then(user => {
            res.render('user/my-profile', { user, isUser, isAdmin, isPremium })
        })
        .catch(err => next(new Error(err)))
})



// My houses list
router.get('/my-houses', (req, res) => {

    const { _id: owner } = req.session.currentUser

    House
        .find({ owner })
        .then(house => res.render('housing/my-houses', { house }))
        .catch(err => next(new Error(err)))
})



router.get('/edit/:id', isLoggedIn, isOwnerOrAdmin, (req, res) => {

    const { id } = req.params
    const { username, email, name, password, country, role } = req.body

    User
        .findById(id)
        .then(user => {
            res.render('user/edit', { user })
        })
        .catch(err => next(new Error(err)))
})



router.post('/edit/:id', isLoggedIn, isOwnerOrAdmin, (req, res) => {

    const { id } = req.params
    const { username, email, name, password, country, role } = req.body

    User
        .findByIdAndUpdate(id, { username, email, name, password, country, role })
        .then(() => {
            res.redirect('/')
        })
        .catch(err => next(new Error(err)))
})



// Payment card form (GET)
router.get('/role-premium/:id', (req, res) => {

    const { id } = req.params

    res.render('auth/premium', { id })

})



router.post('/role-premium/:id', (req, res) => {

    const { id } = req.params

    User
        .findByIdAndUpdate(id, { role: 'PREMIUM' })
        .then(() => res.redirect('/profiles'))
        .catch(err => next(new Error(err)))
})



router.get('/delete', isLoggedIn, (req, res) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(res.render('user/deleted'))
        .catch(err => next(new Error(err)))
})


module.exports = router