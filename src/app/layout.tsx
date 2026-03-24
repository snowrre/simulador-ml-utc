import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { MLProvider } from "@/context/MLContext";
import NavbarSimulador from "@/components/simulador/NavbarSimulador";
import TutorialWizard from "@/components/simulador/TutorialWizard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thetechhub.mx"),
  title: {
    default: "The Tech Hub — Catálogo B2B SaaS",
    template: "%s | The Tech Hub",
  },
  description:
    "Explora, compara y cotiza soluciones de software empresarial B2B. CRM, ERP, RRHH, Ciberseguridad y más. Precios transparentes y cotización instantánea.",
  keywords: ["B2B SaaS", "software empresarial", "CRM", "ERP", "ciberseguridad", "cotización", "comparador de software"],
  authors: [{ name: "The Tech Hub" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "The Tech Hub",
    title: "The Tech Hub — Catálogo B2B SaaS",
    description: "Explora, compara y cotiza soluciones de software empresarial B2B con precios transparentes.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "The Tech Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Tech Hub — Catálogo B2B SaaS",
    description: "Explora, compara y cotiza soluciones de software empresarial B2B.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 text-navy-slate dark:text-white flex flex-col min-h-screen transition-colors duration-300`}>
        <ThemeProvider>
            <MLProvider>
              <NavbarSimulador />
              <main className="flex-grow pt-[72px]">
                {children}
              </main>
              <TutorialWizard />
            </MLProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


