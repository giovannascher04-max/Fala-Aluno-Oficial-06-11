const EMAIL_DA_ESCOLA = "sugestoes@exemplo.com";

const AVISOS = [
  {
    categoria: "Provas",
    titulo: "Semana de avaliações",
    texto: "Confira o calendário com o professor de cada matéria e organize seus estudos com antecedência.",
    data: "Data a definir",
    exemplo: true
  },
  {
    categoria: "Eventos",
    titulo: "Feira de projetos da turma técnica",
    texto: "Venha apresentar, ou conhecer, os sites e aplicativos criados pela turma de Desenvolvimento de Sistemas.",
    data: "Data a definir",
    exemplo: true
  },
  {
    categoria: "Geral",
    titulo: "Biblioteca aberta no intervalo",
    texto: "Passe por lá para pegar um livro emprestado ou estudar em um lugar tranquilo.",
    data: "Todos os dias",
    exemplo: true
  },
  {
    categoria: "Técnico",
    titulo: "Entrega do projeto de lógica",
    texto: "Teste o seu programa antes de entregar e combine o prazo final com o professor.",
    data: "Prazo a combinar",
    exemplo: true
  }
];

const AULAS = [
  {
    dia: "Segunda",
    hora: "13h30",
    titulo: "Reforço de Matemática",
    descricao: "Tire dúvidas de equações e funções e treine com exercícios.",
    local: "Local a confirmar",
    exemplo: true
  },
  {
    dia: "Terça",
    hora: "13h30",
    titulo: "Monitoria de lógica de programação",
    descricao: "Pratique algoritmos e resolva desafios com a ajuda de colegas e professores.",
    local: "Laboratório de informática",
    exemplo: true
  },
  {
    dia: "Quarta",
    hora: "13h30",
    titulo: "Redação e ENEM",
    descricao: "Estrutura do texto, repertório e treino de redação.",
    local: "Local a confirmar",
    exemplo: true
  },
  {
    dia: "Quinta",
    hora: "13h30",
    titulo: "Inglês para tecnologia",
    descricao: "Vocabulário para entender tutoriais, documentações e mensagens de erro.",
    local: "Local a confirmar",
    exemplo: true
  }
];

function esc(texto) {
  const caixa = document.createElement("div");
  caixa.textContent = texto == null ? "" : String(texto);
  return caixa.innerHTML;
}

const COR_DA_CATEGORIA = { "Provas": "rosa", "Eventos": "amarelo", "Geral": "azul", "Técnico": "verde" };

function desenharMural() {
  const lista = document.getElementById("mural-lista");
  if (AVISOS.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhum aviso por enquanto. Volte em breve!</p>';
    return;
  }
  lista.innerHTML = AVISOS.map(function (a) {
    const cor = COR_DA_CATEGORIA[a.categoria] || "azul";
    return '<article class="aviso aviso-' + cor + '">' +
      '<div class="aviso-etiquetas">' +
        '<span class="etiqueta">' + esc(a.categoria) + '</span>' +
        (a.exemplo ? '<span class="etiqueta etiqueta-exemplo">exemplo</span>' : '') +
      '</div>' +
      '<h3>' + esc(a.titulo) + '</h3>' +
      '<p>' + esc(a.texto) + '</p>' +
      '<p class="aviso-data">' + esc(a.data) + '</p>' +
    '</article>';
  }).join("");
}

function desenharAulas() {
  const lista = document.getElementById("aulas-lista");
  if (AULAS.length === 0) {
    lista.innerHTML = '<li><p class="vazio">Ainda não há aulas complementares marcadas. Volte em breve!</p></li>';
    return;
  }
  lista.innerHTML = AULAS.map(function (a) {
    return '<li>' +
      '<div class="quando"><strong>' + esc(a.dia) + '</strong><span>' + esc(a.hora) + '</span></div>' +
      '<div>' +
        '<h3>' + esc(a.titulo) + (a.exemplo ? ' <span class="etiqueta etiqueta-exemplo">exemplo</span>' : '') + '</h3>' +
        '<p>' + esc(a.descricao) + '</p>' +
        '<p class="onde">Onde: ' + esc(a.local) + '</p>' +
      '</div>' +
    '</li>';
  }).join("");
}

function iniciarFormulario() {
  const form = document.getElementById("form-sugestao");
  const resultado = document.getElementById("resultado");
  const titulo = document.getElementById("resultado-titulo");
  const texto = document.getElementById("resultado-texto");
  const botaoEmail = document.getElementById("btn-email");
  const botaoCopiar = document.getElementById("btn-copiar");
  const mensagem = document.getElementById("resultado-msg");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipo = form.tipo.value;
    const ideia = form.ideia.value.trim();
    const motivo = form.motivo.value.trim() || "(não informado)";
    const nome = form.nome.value.trim() || "(não informado)";
    const turma = form.turma.value.trim() || "(não informado)";

    const corpo =
      "Sugestão para o Fala Aluno\n\n" +
      "Tipo: " + tipo + "\n" +
      "Ideia: " + ideia + "\n" +
      "Por que seria legal: " + motivo + "\n" +
      "Nome: " + nome + "\n" +
      "Turma: " + turma;

    texto.value = corpo;
    botaoEmail.href = "mailto:" + EMAIL_DA_ESCOLA +
      "?subject=" + encodeURIComponent("Sugestão (" + tipo + ") - Fala Aluno") +
      "&body=" + encodeURIComponent(corpo);

    mensagem.textContent = "";
    resultado.hidden = false;
    titulo.focus();
  });

  botaoCopiar.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(texto.value);
      mensagem.textContent = "Texto copiado!";
    } catch (erro) {
      texto.focus();
      texto.select();
      mensagem.textContent = "Não foi possível copiar sozinho. O texto está selecionado: use Ctrl+C (ou toque e segure para copiar).";
    }
  });
}

desenharMural();
desenharAulas();
iniciarFormulario();