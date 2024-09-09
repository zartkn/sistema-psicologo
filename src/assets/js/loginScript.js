var inputs = {
    nome: /^[\w\s]+$/,  // Regex válida para nome (letras, números e espaços)
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/  // Regex válida para email
};

// Evento de submissão do formulário
$("form").on("submit", function(event) {
    event.preventDefault();  // Previne o envio do formulário, para validação

    // Acessando os inputs
    let email = document.getElementById("inputLogin1").value;
    let senha = document.getElementById("inputSenha1").value;
    
    // Validação de cada campo de acordo com o tipo
    $("form input").each(function() {
        var tipo = this.name;  // Pega o "name" do input para saber qual regex usar
        var regex = inputs[tipo];  // Pega a regex correspondente ao tipo
        console.log(email)
        // Valida o valor do input com a regex
        if (this.value.match(regex)) {
            console.log("Funfou: " + tipo);
            alert('O campo ' + tipo + ' está válido!');
        } else {
            console.log("Não funfou: " + tipo);
            alert('O campo ' + tipo + ' está inválido!');
        }
    });
});
