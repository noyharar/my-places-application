const axios = require('axios');
const HttpError = require('../models/http-error')


async function getCoordsForAddress(address) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.API_KEY}`
    const response = await axios.get(url);
    const data = response.data;
    if(!data || data.status === 'ZERO_RESULTS'){
        const error = new HttpError('Could not find location', 422);
        throw error;
    }
    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

module.exports = getCoordsForAddress;