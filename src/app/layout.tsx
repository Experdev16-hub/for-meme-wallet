import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'for.meme',
  description: 'for.meme - Connect your wallet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
