const mongoose=require('mongoose');
const connectDB=async()=>{
    try{
       const conn=await mongoose.connect("mongodb+srv://bhavyta1234:@Mani132@short-story.jd0ft.mongodb.net/storybooks?retryWrites=true&w=majority",{
           useNewUrlParser:true,
           useUnifiedTopology:true,
           useFindAndModify:false
       })
    console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch(err){
     console.log(err);
     process.exit(1);
    }
}

module.exports=connectDB;