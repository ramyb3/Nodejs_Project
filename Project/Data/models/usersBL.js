const jsonDAL= require('../DAL/json');

const getUsers = async function() //get all users from file
{
    let users= await jsonDAL.getUsers();
    
    return users;
}

const saveUser = async function(obj) //save user to file
{
    let user= await jsonDAL.getUsers(); //get all users from file
    
    let temp, date;

    let session= Number(obj.session); //declaring as num variable

    if(!obj.date) // if user already exist and has a creation date
    {
        date = new Date(Date.now());
        let year= date.getFullYear();
        let month= date.getMonth() + 1; // for january the function returns 0
        let day= date.getDate();

        date= day + "/" + month + "/" + year;
    }

    if(obj.id==undefined) // if new user
    {
        temp= {id: user[user.length-1].id+1, firstName: obj.Fname, lastName: obj.Lname,
              createdDate: date, sessionTimeOut: session};
    }

    else // if update user
    {
        temp= {id: obj.id, firstName: obj.Fname, lastName: obj.Lname,
              createdDate: obj.date, sessionTimeOut: session};
    }

    user.push(temp);

    await jsonDAL.saveUsers(user);

    return temp.id;
}

const deleteUser= async function(id) //delete user from file
{
    let user= await jsonDAL.getUsers(); //get all users from file
    
    let all= user.filter(x=> x.id != id); //get all users from file except the one i need to delete

    await jsonDAL.saveUsers(all);
}

module.exports={getUsers,saveUser,deleteUser};