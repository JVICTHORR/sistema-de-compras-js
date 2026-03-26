let produtos = [];
let totalBruto = 0;
let indexEditando = null;

// INICIAR
window.onload = function () {
  carregarTema();

  let dados = localStorage.getItem("produtos");

  if (dados) {
    produtos = JSON.parse(dados);
    totalBruto = produtos.reduce((acc, p) => acc + p.subtotal, 0);
    atualizarLista();
  }
};

// MENSAGEM
function mostrarMensagem(texto, tipo) {
  let msg = document.getElementById("mensagem");

  msg.innerText = texto;
  msg.style.color = tipo === "erro" ? "red" : "lightgreen";

  setTimeout(() => msg.innerText = "", 3000);
}

// ADICIONAR / EDITAR
function adicionarProduto() {
  let nome = document.getElementById("nome").value.trim();
  let valor = parseFloat(document.getElementById("valor").value);
  let qtd = parseInt(document.getElementById("qtd").value);

  if (!nome || isNaN(valor) || isNaN(qtd)) {
    mostrarMensagem("Preencha corretamente!", "erro");
    return;
  }

  if (valor <= 0 || qtd <= 0) {
    mostrarMensagem("Valores inválidos!", "erro");
    return;
  }

  let subtotal = valor * qtd;

  if (indexEditando !== null) {
    totalBruto -= produtos[indexEditando].subtotal;
    produtos[indexEditando] = { nome, valor, qtd, subtotal };
    totalBruto += subtotal;

    indexEditando = null;
    mostrarMensagem("Produto atualizado!", "sucesso");

  } else {
    produtos.push({ nome, valor, qtd, subtotal });
    totalBruto += subtotal;

    mostrarMensagem("Produto adicionado!", "sucesso");
  }

  atualizarLista();
  salvarDados();
  limparCampos();
}

// LISTA
function atualizarLista() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";

  produtos.forEach((p, index) => {
    let item = document.createElement("li");

    item.innerHTML = `
      <div>
        <strong>${p.nome}</strong><br>
        Qtd: ${p.qtd} | R$ ${p.subtotal.toFixed(2)}
      </div>
      <div class="acoes">
        <button onclick="editarProduto(${index})">✏️</button>
        <button onclick="removerProduto(${index})">❌</button>
      </div>
    `;

    lista.appendChild(item);
  });

  document.getElementById("total").innerText = totalBruto.toFixed(2);
}

// EDITAR
function editarProduto(index) {
  let p = produtos[index];

  document.getElementById("nome").value = p.nome;
  document.getElementById("valor").value = p.valor;
  document.getElementById("qtd").value = p.qtd;

  indexEditando = index;
  mostrarMensagem("Editando produto...", "sucesso");
}

// REMOVER
function removerProduto(index) {
  totalBruto -= produtos[index].subtotal;
  produtos.splice(index, 1);

  atualizarLista();
  salvarDados();

  mostrarMensagem("Removido!", "sucesso");
}

// FINALIZAR
function finalizarCompra() {
  let pagamento = document.getElementById("pagamento").value;

  let totalFinal = totalBruto;
  let desconto = 0;

  if (pagamento == 0) {
    if (totalBruto > 200) desconto = totalBruto * 0.15;
    else if (totalBruto >= 100) desconto = totalBruto * 0.10;

    totalFinal -= desconto;
  }

  document.getElementById("resultado").innerText =
    `Total: R$ ${totalFinal.toFixed(2)} (Desconto: R$ ${desconto.toFixed(2)})`;
}

// AUX
function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("qtd").value = "";
}

function salvarDados() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// TEMA
function alternarTema() {
  let body = document.body;

  if (body.classList.contains("dark")) {
    body.classList.replace("dark", "light");
    localStorage.setItem("tema", "light");
  } else {
    body.classList.replace("light", "dark");
    localStorage.setItem("tema", "dark");
  }

  atualizarBotaoTema();
}

function carregarTema() {
  let tema = localStorage.getItem("tema") || "dark";
  document.body.classList.add(tema);
  atualizarBotaoTema();
}

function atualizarBotaoTema() {
  let btn = document.getElementById("temaBtn");
  btn.innerText = document.body.classList.contains("dark")
    ? "☀️ Modo Light"
    : "🌙 Modo Dark";
}
