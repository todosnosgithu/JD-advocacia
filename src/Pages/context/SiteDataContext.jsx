// src/context/SiteDataContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const SiteDataContext = createContext();

export function useSiteData() {
  return useContext(SiteDataContext);
}

// Dados padrão
const defaultHomeData = {
  hero: {
    label: "Advocacia de Excelência",
    title: "PRECISÃO",
    subtitle: "NA PRÁTICA",
    description: "+15 de anos de excelência jurídica. Defendemos os seus interesses com rigor intelectual e estratégia de precisão."
  },
  stats: [
    { value: "+15", label: "Anos de Experiência" },
    { value: "+100", label: "Casos Resolvidos" },
    { value: "90%", label: "Taxa de Sucesso" },
    { value: "+10", label: "Advogados Especializados" }
  ],
  areas: [
    { icon: "Scale", title: "Contencioso Civil", desc: "Representação estratégica em litígios complexos de âmbito nacional e internacional." },
    { icon: "Building2", title: "Direito Comercial", desc: "Assessoria integral a empresas, desde a constituição ao crescimento sustentável." },
    { icon: "Globe", title: "Direito Internacional", desc: "Operações transfronteiriças, arbitragem e regulação do comércio global." },
    { icon: "Shield", title: "Propriedade Intelectual", desc: "Proteção de marcas, patentes e direitos autorais em todas as jurisdições." },
    { icon: "FileText", title: "Direito Fiscal", desc: "Planeamento fiscal e contencioso tributário com rigor técnico." },
    { icon: "Users", title: "Direito Laboral", desc: "Relações de trabalho, reestruturações e negociação coletiva." }
  ],
  cta: {
    title: "Precisa de ajuda",
    highlight: "jurídica?",
    text: "Fale connosco agora mesmo. A nossa equipa está preparada para analisar o seu caso com a discrição e a competência que merece.",
    email: "fulanoadvocacia@gmail.com",
    phone: "9XX XXX XXX"
  }
};

const defaultAboutData = {
  hero: {
    title: "O MOTOR",
    highlight: "INTELECTUAL",
    description: "Fundada em 2005, a Fulano Advocacia construiu a sua reputação através de um compromisso inabalável com a excelência e a inovação no exercício da advocacia."
  },
  filosofia: {
    missao: {
      title: "A Nossa Missão",
      text: "Oferecer aconselhamento jurídico de excelência, fundamentado em rigor intelectual e numa compreensão profunda das necessidades de cada cliente. Acreditamos que o direito é um instrumento de justiça e progresso — e tratamos cada caso com a dedicação que essa responsabilidade exige."
    },
    impacto: {
      title: "O Nosso Impacto",
      text: "Mais de 100 casos resolvidos com sucesso, incluindo litígios de referência que moldaram a jurisprudência portuguesa. Os nossos clientes recuperaram mais de 2 mil milhões em indemnizações e evitaram riscos regulatórios significativos nas suas operações internacionais."
    }
  },
  timeline: [
    { year: "2005", title: "Fundação", desc: "Constituição da sociedade por António Fulano e Mariana Advocacia em Luanda." },
    { year: "2010", title: "Expansão Internacional", desc: "Abertura do primeiro escritório internacional em Luanda, Angola." },
    { year: "2018", title: "Inovação Digital", desc: "Pioneiros na implementação de JD Tecnologia em Luanda." },
    { year: "2020", title: "Prémio de Excelência", desc: "Reconhecidos como Firma do Ano pela Chambers Europe." },
    { year: "2024", title: "Nova Geração", desc: "Integração de 15 novos associados e expansão para direito tecnológico." }
  ],
  valores: [
    { title: "Rigor", desc: "Cada argumento é construído com precisão cirúrgica." },
    { title: "Integridade", desc: "Transparência absoluta e ética profissional." },
    { title: "Inovação", desc: "Tecnologia para uma advocacia moderna." }
  ]
};

const defaultServicesData = [
  {
    id: "trabalho",
    title: "Direito do Trabalho",
    content: "Atuamos na defesa de trabalhadores e empresas em questões trabalhistas, assegurando direitos e promovendo soluções justas e equilibradas.",
    subtitles: "Defesa dos Trabalhadores",
    pontos: [
      "Garantia de direitos básicos: salários, férias, 13º, horas extras, descanso semanal remunerado.",
      "Proteção contra abusos: casos de assédio moral ou sexual, discriminação, despedimento sem justa causa",
      "Segurança no ambiente laboral: acompanhamento em acidentes de trabalho, doenças ocupacionais e indenizações",
      "Negociação coletiva: apoio em acordos sindicais e convenções que assegurem melhores condições de trabalho."
    ],
    subtitle: "Defesa de Empresas",
    ponto: [
      "Consultoria preventiva: elaboração de contratos de trabalho claros e adequados à legislação.",
      "Gestão de riscos: orientação para evitar passivos trabalhistas e reduzir litígios.",
      "Treinamento interno: implementação de políticas de compliance e boas práticas de RH.",
      "Assessoria em contratos de trabalho e políticas internas"
    ]
  },
  {
    id: "civil",
    title: "Direito Civil",
    content: "Resolução de conflitos e contratos, assegurando justiça e equilíbrio nas relações entre pessoas e instituições.",
    subtitles: "Áreas de Atuação",
    pontos: [
      "Elaboração e revisão de contratos",
      "Ações de responsabilidade civil",
      "Indenizações por danos materiais e morais",
      "Assessoria em questões patrimoniais"
    ],
    subtitle: "Benefícios",
    ponto: [
      "Segurança jurídica nas relações contratuais",
      "Proteção dos direitos do cidadão",
      "Resolução eficiente de conflitos"
    ]
  },
  {
    id: "penal",
    title: "Direito Penal",
    content: "Assistência jurídica especializada em processos criminais, garantindo ampla defesa e respeito aos direitos fundamentais.",
    subtitles: "Atuação",
    pontos: [
      "Defesa em processos criminais",
      "Acompanhamento em inquéritos policiais",
      "Recursos e medidas cautelares",
      "Consultoria preventiva em matéria penal"
    ],
    subtitle: "Garantias",
    ponto: [
      "Ampla defesa",
      "Devido processo legal",
      "Presunção de inocência"
    ]
  }
];

const defaultRecrutamentoPositions = [
  {
    id: 1,
    title: "Advogado Sénior - Direito Comercial",
    description: "Procuramos um advogado com experiência mínima de 5 anos em direito comercial, capacidade de gestão de equipas e excelente capacidade de comunicação.",
    requirements: ["Licenciatura em Direito", "Inscrição na OA", "Experiência mínima de 5 anos"],
    location: "Luanda, Angola",
    type: "Tempo Integral",
    active: true
  },
  {
    id: 2,
    title: "Advogado Júnior - Direito Civil",
    description: "Recém-licenciados ou com até 2 anos de experiência. Interesse em direito civil e contencioso.",
    requirements: ["Licenciatura em Direito", "Boa capacidade de comunicação"],
    location: "Luanda, Angola",
    type: "Tempo Integral",
    active: true
  }
];

const defaultSettingsData = {
  siteInfo: {
    name: "Fulano Advocacia",
    email: "fulanoadvocacia@gmail.com",
    phone: "+244 900 000 000",
    address: "Av. Deolinda Rodrigues, Luanda, Angola",
    whatsapp: "+244 900 000 000"
  },
  socialMedia: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: ""
  },
  admin: {
    password: "admin123"
  },
  emailConfig: {
    notifications: true,
    contactEmail: "fulanoadvocacia@gmail.com"
  },
  seo: {
    metaTitle: "Fulano Advocacia - Excelência Jurídica em Angola",
    metaDescription: "Advocacia de excelência em Angola. Especialistas em Direito Civil, Trabalho, Empresarial e Internacional.",
    metaKeywords: "advocacia, advogados Angola, direito civil, direito trabalho"
  }
};

// Função para inicializar dados
function initializeLocalStorage() {
  const items = [
    { key: "home_content", data: defaultHomeData },
    { key: "about_content", data: defaultAboutData },
    { key: "servicos_content", data: defaultServicesData },
    { key: "galeria_fotos", data: [] },
    { key: "recrutamento_positions", data: defaultRecrutamentoPositions },
    { key: "admin_settings", data: defaultSettingsData }
  ];
  
  items.forEach(({ key, data }) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  });
}

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState({
    home: defaultHomeData,
    about: defaultAboutData,
    services: defaultServicesData,
    galeria: [],
    recrutamento: defaultRecrutamentoPositions,
    settings: defaultSettingsData,
  });
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  // Função para carregar dados
  const loadAllData = useCallback(() => {
    try {
      initializeLocalStorage();

      const home = localStorage.getItem("home_content");
      const about = localStorage.getItem("about_content");
      const services = localStorage.getItem("servicos_content");
      const galeria = localStorage.getItem("galeria_fotos");
      const recrutamento = localStorage.getItem("recrutamento_positions");
      const settings = localStorage.getItem("admin_settings");

      setSiteData({
        home: home ? JSON.parse(home) : defaultHomeData,
        about: about ? JSON.parse(about) : defaultAboutData,
        services: services ? JSON.parse(services) : defaultServicesData,
        galeria: galeria ? JSON.parse(galeria) : [],
        recrutamento: recrutamento ? JSON.parse(recrutamento) : defaultRecrutamentoPositions,
        settings: settings ? JSON.parse(settings) : defaultSettingsData,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para atualizar dados específicos
  const updateData = useCallback((key, value) => {
    setSiteData(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`${key}_content`, JSON.stringify(value));
  }, []);

  // Função para refresh forçado
  const refreshData = useCallback(() => {
    setLoading(true);
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      loadAllData();
    }

    // Listener para mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === "recrutamento_positions") {
        const newData = JSON.parse(e.newValue);
        setSiteData(prev => ({ ...prev, recrutamento: newData }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadAllData]);

  return (
    <SiteDataContext.Provider value={{ 
      siteData, 
      loading, 
      loadAllData, 
      updateData,
      refreshData
    }}>
      {children}
    </SiteDataContext.Provider>
  );
}