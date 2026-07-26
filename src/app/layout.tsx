import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karan Kang, REALTOR® | Royal LePage Pinnacle Real Estate",
  description: "Official real estate portal for Karan Kang, REALTOR® with Royal LePage Pinnacle Real Estate, serving Oakville and the Greater Toronto Area (GTA).",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ]
  },
  openGraph: {
    title: "Karan Kang, REALTOR® | Royal LePage Pinnacle Real Estate",
    description: "Oakville & GTA Real Estate Professional. Royal LePage Pinnacle Real Estate — Independently Owned and Operated Brokerage.",
    url: "https://kanghomes.ca",
    siteName: "KangHomes.ca",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
