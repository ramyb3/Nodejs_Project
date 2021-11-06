const MoviesModel = require('../DAL/moviesModel');

const findMovies= function() // get all movies in DB
{
    return new Promise((resolve, reject) =>
    {
        MoviesModel.find({}, function(err, data)
        {
            if(err)
            {
                reject(err);
            }

            else
            {
                resolve(data);
            }
        })
    })
}

const saveMovies1 = function(obj) // save movie in DB if there isn't data before
{
    return new Promise((resolve, reject) =>
    {
        let movie = new MoviesModel({
            _id : obj.id,
            Name : obj.name,
            Genres : obj.genres,
            Image: obj.image.medium,
            Premiered: obj.premiered
        });

        movie.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
        })

        resolve(movie);
    })
}

const saveMovies2 = function(obj) // save movie in DB if there is data before
{
    return new Promise((resolve, reject) =>
    {
        let movie = new MoviesModel({
            _id : obj._id,
            Name : obj.Name,
            Genres : obj.Genres,
            Image: obj.Image,
            Premiered: obj.Premiered
        });

        movie.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
        })

        resolve(movie);
    })
}

const deleteMovie = function(id) // delete movie in DB
{
    return new Promise((resolve, reject) =>
    {
        MoviesModel.findOneAndDelete({_id: id},function(err,data)
        {
            if(err)
            {
                reject(err);
            }

            else
            {
                resolve(data);
            }
        })
    })
}

module.exports={findMovies,saveMovies1,saveMovies2,deleteMovie};