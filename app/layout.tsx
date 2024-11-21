"use client"

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Provider } from "@/components/ui/provider"
import "./globals.css";
import { StateContext } from "./Context";
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState(null);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StateContext.Provider value={{user, setUser}}>
          <Provider>{children}</Provider>
        </StateContext.Provider>
      </body>
    </html>
  );
}
