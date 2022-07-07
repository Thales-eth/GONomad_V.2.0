const axios = require('axios')

const key = process.env.GOOGLE_API_KEY

class PlacesService {

    constructor() {

        this.baseURL = 'https://maps.googleapis.com/maps/api/place'

        this.api = axios.create({
            baseURL: this.baseURL
        })
    }

    // getTopRestaurants(cityName) {
    //     return this.api.get(`/textsearch/json?query=mejores+restaurantes+${cityName}&key=${key}`)
    // }

    getTopCoworkings(query) {
        return this.api.get(`/textsearch/json?query=best+coworkings+${query}&key=${key}`)
    }

    getTopClubs(query) {
        return this.api.get(`/textsearch/json?query=best+clubs+${query}&key=${key}`)
    }

    getTopRestaurants(query) {
        return this.api.get(`/textsearch/json?query=best+restaurants+${query}&key=${key}`)
    }

    getPlaceInfo(query) {
        return this.api.get(`/textsearch/json?query=${query}&key=${key}`)
    }

    getPhoto(ref) {
        return this.api.get(`/photo?maxwidth=400&photo_reference=${ref}&key=${key}`)
    }

    getPlaceDetails(place_id) {
        return this.api.get(`/details/json?place_id=${place_id}&key=${key}`)
    }

    getPlaceFullInfo(query) {

        let placeName = ""
        let rating = ""
        let pricing = ""
        let address = ""
        let place_id = ""
        let photo = ""
        let phoneNumber = ""
        let schedule = ""
        let photoRef = ""

        return this
            .getPlaceInfo(query)
            .then(response => {
                photoRef = response.data.results[0].photos[0].photo_reference
                placeName = response.data.results[0].name
                rating = response.data.results[0].rating
                pricing = response.data.results[0].price_level
                address = response.data.results[0].formatted_address
                place_id = response.data.results[0].place_id

                return this.getPhoto(photoRef)
            })
            .then(response => {
                photo = this.baseURL + response.config.url
                return this.getPlaceDetails(place_id)
            })
            .then(response => {
                phoneNumber = response.data.result.formatted_phone_number
                schedule = response.data.result.opening_hours.weekday_text

                const result = { photo, placeName, rating, pricing, address, phoneNumber, schedule }

                return result
            })
            .catch(err => next(new Error(err)))
    }
}
module.exports = new PlacesService()