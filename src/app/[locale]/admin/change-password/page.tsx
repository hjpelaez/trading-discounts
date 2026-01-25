'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        try {
            // Verify current password by trying to sign in
            const { data: { user } } = await supabase.auth.getUser()
            if (!user?.email) throw new Error('No se pudo obtener el usuario')

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            })

            if (signInError) throw new Error('Contraseña actual incorrecta')

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) throw updateError

            setSuccess(true)
            setTimeout(() => {
                router.push('/admin')
            }, 2000)
        } catch (error: any) {
            setError(error.message || 'Error al cambiar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border p-6">
                <h1 className="text-2xl font-bold mb-6">Cambiar Contraseña</h1>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    {error && (
                        <div className="bg-destructive/20 border border-destructive text-destructive-foreground px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded">
                            ¡Contraseña actualizada! Redirigiendo...
                        </div>
                    )}

                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                            Contraseña Actual
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-background"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                            Nueva Contraseña
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-background"
                            placeholder="Mínimo 6 caracteres"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-background"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin')}
                            className="px-4 py-2 border rounded-lg hover:bg-accent"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
