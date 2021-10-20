require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Const para armanezar a porta do servidor
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

let message = "";

// Esse é o responsável por trazer os dados.
// Ele vai chamar os módulos da modelo e database para fazer a conexão e trazer
// o objeto com todas as informações que precisamos.
// Por isso que em todas as rotas que trabalhamos com nosso DB, vamos nos referir a "Loja"
// Atenção com a letra maiúscula!!!!!
const Loja = require("./models/loja");


app.get("/", async (req, res) => {
  const loja = await Loja.findAll();

  res.render("index", {
    loja, message
  });
});

app.get("/criar", (req, res) => {
  res.render("cadastroloja", {message});
});

app.get("/cadastro", (req, res) => {
  res.render("cadastroLoja", {
    message: "Cadastre sua loja!",
  });
});

app.post("/criar", async (req, res) => {
  const { nome, categoria, imagem, cnpj, contato, email } = req.body;

  if (!nome) {
    res.render("cadastroLoja", {
      message: "Nome é obrigatório",
    });
  }

  if (!imagem) {
    res.render("cadastroLoja", {
      message: "Imagem é obrigatório",
    });
  }
  if (!categoria) {
    res.render("cadastroLoja", {
      message: "Categoria é obrigatório",
    });
  }
  if (!cnpj) {
    res.render("cadastroLoja", {
      message: "Cnpj é obrigatório",
    });
  }

  if (!contato) {
    res.render("cadastroLoja", {
      message: "Contato é obrigatório",
    });
  }

    if (!email) {
      res.render("cadastroLoja", {
        message: "E-mail é obrigatório",
      });
  }

  try {
    const loja = await Loja.create({
      nome,
      categoria,
      imagem,
      cnpj,
      contato,
      email,
    });

    res.render("cadastroLoja", {
      loja,
    });
  } catch (err) {
    console.log(err);

    res.render("cadastroLoja", {
      message: "Ocorreu um erro ao cadastrar a Loja!",
    });
  }
})

app.get("/detalhes/:id", async (req, res) => { //O id definido aqui na rota é passado pelo meu HTML quando clico no link
  //Pegando uma entrada específica no banco (passada pelo ID) e construindo um objeto 
  //Aqui é apenas um objeto, não uma lista como na rota principal.
  const loja = await Loja.findByPk(req.params.id); //Find By PK - Procurar pela PK

  res.render("detalhes", {
    loja,
  });
});

app.get("/editar/:id", async (req, res) => {
  const loja = await Loja.findByPk(req.params.id);

  if (!loja) {
    res.render("editar", {
      loja,
      message: "Loja não encontrado!",
    });
  }

  res.render("editar", {
    loja, message
  });
});


app.post("/editar/:id", async (req, res) => {
  const loja = await Loja.findByPk(req.params.id);

  const { nome, categoria, imagem, cnpj, contato, email } = req.body;

  loja.nome = nome;
  loja.categoria = categoria;
  loja.imagem = imagem;
  loja.cnpj = cnpj;
  loja.contato = contato;
  loja.email = email;

  const LojaEditado = await loja.save();

  res.render("editar", {
    loja: LojaEditado,
    message: "Loja editado com sucesso!",
  });
});

app.get("/deletar/:id", async (req, res) => {
  const loja = await Loja.findByPk(req.params.id);

  if (!loja) {
    res.render("deletar", {
      loja,
      message: "Loja não encontrado!",
    });
  }

  res.render("deletar", {
    loja, message
  });
});


app.post("/deletar/:id", async (req, res) => {
  const loja = await Loja.findByPk(req.params.id);

  if (!loja) {
    res.render("deletar", {
      mensagem: "Loja não encontrado!",
    });
  }

  await loja.destroy();

  res.redirect("/");
});

app.get("/quemsomos", (req, res) => {
  res.render("quemsomos");
});

app.post("/cadastrocliente", (req, res) => {
  const {nome, sobrenome, cpf, endereco, numero, complemento, bairro, cidade, uf, cep, email} = req.body;
  const novoCliente = ({nome: nome, sobrenome: sobrenome, cpf: cpf, endereco: endereco, numero: numero, complemento: complemento, bairro: bairro, cidade: cidade, uf: uf, cep: cep, email: email});
  cadastroCliente.push(novoCliente);
  message = 'Olá, ${nome}! Seu cadastro foi realizado com sucesso!';
  res.redirect("/");
});


app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));