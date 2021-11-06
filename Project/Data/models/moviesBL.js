const restDAL= require('../DAL/rest');

const addMovie= async function(temp) // add movie to DB
{
    let obj;

    if(!temp.id) // if new movie
    {
        let resp= await restDAL.getData(); // get all movies

        let id= resp[0].map(x=> x._id); // get all movie id's

        let max= Math.max(...id); // get the last id

        obj={_id: max+1, Name: temp.name, Genres: temp.genres,
            Image: temp.image, Premiered: temp.date};
    }

    else // if update movie
    {
        obj={_id: temp.id, Name: temp.name, Genres: temp.genres,
            Image: temp.image, Premiered: temp.date};
    }

    await restDAL.postMovies(obj);
}

const showAll= async function() // get all movies from DB
{
    let resp= await restDAL.getData();

    return resp[0];
}

const search= async function(obj) // search movies in DB
{
    let resp= await restDAL.getData(); // get all movies

    let movies=[];

    let names= resp[0].map(x=> x.Name); // get all movie names

    for(i=0;i<names.length;i++)
    {
        if((names[i].toLowerCase()).includes(obj.toLowerCase())) //check all letters
        {
            movies.push(resp[0][i]); 
        }
    }

    return movies;
}

const updateMovie= async function(obj) // get movie that should be updated
{
    let resp= await showAll(); // get all movies

    let movie= resp.find(x=> x._id==obj); // get only the one movie i need to update

    return movie;
}

const saveUpdate= async function(obj) // save update movie in DB
{
    let resp= await showAll(); // get all movies

    let movie= resp.find(x=> x._id==obj.id); // get only the one movie i need to update 

    await deleteMovie(movie._id); // delete this movie
    await addMovie(obj); // add updated movie
}

const deleteMovie= async function(id) // delete movie in DB
{
    await restDAL.deleteMovies(id);
}

module.exports={addMovie,showAll,search,updateMovie,saveUpdate,deleteMovie};