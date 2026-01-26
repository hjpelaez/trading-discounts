export interface PropFirm {
    // Basic Info
    id: string;
    name: string;
    description: string;
    discount: string;
    code: string;
    link: string;
    imageUrl?: string | null;
    featured?: boolean;
    rating: number; // 1-5
    trustpilotScore?: number | null;

    // Firm Details
    country?: string | null;
    activeYears?: number | null;
    maxAllocation?: string | null;
    broker?: string | null;

    // Categories & Platforms
    categories: (string | "crypto" | "forex" | "futures" | "stocks")[];
    platforms: string[];
    instruments?: string[] | null;
    assets?: string[] | null;

    // Trading Info
    minPrice: number;
    maxLeverage: string;
    drawdownType: "Trailing" | "Static" | "Balance-based" | "Step-based";

    // Features & Rules
    features: string[];
    rules: string[];
    consistencyRules?: string | null;
    prohibitedPractices?: string[] | null;

    // Payout Info
    paymentMethods: string[];
    payoutMethods?: string[] | null;
    payoutFrequency?: string | null;
    minPayout?: string | null;
}

export const PROP_FIRMS: PropFirm[] = [
    {
        id: "apex-trader",
        name: "Apex Trader Funding",
        description: "Best for Futures fanatics. High leverage, simple rules.",
        discount: "90% OFF",
        code: "PFT",
        link: "https://apextraderfunding.com/member/aff/go/propfirmtrader1",
        categories: ["futures", "crypto"],
        featured: true,
        rating: 4.8,
        platforms: ["Rithmic", "Tradovate", "NinjaTrader"],
        minPrice: 147,
        features: ["One Step Evaluation", "Trade During News", "No Daily Drawdown", "Keep 100% of first $25k"],
        rules: ["Trailing Threshold Drawdown", "Consistency Rule"],
        maxLeverage: "1:20", // Futures don't use leverage the same way effectively, but usually high
        paymentMethods: ["Credit Card", "Crypto"],
        trustpilotScore: 4.8,
        drawdownType: "Trailing",
    },
    {
        id: "atmos-funded",
        name: "AtmosFunded",
        description: "Community favorite. Great support and fast payouts.",
        discount: "25% OFF",
        code: "PFT1",
        link: "https://app.atmosfunded.com/en/challenges?campaign_id=2&ref_id=65&lp=1",
        categories: ["forex", "crypto"],
        rating: 4.5,
        platforms: ["MT4", "MT5", "cTrader"],
        minPrice: 50,
        features: ["High HFT Allowed", "Weekly Payouts", "No Time Limits"],
        rules: ["5% Daily Drawdown", "10% Max Drawdown"],
        maxLeverage: "1:100",
        paymentMethods: ["Credit Card", "Crypto", "Wise"],
        trustpilotScore: 4.5,
        drawdownType: "Static",
    },
    {
        id: "alpha-capital",
        name: "Alpha Capital",
        description: "Industry leading conditions. Low spreads.",
        discount: "30% OFF",
        code: "PFT",
        link: "https://app.alphacapitalgroup.uk/signup/PFT",
        categories: ["forex"],
        rating: 4.7,
        platforms: ["MT5"],
        minPrice: 99,
        features: ["0% Commission", "Raw Spreads", "Scaling Plan up to $2M"],
        rules: ["No Martingale", "No HFT"],
        maxLeverage: "1:100",
        paymentMethods: ["Credit Card", "Crypto"],
        trustpilotScore: 4.6,
        drawdownType: "Static",
    },
    {
        id: "blueberry-funded",
        name: "Blueberry Funded",
        description: "Reliable and trusted. 200% refund bonus.",
        discount: "25% OFF",
        code: "PFT",
        link: "https://blueberryfunded.com/?utm_source=affiliate&ref=3464",
        categories: ["forex", "crypto"],
        featured: true,
        rating: 4.6,
        platforms: ["MT4", "MT5"],
        minPrice: 69,
        features: ["200% Refund Bonus", "Bi-weekly Payouts", "Balance Based Drawdown"],
        rules: ["No Copy Trading", "Weekend Holding Allowed"],
        maxLeverage: "1:50",
        paymentMethods: ["Credit Card", "Crypto"],
        trustpilotScore: 4.4,
        drawdownType: "Balance-based",
    },
    {
        id: "topstep",
        name: "Topstep",
        description: "The original futures prop firm. Safe and secure.",
        discount: "70% OFF",
        code: "LINK",
        link: "https://www.topstep.com/",
        categories: ["futures"],
        rating: 4.9,
        platforms: ["Tradovate", "NinjaTrader"],
        minPrice: 49,
        features: ["First Payout Bonus", "Free Coaching", "Fast Payouts"],
        rules: ["Only Trade Permitted Products", "Daily Loss Limit"],
        maxLeverage: "1:50", // Futures day trading margins
        paymentMethods: ["Credit Card", "PayPal"],
        trustpilotScore: 4.7,
        drawdownType: "Trailing",
    },
    {
        id: "ftmo",
        name: "FTMO",
        description: "The gold standard of prop trading.",
        discount: "Best Deal",
        code: "LINK",
        link: "https://trader.ftmo.com/?affiliates=NQKhLFRlDnYcDTvrEyeq",
        categories: ["forex", "crypto"],
        rating: 4.9,
        platforms: ["MT4", "MT5", "cTrader", "DXtrade"],
        minPrice: 160,
        features: ["Swing Account Option", "Free Trial", "Performance Coach"],
        rules: ["Max Daily Loss", "Max Loss", "Minimum Trading Days"],
        maxLeverage: "1:100",
        paymentMethods: ["Credit Card", "Crypto", "Skrill", "Wire Transfer"],
        trustpilotScore: 4.9,
        drawdownType: "Static",
    },
];

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    price: string;
    link: string;
    imageUrl?: string | null;
    platform: string;
    rating: number;
    lessons?: number;
    duration?: string;
    featured?: boolean;
    level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
    language: "English" | "Spanish" | "Mixed";
    longDescription?: string;
    learningPoints?: string[];
    curriculum?: { title: string; lessons: string[] }[];
}

export const COURSES: Course[] = [
    {
        id: "crypto-masterclass",
        title: "Crypto Trading Masterclass",
        description: "Complete guide to cryptocurrency trading, from basics to advanced technical analysis.",
        longDescription: "This masterclass is designed to take you from a complete beginner to a confident crypto trader. We cover everything from setting up your first wallet to executing complex trading strategies using technical analysis and on-chain data. You will learn how to identify market cycles, manage risk effectively, and build a portfolio that can weather any storm.",
        learningPoints: [
            "Understand blockchain fundamentals and how crypto markets work",
            "Master technical analysis: Support/Resistance, Indicators, and Patterns",
            "Risk management strategies to protect your capital",
            "How to use DeFi protocols and DEXs safely",
            "Psychology of trading: Mastering your emotions"
        ],
        curriculum: [
            {
                title: "Module 1: Introduction to Crypto",
                lessons: ["What is Bitcoin?", "Blockchain Basics", "Setting up Metamask", "Security Best Practices"]
            },
            {
                title: "Module 2: Technical Analysis",
                lessons: ["Candlestick Patterns", "Moving Averages", "RSI & MACD", "Fibonacci Retracements"]
            },
            {
                title: "Module 3: Advanced Strategies",
                lessons: ["Swing Trading vs Day Trading", "On-Chain Analysis", "Yield Farming Basics"]
            }
        ],
        instructor: "Alex Hormozi",
        price: "$497",
        link: "https://example.com/course/crypto",
        platform: "Teachable",
        rating: 4.9,
        lessons: 45,
        duration: "12h 30m",
        featured: true,
        level: "All Levels",
        language: "English"
    },
    {
        id: "ict-concepts",
        title: "ICT Concepts Explained",
        description: "Deep dive into Inner Circle Trader concepts. Order blocks, liquidity sweeps, and fair value gaps.",
        longDescription: "Unlock the secrets of institutional trading with our in-depth breakdown of ICT concepts. This course demystifies the complex terminology and strategies used by 'smart money'. Learn to see the market like the algorithms do, identifying high-probability setups based on liquidity and inefficiency.",
        learningPoints: [
            "Identify Order Blocks and Breaker Blocks",
            "Understand Fair Value Gaps (FVG) and Liquidity Voids",
            "Master Market Structure Shift (MSS) for entry confirmation",
            "Daily Bias determination",
            "Time & Price theory"
        ],
        curriculum: [
            {
                title: "Core Concepts",
                lessons: ["Liquidity & Inducement", "Market Structure", "Premium vs Discount Pricing"]
            },
            {
                title: "Entry Models",
                lessons: ["The Silver Bullet", "OTE (Optimal Trade Entry)", "2022 Mentorship Model"]
            }
        ],
        instructor: "Michael J. Huddleston",
        price: "Free",
        link: "https://youtube.com",
        platform: "YouTube",
        rating: 5.0,
        lessons: 20,
        duration: "15h",
        level: "Advanced",
        language: "English"
    },
    {
        id: "forex-bootcamp",
        title: "Forex Zero to Hero",
        description: "Aprende a operar Forex desde cero. Estrategias rentables y gestión de riesgo.",
        longDescription: "¿Quieres empezar en el mundo del Forex pero no sabes por dónde? Este bootcamp intensivo te enseñará todo lo necesario para operar divisas de manera profesional. Desde la terminología básica hasta la ejecución de operaciones en vivo, te guiaremos paso a paso.",
        learningPoints: [
            "Qué es Forex y cómo funcionan los pares de divisas",
            "Análisis Fundamental: Cómo las noticias afectan el precio",
            "Gestión operativa en MetaTrader 4 y 5",
            "Plan de Trading: Creando tu propia estrategia",
            "Psicología del trader: Disciplina y Paciencia"
        ],
        curriculum: [
            {
                title: "Fundamentos",
                lessons: ["Introducción al Mercado de Divisas", "Pipso, Lotes y Apalancamiento", "Tipos de Órdenes"]
            },
            {
                title: "Estrategia",
                lessons: ["Acción del Precio", "Soportes y Resistencias Institucionales", "Gestión de Riesgo Avanzada"]
            }
        ],
        instructor: "Juan Trading",
        price: "$299",
        link: "https://example.com/course/forex",
        platform: "Hotmart",
        rating: 4.7,
        lessons: 32,
        duration: "8h",
        level: "Beginner",
        language: "Spanish"
    }
];
