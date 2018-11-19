const express = require('express');
const app = express();
const port = 3333;
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./configure/keys.js');
var bodyParser = require('body-parser');



require('./models/Project');
require('./models/Student');
require('./models/User');
require('./models/Message');

mongoose.connect(keys.mongoURI);



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
//
app.post('/', function (req, res) {
  User.findOne({
    'userName': req.query.userName,
    'passWord': req.query.passWord
  }, function (err, user) {
     if (err) {console.log("error");return;}
    if (user) {
      res.render('/views/xiaolong/student-profile.html');


    } else {
      console.log('Not exist');
    }

  });
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/index', function (req, res) {

  res.render('index')
  /* new Project({
     title: 'Project 1'

   }).save();
  Project.find(function(err,projects){
    console.log(projects);
  })*/
})

app.post('/login', function (req, res) {
  var Email = req.body.email;
  var Pass = req.body.pass;
  var role= req.body.account_type;
  console.log(req.body);
  console.log('Email:', Email);
  console.log('Password:', Pass);
  console.log('Login as:',role);

  //check with DB


})

app.get('/student',function(req,res){
  res.sendFile(path.join(__dirname + '/views/xiaolong/student-profile.html'));
})

app.get('/pm',function(req,res){
  res.sendFile(path.join(__dirname + '/views/xiaolong/create-project.html'));
})

app.get('/home',function(req,res){

  res.sendFile(path.join(__dirname + '/views/login.html'));
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

app.listen(port, () => console.log('GradRec is listening on port ${port}!'))
