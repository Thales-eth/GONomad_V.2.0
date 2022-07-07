const router = require("express").Router()

const Comment = require('../models/Comment.model')

const fileUploader = require('../config/cloudinary.config')

const { checkRole } = require('./../middleware/roles-checker')

const { isLoggedIn } = require("../middleware/session-guard")


// router.get('/list', (req, res) => {

//     Comment
//         .find()
//         .then(comm => res.render('review/list', {comm}))
//         .catch(err => console.log(err))
// })


router.post('/write/:place_id', (req, res) => {
    const { title, review } = req.body
    const { place_id } = req.params
    const { _id: owner } = req.session.currentUser

    Comment
        .create({ title, review, owner, place_id })
        .then(res.redirect('/user')) //placeholder
        .catch(err => console.log(err))
})


router.get('/update/:id', (req, res) => {

    const { id } = req.params

    Comment
        .findById(id)
        .then(comm => res.render('review/edit-form', comm))
        .catch(err => console.log(err))
})


router.post('/update/:id', (req, res) => {

    const { id } = req.params
    const { title, review, owner } = req.body

    Comment
        .findByIdAndUpdate(id, { title, review, owner })
        .then(() => res.redirect('/user'))
        .catch(err => console.log(err))
})

router.post('')








module.exports = router



