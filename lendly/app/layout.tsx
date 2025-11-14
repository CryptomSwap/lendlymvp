import { Heebo } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./[locale]/globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout must have html and body tags per Next.js requirements
  // Locale-specific lang and dir are set via template.tsx
  return (
    <html suppressHydrationWarning>
      <body className={`${heebo.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
