const express = require('express');
const app = express();
const port = 3333;
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./configure/keys.js');
var bodyParser = require('body-parser');


require('./vendor/jquery/jquery-3.2.1.min.js')
require('./js/main.js');

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


//home page, login page
app.get('/', function (req, res) {

  res.render('index')
  /* new Project({
     title: 'Project 1'

   }).save();
  Project.find(function(err,projects){
    console.log(projects);
  })*/
})

//signup




app.post('/', function (req, res) {

  User.findOne({
    'userName': req.query.userName,
    'passWord': req.query.passWord
  }, function (err, user) {
    if (err) {
      console.log("error");
      return;
    }
    if (user) {
      res.render('/views/xiaolong/student-profile.html');


    } else {
      console.log('Not exist');
    }

  });
})




app.post('/login', function (req, res) {
  var Email = req.body.email;
  var Pass = req.body.pass;
  var role = req.body.account_type;
  console.log(req.body);
  console.log('Email:', Email);
  console.log('Password:', Pass);
  console.log('Login as:', role);

  //check with DB


})

app.get('/signup',function(req,res){

  res.render('signup');

})


app.post('/signup',function(req,res){

  new User({
    fistName:req.body.fname,
    lastName:req.body.lname,
    userName:req.body.username,
    email:req.body.email,
    password:req.body.password
  }).save();

  


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
app.get('/makeoffer', function (req, res) {

  res.render('makeoffer')
  /* new Project({
     title: 'Project 1'

   }).save();
  Project.find(function(err,projects){
    console.log(projects);
  })*/
})

app.listen(port, () => console.log('GradRec is listening on port ${port}!'))