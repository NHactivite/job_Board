import { CommonLayout } from "@/components/common-layout";
import { SocketProvider } from "@/context/SocketContext";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Job Portal",
  description: "A smart job board with video calling & Gemini AI integration",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClerkLoading>
            <div className="flex items-center justify-center h-screen text-7xl font-bold">
              Loading...
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <SocketProvider>
              <Suspense fallback={<Loading />}>
                <CommonLayout>{children}</CommonLayout>
              </Suspense>
            </SocketProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}