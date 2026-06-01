// src/data/imagensData.js
export const imagensPadrao = {
  home: {
    hero: "https://media.base44.com/images/public/69f7c0cb74412364a8191f75/e12cfa65f_generated_7b0e6022.png",
    sobre: "https://media.base44.com/images/public/69f7c0cb74412364a8191f75/36b0ede1d_generated_8b1cef3b.png",
    vozes: "https://media.base44.com/images/public/69f63f17474c18e84ed5b67f/6f4011fd6_generated_53a71f14.png",
  },
  servicos: {
    hero: "https://media.base44.com/images/public/69f7c0cb74412364a8191f75/af8c3378c_generated_94ea2acc.png",
  },
  contacto: {
    hero: "https://media.base44.com/images/public/69f7c0cb74412364a8191f75/af8c3378c_generated_94ea2acc.png",
  },
  recrutamento: {
    hero: "https://media.base44.com/images/public/69f7c0cb74412364a8191f75/e0077a643_generated_366188cf.png",
  },
  sobre: {
    hero: "https://media.base44.com/images/public/69f7c0cb74412364a8191f75/36b0ede1d_generated_8b1cef3b.png",
  },
  portfolio: {
    capa: "https://media.base44.com/images/public/69f7c0cb74412364a8191f75/portfolio-cover.png",
    heroImage: "https://i.pinimg.com/736x/01/07/83/010783d383408b3d5b27b201fc6bbafc.jpg",
    sobreImage: "https://i.pinimg.com/1200x/56/f6/b0/56f6b003550e1c55fb895c6764e9dc58.jpg",
  },
  equipa: {
    placeholder: "/assets/avatar-placeholder.png",
  },
  logos: {
    principal: "/assets/educatec.jpeg",
    secundario: "/assets/BDZ-LOGO.jpg",
    favicon: "/favicon.ico",
  },
};

export const listaImagens = [
  { id: "home_hero", categoria: "home", nome: "Hero Banner", url: imagensPadrao.home.hero, pagina: "Página Inicial" },
  { id: "home_sobre", categoria: "home", nome: "Imagem Sobre", url: imagensPadrao.home.sobre, pagina: "Página Inicial" },
  { id: "home_vozes", categoria: "home", nome: "Imagem Vozes de Confiança", url: imagensPadrao.home.vozes, pagina: "Página Inicial" },
  { id: "servicos_hero", categoria: "servicos", nome: "Hero Banner", url: imagensPadrao.servicos.hero, pagina: "Serviços" },
  { id: "contacto_hero", categoria: "contacto", nome: "Hero Banner", url: imagensPadrao.contacto.hero, pagina: "Contacto" },
  { id: "recrutamento_hero", categoria: "recrutamento", nome: "Hero Banner", url: imagensPadrao.recrutamento.hero, pagina: "Recrutamento" },
  { id: "sobre_hero", categoria: "sobre", nome: "Hero Banner", url: imagensPadrao.sobre.hero, pagina: "Sobre Nós" },
  { id: "portfolio_capa", categoria: "portfolio", nome: "Capa do Portfólio", url: imagensPadrao.portfolio.capa, pagina: "Portfólio" },
  { id: "portfolio_hero", categoria: "portfolio", nome: "Hero Image", url: imagensPadrao.portfolio.heroImage, pagina: "Portfólio" },
  { id: "portfolio_sobre", categoria: "portfolio", nome: "Sobre Image", url: imagensPadrao.portfolio.sobreImage, pagina: "Portfólio" },
  { id: "equipa_placeholder", categoria: "equipa", nome: "Avatar Padrão", url: imagensPadrao.equipa.placeholder, pagina: "Equipa" },
  { id: "logo_principal", categoria: "logos", nome: "Logo Principal", url: imagensPadrao.logos.principal, pagina: "Global" },
  { id: "logo_secundario", categoria: "logos", nome: "Logo Secundário", url: imagensPadrao.logos.secundario, pagina: "Global" },
  { id: "favicon", categoria: "logos", nome: "Favicon", url: imagensPadrao.logos.favicon, pagina: "Global" },
];

// Aliases para facilitar o uso
export const getAliasMap = () => ({
  hero: "home_hero",
  vozes: "home_vozes",
  about: "sobre_hero",
  contact: "contacto_hero",
  recruit: "recrutamento_hero",
  portfolioCapa: "portfolio_capa",
  portfolioHero: "portfolio_hero",
  portfolioSobre: "portfolio_sobre",
});