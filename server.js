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



app.use(session({
  secret: 'gradrec'
}));

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', 'views');
app.set('view engine', 'jade');

const User = mongoose.model('users');
const Project = mongoose.model('projects');

const Offer = mongoose.model('offers');


//

//about
app.get('/about',function(req,res){

  var role=req.query.role;
  var sess=req.session;
  if(sess.email){
  User.findOne({email:sess.email},function(err,user){

    res.render('about',{role:role,user:user})
  })
} else {

  res.redirect('/?message="Please login again"');
}
  


})


//home page, login page
app.get('/', function (req, res) {

  sess = req.session;

  if (sess.email) {
    var user = User.find({
      'email': sess.email
    });
    if (user.role === 'student') {
      res.render('student/profile');
    } else if (user.role === 'pm') {

      res.render('pm/create-project');
    } else {
      res.render('login')
    }

  } else {
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

      if (user.passWord === req.body.password) {

        sess.email = req.body.email;

        //verify user role
        if (user.role === 'student') {
          res.redirect('/show');
        } else {
          res.redirect('/manage-project');

        }
      } else {


        console.log('pass is wrong');
        res.render('login', {
          message: 'pass is wrong'
        })
      }


    } else {

      console.log('no user')
      res.render('login', {
        message: 'no user'
      })

    }
  });

})



//Sign up
app.get('/signup', function (req, res) {

  res.render('signup', {
    message: req.query.message
  });

})


app.post('/signup', function (req, res) {
  console.log('signingup')
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (user) {
      res.redirect('/signup?message="This email has been used, please use another one"');
    } else {

      var newUser = new User({
        fistName: req.body.fname,
        lastName: req.body.lname,
        userName: req.body.username,
        email: req.body.email,
        passWord: req.body.password,
        firstTime: true,
        role: 'student'
      })
      newUser.save();
      res.redirect('/?message="Welcome to GradRec! Please login!"');
    }


  })


})

//logout
app.get('/logout', function (req, res) {

  req.session.destroy(function (err) {

    if (err) {

      console.log(err);
    } else {
      res.render('login');
    }
  })

});

//show student profile
app.get('/show', function (req, res) {

  sess = req.session;
  if (sess.email) {

    User.findOne({
        'email': sess.email
      },
      function (err, user) {

        if (user.firstTime) {

          res.render('student/create-profile', {
            loginuser: user
          });
        } else {
          console.log('my-profile')
          res.render('student/my-profile', {
            user:user
          })
        }

      }

    )

  } else {
    res.redirect('/');
  }

  //    res.render('test',{email:sess.email});

})

//create-profile

app.post('/create-profile', function (req, res) {

  sess = req.session;
  var profile = req.body.profile
  console.log(sess.email)
  console.log(req.body.profile);
  if (sess.email) {

    User.updateOne({
        email: sess.email
      }, {
        $set: {
          "firstName": profile.firstName,
          "lastName": profile.lastName,
          "education": profile.education,
          "interest": profile.interest,
          "skills": profile.skills,
          "experience": profile.experience,
          "startDate": profile.startDate,
          "firstTime": false,
          "funds": profile.funds
        }
      }, function (err, user) {
        if (err) throw error
        console.log(user)
        console.log("update user complete");
        res.redirect('/show');
      }


    )

    //when ever new student profile added, do a mathching for this new student
    User.findOne({
      email: sess.email
    }, function (err, user) {

      Project.find({}, function (err, projects) {
        var matched = [];

        for (var i = 0; i < projects.length; i++) {
          var findOne = function (pro, stu) {
            console.log('matching')
            return stu.some(function (v) {
              return pro.indexOf(v) >= 0;
            });
          };
          //filter the projects according to interest
          console.log("Projects", projects[i].skills)
          console.log("Student", user.skills)
          console.log('Interest matching result:', findOne(projects[i].skills, user.skills))

          if (findOne(projects[i].interest, user.interest) && findOne(projects[i].skills, user.skills)) {
            matched.push(projects[i]);
            projects[i].matched.push(user);
            projects[i].save();
          }



        }
        console.log("Matched", matched)
        User.updateOne({
          email: sess.email
        }, {
          $set: {
            "matched": matched,
          }
        }, function (err, user) {
          if (err) throw error

          console.log("update user complete");

        });
        res.render('student/matched-projects', {
          user:user
        })

      });

    })



  } else {
    res.redirect('/?message="Please login again');
  }

})

//student match  projects
app.get('/matched-project', function (req, res) {

  var sess = req.session;
  console.log(sess.email)
if(sess.email){
  User.findOne({
    email: sess.email
  }).populate('matched').exec(function (err, user) {
    if (err) {
      console.log(err)
    }
    console.log(user)
    res.render('student/matched-projects', {
      user: user,
      matched: user.matched
    });

  });
} else{
  res.redirect('/?message="Please login again');
}

})

app.get('/get/matched-project', function (req, res) {

  sess = req.session
if(sess.email){
  User.findOne({
    email: sess.email
  }).populate('matched').exec(function (err, user) {
    if (err) {
      console.log(err)
    }
    console.log(user)
    res.render('student/project-details', {
      projects: user.matched,
      user: user,
      matched: user.matched,
      currentProject: req.query.id,
      message: req.query.message
    });

  });
} else{
  res.redirect('/?message="Please login again');
}

})

//show student matched projects
app.get('/show-project', function (req, res) {
  var sess = req.session;
  console.log(sess.email)
if (sess.email){
  User.findOne({
    email: sess.email
  }).populate('matched').exec(function (err, user) {
    if (err) {
      console.log(err)
    }
    console.log(user)
    res.render('student/project-details', {
      user: user,
      projects: user.matched,
      currentProject: 0
    });

  });
} else{
  res.redirect('/?message="Please login again');
}
})

//apply for a project
app.get('/apply', function (req, res) {


  var sess = req.session;
if(sess.email){
  console.log(sess.email)
  console.log("apply id", req.query.id)
  User.findOne({
    email: sess.email
  }, function (err, user) {

    var title = req.query.title;

    Project.findOne({
      title: title
    }, function (err, project) {
      var id = req.query.id;
      if (err) console.log("Err:", err);
      console.log("Pusing:", project)
      project.applied.push(user);
      project.save();
      User.updateOne({
        email: sess.email
      }, {
        applied: project
      }, function (err) {});

      res.redirect('/get/matched-project?id=' + id + '&message="You have applied this project"');

    })




  })
} else{
  res.redirect('/?message="Please login again');
}




})

app.get('/offer',function(req,res){


  var sess=req.session
 console.log(sess.email)
 if(sess.email){
  User.findOne({email:sess.email}).populate({path:'offers',select:"title email content isaccept isactive"}).exec(function(err,user){

     console.log(user)
    Project.findOne({title:user.offers.title},function(err,project){


       console.log(project)
        res.render('student/offer',{offer:user.offers,user:user,project:project});
   


    })
    

  




  })
} else{
  res.redirect('/?message="Please login again');
}


})

app.get('/declineOffer',function(req,res){

  
  var email=req.query.email;
  var title=req.query.title;
 
  Offer.updateOne({title:title,email:email},{
    $set: {
      "isaccept": false,
      "isactive": false
    }
  },function(err,offer){
    
  })

  User.updateOne({email:email},{
    $unset: {
      "offers":'',
    }
  },function(err,user){})

  Offer.findOne({title:title,email:email},function(err,offer){


    User.findOne({email:email}).populate('applied').exec(function(err,user){

      if (err){
        console.log(err)
      }

      if(user.applied.title===offer.title){
        console.log("id:",user._id)
        Project.updateOne({title:title},{

          $pull:{

            "applied":user._id
          }
        },function(err,project){
          User.updateOne({email:email},{
            $unset:{
              "applied":'',
            }
          },function(err,user){
              
              
              res.redirect('/offer');
          })

        })

      }
  
    })
  })


  









})


//accept offer
app.get('/acceptOffer',function(req,res){

  
  var email=req.query.email;
  var title=req.query.title;
 
  //update offer status
  Offer.updateOne({title:title,email:email},{
    $set: {
      "isaccept": true,
      "isactive": false
    }
  },function(err,offer){
    
  })

console.log(email)
User.findOne({email:email},function(err,user){

  Project.findOne({title:title},function(err,theproject){

    
    //add student to enrolled
    Project.updateOne({title:title},{

      $push:{
        "enrolled":user._id
      }
    },function(err,project){
      
      User.updateOne({email:email},{
        $set:{
          "enrolled":theproject._id,
        }
      },function(err,user){

          res.redirect('/offer');
      })

    })



})


})





})

//Project manager logic
//show manage project
app.get('/manage-project', function (req, res) {

  console.log('manage project');
  // for test////////////

  sess = req.session;

  //if there is new project created, do mathcing
  console.log('Query project title', req.query.newProjectTitle)


  if (req.query.newProjectTitle) {
    var title = req.query.newProjectTitle;
    Project.findOne({
      title: title
    }, function (err, project) {

      console.log(project)
      User.find({}, function (err, users) {
        var matched = [];

        for (var i = 0; i < users.length; i++) {
          var findOne = function (pro, stu) {
            console.log('matching')
            return stu.some(function (v) {
              return pro.indexOf(v) >= 0;
            });
          };
          //filter the projects according to interest
          console.log("Project interest:", project.interest)
          console.log("Student interest:", users[i].interest)
          console.log("interest mathcing:", findOne(project.interest, users[i].interest))
          console.log("skills mathcing:", findOne(project.skills, users[i].skills))
          if (findOne(project.interest, users[i].interest) && findOne(project.skills, users[i].skills)) {
            matched.push(users[i]);
            users[i].matched.push(project);
            users[i].save();
          }



        }
        console.log("Matched", matched)
        Project.updateOne({
          title: project.title
        }, {
          $set: {
            "matched": matched,
          }
        }, function (err, project) {
          if (err) throw error


        });


      });

    })
  }
  Project.findOne().sort({
    created_at: 1
  }).populate('matched').populate('applied').populate('enrolled').exec(function (err, project) {

    Project.find({}, function (err, projects) {
      if(project){
      var matched = project.matched
      var applied = project.applied
      var enrolled = project.enrolled
      console.log(matched)
     
      res.render('pm/manage-projects', {
        projects: projects,
        currentProject: 0,
        matched: matched,
        applied: applied,
        enrolled: enrolled,
        message:req.query.message
      })

    } else{ res.render('pm/manage-projects')}
    })


  });

})

app.get('/get/project', function (req, res) {
  console.log(req.query.id)
  console.log(req.query.title)

  Project.findOne({
    title: req.query.title
  }).populate('enrolled').populate('applied').populate('matched').exec(function (err, project) {

    Project.find({}, function (err, projects) {
      var matched = project.matched
      var applied = project.applied
      
      var enrolled = project.enrolled
      console.log("enrolled:",enrolled)
      console.log("id:",project._id)
      res.render('pm/manage-projects', {
        projects: projects,
        currentProject: req.query.id,
        matched: matched,
        applied: applied,
        enrolled: enrolled
      })
    })
  });
})




//create-projects
app.get('/create-project', function (req, res) {

  res.render('pm/create-project');

})

app.post('/create-project', function (req, res) {
  var project = req.body.project;
  console.log("Project variable interest:", project.interest)

  new Project({
    title: project.title,
    description: project.description,
    posMaster: project.posMaster,
    posPhd: project.posPhd,
    department: project.department,
    interest: project.interest,
    skills: project.skills,
    startDate: project.startDate,
    funds: project.funds,

  }).save();

  //whenever a new project created, do a matching


  console.log('project created')
  res.redirect('/manage-project?newProjectTitle=' + project.title)




})

//delete project
app.get('/delete', function (req, res) {

  var title = req.query.title;
  console.log(title)

 
  Project.remove({title:title},function(err){
    console.log("project deleted")
    res.redirect('/manage-project')

  })


})

//approve an application
app.post('/approve', function (req, res) {

  var title = req.query.title;
  var email = req.query.email;
  var content = req.body.offerContent
  console.log('offer sent')
  console.log('Offer title', title);
  console.log('Offer email', email);
  console.log('Offer content', content)



  Project.findOne({
    title: title
  }, function (err, project) {

    User.findOne({
      email: email
    }, function (err, user) {
      new Offer({
        name: user.firstName+' '+user.lastName,
        title: title,
        email: email,
        project: project,
        student: user,
        content: content,
        isaccept: false,
        isactive: true
      }).save(function () {

        Offer.findOne({
          title: title,
          email: email
        }, function (err, offer) {

          project.offers.push(offer);
          project.save()

           User.updateOne({email:email},{offers:offer},function(err){})

          res.redirect('/get/project?id='+req.query.id+'&title='+title+'&message="Offer sent"')

        })





      })

    })
  })
})


app.get('/test', function (req, res) {

  Offer.findOne({
    title: req.query.title,
    email: req.query.email
  }, function (err, offer) {
    if (err) console.log(err)
    console.log(offer)

  })

})



//mange offers

app.get('/manage-offer',function(req,res){

  Project.findOne().sort({
    created_at: 1
  }).populate('offers').exec(function (err, project) {

    Project.find({}, function (err, projects) {
      if(project){
      var offers = project.offers
      
      console.log(offers)
      res.render('pm/manage-offer', {
        projects: projects,
        currentProject: 0,
        offers: offers,
      })
    } else{res.render('pm/manage-offer')}


    })


  });
   
})

app.get('/get/offer', function (req, res) {
  console.log(req.query.id)
  console.log(req.query.title)

  Project.findOne({
    title: req.query.title
  }).populate('offers').exec(function (err, project) {

    Project.find({}, function (err, projects) {
      var offers= project.offers

      
      res.render('pm/manage-offer', {
        projects: projects,
        currentProject: req.query.id,
        offers:offers
      })
    })
  });
})



app.listen(port, () => console.log('GradRec is listening on port ${port}!'));