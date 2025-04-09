import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "NuvioChat",
//   description: "NuvioChat is an AI-powered chatbot designed to assist you with your queries and provide information on a wide range of topics.",
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon.ico",
//     apple: "/favicon.ico",
//   },
// };



export const metadata = {
  title: "NuvioChat",
  description:
    "NuvioChat is an AI-powered chatbot designed to assist you with your queries and provide information on a wide range of topics.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "NuvioChat",
    description:
      "NuvioChat is an AI-powered chatbot designed to assist you with your queries and provide information on a wide range of topics.",
    url: "https://nuviochat.vercel.app/", // Replace with your actual URL
    siteName: "NuvioChat",
    images: [
      {
        url: "/display-icon.png", // Put this in /public
        width: 1200,
        height: 630,
        alt: "NuvioChat Open Graph Image",
      },
    ],
    type: "website",
  },
};






export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
