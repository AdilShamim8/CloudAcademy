import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CloudAcademy — AWS Cloud Learning Platform (Beginner to Expert)",
    template: "%s · CloudAcademy",
  },
  description:
    "Master AWS Cloud from absolute zero to expert architect. 14 in-depth modules, 10 hands-on projects, real-world troubleshooting, simulators, and certification prep for AI/ML developers and DevOps engineers.",
  keywords: [
    "AWS",
    "cloud computing",
    "AWS training",
    "AWS certification",
    "cloud architect",
    "DevOps",
    "AI/ML infrastructure",
    "Lambda",
    "EC2",
    "S3",
    "IAM",
    "VPC",
    "RDS",
    "DynamoDB",
    "EKS",
    "SageMaker",
  ],
  authors: [{ name: "CloudAcademy" }],
  creator: "CloudAcademy",
  publisher: "CloudAcademy",
  applicationName: "CloudAcademy",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "CloudAcademy — AWS Cloud Learning Platform",
    description:
      "Beginner to expert AWS learning with interactive lessons, labs, projects, and certification prep.",
    siteName: "CloudAcademy",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudAcademy — AWS Cloud Learning Platform",
    description:
      "Master AWS from beginner to expert with interactive lessons, simulators, and projects.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1d29" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
