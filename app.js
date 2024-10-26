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


//TELA DE LOGIN GET
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/html/authentication-login.html');
  console.log("aa")
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
      req.session.user = results[0]; 
      return res.redirect("/menu"); 
    } else {
      console.log("Credenciais inválidas, tente novamente.")
      res.redirect("login")
    }
  });
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
      return res.status(500).send('Erro ao salvar os dados no banco de dados'); 
    }

    console.log('Usuário registrado!');
    res.redirect("/login");  
  });
});



//menu
app.get('/menu', (req, res) => {
  res.sendFile(__dirname + '/src/html/index.html');
});



//lista de usuarios (REMOVER DEPOIS)
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