const express = require('express');

const app = express();
const port = 3333;
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./configure/keys.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var sess
require('./vendor/jquery/jquery-3.2.1.min.js')
require('./js/main.js');

require('./models/Project');
require('./models/User');
require('./models/Message');
require('./models/Offer');

mongoose.connect(keys.mongoURI);



app.use(session({secret:'gradrec'}));

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', 'views');
app.set('view engine', 'jade');

const Project = mongoose.model('projects');
const User = mongoose.model('users');
const Offer = mongoose.model('offers');


//home page, login page
app.get('/', function (req, res) {

  sess = req.session;
  
  if(sess.email){
    var user = User.find({'email':sess.email});
    if(user.role==='student'){ 
      res.render('student/profile');
    } else {

      res.render('pm/create-project');
    }
    
  } else{
  res.render('login');

  }
  /* new Project({
     title: 'Project 1'

   }).save();
  Project.find(function(err,projects){
    console.log(projects);
  })*/
})

app.post('/login', function (req, res) {

  sess = req.session
  //check with DB
  User.findOne({
    'email': req.body.email,
  }, function (err, user) {
    if (err) {
      console.log("error");
      return;
    }
    if (user) {
      if(user.passWord === req.body.password){

      sess.email = req.body.email;
      
      //verify user role
      if(user.role==='student'){
      res.redirect('/show');
      } else{
      res.redirect('/manage-project');

      }
    } else { 
      
      
      console.log('pass is wrong');
      res.render('login',{message:'pass is wrong'})
    }


    } else {
      
      console.log('no user')
      res.render('login',{message:'no user'})
      
    }
  });

})



//Sign up
app.get('/signup',function(req,res){
 console.log('signup')
  res.render('signup');

})


app.post('/signup',function(req,res){

  var newUser=new User({
    fistName:req.body.fname,
    lastName:req.body.lname,
    userName:req.body.username,
    email:req.body.email,
    password:req.body.password,
    firstTime: true,
    role: 'student'
  })
  newUser.save();
  res.redirect('/');

})

//logout
app.get('/logout',function(req,res){

  req.session.destroy(function(err){

    if(err){

      console.log(err);
    } else {
      res.render('login');
    }
  })

});

//show student profile
app.get('/show',function(req,res){
    
    sess = req.session;
    if(sess.email){
     
      User.findOne({'email':sess.email},
      function(err,user){
         
          if(user.firstTime){
            
            res.render('student/create-profile',{loginuser:user});
          } else{
            console.log('my-profile')
            res.render('student/my-profile',{user})
          }

      }
      
      )

    } else {
      res.redirect('/');
    }
    
//    res.render('test',{email:sess.email});

})

//create-profile

app.post('/create-profile',function(req,res){

  sess = req.session;
  var profile=req.body.profile
  console.log(sess.email)
 console.log(req.body.profile);
  if(sess.email){
     
     User.updateOne({email:sess.email},{
       $set:{
        "firstName": profile.firstName,
        "lastName": profile.lastName,
        "education":profile.education,
        "interest":profile.interest,
        "skills":profile.skills,
        "experience":profile.experience,
        "startDate":profile.startDate,
        "firstTime":false,
        "funds":profile.funds
       }
     },function (err, user) {
      if (err) throw error
      console.log(user)
      console.log("update user complete");
      res.redirect('/show');
    }
      

    )
     
  } else {
    res.redirect('/');
  }





})

//show manage project
app.get('/manage-project',function(req,res){
  
  console.log('manage project')
  sess=req.session;
  
 
  Project.find({},function(err,projects){

    res.render('pm/manage-projects',{projects})
  

  })
  
  

})

app.get('/create-project',function(req,res){

  res.render('pm/create-project');
  
})

app.post('/create-project',function(req,res){
  var project=req.body.project;

  new Project({
    title:project.title,
    description:project.description,
    posMaster:project.posMaster,
    posPhd:project.posPhd,
    department:project.department,
    interests:project.interest,
    skills:project.skills,
    startDate:project.startDate,
    funds:project.funds,



  }).save();
  console.log('project created')


})



//==============================offer=======================
app.get('/acceptoffer',function(req,res){

  console.log("acceptoffer");
  res.render('acceptoffer');

})
app.get('/test',function(req,res){

  console.log("test");
  res.render('testaccordian');

})

app.get('/makeoffer',function(req,res){

  console.log("makeoffer");
  res.render('makeoffer');

})

//=========================================
app.listen(port, () => console.log('GradRec is listening on port ${port}!'));