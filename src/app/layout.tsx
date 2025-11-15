import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-commerce Chat Helper',
  description: 'Your AI-powered shopping assistant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
