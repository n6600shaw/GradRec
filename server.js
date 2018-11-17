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
app.use(bodyParser());


const Project = mongoose.model('projects');
const Student = mongoose.model('students');
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {

  res.sendFile(path.join(__dirname + '/views/student-profile.html'));
  new Project({
    title: 'Project 1'

  }).save();
 Project.find(function(err,projects){
   console.log(projects);
 })
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