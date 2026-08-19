import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudAcademy — AWS Cloud Learning Platform (Beginner to Expert)",
  description: "Master AWS Cloud from absolute zero to expert architect. 14 in-depth modules, hands-on projects, real-world troubleshooting, simulators, and certification prep for AI/ML developers and DevOps engineers.",
  keywords: ["AWS", "cloud computing", "AWS training", "AWS certification", "cloud architect", "DevOps", "AI/ML infrastructure", "Lambda", "EC2", "S3", "IAM"],
  authors: [{ name: "CloudAcademy" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CloudAcademy — AWS Cloud Learning Platform",
    description: "Beginner to expert AWS learning with interactive lessons, labs, projects, and certification prep.",
    siteName: "CloudAcademy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
