const GoogleStrategy=require('passport-google-oauth20').Strategy
const mongoose=require('mongoose')
const User=require('../modals/User')

module.exports=function(passport){
    
passport.use(new GoogleStrategy({
    clientID: "816863996365-fotipjbavc6sgqto8cj1koa8r1noj71o.apps.googleusercontent.com",
    clientSecret: "UMvuFAk7eW5b10q0AnRpTfdn",
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    // console.log(profile)
      const newUser={
          googleId:profile.id,
          displayName:profile.displayName,
          firstName:profile.name.givenName,
          lastName:(!profile.name.familyName)?"":profile.name.familyName,
        //   lastName:profile.name.familyName,
          image:profile.photos[0].value
      }
     try{
       let user=await User.findOne({googleId:profile.id})
       if(user){
           done(null,user)
       }else{
           user=await User.create(newUser)
           done(null,user)
       }
     }catch(err){
       console.error(err)
     }
 
  }
));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user)=>done(err, user));
  });

}