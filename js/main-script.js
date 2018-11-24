   function submitProfile(){

    var profile={};
    profile.firstName=$('#firstName').val();
    profile.lastName=$('#lastName').val();
    profile.interest=[];
    profile.skills=[];
    profile.education={degree:$('#program').val(),department:$('#department').val()};
    $('#interest').find('input[type=checkbox]').each(function () {

     if(this.checked) profile.interest.push(this.value);
     
      });
      $('#skills').find('input[type=checkbox]').each(function () {

       if(this.checked) profile.skills.push(this.value);
       
        });
     profile.experience=$('#workExp').val();
     profile.startDate=$('#startDate').val();
     profile.funds=$('#funds').val();

    
     console.log (profile);

    $.post('/create-profile',{profile:profile})
   }

   function publishProject(){
   
    var project={};

    project.title=$('#title').val();
    project.description=$('#description').val();
    project.interest=[];
    project.skills=[];
    project.department=$('#department').val();
    project.posMaster=$('#posMaster').val();
    project.posPhd=$('#posPhd').val();

    $('#interest').find('input[type=checkbox]').each(function () {

     if(this.checked) project.interest.push(this.value);
     
      });
      $('#skills').find('input[type=checkbox]').each(function () {

       if(this.checked) project.skills.push(this.value);
       
        });
        
        project.startDate=$('#startDate').val();
        project.funds=$('#funds').val();

    
  

    $.post('/create-project',{project:project})
   }

   function currentProject(index){

    console.log(currentIndex)

       



   }
  

   