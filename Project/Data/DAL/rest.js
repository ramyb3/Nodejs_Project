const axios= require('axios');

const getData = async function()
{
    let resp= await axios.get("http://localhost:8000/subscriptions");

    return resp.data;
}

const postMovies = async function(obj)
{
    await axios.post("http://localhost:8000/subscriptions/movies", obj);
}

const postMembers = async function(obj)
{
    await axios.post("http://localhost:8000/subscriptions/members", obj);
}

const postSubs = async function(obj)
{
    await axios.post("http://localhost:8000/subscriptions/subscriptions", obj);
}

const deleteMovies = async function(id)
{
    await axios.delete("http://localhost:8000/subscriptions/movies/" + id);
}

const deleteMembers = async function(id)
{
    await axios.delete("http://localhost:8000/subscriptions/members/" + id);
}

const deleteSubs = async function(obj,id)
{
    await axios.delete("http://localhost:8000/subscriptions/subscriptions/"+ obj +"/" + id);
}

module.exports={getData,postMovies,postMembers,postSubs,deleteMovies,deleteMembers,deleteSubs}