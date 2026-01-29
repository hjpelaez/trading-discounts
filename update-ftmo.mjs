import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const ftmoData = {
    id: "ftmo",
    name: "FTMO",
    description: {
        es: "Líder en prop trading desde 2015. FTMO ofrece desafíos de dos fases para traders que buscan capital hasta $400k inicial, escalable a $2M con splits hasta 90%.",
        en: "Leading prop firm since 2015. FTMO offers two-phase challenges for traders seeking up to $400k initial capital, scalable to $2M with profit splits up to 90%."
    },
    imageUrl: "https://ftmo.com/assets/images/logo.svg",
    trustpilotScore: 4.8,
    country: "República Checa (Praga)",
    activeYears: 11,
    maxAllocation: "$400,000 (escalable a $2M)",
    broker: "OANDA / DXtrade",
    categories: ["forex", "futures", "stocks", "crypto"],
    platforms: ["MT4", "MT5", "cTrader", "DXtrade"],
    instruments: ["CFDs", "Stocks"],
    assets: ["Crypto", "Metals", "FX", "Indices"],
    minPrice: 160,
    maxLeverage: "1:100",
    drawdownType: "Static",
    features: {
        en: [
            "Up to 90% profit split",
            "Scaling every 4 months +25%",
            "Unlimited period after 4 min days",
            "News trading & overnight allowed"
        ],
        es: [
            "Hasta 90% split de ganancias",
            "Escalado cada 4 meses +25%",
            "Período ilimitado tras 4 días mín",
            "News trading y overnight permitidos"
        ]
    },
    rules: {
        en: [
            "Max daily loss limit",
            "Max overall loss limit",
            "Minimum 4 trading days",
            "Refundable fee on first payout"
        ],
        es: [
            "Límite pérdida diaria máxima",
            "Límite pérdida total máxima",
            "Mínimo 4 días trading",
            "Tasa reembolsable primer pago"
        ]
    },
    consistencyRules: {
        en: "10% profit target for scaling, Consistent performance required, No erratic strategies",
        es: "10% profit target para scaling, Rendimiento consistente requerido, Sin estrategias erráticas"
    },
    prohibitedPractices: {
        en: [
            "Gambling-style trading",
            "Breaching risk limits",
            "Arbitrage strategies",
            "Copy trading from external accounts"
        ],
        es: [
            "Trading estilo gambling",
            "Exceder límites de riesgo",
            "Estrategias de arbitraje",
            "Copy trading de cuentas ajenas"
        ]
    },
    paymentMethods: ["Credit Card", "Crypto", "Wire Transfer"],
    payoutMethods: ["Crypto", "Riseworks", "Wire Transfer"],
    payoutFrequency: "14 días, Bi-semanal",
    minPayout: "$20"
}

async function updateFTMO() {
    console.log('🚀 Updating FTMO data (Full Bilingual)...')

    // First try update
    const { data, error } = await supabase
        .from('Firm')
        .update(ftmoData)
        .eq('id', 'ftmo')
        .select()

    if (error) {
        console.error('❌ Error updating FTMO:', error.message)
        return
    }

    if (data && data.length > 0) {
        console.log('✅ FTMO updated successfully!')
        // console.log(JSON.stringify(data[0], null, 2))
    } else {
        console.log('⚠️ No record found to update.')
    }
}


updateFTMO().catch(console.error)
