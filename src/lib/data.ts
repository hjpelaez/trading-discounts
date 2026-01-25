export interface PropFirm {
    id: string;
    name: string;
    description: string;
    discount: string;
    code: string;
    link: string;
    categories: ("crypto" | "forex" | "futures")[];
    featured?: boolean;
    rating: number; // 1-5
    platforms: string[];
    minPrice: number;
    // New detailed fields
    features: string[];
    rules: string[];
    maxLeverage: string;
    paymentMethods: string[];
    trustpilotScore: number;
    imageUrl?: string;
    drawdownType: "Trailing" | "Static" | "Balance-based" | "Step-based";
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
