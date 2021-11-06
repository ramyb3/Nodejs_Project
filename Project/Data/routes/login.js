var express = require('express');
var router = express.Router();

const usersBL= require('../models/usersBL');
const loginBL= require('../models/loginBL');
const permBL= require('../models/permissionsBL');
const dbBL= require('../models/dbBL');
const funcBL= require('../models/funcBL');
const moviesBL= require('../models/moviesBL');
const subsBL= require('../models/subsBL');
const membersBL= require('../models/membersBL');

const restDAL= require('../DAL/rest');

//////////////////////////////////////////////////////////////////////////////////// login

router.get('/', async function(req, res, next) {
  
  await restDAL.getData(); // get data from subscriptions DB

  //declaring all session parameters to default
  req.session.name= undefined;
  req.session.perm= [];
  req.session.authenticated= false;
  req.session.time= 0;
  req.session.timeOut= 0;

  res.render('login',{msg: req.session.msg});
});

////////////////////////////////////////////////////////////////////////////////////////   main

router.post('/main', async function(req, res, next) {

  let check= await loginBL.check(req.body); // check authentication

  if(check==1) // if user authenticated
  {
    req.session.authenticated= true;
    req.session.msg= undefined;
    req.session.name= req.body.user;
    req.session.time= Date.now();

    //get all data of logged user
    let user= await dbBL.findUser(req.body.user);
    let perm= await permBL.getPermissions();
    let all= await usersBL.getUsers();

    req.session.perm= perm.find(x=> x.id==user[0]._id).permissions;
    req.session.timeOut= all.find(x=> x.id==user[0]._id).sessionTimeOut * 60000; // 1 minute = 60000 Milliseconds

    res.render('main',{name: req.session.name, perm: req.session.perm});
  }

  if(check==0) // if not authenticated
  {
    req.session.msg= "THE USERNAME OR PASSWORD IS INCORRECT!!"

    res.redirect('http://localhost:3000/login');
  }
});

////////////////////////////////////////////////////////////////////////////////////////// create

router.get('/create', function(req, res, next) {

  res.render('create',{}); 
});

router.post('/saveCreate', async function(req, res, next) {

  let temp= await dbBL.findUser(req.body.user);

  req.session.msg= undefined;

  if(temp.length==0) // check if the user exist in DB
  {
    req.session.msg= "THIS USER DOES NOT EXIST!!"
  }
  
  else
  {
    let check= false;

    if(!temp[0].Password) // check if user don't have a password
    {   
      await dbBL.savePassword(req.body);  
      
      check= true;
    }

    if(temp[0].Password && check==false) // check if user already created and has a password
    {
      req.session.msg= "THIS USER ALREADY HAS PASSWORD!!"
    }
  }

  res.redirect('http://localhost:3000/login');
});

///////////////////////////////////////////////////////////////////////////////////////  admin

router.get('/managUsers', async function(req, res, next) {
  
  if(req.session.name == "admin" && req.session.authenticated == true) // if admin & connected
  {
    let data= await funcBL.getAll(); // get all users data

    res.render('managUsers',{users: data, name: req.session.name});
  }

  if(req.session.name != "admin" && req.session.authenticated == true) // if not admin & connected
  {
    req.session.msg="YOU ARE NOT ADMIN!!";

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.get('/managUsers/addUser', function(req, res, next) {
  
  if(req.session.name == "admin" && req.session.authenticated == true) // if admin & connected
  {
    res.render('addUser',{name: req.session.name});  
  }

  if(req.session.name != "admin" && req.session.authenticated == true) // if not admin & connected
  {
    req.session.msg="YOU ARE NOT ADMIN!!";

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/managUsers/addUser/added', async function(req, res, next) {
  
  let id= await usersBL.saveUser(req.body); // save user in file

  await permBL.savePermissions(id,req.body); // save permission in file
  await dbBL.saveUserName(req.body.Uname,id); // save user in DB

  res.redirect('http://localhost:3000/login/managUsers');
});

router.get('/managUsers/users/edit/:id', async function(req, res, next) { 
  
  if(req.session.name == "admin" && req.session.authenticated == true) // if admin & connected
  {
    let data= await funcBL.edit(req.params.id); // get user that i want to update

    res.render('editUser',{data: data, name: req.session.name});  
  }

  if(req.session.name != "admin" && req.session.authenticated == true) // if not admin & connected
  {
    req.session.msg="YOU ARE NOT ADMIN!!";

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/managUsers/users/updated', async function(req, res, next) { 
  
  await funcBL.update(req.body); // update new data of specific user

  res.redirect("http://localhost:3000/login/managUsers");
});

router.get('/managUsers/users/delete/:id', async function(req, res, next) { 
  
  if(req.session.name == "admin" && req.session.authenticated == true) // if admin & connected
  {
    // delete user data from all files and DB
    await dbBL.deleteUserName(req.params.id);
    await usersBL.deleteUser(req.params.id);
    await permBL.deletePermissions(req.params.id);

    res.redirect('http://localhost:3000/login/managUsers');
  }  

  if(req.session.name != "admin" && req.session.authenticated == true) // if not admin & connected
  {
    req.session.msg="YOU ARE NOT ADMIN!!";

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

///////////////////////////////////////////////////////////////////////////////////////////     movies

router.get('/movies', async function(req, res, next) {
  
  if(req.session.perm.includes("View Movies") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      // get all data 
      let movies= await moviesBL.showAll(); 
      let subs= await subsBL.getSubs(); 
      let members= await membersBL.showAll(); 

      res.render('movies',{movies: movies, subs: subs, members: members, name: req.session.name, perm: req.session.perm});  
    }
  }
  
  if((!req.session.perm.includes("View Movies")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/movies/find',async function(req, res, next) {
  
  if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
  if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
  {
    // get all search data
    let movies= await moviesBL.search(req.body.search);
    let subs= await subsBL.getSubs(); 
    let members= await membersBL.showAll(); 

    res.render('movies',{movies: movies, subs: subs, members: members, name: req.session.name, perm: req.session.perm}); 
  }
});

router.get('/movies/:id', async function(req, res, next) {
  
  if(req.session.perm.includes("View Movies") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      // get all data
      let subs= await subsBL.getSubs(); 
      let members= await membersBL.showAll(); 
      let movies= await moviesBL.showAll(); 

      let movie = movies.find(x=> x._id==req.params.id); // get only the data of this movie

      movies=[];
      movies.push(movie);

      res.render('movies',{movies: movies, subs: subs, members: members, name: req.session.name, perm: req.session.perm});  
    }
  }

  if((!req.session.perm.includes("View Movies")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.get('/movies/edit/:id', async function(req, res, next) {
  
  if(req.session.perm.includes("Update Movies") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      let movie= await moviesBL.updateMovie(req.params.id); // get data of movie that should be updated

      let date= movie.Premiered.slice(0,10); // get full premiere date

      res.render('editMovie',{movie: movie, date: date, name: req.session.name, perm: req.session.perm});  
    }
  }

  if((!req.session.perm.includes("Update Movies")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/movies/updated', async function(req, res, next) {
  
  await moviesBL.saveUpdate(req.body); // update this movie

  res.redirect("http://localhost:3000/login/movies"); 
});

router.get('/movies/delete/:id', async function(req, res, next) {
  
  if(req.session.perm.includes("Delete Movies") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      await moviesBL.deleteMovie(req.params.id); // delete this movie
      await subsBL.deleteSubs(1,req.params.id); // delete all subs that assigned to this movie

      res.redirect("http://localhost:3000/login/movies");
    }
  }

  if((!req.session.perm.includes("Delete Movies")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.get('/movie/addMovie', function(req, res, next) {
  
  if(req.session.perm.includes("Create Movies") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      res.render('addMovie',{name: req.session.name, perm: req.session.perm});
    }
  }  

  if((!req.session.perm.includes("Create Movies")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/movies/addMovie/added', async function(req, res, next) {
  
  await moviesBL.addMovie(req.body); // add this movie to DB

  res.redirect("http://localhost:3000/login/movies"); 
});

///////////////////////////////////////////////////////////////////////////////////////////  subscriptions

router.get('/subscriptions', async function(req, res, next) {
  
  if(req.session.perm.includes("View Subscriptions") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      // get all data
      let members= await membersBL.showAll();
      let items= await subsBL.getSubs();
      let movies= await moviesBL.showAll();
      
      res.render('subscriptions',{members: members, movies: movies, list: items, name: req.session.name, perm: req.session.perm});  
    }
  }

  if((!req.session.perm.includes("View Subscriptions")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }
  
  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.get('/subscriptions/:id', async function(req, res, next) {

  if(req.session.perm.includes("View Subscriptions") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      //get all data
      let movies= await moviesBL.showAll(); 
      let items= await subsBL.getSubs();
      let members = await membersBL.showAll();
      
      let member= members.find(x=> x._id==req.params.id); // get only the data of this member

      members=[];
      members.push(member);

      res.render('subscriptions',{members: members, movies: movies, list: items, name: req.session.name, perm: req.session.perm});
    }
  }

  if((!req.session.perm.includes("View Subscriptions")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/subscriptions/allMembers', async function(req, res, next) {
  
  await subsBL.checkMovie(req.body); // assign this movie to specific this member

  res.redirect("http://localhost:3000/login/subscriptions"); 
});

router.get('/subscriptions/edit/:id', async function(req, res, next) {
  
  if(req.session.perm.includes("Update Subscriptions") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      let member= await membersBL.updateMember(req.params.id); // get data of member that should be updated

      res.render('editMember',{member: member, name: req.session.name, perm: req.session.perm}); 
    }
  } 

  if((!req.session.perm.includes("Update Subscriptions")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/subscriptions/updated', async function(req, res, next) {
  
  await membersBL.saveUpdate(req.body); // update this member

  res.redirect("http://localhost:3000/login/subscriptions"); 
});

router.get('/subscriptions/delete/:id', async function(req, res, next) {
  
  if(req.session.perm.includes("Delete Subscriptions") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      await membersBL.deleteMember(req.params.id); // delete this member from DB
      await subsBL.deleteSubs(2,req.params.id); // delete this member subs from DB

      res.redirect("http://localhost:3000/login/subscriptions");
    }
  }

  if((!req.session.perm.includes("Delete Subscriptions")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.get('/subscription/addMember', function(req, res, next) {
  
  if(req.session.perm.includes("Create Subscriptions") && req.session.authenticated == true) // if have permission & connected
  {
    if(req.session.name != "admin") // check if not admin
    {
      if((Date.now()-req.session.time) >= req.session.timeOut) // check if time over
      {
        req.session.msg= "YOUR TIME IS UP!!"
    
        res.redirect('http://localhost:3000/login');
      }
    }
    // admin has unlimited session || the user still have time to session
    if(req.session.name == "admin" || (Date.now()-req.session.time) < req.session.timeOut)
    {
      res.render('addMember',{name: req.session.name, perm: req.session.perm});
    } 
  } 

  if((!req.session.perm.includes("Create Subscriptions")) && req.session.authenticated == true) // if don't have permission & connected
  {
    req.session.msg= "YOU NEED TO HAVE A PERMISSION FOR THAT!!"

    res.redirect('http://localhost:3000/login');
  }

  if(req.session.authenticated == false) // if not connected
  {
    req.session.msg= "LOG IN FIRST!!"

    res.redirect('http://localhost:3000/login');
  }
});

router.post('/subscriptions/addMember/added', async function(req, res, next) {
  
  await membersBL.addMember(req.body); // add this member to DB

  res.redirect("http://localhost:3000/login/subscriptions"); 
});

////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;