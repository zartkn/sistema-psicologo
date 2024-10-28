function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get('id'),
    valor: params.get('valor')
  };
}

// Preenche os campos do formulário
document.addEventListener('DOMContentLoaded', () => {
  const queryParams = getQueryParams();

  // Preenche os campos com os valores obtidos da URL
  if (queryParams.id) {
    document.getElementById('inputIdPsicologo').value = queryParams.id;
  }
  if (queryParams.valor) {
    document.getElementById('inputValor').value = queryParams.valor;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('notaFormulario');

  form.addEventListener('submit', (event) => {
    // Verifica se os campos estão preenchidos
    const idPsicologo = document.getElementById('inputIdPsicologo').value;
    const valor = document.getElementById('inputValor').value;
    const nome = document.getElementById('inputNome').value;
    const sobrenome = document.getElementById('inputSobrenome').value;
    const cpf = document.getElementById('inputCPF').value;
    const telefone = document.getElementById('inputTelefone').value;

    if (!idPsicologo || !valor || !nome || !sobrenome || !cpf || !telefone) {
      alert('Por favor, preencha todos os campos.');
      event.preventDefault(); // Impede o envio do formulário
      return;
    }

    // Se todos os campos estão preenchidos, o formulário será enviado automaticamente
  });
});

