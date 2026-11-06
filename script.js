function limpar(texto) {
  return texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Liga o site ao Firebase. Só existe "db" se o config.js estiver preenchido.
const temFirebase = FIREBASE_CONFIG.apiKey !== "";
let db = null;
if (temFirebase) {
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
}

// Busca todos os documentos de uma coleção ("avisos" ou "aulas")
// que estão com mostrar = true e devolve uma lista de fichas.
async function buscarLista(colecao) {
  const resposta = await db.collection(colecao).where("mostrar", "==", true).get();
  return resposta.docs.map(function (doc) {
    return doc.data();
  });
}

// Avisos: os mais novos primeiro. Aulas: por dia da semana e depois por hora.
const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

function ordemDosAvisos(a, b) {
  const x = a.criadoEm ? a.criadoEm.seconds : 0;
  const y = b.criadoEm ? b.criadoEm.seconds : 0;
  return y - x;
}

function ordemDasAulas(a, b) {
  const porDia = DIAS.indexOf(a.dia) - DIAS.indexOf(b.dia);
  return porDia !== 0 ? porDia : (a.hora || "").localeCompare(b.hora || "");
}


// ---------- PARTE 2: MOSTRAR NA PÁGINA ----------

// Cada categoria de aviso tem uma cor de papelzinho
const CORES = {
  provas: "rosa",
  eventos: "amarelo",
  geral: "azul",
  tecnico: "verde"
};

// Cria um elemento HTML com uma classe e um texto.
// Usamos textContent (e não innerHTML) para que símbolos como < e >
// apareçam como texto e não quebrem a página.
function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto) {
    elemento.textContent = texto;
  }
  return elemento;
}

function mostrarErro(idDaCaixa, mensagem) {
  const caixa = document.getElementById(idDaCaixa);
  caixa.innerHTML = "";
  caixa.appendChild(criar("p", "erro", mensagem));
}

function mostrarAvisos(lista, ehExemplo) {
  const caixa = document.getElementById("lista-avisos");
  caixa.innerHTML = ""; // apaga o "Carregando..."

  if (lista.length === 0) {
    caixa.appendChild(criar("p", "vazio", "Nenhum aviso por enquanto. Volte em breve!"));
    return;
  }

  for (let i = 0; i < lista.length; i++) {
    const aviso = lista[i];
    const cor = CORES[limpar(aviso.categoria || "")] || "azul";

    const cartao = criar("article", "aviso aviso-" + cor);

    const etiquetas = criar("div", "etiquetas");
    if (aviso.categoria) {
      etiquetas.appendChild(criar("span", "etiqueta", aviso.categoria));
    }
    if (ehExemplo) {
      etiquetas.appendChild(criar("span", "etiqueta exemplo", "exemplo"));
    }
    cartao.appendChild(etiquetas);

    cartao.appendChild(criar("h3", "", aviso.titulo));
    if (aviso.texto) {
      cartao.appendChild(criar("p", "", aviso.texto));
    }
    if (aviso.data) {
      cartao.appendChild(criar("p", "data", aviso.data));
    }

    caixa.appendChild(cartao);
  }
}

function mostrarAulas(lista, ehExemplo) {
  const caixa = document.getElementById("lista-aulas");
  caixa.innerHTML = "";

  if (lista.length === 0) {
    const item = criar("li");
    item.appendChild(criar("p", "vazio", "Ainda não há aulas complementares marcadas. Volte em breve!"));
    caixa.appendChild(item);
    return;
  }

  for (let i = 0; i < lista.length; i++) {
    const aula = lista[i];
    const item = criar("li");

    // lado esquerdo: dia e horário
    const quando = criar("div", "quando");
    quando.appendChild(criar("strong", "", aula.dia));
    quando.appendChild(criar("span", "", aula.hora));
    item.appendChild(quando);

    // lado direito: título, descrição e local
    const detalhes = criar("div", "detalhes");
    const titulo = criar("h3", "", aula.titulo);
    if (ehExemplo) {
      titulo.appendChild(criar("span", "etiqueta exemplo", "exemplo"));
    }
    detalhes.appendChild(titulo);
    if (aula.descricao) {
      detalhes.appendChild(criar("p", "", aula.descricao));
    }
    if (aula.local) {
      detalhes.appendChild(criar("p", "onde", "Onde: " + aula.local));
    }
    item.appendChild(detalhes);

    caixa.appendChild(item);
  }
}

// Se o Firebase está configurado, busca nele. Se não, usa os exemplos.
async function carregarAvisos() {
  if (!temFirebase) {
    mostrarAvisos(EXEMPLO_AVISOS, true);
    return;
  }
  try {
    const lista = await buscarLista("avisos");
    lista.sort(ordemDosAvisos);
    mostrarAvisos(lista, false);
  } catch (erro) {
    console.error(erro);
    mostrarErro("lista-avisos", "Não foi possível carregar os avisos agora. Tente de novo mais tarde.");
  }
}

async function carregarAulas() {
  if (!temFirebase) {
    mostrarAulas(EXEMPLO_AULAS, true);
    return;
  }
  try {
    const lista = await buscarLista("aulas");
    lista.sort(ordemDasAulas);
    mostrarAulas(lista, false);
  } catch (erro) {
    console.error(erro);
    mostrarErro("lista-aulas", "Não foi possível carregar as aulas agora. Tente de novo mais tarde.");
  }
}


// ---------- PARTE 3: FORMULÁRIO DE SUGESTÕES ----------

// O site não tem servidor para guardar mensagens. Por isso, ao enviar,
// ele monta o texto da sugestão e deixa pronto para mandar por e-mail
// ou para copiar.
function configurarFormulario() {
  const formulario = document.getElementById("form-sugestao");
  const resultado = document.getElementById("resultado");
  const titulo = document.getElementById("resultado-titulo");
  const caixaDeTexto = document.getElementById("resultado-texto");
  const botaoEmail = document.getElementById("botao-email");
  const botaoCopiar = document.getElementById("botao-copiar");
  const mensagem = document.getElementById("resultado-msg");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // não deixa a página recarregar

    const tipo = document.getElementById("tipo").value;
    const ideia = document.getElementById("ideia").value.trim();
    const motivo = document.getElementById("motivo").value.trim() || "(não informado)";
    const nome = document.getElementById("nome").value.trim() || "(não informado)";
    const turma = document.getElementById("turma").value.trim() || "(não informado)";

    const texto =
      "Sugestão para o Fala Aluno\n\n" +
      "Tipo: " + tipo + "\n" +
      "Ideia: " + ideia + "\n" +
      "Por que seria legal: " + motivo + "\n" +
      "Nome: " + nome + "\n" +
      "Turma: " + turma;

    const assunto = "Sugestão (" + tipo + ") - Fala Aluno";

    caixaDeTexto.value = texto;
    botaoEmail.href =
      "mailto:" + EMAIL_DA_ESCOLA +
      "?subject=" + encodeURIComponent(assunto) +
      "&body=" + encodeURIComponent(texto);

    mensagem.textContent = "";
    resultado.hidden = false;
    titulo.focus();
  });

  botaoCopiar.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(caixaDeTexto.value);
      mensagem.textContent = "Texto copiado!";
    } catch (erro) {
      caixaDeTexto.focus();
      caixaDeTexto.select();
      mensagem.textContent = "Não foi possível copiar sozinho. O texto está selecionado: use Ctrl+C.";
    }
  });
}


// ---------- COMEÇAR ----------
// Quando a página abre, o site faz estas três coisas:
carregarAvisos();
carregarAulas();
configurarFormulario();
