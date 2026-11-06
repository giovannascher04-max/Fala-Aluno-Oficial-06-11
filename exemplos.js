// =====================================================
// DADOS DE EXEMPLO
// O site usa estes avisos e aulas só quando o
// Firebase ainda não foi configurado no arquivo config.js.
// Os nomes (categoria, titulo...) são iguais aos campos
// guardados no Firestore.
// =====================================================

const EXEMPLO_AVISOS = [
  {
    categoria: "Provas",
    titulo: "Semana de avaliações",
    texto: "Confira o calendário com o professor de cada matéria e organize seus estudos com antecedência.",
    data: "Data a definir"
  },
  {
    categoria: "Eventos",
    titulo: "Feira de projetos da turma técnica",
    texto: "Venha apresentar, ou conhecer, os sites e aplicativos criados pela turma de Desenvolvimento de Sistemas.",
    data: "Data a definir"
  },
  {
    categoria: "Geral",
    titulo: "Biblioteca aberta no intervalo",
    texto: "Passe por lá para pegar um livro emprestado ou estudar em um lugar tranquilo.",
    data: "Todos os dias"
  },
  {
    categoria: "Técnico",
    titulo: "Entrega do projeto de lógica",
    texto: "Teste o seu programa antes de entregar e combine o prazo final com o professor.",
    data: "Prazo a combinar"
  }
];

const EXEMPLO_AULAS = [
  {
    dia: "Segunda",
    hora: "13h30",
    titulo: "Reforço de Matemática",
    descricao: "Tire dúvidas de equações e funções e treine com exercícios.",
    local: "Local a confirmar"
  },
  {
    dia: "Terça",
    hora: "13h30",
    titulo: "Monitoria de lógica de programação",
    descricao: "Pratique algoritmos e resolva desafios com a ajuda de colegas e professores.",
    local: "Laboratório de informática"
  },
  {
    dia: "Quarta",
    hora: "13h30",
    titulo: "Redação e ENEM",
    descricao: "Estrutura do texto, repertório e treino de redação.",
    local: "Local a confirmar"
  },
  {
    dia: "Quinta",
    hora: "13h30",
    titulo: "Inglês para tecnologia",
    descricao: "Vocabulário para entender tutoriais, documentações e mensagens de erro.",
    local: "Local a confirmar"
  }
];