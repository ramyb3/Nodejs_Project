const restDAL= require('../DAL/rest');

const showAll = async function() // get all members from DB
{
    let resp= await restDAL.getData();

    return resp[1];
}

const addMember= async function(temp) // add members to DB
{
    let obj;

    if(!temp.id) // if new member
    {
        let resp= await restDAL.getData(); // get all members

        let id= resp[1].map(x=> x._id); // get all member id's

        let max= Math.max(...id); // get the last id

        obj={_id: max+1, Name: temp.name, Email: temp.email, City: temp.city};
    }

    else // if update movie
    {
        obj={_id: temp.id, Name: temp.name, Email: temp.email, City: temp.city};
    }

    await restDAL.postMembers(obj);
}

const updateMember= async function(obj) // get member that should be updated
{
    let resp= await showAll(); // get all members

    let member= resp.find(x=> x._id==obj); // get only the one member i need to update

    return member;
}

const saveUpdate= async function(obj) // save update member in DB
{
    let resp= await showAll(); // get all members

    let member= resp.find(x=> x._id==obj.id); // get only the one member i need to update

    await deleteMember(member._id); // delete this member
    await addMember(obj); // add updated member
}

const deleteMember= async function(id) // delete member in DB
{
    await restDAL.deleteMembers(id);
}

module.exports={showAll,addMember,updateMember,saveUpdate,deleteMember};