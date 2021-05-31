const path = require('path');
const express = require('express');
const dotenv=require('dotenv');
var methodOverride = require('method-override')
const mongoose=require('mongoose')
const morgan=require('morgan');
const exphbs=require("express-handlebars");
const bodyParser = require('body-parser')
const { promisify } = require('util')
const connectDB=require('./config/db')
const passport=require('passport')
const session=require('express-session')
const MongoStore=require('connect-mongo')(session)

// const initializeDatabase = require('./database')
//log config 
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

//mongo connection
connectDB();

const app = express()
//body-parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())



//morgan logging
if(process.env.NODE_ENV=='development'){
  app.use(morgan("dev"))
}
const {formatDate,truncate,stripTags,editIcon,select}=require('./helpers/hbs')

//handlebars
app.engine('.hbs', exphbs({helpers:{formatDate,truncate,stripTags,editIcon,select},defaultLayout:"main",extname: '.hbs'}));
app.set('view engine', '.hbs');

//sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store:new MongoStore({mongooseConnection:mongoose.connection})
}))

//method-override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//global variable
app.use(function(req,res,next){
  res.locals.user=req.user||null;
  next()
})

//static folder
app.use(express.static(path.join(__dirname,"public")))

//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))




app.listen(process.env.PORT||3000,(req,res)=>{
  console.log("Server started")
})