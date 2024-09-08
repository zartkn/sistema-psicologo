document.addEventListener('DOMContentLoaded', function() {

    function adicionarNotasNaoCompletadas(clientes) {
      const container = document.getElementById('notas-solicitadas');
  
      if (!container) {
        console.error('Elemento de container não encontrado!');
        return;
      }
  
      clientes.forEach(cliente => {
        cliente.notas_fiscais.forEach(nota => {
          if (!nota.completada) {
            const notaDiv = document.createElement('div');
            notaDiv.classList.add('nota-solicitada-menu');
  
            // adiciona o nome do paciente e o valor da consulta na div
            notaDiv.innerHTML = `
              <p><strong>Nome paciente:</strong> ${cliente.nome}</p>
              <p><strong>Valor:</strong> R$ ${cliente.valor_consulta}</p>
            `;
  
            // coloca a div no container
            container.appendChild(notaDiv);
          }
        });
      });
    }
  
    //arquivo clientes.json
    fetch('../data/clientes.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar o arquivo JSON');
        }
        return response.json();
      })
      .then(data => {
        adicionarNotasNaoCompletadas(data.clientes);
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  });
  