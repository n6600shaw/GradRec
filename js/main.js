
function showInput() {
    var msg = "";
    console.log('login');
    var radios = document.getElementsByName('account_type');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            msg = radios[i].value;

            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    window.alert(" The email is " + document.getElementById("email").value + "\n Password is    " + document.getElementById("pass").value + " \n and log in as " + msg);
    //	document.getElementById('display').innerHTML = 
    //		document.getElementById("email").value;
}
function checkPass(){
    var pass  = document.getElementById("password").value;
    
    var rpass  = document.getElementById("rpassword").value;
   if(pass != rpass){
      // document.getElementById("submit").disabled = true;
       window.alert("Entered Password is not matching!! Try Again");
       return false;
       //$('.missmatch').html("Entered Password is not matching!! Try Again");
   }
   return true;
   /*else{
       $('.missmatch').html("");
       document.getElementById("submit").disabled = false;
   }*/
}
(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });

    //confirm passward
    $('#password, #confirm_password').on('keyup', function () {
        if ($('#password').val() == $('#confirm_password').val()) {
          $('#message').html('Matching').css('color', 'green');
        } else 
          $('#message').html('Not Matching').css('color', 'red');
      });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



});