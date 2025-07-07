import type { Metadata } from "next";
import "./globals.css";
import {Nunito} from "next/font/google";

const nunito = Nunito({ subsets: ['latin-ext'] });

export const metadata: Metadata = {
    title: "Ziņas",
    description: "Ziņas",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`antialiased ${nunito.className} overflow-x-hidden overflow-y-scroll`}>
                {children}
            </body>
        </html>
    );
}
