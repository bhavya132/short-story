const express = require('express');
const passport=require('passport');
const route=express.Router();
//@desc Auth page
// @route /auth/google GET
route.get('/google',passport.authenticate('google',{scope: ['profile']}))

//@desc Google auth callback
// @route /auth/google/callback GET
route.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  })

//@desc Logout page
// @route /auth/logout GET
route.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/')
})

module.exports=route;
