import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '../components/Providers';
import { siteData } from '../lib/api';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Smart Buy Radar - Your Guide to Smart Shopping",
  description: "Discover seasonal picks, budget upgrades, coupon hacks, and renter essentials. Smart Buy Radar helps you make informed purchasing decisions all year round.",
  keywords: siteData.keywords,
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
      <head>
        {/* 预连接重要源 - 建立早期连接以提升性能 */}
        <link rel="preconnect" href="https://cdn-info.broadsolutionsgroup.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://info-domainconfig.cloudinfinitedata.com" crossOrigin="anonymous" />
        {/* DNS 预解析其他源 */}
        <link rel="dns-prefetch" href="https://sdk.broadsolutionsgroup.com" />
        {/* 预加载关键资源 */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        {/* SDK 脚本保持原样 */}
        <script async src="https://sdk.broadsolutionsgroup.com/BsSDK.js"></script>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
