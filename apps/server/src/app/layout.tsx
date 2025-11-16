export const metadata = {
  title: 'Lendly API',
  description: 'Peer-to-peer rental marketplace API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}

