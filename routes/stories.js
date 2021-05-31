const express = require('express')
const route=express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth');
const { findOneAndUpdate } = require('../modals/Story');
const Story=require('../modals/Story')
//@desc Add page
// @route /stories/add GET
route.get('/add',ensureAuth,(req,res)=>{
    res.render("stories/add")
})

//@desc Stories Page after add story
// @route /stories POST
route.post('/+',ensureAuth,async (req,res)=>{
   try {
       req.body.user=req.user.id;
       await Story.create(req.body);
       res.redirect('/dashboard')

   } catch (error) {
       console.error(error)
       res.render('errors/500')
   }
    
})

route.get('/:id',ensureAuth,async (req,res)=>{
    try {
        let story=await Story.findOne({_id:req.params.id})
        .populate('user')
        .lean();
        if(!story) return res.render('errors/404')
        // console.log(story)
        res.render("stories/show",{
            story
        })

    } catch (error) {
       console.error(error)
       res.render('errors/500')
    }
    // res.render("stories/index")
})



//@desc public stories page
// @route /stories GET
route.get('/',ensureAuth,async (req,res)=>{
    try {
        let stories=await Story.find({status:'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean();
        
        res.render("stories/index",{
            stories
        })

    } catch (error) {
       console.error(error)
       res.render('errors/500')
    }
    // res.render("stories/index")
})

route.get('/edit/:id',ensureAuth,async (req,res)=>{
    try {
        let story=await Story.findOne({_id:req.params.id})
        .lean();
        if(!story) return res.render('errors/404')
        res.render("stories/edit",{
            story
        })

    } catch (error) {
       console.error(error)
       res.render('errors/500')
    }
    // res.render("stories/index")
})

route.get('/user/:userid',ensureAuth,async (req,res)=>{
    try {
        let stories=await Story.find({user:req.params.userid,status:'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean();

        if(!stories) return res.render('errors/404')
        res.render("stories/index",{
            stories
        })

    } catch (error) {
       console.error(error)
       res.render('errors/500')
    }
    // res.render("stories/index")
})


route.put('/:id',ensureAuth,async (req,res)=>{
    try {
        let story=await Story.findById(req.params.id).lean();
        if(!story) return res.render('errors/404')

        if(req.user.id!=story.user)
           return res.redirect('/stories')
        story=await Story.findOneAndUpdate({_id:req.params.id},req.body,{
            new:true, runValidators:true
        })
        res.redirect('/dashboard')
       

    } catch (error) {
       console.error(error)
       res.render('errors/500')
    }
    // res.render("stories/index")
})



route.delete('/:id',ensureAuth,async (req,res)=>{
    try {
       await Story.remove({_id:req.params.id});
     res.redirect('/dashboard') 

    } catch (error) {
       console.error(error)
       res.render('errors/500')
    }
    // res.render("stories/index")
})


module.exports=route;
