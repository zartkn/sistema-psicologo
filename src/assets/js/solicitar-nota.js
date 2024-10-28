function gerarLink() {
    console.log("gerar link clicado!");
    // Obter valores dos campos
    const tipoConsulta = document.getElementById('tipoConsulta').value;
    const valor = document.getElementById('inputSenha1').value; // Ajuste para o ID correto
    
    // Obter o ID do psicólogo da sessão
    const psicologoId = "<%= psicologoId %>";
    console.log("ID do psicólogo:", psicologoId); // Ajuste para o motor de template que estiver usando (por exemplo, EJS)

    // Construir o URL com parâmetros
    const link = `http://127.0.0.1:3169/formulario?tipoConsulta=${tipoConsulta}&valor=${valor}&id=${psicologoId}`;

    // Redirecionar para o link gerado
    navigator.clipboard.writeText(link)
      .then(() => {
        alert("Link copiado!");
      })
      .catch((error) => {
        console.error("Erro: ", error);
      });
}
