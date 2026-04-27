const express = require("express");
const app = express();

app.use(express.json());

// =====================
// "Tabelas" em memória (COM DADOS)
// =====================

let filmes = [
{ id: 1, titulo: "Matrix", genero: "Ação", ano_lancamento: 1999 },
{ id: 2, titulo: "Vingadores", genero: "Ação", ano_lancamento: 2012 }
];

let usuarios = [
{ id: 3, nome: "João", email: "joao@email.com", plano: "premium" },
{ id: 4, nome: "Maria", email: "maria@email.com", plano: "basico" }
];

let favoritos = [
{ id: 5, id_usuario: 3, id_filme: 1 },
{ id: 6, id_usuario: 4, id_filme: 2 }
];

// Gerador de ID seguro (continua depois do 6)
let contador = 7;
const gerarId = () => contador++;

// =====================
// FILMES
// =====================

app.get("/filmes", (req, res) => {
res.json(filmes);
});

app.post("/filmes", (req, res) => {
const { titulo, genero, ano_lancamento } = req.body;

if (!titulo || !genero || !ano_lancamento) {
return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
}

const novoFilme = {
id: gerarId(),
titulo,
genero,
ano_lancamento
};

filmes.push(novoFilme);
res.status(201).json(novoFilme);
});

app.delete("/filmes/:id", (req, res) => {
const id = Number(req.params.id);

const index = filmes.findIndex(f => f.id === id);

if (index === -1) {
return res.status(404).json({ erro: "Filme não encontrado" });
}

favoritos = favoritos.filter(f => f.id_filme !== id);

filmes.splice(index, 1);
res.json({ mensagem: "Filme removido com sucesso" });
});

// =====================
// USUÁRIOS
// =====================

app.get("/usuarios", (req, res) => {
res.json(usuarios);
});

app.post("/usuarios", (req, res) => {
const { nome, email, plano } = req.body;

if (!nome || !email || !plano) {
return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
}

const novoUsuario = {
id: gerarId(),
nome,
email,
plano
};

usuarios.push(novoUsuario);
res.status(201).json(novoUsuario);
});

app.put("/usuarios/:id", (req, res) => {
const id = Number(req.params.id);
const { nome, email, plano } = req.body;

const usuario = usuarios.find(u => u.id === id);

if (!usuario) {
return res.status(404).json({ erro: "Usuário não encontrado" });
}

if (!nome && !email && !plano) {
return res.status(400).json({ erro: "Informe ao menos um campo para atualizar" });
}

if (nome) usuario.nome = nome;
if (email) usuario.email = email;
if (plano) usuario.plano = plano;

res.json(usuario);
});

// =====================
// FAVORITOS
// =====================

app.post("/favoritos", (req, res) => {
const { id_usuario, id_filme } = req.body;

if (!id_usuario || !id_filme) {
return res.status(400).json({ erro: "id_usuario e id_filme são obrigatórios" });
}

const usuario = usuarios.find(u => u.id === id_usuario);
const filme = filmes.find(f => f.id === id_filme);

if (!usuario || !filme) {
return res.status(404).json({ erro: "Usuário ou filme não encontrado" });
}

const existe = favoritos.find(f =>
f.id_usuario === id_usuario && f.id_filme === id_filme
);

if (existe) {
return res.status(400).json({ erro: "Favorito já existe" });
}

const novoFavorito = {
id: gerarId(),
id_usuario,
id_filme
};

favoritos.push(novoFavorito);
res.status(201).json(novoFavorito);
});

// 🔥 LISTA BONITA
app.get("/favoritos", (req, res) => {
const lista = favoritos.map(f => {
const usuario = usuarios.find(u => u.id === f.id_usuario);
const filme = filmes.find(filme => filme.id === f.id_filme);

return {
id: f.id,
usuario: usuario?.nome,
email: usuario?.email,
filme: filme?.titulo,
genero: filme?.genero,
ano_lancamento: filme?.ano_lancamento
};
});

res.json(lista);
});

// 🔥 FAVORITOS POR USUÁRIO
app.get("/favoritos/usuario/:id_usuario", (req, res) => {
const id_usuario = Number(req.params.id_usuario);

const usuario = usuarios.find(u => u.id === id_usuario);

if (!usuario) {
return res.status(404).json({ erro: "Usuário não encontrado" });
}

const lista = favoritos
.filter(f => f.id_usuario === id_usuario)
.map(f => {
const filme = filmes.find(filme => filme.id === f.id_filme);

return {
usuario: usuario.nome,
filme: filme?.titulo,
genero: filme?.genero,
ano_lancamento: filme?.ano_lancamento
};
});

res.json(lista);
});

// =====================

const PORT = 3000;
app.listen(PORT, () => {
console.log(`Servidor rodando na porta ${PORT}`);
});