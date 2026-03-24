export type PricingModel = "Suscripción" | "Pago Único + Setup" | "Pago Único";

export interface QuoterModule {
    id: string;
    name: string;
    price: number;
    type: "monthly" | "one-time";
}

export interface SystemRequirements {
    os: string[];        // e.g. ['Windows', 'macOS', 'Linux', 'Web']
    browser?: string;   // e.g. 'Chrome, Firefox, Edge (versión 90+)'
    ram?: string;       // e.g. '8 GB RAM mínimo'
    storage?: string;   // e.g. '50 GB en disco'
    internet?: string;  // e.g. '10 Mbps o superior'
    notes?: string;     // Extra info
}

export interface Solution {
    id: string;
    name: string;
    category: string;
    description: string;
    pricingModel: PricingModel;
    priceStr: string;
    setupFeeStr: string;

    // Numeric values for calculation
    basePrice: number; // Monthly or one-time depending on pricing model
    setupFee: number;
    licensePrice?: number; // Optional price per additional license
    includedLicenses?: number; // Licenses already included in the basePrice
    modules: QuoterModule[];

    features: string[];
    rating: number;
    reviews: number;
    vendor: string;
    deployment: string;
    targetAudience: string;
    website: string;
    image?: string;
    systemRequirements?: SystemRequirements;
}

export const solutions: Solution[] = [
    {
        id: "crm-pro",
        name: "SalesForce Pro",
        category: "CRM",
        description: "Plataforma líder en gestión de relaciones con clientes corporativos con IA integrada. Optimiza procesos de ventas, marketing y servicio al cliente en una única plataforma unificada. Obtén visión 360 de cada cliente y automatiza tareas repetitivas.",
        pricingModel: "Suscripción",
        priceStr: "$150/mes por usuario",
        setupFeeStr: "$0",
        basePrice: 0,
        licensePrice: 150, // Per user
        setupFee: 0,
        modules: [
            { id: "ia-predictiva", name: "Reportes IA Predictivos (Avanzado)", price: 50, type: "monthly" },
            { id: "api-plus", name: "Extensión API (Límites Altos)", price: 100, type: "monthly" },
            { id: "training", name: "Capacitación de Equipo", price: 500, type: "one-time" }
        ],
        features: ["Automatización de flujos", "Reportes IA Predictivos", "Integración API REST", "Soporte 24/7", "Roles y Permisos Avanzados"],
        rating: 4.8,
        reviews: 1240,
        vendor: "SalesForce Corp",
        deployment: "Cloud, SaaS",
        targetAudience: "Medianas y Grandes Empresas",
        website: "https://www.salesforce.com",
        image: "/products/crm-pro.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Linux', 'Web', 'iOS', 'Android'],
            browser: 'Chrome, Firefox, Edge, Safari (ver. 90+)',
            ram: '4 GB RAM mínimo',
            internet: '5 Mbps o superior',
            notes: '100% basado en la nube. No requiere instalación local.'
        }
    },
    {
        id: "erp-tech",
        name: "TechERP Suite",
        category: "ERP",
        description: "Sistema de planificación de recursos empresariales para manufactura y logística. Controla toda la cadena de suministro, inventarios, finanzas y recursos humanos desde un único panel centralizado y seguro.",
        pricingModel: "Pago Único + Setup",
        priceStr: "Desde $15,000",
        setupFeeStr: "$2,500",
        basePrice: 15000,
        setupFee: 2500,
        modules: [
            { id: "multi-almacen", name: "Gestión Multi-Almacén Avanzada", price: 3000, type: "one-time" },
            { id: "nomina-pro", name: "Módulo Nómina Regional", price: 1500, type: "one-time" },
            { id: "soporte-premium", name: "Soporte Técnico Premium", price: 200, type: "monthly" }
        ],
        features: ["Control de Inventarios", "Módulo de Finanzas", "Módulo RRHH", "Trazabilidad de Cadena de Suministro", "Facturación Electrónica"],
        rating: 4.6,
        reviews: 845,
        vendor: "TechSolutions Inc",
        deployment: "On-Premise, Cloud Híbrido",
        targetAudience: "Manufactura, Logística, Retail",
        website: "https://www.odoo.com",
        image: "/products/erp-tech.png",
        systemRequirements: {
            os: ['Windows', 'Linux'],
            ram: '16 GB RAM mínimo (servidor)',
            storage: '200 GB en disco SSD',
            internet: '20 Mbps o superior',
            notes: 'Disponible en modalidad Cloud Híbrido. Requiere servidor dedicado para On-Premise.'
        }
    },
    {
        id: "hr-hub",
        name: "PeopleHub",
        category: "Recursos Humanos",
        description: "Gestión unificada de nómina, evaluación de desempeño y reclutamiento. Transforma la experiencia del empleado y agiliza los procesos del departamento de talento.",
        pricingModel: "Suscripción",
        priceStr: "$10/mes por empleado",
        setupFeeStr: "$500",
        basePrice: 0,
        licensePrice: 10,
        setupFee: 500,
        modules: [
            { id: "onboarding-video", name: "Onboarding Inmersivo (Video)", price: 20, type: "monthly" },
            { id: "integracion-erp", name: "Integración con ERPs Externos", price: 50, type: "monthly" }
        ],
        features: ["Nómina Automatizada", "Evaluaciones de Desempeño 360", "Portal de Onboarding", "Gestión de Vacaciones", "Firma Electrónica"],
        rating: 4.9,
        reviews: 2150,
        vendor: "HR Tech Partners",
        deployment: "Cloud",
        targetAudience: "Empresas en crecimiento (50-1000 empleados)",
        website: "https://www.bamboohr.com",
        image: "/products/hr-hub.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Web', 'iOS', 'Android'],
            browser: 'Chrome, Firefox, Edge (ver. 88+)',
            ram: '4 GB RAM mínimo',
            internet: '5 Mbps o superior',
            notes: 'App móvil disponible para iOS 14+ y Android 10+.'
        }
    },
    {
        id: "cyber-sec",
        name: "SecureShield Enterprise",
        category: "Ciberseguridad",
        description: "Protección integral contra amenazas, ransomware y prevención de pérdida de datos. Mantén la continuidad de tu negocio con seguridad de nivel militar certificada.",
        pricingModel: "Suscripción",
        priceStr: "$500/mes base (hasta 50 dispositivos)",
        setupFeeStr: "$1,200",
        basePrice: 500,
        licensePrice: 5, // Per extra device beyond included
        includedLicenses: 50,
        setupFee: 1200,
        modules: [
            { id: "soc-247", name: "Servicio SOC Activo 24/7", price: 800, type: "monthly" },
            { id: "auditoria-hipaa", name: "Certificación/Auditoría HIPAA", price: 2000, type: "one-time" }
        ],
        features: ["Arquitectura Zero Trust", "Monitoreo Inteligente 24/7", "Respaldo Inmutable", "Prevención DLP", "Auditorías de Cumplimiento (HIPAA, SOC2)"],
        rating: 4.7,
        reviews: 512,
        vendor: "SecureSoft",
        deployment: "Agente Endpoint, Cloud",
        targetAudience: "Corporativos, Sector Financiero, Salud",
        website: "https://www.crowdstrike.com",
        image: "/products/cyber-sec.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Linux'],
            ram: '8 GB RAM mínimo (endpoint)',
            storage: '10 GB en disco',
            internet: '10 Mbps o superior',
            notes: 'Agente ligero de instalación local. Panel de gestión en la nube compatible con todos los navegadores.'
        }
    },
    {
        id: "bi-analytics",
        name: "DataVision BI",
        category: "Analytics",
        description: "Visualización de datos avanzados y dashboards predictivos en tiempo real. Conecta todas tus bases de datos y extrae insights de negocio accionables sin escribir código.",
        pricingModel: "Suscripción",
        priceStr: "$299/mes",
        setupFeeStr: "$0",
        basePrice: 299,
        setupFee: 0,
        modules: [
            { id: "conectores-nosql", name: "Conectores NoSQL Premium", price: 99, type: "monthly" },
            { id: "marca-blanca", name: "Dashboards Marca Blanca (Embed)", price: 150, type: "monthly" }
        ],
        features: ["Dashboards Drag & Drop dinámicos", "Generación y Exportación PDF/Excel", "Más de 100 Conectores (SQL, NoSQL, APIs)", "Alertas Inteligentes", "Análisis Predictivo"],
        rating: 4.5,
        reviews: 980,
        vendor: "DataAnalytics Corp",
        deployment: "Cloud, SaaS",
        targetAudience: "Retail, eCommerce, Agencias",
        website: "https://www.tableau.com",
        image: "/products/bi-analytics.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Linux', 'Web'],
            browser: 'Chrome, Edge (ver. 90+)',
            ram: '8 GB RAM recomendado',
            internet: '10 Mbps o superior',
            notes: 'Los conectores locales requieren Windows o Linux para el agente de sincronización.'
        }
    },
    {
        id: "marketing-auto",
        name: "MarketFlow",
        category: "Marketing",
        description: "Automatización de campañas omnicanal, email marketing y lead scoring. Incrementa tu tasa de conversión enviando el mensaje correcto en el momento indicado.",
        pricingModel: "Suscripción",
        priceStr: "$89/mes",
        setupFeeStr: "$0",
        basePrice: 89,
        licensePrice: 15,
        setupFee: 0,
        modules: [
            { id: "sms-marketing", name: "Módulo SMS Global", price: 40, type: "monthly" },
            { id: "whatsapp-api", name: "Integración WhatsApp Business API", price: 120, type: "monthly" },
            { id: "expert-setup", name: "Configuración y Warmup por Expertos", price: 300, type: "one-time" }
        ],
        features: ["Automatización de Emails Multicanal", "Creador de Landing Pages Drag & Drop", "A/B Testing Integrado", "Lead Scoring Sensible al Contexto", "Integración CRM Nativa"],
        rating: 4.4,
        reviews: 3200,
        vendor: "MarketingTech SaaS",
        deployment: "Cloud",
        targetAudience: "Startups, Agencias, PyMEs",
        website: "https://www.hubspot.com",
        image: "/products/marketing-auto.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Web', 'iOS', 'Android'],
            browser: 'Chrome, Firefox, Edge, Safari (ver. 88+)',
            ram: '4 GB RAM mínimo',
            internet: '5 Mbps o superior',
            notes: '100% en la nube. App móvil disponible para gestión de campañas.'
        }
    },
    {
        id: "doc-manager",
        name: "DocuVault Pro",
        category: "Gestión Documental",
        description: "Repositorio centralizado de documentos empresariales con control de versiones, firma electrónica y flujos de aprobación automatizados. Cumplimiento normativo garantizado.",
        pricingModel: "Suscripción",
        priceStr: "$49/mes",
        setupFeeStr: "$250",
        basePrice: 49,
        licensePrice: 8,
        setupFee: 250,
        modules: [
            { id: "firma-avanzada", name: "Firma Electrónica Avanzada (FEA)", price: 30, type: "monthly" },
            { id: "ocr-ia", name: "OCR Inteligente con IA", price: 45, type: "monthly" },
        ],
        features: ["Control de Versiones", "Flujos de Aprobación", "Firma Electrónica", "Búsqueda Full-Text", "Integración Office 365"],
        rating: 4.6,
        reviews: 890,
        vendor: "DocuTech Inc",
        deployment: "Cloud, On-Premise",
        targetAudience: "Legal, Compliance, Corporativos",
        website: "https://www.microsoft.com/sharepoint",
        image: "/products/doc-manager.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Linux', 'Web', 'iOS', 'Android'],
            browser: 'Chrome, Firefox, Edge, Safari (ver. 90+)',
            ram: '4 GB RAM mínimo',
            internet: '5 Mbps o superior',
            notes: 'Integración nativa con Office 365 y Google Workspace. Aplicación de escritorio opcional.'
        }
    },
    {
        id: "helpdesk-pro",
        name: "SupportHub",
        category: "Soporte al Cliente",
        description: "Plataforma omnicanal de soporte al cliente con ticketing, base de conocimiento y chatbot IA. Reduce los tiempos de respuesta hasta un 60% y mejora la satisfacción del cliente.",
        pricingModel: "Suscripción",
        priceStr: "$65/mes",
        setupFeeStr: "$0",
        basePrice: 65,
        licensePrice: 20,
        setupFee: 0,
        modules: [
            { id: "chatbot-ia", name: "Chatbot IA Avanzado (GPT)", price: 80, type: "monthly" },
            { id: "voice-support", name: "Soporte por Voz VoIP", price: 50, type: "monthly" },
        ],
        features: ["Ticketing Multicanal", "Base de Conocimiento", "SLA Automático", "Chatbot IA", "Reportes de Satisfacción (CSAT)"],
        rating: 4.7,
        reviews: 2100,
        vendor: "SupportTech Corp",
        deployment: "Cloud, SaaS",
        targetAudience: "SaaS, eCommerce, Servicios",
        website: "https://www.zendesk.com",
        image: "/products/helpdesk-pro.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Web', 'iOS', 'Android'],
            browser: 'Chrome, Firefox, Edge (ver. 88+)',
            ram: '4 GB RAM mínimo',
            internet: '5 Mbps o superior',
            notes: 'App para agentes disponible en iOS y Android. Portal de clientes accesible desde cualquier dispositivo.'
        }
    },
    {
        id: "unified-comms",
        name: "ConnectPro",
        category: "Comunicaciones",
        description: "Plataforma de comunicaciones unificadas: videoconferencias HD, mensajería interna, gestión de proyectos y pizarras virtuales en una sola herramienta corporativa.",
        pricingModel: "Suscripción",
        priceStr: "$12/mes por usuario",
        setupFeeStr: "$0",
        basePrice: 0,
        licensePrice: 12,
        setupFee: 0,
        modules: [
            { id: "webinars", name: "Webinars y Transmisiones (500+ asistentes)", price: 99, type: "monthly" },
            { id: "transcripcion-ia", name: "Transcripción Automática IA", price: 25, type: "monthly" },
        ],
        features: ["Videoconferencias HD", "Mensajería Instantánea", "Pizarras Colaborativas", "Integración Calendar", "Grabación en la Nube"],
        rating: 4.5,
        reviews: 5400,
        vendor: "ConnectSoft",
        deployment: "Cloud, Desktop App, Mobile",
        targetAudience: "Equipos Remotos, Corporativos",
        website: "https://www.zoom.us",
        image: "/products/unified-comms.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Linux', 'Web', 'iOS', 'Android'],
            browser: 'Chrome, Firefox, Edge (ver. 90+)',
            ram: '8 GB RAM recomendado',
            internet: '10 Mbps o superior (25 Mbps para HD)',
            notes: 'App de escritorio disponible para Windows y macOS. También funcional en navegador sin instalación.'
        }
    },
    {
        id: "ecommerce-b2b",
        name: "TradePortal B2B",
        category: "E-Commerce",
        description: "Plataforma de comercio electrónico diseñada para transacciones B2B: catálogos personalizados por cliente, precios por volumen, órdenes de compra y facturación integrada.",
        pricingModel: "Pago Único + Setup",
        priceStr: "Desde $8,000",
        setupFeeStr: "$1,500",
        basePrice: 8000,
        setupFee: 1500,
        modules: [
            { id: "marketplace", name: "Módulo Marketplace Multi-Vendedor", price: 2500, type: "one-time" },
            { id: "erp-sync", name: "Sincronización ERP en Tiempo Real", price: 400, type: "monthly" },
        ],
        features: ["Catálogos Personalizados por Cliente", "Precios por Volumen", "Órdenes de Compra", "Facturación Electrónica", "Portal de Proveedores"],
        rating: 4.3,
        reviews: 320,
        vendor: "TradeStack",
        deployment: "Cloud, SaaS",
        targetAudience: "Distribuidoras, Manufactura, Retail B2B",
        website: "https://www.shopify.com/plus",
        image: "/products/ecommerce-b2b.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Linux', 'Web'],
            browser: 'Chrome, Firefox, Edge, Safari (ver. 90+)',
            ram: '8 GB RAM mínimo (servidor)',
            storage: '100 GB en disco SSD',
            internet: '20 Mbps o superior',
            notes: 'Frontend del cliente accesible desde cualquier dispositivo. Requiere servidor para panel de administración On-Premise.'
        }
    },
    {
        id: "project-mgmt",
        name: "AgileBoard",
        category: "Gestión de Proyectos",
        description: "Herramienta de gestión ágil de proyectos con tableros Kanban, diagramas de Gantt, seguimiento de tiempo y colaboración en equipo. Integración nativa con herramientas de desarrollo.",
        pricingModel: "Suscripción",
        priceStr: "$9/mes por usuario",
        setupFeeStr: "$0",
        basePrice: 0,
        licensePrice: 9,
        setupFee: 0,
        modules: [
            { id: "gantt-avanzado", name: "Gantt Avanzado con Dependencias", price: 15, type: "monthly" },
            { id: "time-tracking", name: "Seguimiento de Tiempo + Facturación", price: 10, type: "monthly" },
        ],
        features: ["Tableros Kanban", "Diagramas de Gantt", "Seguimiento de Tiempo", "Gestión de Recursos", "Integración GitHub/Jira"],
        rating: 4.8,
        reviews: 7800,
        vendor: "AgileSoft",
        deployment: "Cloud, SaaS",
        targetAudience: "Desarrollo, Agencias, Consultoría",
        website: "https://www.monday.com",
        image: "/products/project-mgmt.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Linux', 'Web', 'iOS', 'Android'],
            browser: 'Chrome, Firefox, Edge, Safari (ver. 88+)',
            ram: '4 GB RAM mínimo',
            internet: '5 Mbps o superior',
            notes: 'App móvil para iOS 14+ y Android 10+. Integración con GitHub, GitLab, Jira y Slack.'
        }
    },
    {
        id: "finance-cloud",
        name: "FinanceCloud",
        category: "Contabilidad",
        description: "Plataforma contable en la nube con facturación electrónica CFDI 4.0, conciliación bancaria automática, reportes fiscales y control presupuestal en tiempo real para empresas mexicanas.",
        pricingModel: "Suscripción",
        priceStr: "$120/mes",
        setupFeeStr: "$500",
        basePrice: 120,
        setupFee: 500,
        modules: [
            { id: "nomina-sat", name: "Nómina Electrónica SAT", price: 60, type: "monthly" },
            { id: "multi-empresa", name: "Multi-Empresa y Multi-Moneda", price: 80, type: "monthly" },
            { id: "auditoria", name: "Módulo de Auditoría Interna", price: 200, type: "one-time" },
        ],
        features: ["CFDI 4.0 Facturación Electrónica", "Conciliación Bancaria Automática", "Reportes SAT y Fiscales", "Control Presupuestal", "Integración ERP"],
        rating: 4.6,
        reviews: 1540,
        vendor: "FinTech MX",
        deployment: "Cloud, SaaS",
        targetAudience: "PyMEs, Contadores, Corporativos MX",
        website: "https://quickbooks.intuit.com",
        image: "/products/finance-cloud.png",
        systemRequirements: {
            os: ['Windows', 'macOS', 'Web'],
            browser: 'Chrome, Firefox, Edge (ver. 90+)',
            ram: '4 GB RAM mínimo',
            internet: '10 Mbps o superior',
            notes: 'Certificado por el SAT para CFDI 4.0. Compatible con Windows 10/11 y macOS 12+.'
        }
    },
];

export const getSolutionById = (id: string): Solution | undefined => {
    return solutions.find(s => s.id === id);
};
