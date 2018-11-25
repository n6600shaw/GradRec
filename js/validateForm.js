var form = document.querySelector('.needs-validation');

form.addEventListener('submit', function (event) {
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    } else{

    }
    form.classList.add('was-validated');

    
});