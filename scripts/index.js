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

// span.onclick = function() {
//   modal.style.display = "none";
// }
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
