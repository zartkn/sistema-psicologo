const express = require('express');
const session = require('express-session'); 
const app = express();
const port = 3169;
const fs = require('fs');
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "6540",
  database: "psicontabil",
  multipleStatements: true
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 

// CONFIGURACOES DA SESSAO DO USUARIO
app.use(session({
  secret: 'senha123', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


// CONECTA COM BD
con.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});
  // LER ARQUIVO SQL
  const sql = fs.readFileSync(__dirname + '/psicontabil.sql').toString();

  
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao executar script SQL:', err);
      return;
    }
    console.log('Script SQL executado com sucesso');
  });

//
//
//carrega css
app.use(express.static(__dirname + '/src'));


// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));


//PAGINA PARA CADA NOTA
app.get('/nota/:id', (req, res) => {
  const notaId = req.params.id;

  con.query('SELECT * FROM Notas WHERE id_Nota = ?', [notaId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar nota:', err);
      return res.status(500).send('Erro ao buscar nota');
    } 

    if (results.length === 0) {
      return res.status(404).send('Nota não encontrada');
    }

    // mostra a pagina, com os resultados da nota especificada
    res.render('nota-detalhes', { nota: results[0] });
  });
});


//TELA DE NOTAS FINALIZADAS
app.get('/notas-finalizadas', (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/login'); 
  }
  //ID do psicologo
  const psicologoId = req.session.user.id; 

  // consulta as notas no banco de dados com base no psicologo
  con.query('SELECT * FROM Notas WHERE id_Psicologo = 1 AND finalizado = 1; ', [psicologoId], (err, notas) => {
    if (err) {
      console.error('Erro ao buscar notas:', err);
      return res.status(500).send('Erro ao buscar notas');
    }
    res.render('notas-finalizadas', { notas });
  });
});


//FORMULARIO PARA O CLIENTE
app.get('/formulario', (req, res) => {
  res.sendFile(__dirname + '/src/html/formulario.html');
});

app.post('/formulario', (req, res) => {
  // pega a info do formulario
  const { idPsicologo, valor, nome, sobrenome, cpf, telefone } = req.body;

  const nomeCompleto = `${nome} ${sobrenome}`

  const sql = 'INSERT INTO Notas (id_Psicologo, valor, nome, cpf, telefone) VALUES (?, ?, ?, ?, ?)';
  const values = [idPsicologo, valor, nomeCompleto, cpf, telefone];


  con.query(sql, values, () => {

    console.log(`Dados inseridos`); 
    res.send('Formulário enviado (tela usuario para finalizar)');
  });
});


//SOLICITAR NOTA
app.get("/solicitar-nota", (req, res) => {

  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/login'); 
  }

  // Renderiza o arquivo EJS e passa o ID do psicólogo
  res.render('solicitar-nota.ejs', { psicologoId: req.session.user.id });
});

//TELA NOTAS SOLICITADAS
app.get('/notas-solicitadas', (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/login'); 
  }

  //ID do psicologo
  const psicologoId = req.session.user.id; 

  // consulta as notas no banco de dados com base no psicologo
  con.query('SELECT * FROM Notas WHERE id_Psicologo = 1 AND finalizado = 0; ', [psicologoId], (err, notas) => {
    if (err) {
      console.error('Erro ao buscar notas:', err);
      return res.status(500).send('Erro ao buscar notas');
    }
    res.render('notas-solicitadas', { notas });
  });
});


//menu
app.get('/menu', (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/login'); 
  }
  res.sendFile(__dirname + '/src/html/index.html');
});


//TELA DE REGISTER
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/src/html/authentication-register.html');
});


//TELA DE REGISTER POST
app.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'INSERT INTO Usuarios (username, email, senha) VALUES (?, ?, ?)';
  const values = [username, email, password];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados no banco de dados:', err.message);
    }

    console.log(`Usuário registrado ID: ${result.insertId}`);
    res.redirect("/login");  
  });
});


//TELA DE LOGIN GET
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/html/authentication-login.html');
});


// TELA DE LOGIN POST
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // VERIFICACAO EMAIL E SENHA
  const sql = 'SELECT * FROM Usuarios WHERE email = ? AND senha = ?';
  con.query(sql, [email, password], (err, results) => {
    if (err) {
      console.log("Erro na verificacao das credenciais.")
      res.redirect("login")
    }

    if (results.length > 0) {
      req.session.user = {
        id: results[0].id,
        username: results[0].username,
        email: results[0].email
      };
      return res.redirect("/menu"); 
    } else {
      console.log("Credenciais inválidas, tente novamente.");
      res.redirect("login");
    }
  });
});


//ENCERRAR SESSAO
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao encerrar a sessão:", err);
      return res.redirect('/menu'); 
    }
  });
    res.redirect("/login");
});

//lista de usuarios (REMOVER DEPOIS ou NAO)
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM Usuarios';
  con.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Erro.');
      return;
    }
    res.send(results); // envia a lista em formato JSON
  });
});



//REDIRECIONA COM BASE NA SESSAO DO USUARIO
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect("/menu");
  } else {
    res.redirect("/login");
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

