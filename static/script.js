/* Abre e fecha menu lateral em modo mobile */

const menuMobile = document.querySelector(".menu-mobile");
const body = document.querySelector("body");

menuMobile.addEventListener("click", () => {
  menuMobile.classList.contains("bi-list")
    ? menuMobile.classList.replace("bi-list", "bi-x")
    : menuMobile.classList.replace("bi-x", "bi-list");
  body.classList.toggle("menu-nav-active");
});

/* Fecha o menu quando clicar em algum item e muda o icone para list */

const navItem = document.querySelectorAll(".nav-item");

navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (body.classList.contains("menu-nav-active")) {
      body.classList.remove("menu-nav-active");
      menuMobile.classList.replace("bi-x", "bi-list");
    }
  });
});

// Animar todos os itens na tela que tiverem meu atributo data-anime

const item = document.querySelectorAll("[data-anime]");

const animeScroll = () => {
  const windowTop = window.pageYOffset + window.innerHeight * 0.85 ;

  item.forEach((element) => {
    if (windowTop > element.offsetTop) {
      element.classList.add("animate");
    } else {
      element.classList.remove("animate");
    }
  });
};

animeScroll();

window.addEventListener("scroll", ()=>{
  animeScroll();
})

// Envio de formulário com AJAX (fetch)
const form = document.querySelector('form');
const btnEnviar = document.querySelector('#btn-enviar');
const btnEnviarLoader = document.querySelector('#btn-enviar-loader');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    btnEnviarLoader.style.display = "block";
    btnEnviar.style.display = "none";

    const formData = new FormData(form);
    const actionUrl = form.getAttribute('action') || '/send';

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const result = await response.json();
      const alertBox = document.querySelector('#alerta');
      const alertMsg = document.querySelector('#alerta-msg');

      if (alertBox && alertMsg) {
        alertBox.style.display = 'block';
        if (response.ok) {
          alertBox.className = 'alert alert-success alert-dismissible fade show';
          alertMsg.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${result.message || 'Mensagem enviada com sucesso!'}`;
          form.reset(); // Limpa o formulário em caso de sucesso
        } else {
          alertBox.className = 'alert alert-danger alert-dismissible fade show';
          alertMsg.innerHTML = `<i class="bi bi-x-circle-fill"></i> ${result.message || 'Erro ao enviar mensagem.'}`;
        }
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      const alertBox = document.querySelector('#alerta');
      const alertMsg = document.querySelector('#alerta-msg');
      if (alertBox && alertMsg) {
        alertBox.style.display = 'block';
        alertBox.className = 'alert alert-danger alert-dismissible fade show';
        alertMsg.innerHTML = `<i class="bi bi-x-circle-fill"></i> Erro ao tentar se conectar ao servidor.`;
      }
    } finally {
      btnEnviarLoader.style.display = "none";
      btnEnviar.style.display = "block";

      // Esconde o alerta depois de 5 segundos
      setTimeout(() => {
        const alertBox = document.querySelector('#alerta');
        if(alertBox) alertBox.style.display = 'none';
      }, 5000);
    }
  });
}