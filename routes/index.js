const express = require('express')
const route=express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const Story=require('../modals/Story')
//@desc Login/Landing Page
// @route / GET
route.get('/',ensureGuest,(req,res)=>{
    res.render("login",{
        layout:'login',
    })
})
//@desc Dashboard Page
// @route /dashboard GET
route.get('/dashboard',ensureAuth,async (req,res)=>{
    try {
        let stories=await Story.find({user:req.user.id}).lean();
        // console.log(stories)
        res.render("dashboard",{
            name:req.user.firstName,
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
   
})
module.exports=route;
