const jsonfile= require('jsonfile');

exports.saveUsers = function(obj) 
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.writeFile(__dirname + "/users.json",obj,function(err,data)
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

exports.getUsers = function() 
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.readFile(__dirname + "/users.json",function(err,data)
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

exports.savePermissions = function(obj) 
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.writeFile(__dirname + "/permissions.json",obj,function(err,data)
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

exports.getPermissions = function() 
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.readFile(__dirname + "/permissions.json",function(err,data)
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