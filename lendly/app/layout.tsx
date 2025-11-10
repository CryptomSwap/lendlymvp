export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles locale routing, so we just pass through
  return children;
}
