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
require('./models/Student');
require('./models/User');
require('./models/Message');

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
const Student = mongoose.model('students');
const User = mongoose.model('users');


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
  res.render('index');

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
    'email': req.query.email,
    'passWord': req.query.pass,
  }, function (err, user) {
    if (err) {
      console.log("error");
      return;
    }
    if (user) {
      console.log("Login",user);
      sess.email = req.body.email;
      
      console.log("login",sess.email);
      res.redirect('/show');


    } else {
      console.log('Not exist');
    }
  });

})

//Sign up
app.get('/signup',function(req,res){

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
      res.redirect('/');
    }
  })

});

//show
app.get('/show',function(req,res){
    
    sess = req.session;
    if(sess.email){
     
      User.findOne({'email':sess.email},
      function(err,user){
         
          if(user.firstTime){
            console.log(user)
            res.render('student/create-profile',{loginuser:user});
          } else{
            res.render('student/my-profile',{user})
          }

      }
      
      )

    } else {
      res.redirect('/');
    }
    
//    res.render('test',{email:sess.email});

})






//perform submit from stu
app.post('/submitstud', function (req, res) {

  var item = {
    firstname: req.body.stuFirstName,
    lastname: req.body.stuLastName,
  }
  console.log(item);

});

//perform save from student 
app.post('/savestud', function (req, res) {

});

//perform save from project
app.post('/savepro', function (req, res) {


});

//perform create from project

app.post('/createpro', function (req, res) {

  var item = {

  }

});

app.listen(port, () => console.log('GradRec is listening on port ${port}!'));