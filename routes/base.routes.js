const router = require("express").Router()

const User = require("../models/User.model")

const { isLoggedIn } = require("../middleware/session-guard")
const PlacesService = require('./../services/places.service')


// Home page
router.get("/", (req, res, next) => {
    res.render("pages/index", { layout: false })
})



// Input query search
router.post("/", (req, res, next) => {

    const { query } = req.body

    PlacesService
        .getPlaceFullInfo(query)
        .then(restaurantInfo => res.render('places/restaurants', restaurantInfo))
        .catch(err => console.log(err))
})



// About us
router.get("/about-us", (req, res, next) => {
    res.render("pages/about-us")
})



// Contact
router.get("/contact", (req, res, next) => {
    res.render("pages/contact")
})



// Profiles
router.get("/profiles", isLoggedIn, (req, res, next) => {

    User
        .find()
        .then(users => {
            res.render("user/list", { users })
        })
        .catch(err => next(new Error(err)))
})


module.exports = router