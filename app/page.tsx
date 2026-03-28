"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import {
  FaBrain,
  FaWifi,
  FaLeaf,
  FaQuoteRight,
  FaHeadSideVirus,
  FaAtom,
  FaSeedling,
  FaSearch,
} from "react-icons/fa";
import { FaRepeat, FaShareNodes } from "react-icons/fa6";
import type { IconType } from "react-icons";

const ROUTES = {
  login: "/login",
  register: "/register",
} as const;

/* —— assets & copy —— */
const ASSETS = {
  logo: "/logo.png",
  intro: "/intro.png",
  sensor: "/sensor.png",
  phone: "/phone.png",
} as const;

const NAVIGATION = [
  { name: "How it works", href: "#how_it_works" },
  { name: "Features", href: "#features" },
  { name: "FAQ", href: "#faq" },
] as const;

const HOW_IT_WORKS = [
  {
    icon: "FaWifi",
    title: "1. Wear The Sensor",
    description:
      "Apply for the discreet arm sensor for continuous, real-time glucose monitoring.",
  },
  {
    icon: "FaBrain",
    title: "2. Get AI insights",
    description:
      "Our AI analyzes your data to provide personalized advice and predictive alerts.",
  },
  {
    icon: "FaLeaf",
    title: "3. Live Healthier",
    description:
      "Take control of your health with actionable insights and a simpler daily routine.",
  },
] as const;

const CORE_FEATURES = [
  {
    icon: "FaHeadSideVirus",
    title: "Personalized AI Assistance",
    description:
      "Our smart AI learns your unique patterns to provide predictive glucose alerts, meal suggestions, and activity recommendations, helping you stay ahead.",
  },
  {
    icon: "FaAtom",
    title: "Real-Time Sensor Monitoring",
    description:
      "The discreet arm sensor continuously tracks your glucose levels, sending real-time data directly to your app without painful finger pricks.",
  },
  {
    icon: "FaSeedling",
    title: "Effortless Food Logging",
    description:
      "Simply snap a photo of your meal, and our AI will identify the food, estimate nutritional info, and log it for you. It's that easy.",
  },
] as const;

const DETAILED_FEATURES = [
  {
    icon: "FaSearch",
    title: "Advanced Data Analytics",
    description:
      "Visualize your trends with easy-to-read charts and reports. Understand how food, exercise, and medication impact your levels to make informed decisions.",
  },
  {
    icon: "FaShareNodes",
    title: "Share with Your Care Team",
    description:
      "Securely share your data and progress reports with your doctor or family members, ensuring everyone is on the same page with your health journey.",
  },
  {
    icon: "FaRepeat",
    title: "Seamless Integration",
    description:
      "Diamate syncs effortlessly with other health apps and devices, creating a comprehensive overview of your health in one convenient place.",
  },
] as const;

const FAQ_ITEMS = [
  {
    summary: "Is there a free trial?",
    detail:
      "Yes, we offer a 14-day free trial that includes one sensor and full access to the Diamate app. You can experience the full benefits before committing to a plan.",
  },
  {
    summary: "How does the sensor subscription work?",
    detail:
      "Based on your chosen plan, we will automatically ship you the required number of sensors to ensure you never run out. Shipments are processed to arrive just before you need your next sensor.",
  },
  {
    summary: "Can I cancel my subscription?",
    detail:
      "Absolutely. You can cancel your subscription at any time through your account settings. If you are on a monthly plan, the cancellation will take effect at the end of the current billing cycle. For quarterly and annual plans, access will continue until the end of the pre-paid period.",
  },
  {
    summary: "Is Diamate covered by insurance?",
    detail:
      "We are actively working with insurance providers to get Diamate covered. Currently, coverage varies by provider and plan. We recommend checking with your insurance company. We can also provide you with an itemized receipt for potential reimbursement.",
  },
] as const;

const IconMap: Record<string, IconType> = {
  FaBrain,
  FaWifi,
  FaLeaf,
  FaHeadSideVirus,
  FaAtom,
  FaSeedling,
  FaSearch,
  FaShareNodes,
  FaRepeat,
};

export default function Home() {
  const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isDark = darkMode === "dark";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const muted = isDark ? "text-slate-400" : "text-slate-600";
  const surface = isDark
    ? "border-slate-700/80 bg-slate-900/70 backdrop-blur-sm"
    : "border-slate-200/90 bg-white/90 backdrop-blur-sm";
  const surfaceSoft = isDark ? "bg-slate-950/90" : "bg-slate-50/90";
  const ringHover = isDark
    ? "hover:border-blue-400/45 hover:shadow-blue-950/20"
    : "hover:border-blue-200 hover:shadow-blue-500/10";

  return (
    <div
      className={`relative min-h-screen scroll-smooth font-[family-name:var(--font-geist-sans)] antialiased ${
        isDark
          ? "bg-slate-950 text-slate-100"
          : "bg-[#f0f4fa] text-slate-900"
      }`}
    >
      <div
        className={`pointer-events-none fixed inset-0 -z-10 ${
          isDark
            ? "bg-[radial-gradient(ellipse_90%_60%_at_50%_-18%,rgba(59,130,246,0.16),transparent),radial-gradient(ellipse_60%_45%_at_100%_0%,rgba(56,189,248,0.08),transparent)]"
            : "bg-[radial-gradient(ellipse_90%_55%_at_50%_-20%,rgba(59,130,246,0.14),transparent),radial-gradient(ellipse_55%_40%_at_100%_10%,rgba(125,211,252,0.12),transparent)]"
        }`}
      />

      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors ${
          isDark
            ? "border-slate-800/90 bg-slate-950/75"
            : "border-slate-200/70 bg-white/80"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.logo}
              alt=""
              className="h-10 w-10 shrink-0 cursor-pointer rounded-full object-cover ring-2 ring-blue-500/20 transition-transform duration-300 hover:scale-105 hover:ring-blue-500/35"
              onClick={() =>
                setDarkMode((d) => (d === "light" ? "dark" : "light"))
              }
            />
            <div className="flex min-w-0 flex-col">
              <a
                href="#intro"
                className="truncate text-lg font-semibold tracking-tight text-blue-600 dark:text-blue-400"
                onClick={closeMobileMenu}
              >
                DiaMate
              </a>
              <span className={`hidden text-[10px] font-medium md:block ${muted}`}>
                Tap logo for theme
              </span>
            </div>
          </div>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-300 hover:bg-slate-800/90 hover:text-blue-300"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                isDark
                  ? "text-slate-200 hover:bg-slate-800"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => router.push(ROUTES.login)}
            >
              Log in
            </button>
            <button
              type="button"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-blue-600/35"
              onClick={() => router.push(ROUTES.register)}
            >
              Sign up
            </button>
          </div>

          <button
            type="button"
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border md:hidden ${
              isDark
                ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                : "border-slate-200 bg-white/90 text-slate-800 hover:bg-slate-50"
            }`}
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>

        <div
          id="mobile-nav"
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          } ${
            isDark ? "border-t border-slate-800 bg-slate-950/95" : "border-t border-slate-200 bg-white/95"
          }`}
        >
          <div className="min-h-0" inert={!mobileMenuOpen ? true : undefined}>
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
            aria-label="Mobile primary"
          >
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  isDark
                    ? "text-slate-200 hover:bg-slate-800"
                    : "text-slate-800 hover:bg-blue-50"
                }`}
                onClick={closeMobileMenu}
              >
                {item.name}
              </a>
            ))}
            <div
              className={`mt-3 flex flex-col gap-2 border-t pt-4 ${
                isDark ? "border-slate-800" : "border-slate-200"
              }`}
            >
              <button
                type="button"
                className={`w-full rounded-xl px-4 py-3 text-left text-base font-medium ${
                  isDark
                    ? "text-slate-200 hover:bg-slate-800"
                    : "text-slate-800 hover:bg-slate-100"
                }`}
                onClick={() => {
                  closeMobileMenu();
                  router.push(ROUTES.login);
                }}
              >
                Log in
              </button>
              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 py-3 text-center text-base font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700"
                onClick={() => {
                  closeMobileMenu();
                  router.push(ROUTES.register);
                }}
              >
                Sign up
              </button>
            </div>
          </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <main className="flex-1">
          <section
            id="intro"
            className="relative flex flex-col items-center gap-12 py-14 text-center md:flex-row md:items-center md:gap-16 md:py-20 md:text-left"
          >
            <div className="relative flex max-w-xl flex-1 flex-col items-center md:items-start">
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                Smarter diabetes management,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-400">
                  simpler life
                </span>
              </h1>
              <p className={`mt-5 max-w-lg text-lg leading-relaxed ${muted}`}>
                The AI-powered assistant and continuous glucose monitor that
                personalize your care—clear trends, timely guidance, less
                guesswork.
              </p>
              <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
                  onClick={() => router.push(ROUTES.register)}
                >
                  Get started free
                </button>
                <a
                  href="#how_it_works"
                  className={`inline-flex items-center justify-center rounded-2xl border px-8 py-3.5 text-base font-semibold transition ${
                    isDark
                      ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 bg-white/60 text-slate-800 hover:border-blue-300 hover:bg-white"
                  }`}
                >
                  See how it works
                </a>
              </div>
            </div>
            <div className="relative flex w-full flex-1 justify-center md:justify-end">
              <div
                className={`absolute inset-0 rounded-[2rem] opacity-85 blur-3xl ${
                  isDark ? "bg-blue-600/25" : "bg-blue-400/30"
                }`}
                aria-hidden
              />
              <div
                className={`relative hidden w-full max-w-[520px] items-center justify-center rounded-[2rem] border p-4 shadow-2xl md:flex ${
                  isDark
                    ? "border-slate-700/80 bg-slate-900/80 shadow-blue-950/40"
                    : "border-slate-200 bg-white/95 shadow-blue-900/15"
                }`}
              >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASSETS.intro}
                alt=""
                className="relative z-[1] h-auto w-full max-w-[460px] rounded-2xl object-contain"
              />
              </div>
            </div>
          </section>

          <section
            id="how_it_works"
            className={`rounded-3xl border px-5 py-16 sm:px-10 sm:py-20 ${surfaceSoft} ${
              isDark ? "border-slate-800/90" : "border-slate-200/90 shadow-sm"
            }`}
          >
            <p
              className={`text-center text-sm font-semibold tracking-widest uppercase ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Your journey
            </p>
            <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              How Diamate works
            </h2>
            <p className={`mx-auto mt-3 max-w-2xl text-center ${muted}`}>
              Three steps from sensor to insight—built for real routines, not
              clinic-only theory.
            </p>
            <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
              {HOW_IT_WORKS.map((item) => {
                const IconComponent = IconMap[item.icon];
                return (
                  <article
                    key={item.title}
                    className={`group relative overflow-hidden rounded-2xl border p-6 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${surface} ${ringHover}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90" />
                    <div className="mt-2 flex justify-center text-3xl text-blue-600 transition group-hover:scale-110 dark:text-blue-400">
                      {IconComponent ? <IconComponent /> : null}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <h2 className="mt-20 text-center text-3xl font-semibold tracking-tight sm:mt-28 sm:text-4xl">
              Personalized care at your fingertips
            </h2>
            <p className={`mx-auto mt-3 max-w-xl text-center ${muted}`}>
              Diamate is more than just a monitor. It&apos;s a smart companion
              that learns about you to provide support when you need it.
            </p>
            <div className="mx-auto mt-14 grid max-w-5xl gap-12 md:grid-cols-2 md:gap-14">
              {[
                {
                  img: ASSETS.phone,
                  imgTop: "-top-12 sm:-top-14",
                  scale: "w-[118%] max-w-none",
                  title: "Your personal AI helper",
                  body: "Meal ideas, activity tips, and predictive alerts to soften spikes and dips.",
                },
                {
                  img: ASSETS.sensor,
                  imgTop: "-top-24 sm:-top-28",
                  scale: "w-full max-w-none",
                  title: "The seamless arm sensor",
                  body: "Continuous readings without finger sticks—synced quietly to your phone.",
                },
              ].map((block) => (
                <div
                  key={block.title}
                  className="flex flex-col items-center text-center md:items-start md:text-left"
                >
                  <div
                    className={`relative h-[280px] w-full max-w-md overflow-hidden rounded-2xl border shadow-md ${
                      isDark
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-200 bg-gradient-to-b from-white to-slate-50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.img}
                      alt=""
                      className={`absolute left-1/2 ${block.imgTop} -translate-x-1/2 ${block.scale} transition-transform duration-500 hover:scale-[1.04]`}
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{block.title}</h3>
                  <p className={`mt-2 max-w-md ${muted}`}>{block.body}</p>
                </div>
              ))}
            </div>

            <blockquote
              className={`mx-auto mt-20 max-w-3xl rounded-2xl border p-8 sm:mt-24 sm:p-10 ${
                isDark
                  ? "border-blue-500/20 bg-slate-900/60"
                  : "border-blue-100/90 bg-white shadow-xl shadow-blue-900/[0.06]"
              }`}
            >
              <FaQuoteRight className="mx-auto mb-5 text-3xl text-blue-500 dark:text-blue-400" />
              <p className="text-lg font-medium leading-relaxed sm:text-xl">
                &quot;Diamate has been a game-changer. The predictive alerts have
                helped me avoid so many highs and lows—I feel more in control than
                ever. It&apos;s like a personal diabetes coach 24/7.&quot;
              </p>
              <footer className={`mt-6 text-center text-sm font-medium ${muted}`}>
                — Sarah M., using DiaMate since 2024
              </footer>
            </blockquote>

            <h2 className="mt-20 text-center text-3xl font-semibold sm:mt-28 sm:text-4xl">
              Ready to simplify your life?
            </h2>
            <p className={`mx-auto mt-3 max-w-xl text-center ${muted}`}>
              Join others taking control with smarter, personalized care.
            </p>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                className="rounded-2xl bg-blue-600 px-12 py-3.5 text-lg font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
                onClick={() => router.push(ROUTES.register)}
              >
                Create your account
              </button>
            </div>
          </section>

          <section id="features" className="py-16 sm:py-24">
            <p
              className={`text-center text-sm font-semibold tracking-widest uppercase ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Platform
            </p>
            <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              A smarter way to manage diabetes
            </h2>
            <p className={`mx-auto mt-3 max-w-2xl text-center ${muted}`}>
              Intelligent features that work together—insights, monitoring, and
              peace of mind.
            </p>
            <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
              {CORE_FEATURES.map((feature) => {
                const IconComponent = IconMap[feature.icon];
                return (
                  <article
                    key={feature.title}
                    className={`rounded-2xl border p-7 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${surface} ${ringHover}`}
                  >
                    {IconComponent ? (
                      <IconComponent className="mx-auto mb-5 text-3xl text-blue-600 dark:text-blue-400" />
                    ) : null}
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
            <div
              className={`mx-auto mt-16 flex max-w-5xl flex-col gap-14 rounded-3xl border p-6 sm:mt-20 sm:flex-row sm:items-stretch sm:gap-16 sm:p-10 ${
                isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200/90 bg-white/70 shadow-sm"
              }`}
            >
              <div
                className={`flex flex-1 items-center justify-center overflow-hidden rounded-2xl border p-6 ${
                  isDark ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50/80"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ASSETS.phone}
                  alt="DiaMate on a phone"
                  className="w-full max-w-xs scale-110 object-contain transition-transform duration-500 hover:scale-[1.12]"
                />
              </div>
              <ul className="flex flex-1 flex-col justify-center gap-4">
                {DETAILED_FEATURES.map((feature) => {
                  const IconComponent = IconMap[feature.icon];
                  return (
                    <li
                      key={feature.title}
                      className={`rounded-xl border p-5 transition-colors ${
                        isDark
                          ? "border-slate-800 hover:bg-slate-800/50"
                          : "border-slate-200/90 hover:bg-blue-50/60"
                      }`}
                    >
                      <h3 className="flex items-start gap-3 font-semibold">
                        {IconComponent ? (
                          <IconComponent className="mt-0.5 shrink-0 text-xl text-blue-600 dark:text-blue-400" />
                        ) : null}
                        {feature.title}
                      </h3>
                      <p className={`mt-2 pl-9 text-sm leading-relaxed ${muted}`}>
                        {feature.description}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section
            id="faq"
            className={`mb-20 rounded-3xl border px-5 py-16 sm:mb-24 sm:px-10 sm:py-20 ${surfaceSoft} ${
              isDark ? "border-slate-800/90" : "border-slate-200/90 shadow-sm"
            }`}
          >
            <p
              className={`text-center text-sm font-semibold tracking-widest uppercase ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Support
            </p>
            <h2 className="mt-2 text-center text-3xl font-semibold sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className={`mx-auto mt-3 max-w-xl text-center ${muted}`}>
              Straight answers about trials, subscriptions, and more.
            </p>
            <div className="mx-auto mt-12 max-w-3xl space-y-3">
              {FAQ_ITEMS.map((q, index) => (
                <details
                  key={`faq-${index}`}
                  className={`group rounded-2xl border transition-all ${
                    isDark
                      ? "border-slate-700/90 bg-slate-900/50 open:border-blue-500/35"
                      : "border-slate-200 bg-white open:border-blue-200"
                  }`}
                >
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium transition-colors ${
                      isDark
                        ? "text-slate-100 hover:text-blue-300"
                        : "text-slate-900 hover:text-blue-700"
                    }`}
                  >
                    <span>{q.summary}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    />
                  </summary>
                  <p
                    className={`border-t px-5 pb-5 pt-4 text-sm leading-relaxed ${
                      isDark
                        ? "border-slate-800 text-slate-400"
                        : "border-slate-100 text-slate-600"
                    }`}
                  >
                    {q.detail}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </main>

        <footer
          className={`border-t py-12 text-center text-sm ${
            isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"
          }`}
        >
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            DiaMate
          </p>
          <p className="mx-auto mt-2 max-w-md leading-relaxed">
            Supporting self-management only—not a substitute for professional
            medical advice. Consult your care team for treatment decisions.
          </p>
          <p className="mt-8 text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} DiaMate. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
