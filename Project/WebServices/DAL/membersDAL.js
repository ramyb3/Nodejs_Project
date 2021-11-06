const axios= require('axios');

exports.getMembers = async function()
{
    let resp = await axios.get("https://jsonplaceholder.typicode.com/users");
    
    return resp.data;
}