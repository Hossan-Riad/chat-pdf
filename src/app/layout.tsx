import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google'; 
import Providers from "@/components/Providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

/* const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
 */

const inter = Inter({ subsets: ["latin"]});
export const metadata: Metadata = {
  title: "ChatPDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
      <html lang="en">
      <body className={inter.className}>{children} </body>
      <Toaster />
    </html>
      </Providers>
    </ClerkProvider>
  );
}
