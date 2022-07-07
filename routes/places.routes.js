const { response } = require("express")
const Comment = require("../models/Comment.model")
const { getPlaceInfo } = require("../services/places.service")
const placesService = require("../services/places.service")

const router = require("express").Router()

const axios = require('axios')

// Places
router.get('/', (req, res) => {
    res.render('places/list')
})



// Places details
router.get('/details/:city', (req, res) => {

    let photoArr = []
    let name = ""
    let placeID
    let photos

    let commentPromise
    let placePromise

    const { city: cityName } = req.params
    console.log("Hey")
    placesService
        .getPlaceInfo(cityName)

        .then(city => {
            placeID = city.data.results[0].place_id
            return placesService.getPlaceDetails(city.data.results[0].place_id)
        })
        .then(response => {
            name = response.data.result.name
            let photosArr = response.data.result.photos
            let photoReferences = photosArr.map(elm => elm.photo_reference)

            const photoPromises = photoReferences.map(ref => {
                // placesService.getPhoto(ref)
                return axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=AIzaSyCWeFAP8xK0Ea5xMJjFlEDbq7C_twO-_so`)
            })
            commentPromise = Comment.find({ placeID })
            placePromise = placesService.getPlaceDetails(placeID)
            return Promise.all(photoPromises)
        })
        .then((response) => {

            photos = response.map(elm => elm.config.url)

            return Promise.all([commentPromise, placePromise])
        })
        .then(response => {
            console.log({ photos, commets: response[0][0].title })
            res.render('places/details', { name, photos, title: response[0][0].title, review: response[0][0].review })
        })
        .catch(e => console.log('ERRRRORRRR', e))

})



// Restaurants list   
router.get('/details/restaurants/:city_name/list', (req, res) => {

    const { city_name } = req.params

    placesService
        .getTopRestaurants(city_name)
        .then(rest => {
            const result = rest.data.results
            res.render('places/restaurants-list', { result })
        })
})



// Coworkings list   
router.get('/details/coworking/:city_name/list', (req, res) => {

    const { city_name } = req.params

    placesService
        .getTopCoworkings(city_name)
        .then(cowork => {
            const coworkRes = cowork.data.results
            res.render('places/coworking-list', { coworkRes })
        })

})



// Places clubs details
// router.get('/details/clubs/:id', (req, res) => {
//     res.render('places/list')
// })



// Clubs list   
router.get('/details/clubs/:city_name/list', (req, res) => {

    const { city_name } = req.params

    placesService
        .getTopClubs(city_name)
        .then(clubs => {
            const clubsRes = clubs.data.results
            res.render('places/clubs-list', { clubsRes })
        })
})

// Places coworkings details
// router.get('/coworkings/:id', (req, res) => {
//     res.render('places/list')
// })


// Restaurants details
router.get('/details/restaurants/:name', (req, res) => {

    const { name } = req.params

    placesService
        .getPlaceFullInfo(name)
        .then(restaurantInfo => res.render('places/restaurants', restaurantInfo))
        .catch(err => console.log(err))
})



// Clubs details
router.get('/details/clubs/:name', (req, res) => {

    const { name } = req.params

    placesService
        .getPlaceFullInfo(name)
        .then(clubsInfo => res.render('places/clubs', clubsInfo))
        .catch(err => console.log(err))
})



// Coworkings details  
router.get('/details/coworkings/:name', (req, res) => {

    const { name } = req.params

    placesService
        .getPlaceFullInfo(name)
        .then(coworkInfo => res.render('places/coworkings', coworkInfo))
        .catch(err => console.log(err))
})


module.exports = router
