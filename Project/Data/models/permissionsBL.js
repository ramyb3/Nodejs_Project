const jsonDAL= require('../DAL/json');

const getPermissions = async function() // get all permissions from file
{
    let perm= await jsonDAL.getPermissions();
    
    return perm;
}

const savePermissions = async function(id, obj) // save permissions to file
{
    let perm= await jsonDAL.getPermissions(); // get all permissions from file
    
    let data=[];

    if(obj.VS) // if this permission exist in this user
    data.push("View Subscriptions");

    if(obj.CS) // if this permission exist in this user
    data.push("Create Subscriptions");

    if(obj.US) // if this permission exist in this user
    data.push("Update Subscriptions");

    if(obj.DS) // if this permission exist in this user
    data.push("Delete Subscriptions");

    if(obj.VM) // if this permission exist in this user
    data.push("View Movies");

    if(obj.CM) // if this permission exist in this user
    data.push("Create Movies");

    if(obj.UM) // if this permission exist in this user
    data.push("Update Movies");

    if(obj.DM) // if this permission exist in this user
    data.push("Delete Movies");

    let temp={id: id, permissions: data};
    
    perm.push(temp);

    await jsonDAL.savePermissions(perm);
}

const deletePermissions = async function(id) // delete permissions from file
{
    let perm= await jsonDAL.getPermissions(); // get all permissions
    
    let all= perm.filter(x=> x.id != id); // //get all permissions from file except the one i need to delete

    await jsonDAL.savePermissions(all);
}

module.exports={getPermissions,savePermissions,deletePermissions};