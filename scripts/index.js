var modal = document.getElementById("modal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("fechar")[0];
var btn2 = document.getElementById("myBtn2");
var bloco = document.getElementById("bloco");
const registerButton = document.getElementById("registro");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");
var inp_email = document.getElementById('emaill');
var inp_senha = document.getElementById('senhal');
var inp_submit = document.getElementById("submit");
var inp_emailr = document.getElementById('emailr');
var inp_senhaR1 = document.getElementById('senhaR1');
var inp_nomer = document.getElementById('nomer');
var inp_submitr = document.getElementById('butsubmitr');
var inp_emails = document.getElementById('emails');
var inp_senhaesquecida = document.getElementById('senhaesquecida');
const toaster = iniciarToaster(document.body);

btn.onclick = function() {
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
  
}
  inp_submit.addEventListener('click', function (event) {
    event.preventDefault();
    login(inp_email.value, inp_senha.value, toaster);
  });
  inp_submitr.addEventListener('click' , function (event) {
    event.preventDefault();
    registro(inp_emailr.value, inp_senhaR1.value, inp_nomer.value, toaster);
  });
  inp_senhaesquecida.addEventListener('click', function(event) {
    event.preventDefault();
    senhaesquecida(inp_emails.value,toaster);
  });
btn2.onclick = function() {
    modal.style.display = "block";
  }
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}
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


function login(email, senha, toaster) {
    $.post("php/login.php", { emaill: email, senhal: senha })
    .done(function (data) {
        // data = JSON.parse(data); se deixar isso aqui o código não funciona
        if (data.error != undefined) {
          toaster.error(data.error);
        } else if (data.success != undefined) {
            // console.log(data.success);
            toaster.success(data.success);
            window.location.href = "homepage.html";
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Erro na requisição:', textStatus, errorThrown);
    });
}


console.log(inp_submit, inp_submitr);

function registro(email, senha, nome, toaster) {
    $.post("php/cadastro.php", {emailr: email, senhaR1: senha, nomer: nome})
    .done(function (data) {
        if (data.error != undefined) {
          toaster.error(data.error);
        } else if (data.success != undefined) {
            toaster.success(data.success);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Erro na requisição:', textStatus, errorThrown);
    });
}


function senhaesquecida(email, toaster) {
  console.log("Chega aqui senha esquecida 2");
  $.post("php/recuperarsenhapt1.php", {emails: email})
  .done(function(data) {
    console.log("Resposta do servidor:", data);
    if (data.error != undefined) {
      toaster.error(data.error);
    } else if (data.success != undefined) {
      toaster.success(data.success);
    }
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.error('Erro na requisição:', textStatus, errorThrown);
  });
}
function iniciarToaster(parent) {
  const ElementoToaster = document.createElement("div");
  ElementoToaster.classList.add("toaster");
  parent.appendChild(ElementoToaster);
  return {
    success(message) {
      mostrarToaster(ElementoToaster, message, "success");
    },
    error(message) {
      mostrarToaster(ElementoToaster, message, "error");
    }
  };
}
function mostrarToaster(ElementoToaster, message, type) {
  const ElementoToast = criarToast(message,type);
  animarToast(ElementoToaster, ElementoToast);
}
function criarToast(message, type) {
  const ElementoToast = document.createElement("div");
  ElementoToast.textContent = message;
  ElementoToast.classList.add("toast");
  ElementoToast.classList.add(type);
  return ElementoToast;
}
function animarToast(ElementoToaster, ElementoToast){
  const alturaantes = ElementoToaster.offsetHeight;
  ElementoToaster.appendChild(ElementoToast);
  const alturadepois = ElementoToaster.offsetHeight;
  const diferencaaltura = alturadepois - alturaantes;

  const AnimacaoToaster = ElementoToaster.animate([
    { transform: `translate(0, ${diferencaaltura}px)`},
    { transform: "translate(0, 0)"}
  ], {
    duration: 150,
    easing: "ease-out"
  });

  AnimacaoToaster.startTime = document.timeline.currentTime;
  esperarAnimacao(ElementoToast)
  .then(() => {
    ElementoToaster.removeChild(ElementoToast);
  })
  .catch((error) => {
    console.error("Deu errado a animação", error);
  })
}
function esperarAnimacao(element) {
  const animationPromises = element.getAnimations().map(animation => animation.finished);

  return Promise.allSettled(animationPromises);
}