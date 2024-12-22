inp_email = document.getElementById('emaill');
inp_senha = document.getElementById('senhal');
inp_submit = document.getElementById("submit");

inp_submit.addEventListener('click', function (event) {
  event.preventDefault();
  login(inp_email.value, inp_senha.value);
});

function login(email, senha) {
    $.post("php/login.php", { emaill: email, senhal: senha })
    .done(function (data) {
        // data = JSON.parse(data); se deixar isso aqui o código não funciona
        if (data.error != undefined) {
          console.log(data.error);
        } else if (data.success != undefined) {
            // console.log(data.success);
            window.location.href = "homepage.html";
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Erro na requisição:', textStatus, errorThrown);
    });
}
