import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Groq AI Chatbot",
  description: "AI chatbot powered by Groq API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}