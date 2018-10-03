 $(document).ready(function(){
     alert("clicked");
     $( function() {
       $( "#job-from-1" ).datepicker({ dateFormat: 'dd/mm/yy' });
       $( "#job-to-1" ).datepicker({ dateFormat: 'dd/mm/yy' });
     });
   });    
