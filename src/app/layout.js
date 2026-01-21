// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstantShareProvider from "../context/InstantShareContext";
import SessionExpiredOverlay from "./SessionExpiredOverlay";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "LazyDrop - File Sharing for the Lazy Generation",
    description: "Too lazy for cables? Drop files between devices instantly. No apps, no signups, just works.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased">
        <UserProvider>
            <InstantShareProvider>
                <SessionExpiredOverlay>
                    {children}
                </SessionExpiredOverlay>
            </InstantShareProvider>
        </UserProvider>
        </body>
        </html>
    );
}