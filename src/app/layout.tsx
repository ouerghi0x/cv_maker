import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MakerCV - Create CVs That Actually Get You Hired",
  description:
    "Build stunning, customized CVs in minutes. Fill in your info, add your skills, and enhance your experience. Professional CV builder with creative freedom.",
  keywords:
    "CV builder, resume maker, job application, professional CV, resume templates, career tools",
  authors: [{ name: "MakerCV Team" }],
  openGraph: {
    title: "MakerCV - Create CVs That Actually Get You Hired",
    description:
      "Build stunning, customized CVs in minutes with creative freedom.",
    type: "website",
    url: "https://makercv.com",
  },
  icons: {
    icon: "/favicon.ico", // ✅ correct path
  },
  twitter: {
    card: "summary_large_image",
    title: "MakerCV - Create CVs That Actually Get You Hired",
    description:
      "Build stunning, customized CVs in minutes with creative freedom.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
