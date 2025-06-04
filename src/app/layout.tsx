import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '../components/Providers';
import AppLoader from '../components/AppLoader/AppLoader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Buy Radar - Your Guide to Smart Shopping",
  description: "Discover seasonal picks, budget upgrades, coupon hacks, and renter essentials. Smart Buy Radar helps you make informed purchasing decisions all year round.",
  keywords: "smart shopping, seasonal deals, budget upgrades, coupon hacks, renter essentials, buying guide",
  authors: [{ name: "Smart Buy Radar" }],
  openGraph: {
    title: "Smart Buy Radar - Your Guide to Smart Shopping",
    description: "Discover seasonal picks, budget upgrades, coupon hacks, and renter essentials.",
    url: "https://smartshoppingradar.com",
    siteName: "Smart Buy Radar",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://smartshoppingradar.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppLoader>
          {children}
          </AppLoader>
        </Providers>
      </body>
    </html>
  );
}
