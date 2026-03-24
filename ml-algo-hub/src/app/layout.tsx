import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MLProvider } from "@/context/MLContext";
import TutorialWizard from "@/components/simulador/TutorialWizard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ML Algo Hub | Simulador de Machine Learning",
  description: "Plataforma educativa para entender KNN y Árboles de Decisión",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MLProvider>
          <TutorialWizard />
          {children}
        </MLProvider>
      </body>
    </html>
  );
}
