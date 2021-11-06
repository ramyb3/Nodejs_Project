const SubscriptionsModel = require('../DAL/subscriptionsModel');

const findSubs= function() // get all subs from DB
{
    return new Promise((resolve, reject) =>
    {
        SubscriptionsModel.find({}, function(err, data)
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

const findSub= function(id) // get specific sub by id from DB
{
    return new Promise((resolve, reject) =>
    {
        SubscriptionsModel.find({MemberId: id}, function(err, data)
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

const saveSubs1 = async function(obj) // save sub to DB if this sub isn't in DB
{
    let temp= await findSubs(); // get all subs

    let id;

    if(temp.length>0) // if DB isn't empty
    {
        id= temp[temp.length-1]._id + 1;
    }

    if(temp.length==0) // when there isn't data in subs DB
    {
        id= 1;
    }

    return new Promise((resolve, reject) =>
    {
        let subs = new SubscriptionsModel({
            _id : id,
            MemberId : obj.id,
            Movies : [{MovieId: obj.movie, Date: obj.date}]
        });

        subs.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
        })

        resolve(subs);
    })
}

const saveSubs2 = async function(obj) // save sub to DB if this sub was in DB
{
    return new Promise((resolve, reject) =>
    {
        let subs = new SubscriptionsModel({
            _id : obj._id,
            MemberId : obj.MemberId,
            Movies : obj.Movies
        });

        subs.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
        })

        resolve(subs);
    })
}

const updateSubs = async function(obj) // update sub in DB
{
    let temp= await findSub(Number(obj.id)); //get specific sub by id

    temp[0].Movies.push({MovieId: obj.movie, Date: obj.date}); //update movies in this sub

    return new Promise((resolve, reject) =>
    {
        SubscriptionsModel.findOneAndUpdate({_id: temp[0]._id},
        {
            Movies: temp[0].Movies
        },
        function(err,data)
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

const deleteMoviesSubs = async function(id) // delete movies in this sub in DB
{
    let temp= await findSubs(); // get all subs from DB

    let arr=[];

    for(i=0;i<temp.length;i++) // loop that checks which movie need to be deleted  
    {
        let movies= temp[i].Movies.filter(x=> x.MovieId != id); //get all movies except the one that need to delete

        if(movies.length!=0) //if there's movies after the filter 
        {
            arr.push({_id: temp[i]._id, MemberId: temp[i].MemberId, Movies: movies}); 
        }
    }

    return arr;
}

const deleteMembersSubs = async function(id) // delete members in this sub in DB
{
    let temp= await findSubs(); // get all subs from DB

    let arr= temp.filter(x=> x.MemberId != id); // get all subs except the one that need to delete 

    return arr;
}

const deleteAllSubs = async function() // delete all subs in DB
{
    return new Promise((resolve, reject) =>
    {
        SubscriptionsModel.remove({},function(err,data)
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

module.exports={findSubs,findSub,saveSubs1,saveSubs2,updateSubs,
                deleteMoviesSubs,deleteMembersSubs,deleteAllSubs};