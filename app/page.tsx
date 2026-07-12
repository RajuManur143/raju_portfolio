"use client";

import Image from "next/image";
import { Github, Linkedin, QrCode, X, FileText, Bot, User } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import dynamic from "next/dynamic";

import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { ExperienceItem } from "@/components/ExperienceItem";
import { FocusTools } from "@/components/FocusTools";
import { LinkedInButton } from "@/components/ui/LinkedInButton";
import { MenuBar, MenuBarItem } from "@/components/ui/bottom-menu";
import { SiLeetcode } from "react-icons/si";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SideNav } from "@/components/SideNav";
import { getYearsOfExperience } from "@/lib/utils";

// Animated Counter Component
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const [displayValue, setDisplayValue] = useState("0");

  // Determine decimal places from the target value
  const decimalPlaces = (value.toString().split(".")[1] || "").length;

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest.toFixed(decimalPlaces));
    });

    if (isInView) {
      motionValue.set(value);
    }

    return () => unsubscribe();
  }, [isInView, motionValue, springValue, value, decimalPlaces]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-2xl font-bold text-foreground sm:text-3xl"
    >
      {displayValue}
      {suffix}
    </motion.div>
  );
}


import { AgentMarkdownView } from "@/components/AgentMarkdownView";

const TechStack = dynamic(
  () => import("@/components/TechStack").then((mod) => mod.TechStack),
  { ssr: true },
);

const GithubGraph = dynamic(
  () => import("@/components/GithubGraph").then((mod) => mod.GithubGraph),
  { ssr: false },
);

export default function Home() {
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<"human" | "agent">("human");
  const closeQRRef = useRef<HTMLButtonElement>(null);
  const yearsExp = useMemo(() => getYearsOfExperience(), []);

  const closeQR = useCallback(() => setShowQR(false), []);

  // Close QR modal on Escape key
  useEffect(() => {
    if (!showQR) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeQR(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showQR, closeQR]);

  // Focus close button when modal opens
  useEffect(() => {
    if (showQR) closeQRRef.current?.focus();
  }, [showQR]);


  const menuItems: MenuBarItem[] = [
    {
      label: `Switch to ${mode === "human" ? "agent" : "human"} mode`,
      element: (
        <div className="flex items-center mx-[2px]">
          <button
            className="group relative flex h-7 w-12 cursor-pointer rounded-full bg-foreground/10 p-1 transition-colors duration-200 ease-in-out hover:bg-foreground/20 focus:outline-none"
            role="switch"
            aria-checked={mode === "agent"}
            aria-label={`Switch to ${mode === "human" ? "agent" : "human"} mode`}
          >
            <div
              className={`flex h-5 w-5 transform items-center justify-center rounded-full bg-background shadow-sm transition duration-200 ease-in-out ${
                mode === "agent" ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {mode === "human" ? (
                <User className="h-3 w-3 text-foreground" />
              ) : (
                <Bot className="h-3 w-3 text-foreground" />
              )}
            </div>
          </button>
        </div>
      ),
      onClick: () => setMode(mode === "human" ? "agent" : "human"),
    },
    {
      label: "Download Resume",
      icon: FileText,
      href: "/raju_manur_resume.pdf",
    },
    {
      label: "QR Code",
      icon: QrCode,
      onClick: () => setShowQR(true),
    },
    {
      isDivider: true,
    },
    {
      label: "GitHub",
      icon: Github,
      href: "https://github.com/RajuManur143/",
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      onClick: () => window.open("https://www.linkedin.com/in/rajumanur/", "_blank", "noopener,noreferrer"),
    },
  ];

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center bg-background px-3 pt-8 text-foreground selection:bg-foreground/20
      pb-16 sm:px-4 sm:pt-12 sm:pb-20 overflow-x-hidden transition-colors duration-300`}
    >
      {/* Theme Toggle in Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <SideNav />

      <AnimatePresence mode="wait">
        {mode === "agent" ? (
          /* Agent Mode - Markdown View */
          <motion.main
            key="agent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-2xl flex-col items-start text-left px-4 sm:px-0"
          >
            <AgentMarkdownView />
          </motion.main>
        ) : (
          /* Human Mode - Original View */
          <motion.main
            key="human"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-2xl flex-col items-center text-center relative z-10"
          >
            {/* Background Animations */}
            <BackgroundBeams className="fixed -z-10" />

            {/* Profile Image */}
            <div className="relative mb-2 group flex items-center justify-center">
              <div
                className="relative h-28 w-28 sm:h-56 sm:w-56 overflow-hidden rounded-full bg-white dark:bg-slate-950 border border-foreground/10"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 70%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 70%, transparent 100%)",
                }}
              >
                <Image
                  src="/profilePhoto.png"
                  alt="Raju Manur - Java Full Stack Developer"
                  fill
                  sizes="(max-width: 640px) 112px, 224px"
                  className="object-contain transition-all duration-700 drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                  priority
                />
              </div>
            </div>

            {/* Hero Text */}
            <div className="mb-4 sm:mb-6 text-center">
              <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl cursor-default">
                Raju Manur
              </h1>
              <h2 className="text-xl font-medium text-foreground/80 sm:text-2xl transition-colors duration-300">
                Java Full Stack Developer
              </h2>
              <p className="mt-2 text-sm text-foreground/60 sm:text-base">
                Java · Spring Boot · React.js · MySQL · REST APIs · Microservices
              </p>
            </div>

            {/* Summary Highlights */}
            <section id="highlights" className="mb-16 w-full relative" aria-labelledby="highlights-heading">
              <div className="rounded-2xl border border-foreground/10 bg-background/90 p-4 sm:p-6 transition-all duration-500">
                <h3 id="highlights-heading" className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-foreground/70">
                  Key Highlights
                </h3>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="text-center">
                    <AnimatedCounter value={1} suffix="+" />
                    <div className="text-xs text-foreground/60 sm:text-sm">
                      Years Experience
                    </div>
                    <div className="text-xs text-foreground/50">
                      Hands-on Full Stack Development
                    </div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter value={8} suffix="+" />
                    <div className="text-xs text-foreground/60 sm:text-sm">
                      Projects Built
                    </div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter value={10} suffix="+" />
                    <div className="text-xs text-foreground/60 sm:text-sm">
                      REST APIs Built
                    </div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter value={5} suffix="+" />
                    <div className="text-xs text-foreground/60 sm:text-sm">
                      Database Modules
                    </div>
                    <div className="text-xs text-foreground/50">
                      Optimized & Scaled
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="mb-16 mt-4 w-full space-y-4 text-justify text-base leading-relaxed text-foreground/70 sm:text-lg md:text-xl">
              <p>
                I&apos;m a passionate Java Full Stack Developer focused on problem-solving, clean coding, backend development, REST APIs, database management, and modern frontend experiences. I enjoy turning ideas into reliable, scalable applications with strong architecture, maintainable code, and a product-first mindset.
              </p>
            </div>

            {/* Experience Section */}
            <section
              id="experience"
              className="mb-16 w-full text-left"
              aria-labelledby="experience-heading"
            >
              <h2 id="experience-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                Experience
              </h2>
              <div className="space-y-8">
                <ExperienceItem
                  title="Jspiders Training and Development Centre"
                  role="Java Full Stack Developer Intern"
                  location="Bengaluru, India | On-site"
                  collapsible={true}
                >
                  <div className="space-y-3">
                    <p className="font-semibold text-foreground/70 text-sm mb-4">
                      January 2025 – Present
                    </p>
                    <p className="text-sm text-foreground/80 mb-4 italic">
                      Built end-to-end web applications using Java, Spring Boot, Hibernate, and React.js while focusing on scalable architecture, clean APIs, and practical product delivery.
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Developed RESTful backend services</strong> with Spring Boot, JPA, and MySQL to support business workflows and data persistence.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Built responsive frontend interfaces</strong> with React.js and modern CSS to deliver a smooth user experience.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Collaborated on database design and optimization</strong> using SQL and ORM practices to improve performance and maintainability.
                        </span>
                      </p>
                    </div>
                  </div>
                </ExperienceItem>
              </div>
            </section>

            {/* Featured Projects Section */}
            <section id="projects" className="mb-16 w-full text-left" aria-labelledby="projects-heading">
              <h2 id="projects-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                Featured projects
              </h2>
              <div className="space-y-8">
                <article>
                <ExperienceItem
                  title="JanaAushadhi"
                  role="Java · Spring Boot · React.js · MySQL · 2025"
                  collapsible={true}
                >
                  <div className="space-y-3">
                    <p className="text-sm text-foreground/70 mb-1">
                      A full-stack generic medicine discovery platform designed to help users find medicines, compare alternatives, and access trusted health information.
                    </p>
                    <p className="text-sm text-foreground/55 mb-3 italic">
                      Focused on practical healthcare access, clean UX, and a reliable backend for fast search and management workflows.
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Features:</strong> medicine search, category browsing, admin management, secure data handling, and responsive UI for desktop and mobile.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Tech stack:</strong> Java, Spring Boot, Spring MVC, Hibernate, JPA, MySQL, React.js, REST APIs.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Outcome:</strong> delivered a scalable platform with reusable service layers and a modern front-end experience.
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-foreground/10">
                      <p className="text-xs text-foreground/50">
                        <strong>GitHub:</strong> <a href="https://github.com/RajuManur143/" className="underline" target="_blank" rel="noreferrer">Placeholder repository</a> · <strong>Demo:</strong> <span className="underline">Coming soon</span>
                      </p>
                    </div>
                  </div>
                </ExperienceItem>
                </article>

                <article>
                <ExperienceItem
                  title="Where Is My Bus"
                  role="Java · Spring Boot · React.js · REST APIs · 2024"
                  collapsible={true}
                >
                  <div className="space-y-3">
                    <p className="text-sm text-foreground/70 mb-1">
                      A real-time transit tracking system aimed at helping commuters locate bus movement and plan travel more efficiently.
                    </p>
                    <p className="text-sm text-foreground/55 mb-3 italic">
                      Designed around live data handling, route logic, and responsive user interactions for practical everyday use.
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Features:</strong> live tracking, route status updates, schedule visibility, and simplified commuter navigation.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Tech stack:</strong> Java, Spring Boot, MySQL, REST APIs, React.js, JavaScript, HTML5, CSS3.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-foreground/40 mt-1">•</span>
                        <span>
                          <strong>Outcome:</strong> built a modular solution that combines backend services with a user-friendly interface.
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-foreground/10">
                      <p className="text-xs text-foreground/50">
                        <strong>GitHub:</strong> <a href="https://github.com/RajuManur143/" className="underline" target="_blank" rel="noreferrer">Placeholder repository</a> · <strong>Demo:</strong> <span className="underline">Coming soon</span>
                      </p>
                    </div>
                  </div>
                </ExperienceItem>
                </article>
              </div>
            </section>

            {/* Education Section */}
            <section id="education" className="mb-16 w-full text-left" aria-labelledby="education-heading">
              <h2 id="education-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                Education
              </h2>
              <div className="space-y-12">
                <ExperienceItem
                  title="Visvesvaraya Technological University (VTU)"
                  role="Bachelor of Engineering (Computer Science and Engineering)"
                >
                  <p className="text-foreground/70">
                    CGPA: 9.15
                  </p>
                </ExperienceItem>
              </div>
            </section>

            {/* GitHub Activity Section */}
            <section id="github" className="mb-16 w-full text-left" aria-labelledby="github-heading">
              <h2 id="github-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                GitHub Activity
              </h2>
              <p className="mb-2 text-md text-foreground/70">
                Active on GitHub with a consistent streak and focused work on Java backend services, REST APIs, and full-stack projects.
              </p>
              <p className="mb-8 text-sm text-foreground/60">
                GitHub streak: 140 contributions in the last year.
              </p>
              <GithubGraph />
            </section>

            {/* Certifications Section */}
            <section id="certifications" className="mb-16 w-full text-left" aria-labelledby="certifications-heading">
              <h2 id="certifications-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                Certifications
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Java Programming Certification",
                  "Spring Boot & REST API Development",
                  "SQL & Database Management",
                  "Git/GitHub for Software Development",
                  "Full Stack Development Fundamentals",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-foreground/10 bg-background/90 p-4 text-sm text-foreground/70">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements Section */}
            <section id="achievements" className="mb-16 w-full text-left" aria-labelledby="achievements-heading">
              <h2 id="achievements-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                Achievements
              </h2>
              <div className="space-y-3 text-sm text-foreground/70">
                <p>• Built Java-based full-stack projects with practical business impact and clean architecture.</p>
                <p>• Strengthened backend and frontend development skills through hands-on internship experience.</p>
                <p>• Achieved strong academic performance with a CGPA of 9.15 in Computer Science and Engineering.</p>
                <p>• Developed a consistent habit of solving coding challenges and building real-world applications.</p>
              </div>
            </section>

            {/* Tech Stack Section */}
            <section id="skills" className="mb-16 w-full text-left" aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                Tech Stack
              </h2>
              <p className="mb-8 text-lg text-foreground/70">
                I build modern applications using the core technologies that power robust Java and full-stack solutions:
              </p>
              <TechStack />
            </section>

            {/* Get in Touch Section */}
            <section
              id="contact"
              className="mb-16 w-full text-left"
              aria-labelledby="contact-heading"
            >
              <h2
                id="contact-heading"
                className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70"
              >
                Get in Touch
              </h2>
              <div className="rounded-2xl border border-foreground/10 bg-background/90 p-6 sm:p-8 relative">
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="mb-4 text-lg font-medium text-foreground max-w-xl">
                      I&apos;m Raju, a Java Full Stack Developer with a strong interest in building reliable, scalable, and user-friendly applications.
                    </p>
                    <p className="text-md text-foreground/70 max-w-xl mb-2">
                      I&apos;m open to opportunities in backend development, full-stack engineering, REST APIs, and modern web applications. If you&apos;re building products that need clean architecture and thoughtful execution, I&apos;d love to connect.
                    </p>
                    <p className="text-sm text-foreground/50 italic">
                      Let&apos;s build something impactful together.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <CopyEmailButton email="your-rajumanur343@gmail.com" />
                    <LinkedInButton url="https://www.linkedin.com/in/rajumanur/" />
                  </div>
                </div>
              </div>
            </section>

            {/* Focus Tools */}
            <section id="extras" className="mb-16 w-full text-left" aria-labelledby="extras-heading">
              <h2 id="extras-heading" className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground/70">
                Extras
              </h2>
              <p className="mb-8 text-md text-foreground/70 max-w-xl">
                Tools I built and use personally for focus and flow:
              </p>

              <FocusTools />
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Liquid Glass Island Navbar */}
      <nav
        className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center"
        aria-label="Main Navigation"
      >
        <MenuBar items={menuItems} />
      </nav>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
          onClick={closeQR}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            className="relative rounded-2xl border border-foreground/10 bg-background p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="qr-modal-title" className="sr-only">Portfolio QR Code</p>
            <button
              ref={closeQRRef}
              onClick={closeQR}
              className="absolute -right-3 -top-3 rounded-full bg-foreground p-2 text-background transition-transform hover:scale-110"
              aria-label="Close QR code dialog"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="rounded-lg bg-white p-2">
              <QRCodeSVG
                value="https://raju-manur-portfolio.vercel.app/"
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
