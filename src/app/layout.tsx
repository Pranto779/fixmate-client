import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { Toaster } from "sonner";
import Footer from "./components/footer";
import { Suspense } from "react";
import NavbarSkeleton from "./components/navbarsclaton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixMate",
  description: "Smart Device & Home Appliance Repair Service",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<NavbarSkeleton/>}>
          <Navbar />
        </Suspense>

        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
          expand={false}
          toastOptions={{
            duration: 2000,
            style: {
              borderRadius: "10px",
              background: "#243b53",
              color: "#ffffff",
            },
          }}
        />
        <Footer />
      </body>
    </html>
  );
}