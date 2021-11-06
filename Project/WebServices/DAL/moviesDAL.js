const axios= require('axios');

exports.getMovies = async function()
{
    let resp = await axios.get("https://api.tvmaze.com/shows");
    
    return resp.data;
}