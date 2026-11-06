// =====================================================
// FALA ALUNO - admin.js
//
// Controla a área do administrador:
//   PARTE 1: login e logout (Firebase Authentication)
//   PARTE 2: adicionar, editar, esconder e apagar (Firestore)
//
// Quem pode escrever é decidido pelas regras do Firestore
// (veja o GUIA-DO-GRUPO.md), e não por este arquivo.
// =====================================================

const telaLogin = document.getElementById("tela-login");
const telaPainel = document.getElementById("tela-painel");
const erroLogin = document.getElementById("login-erro");
const erroPainel = document.getElementById("painel-erro");

// Cada coleção tem os seus campos e o texto que aparece na lista.
const TIPOS = {
  avisos: {
    campos: ["categoria", "titulo", "texto", "data"],
    resumo: function (d) { return d.categoria + ": " + d.titulo; }
  },
  aulas: {
    campos: ["dia", "hora", "titulo", "descricao", "local"],
    resumo: function (d) { return d.dia + " " + d.hora + " – " + d.titulo; }
  }
};

// Guarda o id do item que está sendo editado (ou null se for um item novo).
const editando = { avisos: null, aulas: null };

if (FIREBASE_CONFIG.apiKey === "") {
  document.getElementById("alerta-sem-config").hidden = false;
} else {
  firebase.initializeApp(FIREBASE_CONFIG);
  iniciar();
}

function iniciar() {
  const auth = firebase.auth();
  const db = firebase.firestore();

  // ---------- PARTE 1: LOGIN ----------

  // O Firebase avisa sempre que alguém entra ou sai.
  auth.onAuthStateChanged(function (usuario) {
    telaLogin.hidden = usuario !== null;
    telaPainel.hidden = usuario === null;
    if (usuario) {
      document.getElementById("quem").textContent = usuario.email;
      carregarLista("avisos");
      carregarLista("aulas");
    }
  });

  document.getElementById("form-login").addEventListener("submit", async function (evento) {
    evento.preventDefault();
    erroLogin.textContent = "";
    try {
      await auth.signInWithEmailAndPassword(
        document.getElementById("login-email").value.trim(),
        document.getElementById("login-senha").value
      );
      document.getElementById("login-senha").value = "";
    } catch (erro) {
      erroLogin.textContent = "E-mail ou senha incorretos.";
    }
  });

  document.getElementById("botao-sair").addEventListener("click", function () {
    auth.signOut();
  });

  // ---------- PARTE 2: AVISOS E AULAS ----------

  function criar(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) { e.className = classe; }
    if (texto) { e.textContent = texto; }
    return e;
  }

  function falhou(erro) {
    console.error(erro);
    erroPainel.textContent = "Não foi possível concluir. Confira se você entrou com o e-mail de administrador.";
  }

  // Desenha a lista de uma coleção, com os botões de cada item.
  async function carregarLista(colecao) {
    const caixa = document.getElementById("lista-admin-" + colecao);
    try {
      const resposta = await db.collection(colecao).get();
      caixa.innerHTML = "";
      if (resposta.empty) {
        caixa.appendChild(criar("li", "vazio", "Nada cadastrado ainda."));
      }
      resposta.docs.forEach(function (doc) {
        const dados = doc.data();
        const item = criar("li", "item-admin" + (dados.mostrar ? "" : " escondido"));
        item.appendChild(criar("span", "", TIPOS[colecao].resumo(dados) + (dados.mostrar ? "" : " (escondido)")));

        const editar = criar("button", "botao botao-contorno botao-pequeno", "Editar");
        editar.onclick = function () { comecarEdicao(colecao, doc.id, dados); };

        const alternar = criar("button", "botao botao-contorno botao-pequeno", dados.mostrar ? "Esconder" : "Mostrar");
        alternar.onclick = function () {
          db.collection(colecao).doc(doc.id).update({ mostrar: !dados.mostrar })
            .then(function () { carregarLista(colecao); }).catch(falhou);
        };

        const apagar = criar("button", "botao botao-contorno botao-pequeno", "Apagar");
        apagar.onclick = function () {
          if (confirm("Apagar de vez? Isso não tem volta.")) {
            db.collection(colecao).doc(doc.id).delete()
              .then(function () { carregarLista(colecao); }).catch(falhou);
          }
        };

        item.append(editar, alternar, apagar);
        caixa.appendChild(item);
      });
    } catch (erro) {
      falhou(erro);
    }
  }

  // Coloca os dados do item no formulário para poder editar.
  function comecarEdicao(colecao, id, dados) {
    const form = document.getElementById("form-" + colecao);
    TIPOS[colecao].campos.forEach(function (campo) {
      form.elements[campo].value = dados[campo] || "";
    });
    editando[colecao] = id;
    form.querySelector("[data-cancelar]").hidden = false;
    form.scrollIntoView();
  }

  function terminarEdicao(colecao) {
    const form = document.getElementById("form-" + colecao);
    form.reset();
    editando[colecao] = null;
    form.querySelector("[data-cancelar]").hidden = true;
  }

  // Liga os dois formulários (avisos e aulas) com o mesmo código.
  Object.keys(TIPOS).forEach(function (colecao) {
    const form = document.getElementById("form-" + colecao);

    form.addEventListener("submit", async function (evento) {
      evento.preventDefault();
      erroPainel.textContent = "";

      const dados = {};
      TIPOS[colecao].campos.forEach(function (campo) {
        dados[campo] = form.elements[campo].value.trim();
      });

      try {
        if (editando[colecao]) {
          await db.collection(colecao).doc(editando[colecao]).update(dados);
        } else {
          dados.mostrar = true;
          dados.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
          await db.collection(colecao).add(dados);
        }
        terminarEdicao(colecao);
        carregarLista(colecao);
      } catch (erro) {
        falhou(erro);
      }
    });

    form.querySelector("[data-cancelar]").addEventListener("click", function () {
      terminarEdicao(colecao);
    });
  });
}
