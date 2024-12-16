var modal = document.getElementById("modal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("fechar")[0];
var btn2 = document.getElementById("myBtn2");

btn.onclick = function() {
  modal.style.display = "block";
}
btn2.onclick = function() {
    modal.style.display = "block";
  }
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
const registerButton = document.getElementById("registro");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");

registerButton.addEventListener("click", () => {
  container.classList.add("painel-direito-ativo");
  var modalsenha = document.getElementById("show");
  modalsenha.style.zIndex = '-1';
});

loginButton.addEventListener("click", () => {
  container.classList.remove("painel-direito-ativo");
});

document.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section');
  const logo = document.querySelector('.logo');
  
  let currentSection = '';

  sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.pageYOffset;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id'); 
      }
  });
  document.body.className = `section-${currentSection}`;
});
function mostrar() {
  var modalsenha = document.getElementById("show");
  modalsenha.style.zIndex = '3';
}

/*
<form action="#">
<h1>Login</h1>
<input type="email" name="emaill" id="emaill" placeholder="Email" required> <br>
<input type="password" name="senhal" id="senhal" placeholder="Senha" required> <br>
<input id="submit" value="Voltar aos mares">
</form>
*/
inp_email = document.getElementById('emaill');
inp_senha = document.getElementById('senhal');
inp_submit = document.getElementById("submit");

inp_submit.addEventListener('click', function () {
  console.log("Botão clicado");
    login(inp_email.value, inp_senha.value);
});

function login(email, senha) {
    $.post("php/login.php", { emaill: email, senhal: senha })

    .done(function (data) {
        console.log("Resposta do servidor:", data);
        // data = JSON.parse(data); se deixar isso aqui o código não funciona
        if (data.error != undefined) {
          console.log("Chegamos aqui");
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

