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


inp_emailr = document.getElementById('emailr');
inp_senhaR1 = document.getElementById('senhaR1');
inp_nomer = document.getElementById('nomer');
inp_submitr = document.getElementById('butsubmitr');

inp_submitr.addEventListener('click' , function () {
    event.preventDefault();
    registro(inp_emailr.value, inp_senhaR1.value, inp_nomer.value);
});

function registro(email, senha, nome) {
    $.post("php/cadastro.php", {emailr: email, senhaR1: senha, nomer: nome})
    .done(function (data) {
        if (data.error != undefined) {
          console.log(data.error);
        } else if (data.success != undefined) {
            console.log(data.success);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Erro na requisição:', textStatus, errorThrown);
    });
}

inp_emails = document.getElementById('emails');
inp_senhaesquecida = document.getElementById('senhaesquecida');

inp_senhaesquecida.addEventListener('click', function() {
  console.log("Chega aqui senha esquecida");
  event.preventDefault();
  senhaesquecida(inp_emails.value);
});

function senhaesquecida(email) {
  console.log("Chega aqui senha esquecida 2");
  $.post("php/recuperarsenhapt1.php", {emails: email})
  .done(function(data) {
    console.log("Resposta do servidor:", data);
    if (data.error != undefined) {
      console.log("show 1");
      console.log(data.error);
    } else if (data.success != undefined) {
      console.log("show 2");
      console.log(data.success);
    }
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.error('Erro na requisição:', textStatus, errorThrown);
  });
  console.log("show");
}