const router = require("express").Router()

const House = require('./../models/House.model')

const fileUploader = require('../config/cloudinary.config')

const { checkRole } = require('./../middleware/roles-checker')

const { isLoggedIn } = require("../middleware/session-guard")


// Housing list
router.get('/', isLoggedIn, checkRole('ADMIN', 'PREMIUM'), (req, res, next) => {

    House
        .find()
        .then(houses => {
            res.render('housing/list', { houses, user: req.session.currentUser })
        })
        .catch(error => next(new Error(error)))
})



// Create housing (get form)
router.get('/create', isLoggedIn, checkRole('ADMIN', 'PREMIUM'), (req, res, next) => {

    res.render('housing/create', { user: req.session.currentUser })
})



// Create housing (post form)
router.post('/create', fileUploader.single('picture'), isLoggedIn, (req, res, next) => {

    const { name, description, address, country, city } = req.body
    const { _id: owner } = req.session.currentUser

    House
        .create({ name, description, address, country, city, picture: req.file.path, owner })
        .then(() => res.redirect('/housing'))
        .catch(err => next(new Error(err)))
})



// Housing details
router.get('/details/:id', isLoggedIn, (req, res, next) => {

    const { id } = req.params

    House
        .findById(id)
        .then(house => {
            res.render('housing/details', house)
        })
        .catch(err => next(new Error(err)))
})



// Edit house(get form)
router.get('/edit/:id', isLoggedIn, (req, res, next) => {

    const { id } = req.params

    House
        .findById(id)
        .then(house => res.render('housing/edit', house))
        .catch(err => next(new Error(err)))
})



// Edit house(post form)
router.post('/edit/:id', isLoggedIn, (req, res, next) => {

    const { id } = req.params
    const { name, description, address, country, city, picture } = req.body

    House
        .findByIdAndUpdate(id, { name, description, address, country, city, picture })
        .then(() => res.redirect('/housing'))
        .catch(err => next(new Error(err)))
})



// Delete house
router.post('/delete/:id', isLoggedIn, (req, res, next) => {

    const { id } = req.params

    House
        .findByIdAndDelete(id)
        .then(() => res.redirect('/housing'))
        .catch(err => next(new Error(err)))
})


module.exports = router;