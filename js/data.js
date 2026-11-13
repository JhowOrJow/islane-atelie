/* =====================================================
   CONFIGURAÇÃO DO SITE — edite aqui sem mexer no resto
   ===================================================== */
window.SITE = {
  nome: "Islane Veloso",

  // WhatsApp no formato internacional (55 + DDD + número, só dígitos)
  whatsapp: "5511944643877",
  whatsappTexto: "(11) 94464-3877",

  // Seletor de data/horário do orçamento
  agenda: {
    horaMin: "08:00",       // primeiro horário disponível para escolher
    horaMax: "20:00",       // último horário disponível para escolher
    intervaloMin: 30,       // de quantos em quantos minutos
    diasDeFolga: []         // dias da semana indisponíveis: 0=domingo, 1=segunda ... 6=sábado (ex.: [0])
  },

  // Mensagem padrão dos botões "Agendar"
  mensagemPadrao:
    "Olá, Islane! Vim pelo seu site e gostaria de solicitar um orçamento / agendar um horário.",

  // Mensagem de aniversário (aparece 1x por visita). Troque para false quando o site for pro ar.
  aniversario: {
    ativo: true,
    texto:
      "Este site é um presente para o seu novo ateliê. Que cada cliente saia daqui com as unhas lindas e a autoestima lá no alto. Você merece todo o sucesso do mundo! Com muito carinho, Jonathan 💛"
  },

  /* ---------- CATÁLOGO ----------
     preco: número (30) ou null para "Sob consulta"
     pos: posição da foto no card (CSS object-position)
     Para adicionar um serviço, copie um bloco e mude os dados. */
  servicos: [
    {
      id: "mao",
      nome: "Manicure",
      subtitulo: "Somente mão",
      descricao: "Cuidado completo para as suas mãos, com acabamento impecável e esmaltação.",
      preco: 30,
      img: "assets/img/g-nude.webp",
      pos: "center 40%",
      icone: "fa-regular fa-hand",
      tag: "Mãos"
    },
    {
      id: "pe",
      nome: "Pedicure",
      subtitulo: "Somente pé",
      descricao: "Pés cuidados, macios e com esmaltação linda para qualquer ocasião.",
      preco: 30,
      img: "assets/img/card-pedicure.webp",
      pos: "center 60%",
      icone: "fa-solid fa-shoe-prints",
      tag: "Pés"
    },
    {
      id: "combo",
      nome: "Combo Mão + Pé",
      subtitulo: "Manicure e Pedicure",
      descricao: "O atendimento completo: mãos e pés no mesmo horário, com preço especial.",
      preco: 50,
      img: "assets/img/card-combo.webp",
      pos: "center",
      icone: "fa-solid fa-heart",
      tag: "Mais pedido",
      destaque: true
    },
    {
      id: "outros",
      nome: "Outros serviços",
      subtitulo: "Personalizados",
      descricao: "Quer algo diferente ou tem dúvidas? Fale com a Islane e peça seu orçamento.",
      preco: null,
      img: "assets/img/g-detalhe.webp",
      pos: "center 30%",
      icone: "fa-solid fa-wand-magic-sparkles",
      tag: "Sob consulta"
    }
  ],

  /* ---------- GALERIA ----------
     cat: pode ter várias categorias separadas por espaço: maos | pes | antesdepois */
  galeria: [
    { src: "assets/img/g-nude.webp",           cat: "maos",              titulo: "Unhas nude" },
    { src: "assets/img/g-vermelho.webp",       cat: "maos",              titulo: "Vermelho clássico" },
    { src: "assets/img/g-pe-frances.webp",     cat: "pes antesdepois",   titulo: "Francesinha nos pés - depois" },
    { src: "assets/img/g-detalhe.webp",        cat: "maos",              titulo: "Nude com detalhe" },
    { src: "assets/img/g-depois-vermelho.webp",cat: "maos antesdepois",  titulo: "Vermelho - depois" },
    { src: "assets/img/g-pe-antes.webp",       cat: "pes antesdepois",   titulo: "Pés - antes" },
    { src: "assets/img/g-mao-antes.webp",      cat: "maos antesdepois",  titulo: "Mãos - antes" },
    { src: "assets/img/g-mao-durante.webp",    cat: "maos antesdepois",  titulo: "Mãos - durante" },
    { src: "assets/img/g-pe-durante.webp",     cat: "pes antesdepois",   titulo: "Pés - durante" }
  ]
};
