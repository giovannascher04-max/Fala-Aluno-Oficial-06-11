// =====================================================
// CONFIGURAÇÕES DO SITE
// Este é o único arquivo que o grupo precisa mexer
// para ligar o site ao Firebase.
// O passo a passo está no arquivo GUIA-DO-GRUPO.md
// =====================================================

// E-mail que vai receber as sugestões dos alunos
// (use um e-mail da escola ou do grêmio, porque ele fica visível no código)
const EMAIL_DA_ESCOLA = "sugestoesrahal@al.educacao.sp.br";

// Dados do projeto no Firebase (veja o guia, passo 1).
// Enquanto apiKey estiver vazio, o site mostra avisos e aulas de exemplo.
// Não é segredo: quem protege os dados são as regras do Firestore.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAqLrLczFY7tP_yTa13siZQpUMAmm72C44",
  authDomain: "falaluno.firebaseapp.com",
  projectId: "falaluno",
  appId: "1:306980421455:web:b424052fd84f8702784f3a"
};
