import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { ToastProvider } from "@/components/toast";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Raju Manur | Java Full Stack Developer",
    template: "%s | Raju Manur",
  },
  description:
    "Java Full Stack Developer specializing in Java, Spring Boot, REST APIs, MySQL, and modern React.js applications.",
  keywords: [
    "Java Full Stack Developer",
    "Java",
    "Spring Boot",
    "Spring MVC",
    "Hibernate",
    "JPA",
    "REST APIs",
    "Microservices",
    "MySQL",
    "React.js",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Git",
    "GitHub",
    "Docker",
    "Linux",
    "data structures",
    "algorithms",
  ],
  authors: [{ name: "Raju Manur" }],
  creator: "Raju Manur",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://raju-manur-portfolio.vercel.app/",
    title: "Raju Manur | Java Full Stack Developer",
    description:
      "Java Full Stack Developer focused on backend systems, REST APIs, databases, and modern frontend experiences.",
    siteName: "Raju Manur Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Raju Manur — Java Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raju Manur | Java Full Stack Developer",
    description:
      "Java Full Stack Developer focused on backend systems, REST APIs, databases, and modern frontend experiences.",
    creator: "@rajumanur",
    images: ["/opengraph-image"],
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
  metadataBase: new URL("https://raju-manur-portfolio.vercel.app"),
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Raju Manur",
      jobTitle: "Java Full Stack Developer",
      description:
        "Java Full Stack Developer focused on building scalable backend systems, REST APIs, database-driven applications, and modern React.js interfaces.",
      url: "https://rajumanur.vercel.app",
      sameAs: [
        "https://github.com/RajuManur143/",
        "https://www.linkedin.com/in/rajumanur/",
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Visvesvaraya Technological University",
      },
      knowsAbout: [
        "Java Full Stack Development",
        "Spring Boot",
        "REST APIs",
        "MySQL",
        "React.js",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Hibernate",
        "JPA",
        "Microservices",
        "Docker",
        "Linux",
        "Git",
        "GitHub",
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: "Java Full Stack Developer",
        occupationLocation: {
          "@type": "City",
          name: "Bengaluru, India",
        },
        skills:
          "Java, Spring Boot, REST APIs, MySQL, React.js, SQL, Git, Docker, Microservices",
      },
    },
    {
      "@type": "SoftwareSourceCode",
      name: "JanaAushadhi",
      description:
        "A full-stack Generic Medicine Discovery Platform built with Java, Spring Boot, React.js, and MySQL for medicine discovery and admin management.",
      programmingLanguage: ["Java", "JavaScript"],
      runtimePlatform: "JVM",
      author: { "@type": "Person", name: "Raju Manur" },
      dateCreated: "2025",
    },
    {
      "@type": "SoftwareSourceCode",
      name: "Where Is My Bus",
      description:
        "A transit tracking system built with Java and React.js to provide route visibility and commuter-friendly travel planning.",
      programmingLanguage: ["Java", "JavaScript"],
      author: { "@type": "Person", name: "Raju Manur" },
      dateCreated: "2024",
    },
    {
      "@type": "WebSite",
      url: "https://rajumanur.vercel.app",
      name: "Raju Manur Portfolio",
      description:
        "Portfolio of Raju Manur — Java Full Stack Developer.",
      author: { "@type": "Person", name: "Raju Manur" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} antialiased transition-colors duration-300`}
      >
        <div
          className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.05] dark:opacity-[0.05] bg-noise"
          aria-hidden="true"
        />
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <JsonLd data={jsonLd} />
      </body>
    </html>
  );
}
