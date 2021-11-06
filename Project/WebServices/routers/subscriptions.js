const express= require('express');

const moviesBL= require('../models/moviesBL');
const subsBL= require('../models/subscriptionsBL');
const membersBL= require('../models/membersBL');
const funcBL= require('../models/funcBL');

const router= express.Router();

router.route('/').get(async function(req,resp) //when in login page 
{
    let array= await funcBL.getData();

    return resp.json(array);
});

router.route('/movies').post(async function(req,resp) //if want to add/edit movie from movies pages 
{
    await moviesBL.saveMovies2(req.body);

    let array= await funcBL.getData();

    return resp.json(array);
});

router.route('/members').post(async function(req,resp) //if want to add/edit members from members pages 
{
    await membersBL.saveMembers2(req.body);

    let array= await funcBL.getData();

    return resp.json(array);
});

router.route('/subscriptions').post(async function(req,resp) //if want to add/edit subs from members/movies pages 
{
    let temp= await subsBL.findSub(Number(req.body.id));

    if(temp.length==0) // when there isn't data in subs DB - add subs
    {
        await subsBL.saveSubs1(req.body);
    }

    if(temp.length>0) // when there is data in subs DB - edit subs
    {
        await subsBL.updateSubs(req.body);
    }

    let array= await funcBL.getData();

    return resp.json(array);
});

router.route('/movies/:id').delete(async function(req,resp) //if want to delete movies from movies pages
{
    await moviesBL.deleteMovie(req.params.id);

    let array= await funcBL.getData();

    return resp.json(array);
});

router.route('/members/:id').delete(async function(req,resp) //if want to delete members from members pages
{
    await membersBL.deleteMember(req.params.id);

    let array= await funcBL.getData();

    return resp.json(array);
});

router.route('/subscriptions/:obj/:id').delete(async function(req,resp) //if want to delete subs from members/movies pages
{
    let subs;

    if(req.params.obj==1) // delete movies 
    {
        subs= await subsBL.deleteMoviesSubs(req.params.id);
    }

    if(req.params.obj==2) // delete members
    {
        subs= await subsBL.deleteMembersSubs(req.params.id);
    }

    await subsBL.deleteAllSubs(); // delete all data from subs DB

    for(i=0;i<subs.length;i++)
    {
        await subsBL.saveSubs2(subs[i]); // save new data to subs DB
    }

    let array= await funcBL.getData();

    return resp.json(array);
});

module.exports= router;