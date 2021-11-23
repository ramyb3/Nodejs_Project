const axios = require('axios');

exports.getMembers = async function () {
    const resp = await axios.get(process.env.USERS_URI);
    return resp.data;
}