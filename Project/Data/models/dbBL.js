const UsersModel= require('../DAL/usersModel');

const findUser = function(name) // get user from DB by name
{
    return new Promise((resolve, reject) =>
    {
        UsersModel.find({UserName: name}, function(err, data)
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

const findAllUsers = function() // get all users from DB
{
    return new Promise((resolve, reject) =>
    {
        UsersModel.find({}, function(err, data)
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

const savePassword = function(obj) // save password to exist user in DB
{
    return new Promise((resolve, reject) =>
    {
        UsersModel.findOneAndUpdate({UserName: obj.user},
        {
            UserName : obj.user,
            Password : obj.psw
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

const saveUserName = function(Uname,id) // save name to new user in DB
{
    return new Promise((resolve, reject) =>
    {
        let user = new UsersModel({
            _id : id,
            UserName : Uname
        });

        user.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
        })

        resolve(user);
    })
}

const deleteUserName = function(id) // delete user by id from DB
{
    return new Promise((resolve, reject) =>
    {
        UsersModel.findOneAndDelete({_id: id},function(err,data)
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

module.exports={findUser,findAllUsers,savePassword,saveUserName,deleteUserName};