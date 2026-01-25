'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Rocket, Mail, CheckCircle2 } from 'lucide-react'

export default function ComingSoonPage() {
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Save email to Supabase (you'll need to create a subscribers table)
            const { error: dbError } = await supabase
                .from('subscribers')
                .insert([{ email, source: 'coming_soon' }])

            if (dbError) {
                // If table doesn't exist yet, just show success anyway
                console.error('DB Error:', dbError)
            }

            setSuccess(true)
            setEmail('')
        } catch (err: any) {
            setError('Error al guardar el email. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-3xl w-full text-center relative z-10">
                {/* Logo/Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-full">
                            <Rocket className="h-12 w-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Main heading */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                    Trading <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Discounts</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-4">
                    Algo increíble está por llegar
                </p>

                <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                    Estamos preparando la mejor plataforma para encontrar descuentos exclusivos en prop firms.
                    Sé el primero en enterarte cuando lancemos.
                </p>

                {/* Email capture form */}
                {!success ? (
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
                            >
                                {loading ? 'Enviando...' : 'Notificarme'}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-3 text-red-400 text-sm">{error}</p>
                        )}
                    </form>
                ) : (
                    <div className="max-w-md mx-auto mb-12 bg-green-500/20 border border-green-500 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-3 text-green-200">
                            <CheckCircle2 className="h-6 w-6" />
                            <p className="font-semibold">¡Gracias! Te avisaremos cuando lancemos.</p>
                        </div>
                    </div>
                )}

                {/* Features preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                        <div className="text-3xl mb-3">💰</div>
                        <h3 className="text-white font-semibold mb-2">Descuentos Exclusivos</h3>
                        <p className="text-gray-400 text-sm">Ahorra hasta 50% en las mejores prop firms</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="text-white font-semibold mb-2">Comparación Fácil</h3>
                        <p className="text-gray-400 text-sm">Compara firmas y encuentra la mejor para ti</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                        <div className="text-3xl mb-3">✅</div>
                        <h3 className="text-white font-semibold mb-2">Ofertas Verificadas</h3>
                        <p className="text-gray-400 text-sm">Todos los códigos verificados diariamente</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-gray-500 text-sm">
                    <p>© 2025 Trading Discounts. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    )
}
