const axios = require('axios');

exports.getMovies = async function () {
    const resp = await axios.get(process.env.SHOWS_URI);
    return resp.data;
}