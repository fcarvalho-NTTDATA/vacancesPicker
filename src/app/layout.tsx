import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Férias | Gestão de Equipa",
  description: "Controlo de férias e alocação a projetos",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-navy">
        {children}
      </body>
    </html>
  );
}
