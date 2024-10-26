document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formRegister"); 

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // NAO DEIXA ENVIAR SEM ESTAR VALIDADO

      const username = document.getElementById("exampleInputtext1")?.value;
      const email = document.getElementById("exampleInputEmail1")?.value;
      const password = document.getElementById("exampleInputPassword1")?.value;

      // VALIDACOES
      if (!username || !email || !password) {
        console.error("Todos os campos são obrigatórios.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        console.error("Formato de email inválido.");
        return;
      }

   
      form.submit(); // Envia o formulário para /register
    });
  }
});
