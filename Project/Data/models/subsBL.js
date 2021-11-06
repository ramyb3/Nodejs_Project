const restDAL= require('../DAL/rest');
const moviesBL= require('./moviesBL'); 

const checkMovie= async function(obj) // assign movie to specific member
{
    let movies= await moviesBL.showAll(); // get all movies

    let movie= movies.find(x=> x.Name==obj.movie); // get specific movie
    let temp={id: obj.id, date: obj.date, movie: movie._id};

    await restDAL.postSubs(temp);
}

const getSubs= async function() // get all subscriptions
{
    let resp= await restDAL.getData();

    return resp[2];
}

const deleteSubs= async function(obj,id) // delete specific subscription
{
    await restDAL.deleteSubs(obj,id);
}

module.exports={checkMovie,getSubs,deleteSubs};