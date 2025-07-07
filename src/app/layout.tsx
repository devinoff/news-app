import type { Metadata } from "next";
import "./globals.css";
import {Nunito} from "next/font/google";

const nunito = Nunito({ subsets: ['latin-ext'] });

export const metadata: Metadata = {
    title: "Ziņas_dvx | Būtiskākais no Latvijas ziņu portāliem",
    description: "Automatizēts Latvijas ziņu kopsavilkums. Google Gemini AI noņem dublikātus un filtrē mazsvarīgo, atstājot tikai dienas būtiskākos notikumus.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="lv">
            <body className={`antialiased ${nunito.className} overflow-x-hidden overflow-y-scroll`}>
                {children}
            </body>
        </html>
    );
}
