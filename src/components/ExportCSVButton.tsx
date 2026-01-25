'use client'

import { exportSubscribersToCSV } from "@/actions/subscriber-actions"
import { Download } from "lucide-react"
import { useState } from "react"

export function ExportCSVButton() {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        try {
            const result = await exportSubscribersToCSV()

            if (result.success && result.data) {
                // Create blob and download
                const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' })
                const link = document.createElement('a')
                const url = URL.createObjectURL(blob)

                link.setAttribute('href', url)
                link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`)
                link.style.visibility = 'hidden'

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                alert('Error al exportar: ' + (result.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Export error:', error)
            alert('Error al exportar los suscriptores')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Exportando...' : 'Exportar CSV'}
        </button>
    )
}
