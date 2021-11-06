const dbBL= require('./dbBL');
const permBL= require('./permissionsBL');
const usersBL= require('./usersBL');

const update= async function(obj) // update user in DB
{
    let id= Number(obj.id); // declaring as num variable

    let userName= await dbBL.findAllUsers(); // get all users from DB
    let nameData= userName.find(x=> x._id==id); // get specific user from DB

    let newUser= {id: id, Fname: obj.Fname, Lname: obj.Lname, date: obj.date, session: obj.session};
    
    await usersBL.deleteUser(id); // delete this user from file
    await usersBL.saveUser(newUser); // save new user in file

    await permBL.deletePermissions(id); // delete this user permissions from file
    await permBL.savePermissions(id,obj); // save new user permissions in file  
    
    await dbBL.deleteUserName(id); // delete this user from DB
    await dbBL.saveUserName(obj.Uname,id); // save new user in DB

    if(nameData.Password) // if this user in DB has already password
    {
        nameData={user: obj.Uname, psw: nameData.Password};

        await dbBL.findAllUsers();
        await dbBL.savePassword(nameData);
    }
}

const edit = async function(id) // get user that should be updated
{
    // get all data
    let users= await usersBL.getUsers();
    let perm= await permBL.getPermissions();
    let userName= await dbBL.findAllUsers();

    // get user data that i need to update
    let user= users.find(x=> x.id==id);
    let permData= perm.find(x=> x.id==id);
    let nameData= userName.find(x=> x._id==id);

    let data={id: user.id, firstName: user.firstName, lastName: user.lastName, user: nameData.UserName,
    session: user.sessionTimeOut, date: user.createdDate, perm: permData.permissions};

    return data;
}

const getAll = async function() // get all users from DB
{
    // get all data
    let users= await usersBL.getUsers();
    let perm= await permBL.getPermissions();
    let userName= await dbBL.findAllUsers();

    let temp=[];

    for(i=0;i<users.length; i++) // loop that get all user data in order
    {
        let permData= perm.find(x=> x.id==users[i].id); // get permissions for this user
        let nameData= userName.find(x=> x._id==users[i].id); // get user data from DB for this user

        let name= users[i].firstName + " " + users[i].lastName; // get full name of this user

        let data={id: users[i].id, name: name, user: nameData.UserName, session: users[i].sessionTimeOut,
        date: users[i].createdDate, perm: permData.permissions};

        temp.push(data);
    }

    return temp;
}

module.exports={update,edit,getAll};