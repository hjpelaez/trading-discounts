import { Metadata } from 'next'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default function ComingSoonLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-950 min-h-screen">
            {children}
        </div>
    )
}
