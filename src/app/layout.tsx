import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import Nav from "@/components/Nav";
import SyncProvider from "@/components/SyncProvider";
import "./globals.css";

// Direction A — editorial: a high-contrast Didone for display, a warm grotesque
// for body/data.
const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shortlist — your college list, honestly graded",
  description:
    "Build and run your college application list with an honest list-health verdict.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-paper text-ink">
        <SyncProvider />
        <Nav />
        {children}
      </body>
    </html>
  );
}
