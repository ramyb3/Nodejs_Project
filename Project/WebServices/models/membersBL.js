const MembersModel = require('../DAL/membersModel');

const findMembers= function() //get all members from DB
{
    return new Promise((resolve, reject) =>
    {
        MembersModel.find({}, function(err, data)
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

const saveMembers1 = function(obj) // save member in DB if there isn't data before
{
    return new Promise((resolve, reject) =>
    {
        let member = new MembersModel({
            _id : obj.id,
            Name : obj.name,
            Email : obj.email,
            City: obj.address.city
        });

        member.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
        })

        resolve(member);
    })
}

const saveMembers2 = function(obj) // save member in DB if there is data before
{
    return new Promise((resolve, reject) =>
    {
        let member = new MembersModel({
            _id : obj._id,
            Name : obj.Name,
            Email : obj.Email,
            City: obj.City
        });

        member.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
        })

        resolve(member);
    })
}

const deleteMember = function(id) // delete member in DB
{
    return new Promise((resolve, reject) =>
    {
        MembersModel.findOneAndDelete({_id: id},function(err,data)
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

module.exports={findMembers,saveMembers1,saveMembers2,deleteMember};