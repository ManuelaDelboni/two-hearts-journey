import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookDialog } from "@/components/BookDialog";
import { Header } from "@/components/Header";
import { TravelsSection } from "@/components/TravelsSection";
import { StatisticsSection } from "@/components/StatisticsSection";
import { GamesSection } from "@/components/GamesSection";
import { FinalChapter } from "@/components/FinalChapter";

const KISS_MARK_PATH =
  "M9,29 C17,13 24,7 35,8 C44,9 49,15 50,20 C51,15 56,9 65,8 C76,7 83,13 91,29 " +
  "C86,39 76,47 63,49 C57,50.5 52,50.5 50,49.5 C48,50.5 43,50.5 37,49 " +
  "C24,47 14,39 9,29 Z";

function KissMark({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 56"
      width={size}
      height={size * 0.56}
      className={className}
      fill="currentColor"
    >
      <path d={KISS_MARK_PATH} />
    </svg>
  );
}

const kissMarks = [
  { top: "6%", left: "10%", size: 84, opacity: 0.12, rotate: -14 },
  { top: "12%", left: "22%", size: 56, opacity: 0.08, rotate: 10 },
  { top: "9%", left: "48%", size: 68, opacity: 0.09, rotate: -6 },
  { top: "14%", left: "76%", size: 112, opacity: 0.13, rotate: 16 },
  { top: "7%", left: "90%", size: 58, opacity: 0.07, rotate: -20 },
  { top: "26%", left: "6%", size: 72, opacity: 0.1, rotate: 8 },
  { top: "32%", left: "88%", size: 86, opacity: 0.09, rotate: -10 },
  { top: "48%", left: "4%", size: 60, opacity: 0.08, rotate: 18 },
  { top: "52%", left: "94%", size: 74, opacity: 0.11, rotate: -16 },
  { top: "66%", left: "9%", size: 90, opacity: 0.1, rotate: -8 },
  { top: "70%", left: "85%", size: 58, opacity: 0.08, rotate: 12 },
  { top: "80%", left: "18%", size: 76, opacity: 0.09, rotate: -18 },
  { top: "85%", left: "40%", size: 58, opacity: 0.07, rotate: 6 },
  { top: "82%", left: "62%", size: 88, opacity: 0.11, rotate: -12 },
  { top: "88%", left: "80%", size: 72, opacity: 0.08, rotate: 20 },
  { top: "20%", left: "60%", size: 56, opacity: 0.06, rotate: -4 },
  { top: "40%", left: "34%", size: 56, opacity: 0.06, rotate: 14 },
  { top: "58%", left: "68%", size: 58, opacity: 0.06, rotate: -22 },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nossa História — 2 anos do primeiro beijo" },
      { name: "description", content: "Uma viagem pelas memórias que começaram em Londres e continuam sendo escritas todos os dias." },
      { property: "og:title", content: "Nossa História — 2 anos" },
      { property: "og:description", content: "Um livro interativo de amor: viagens, estatísticas, jogos e estrelas." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Caveat:wght@400;600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setBookOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="top" className="relative min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-24">
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
        >
          {kissMarks.map((k, i) => (
            <div
              key={i}
              className="absolute text-gold"
              style={{
                top: k.top,
                left: k.left,
                opacity: k.opacity,
                transform: `rotate(${k.rotate}deg)`,
              }}
            >
              <KissMark size={k.size} />
            </div>
          ))}
        </motion.div>
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-xs uppercase tracking-[0.4em] text-gold/70"
          >
            01 . 07 . 2024  →  01 . 07 . 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1.2 }}
            className="mt-5 font-display text-6xl text-gradient-gold sm:text-8xl"
          >
            Dois anos
            <br />
            <span className="font-hand text-5xl italic sm:text-7xl">do nosso primeiro beijo</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 1 }}
            className="mx-auto mt-8 max-w-xl font-display text-lg italic text-foreground/70 sm:text-xl"
          >
            Uma viagem pelas memórias que começaram em Londres e continuam sendo escritas todos os dias..
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="mt-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#travels"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-all hover:opacity-90 hover:shadow-glow"
              >
                Começar a leitura ↓
              </a>
              <button
                type="button"
                onClick={() => setBookOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--gold)]/40 bg-card px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-gold transition-all hover:bg-[var(--gold)]/10"
              >
                Abrir o livro ✦
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {mounted && (
        <>
          <TravelsSection />
          <StatisticsSection />
          <GamesSection />
          <FinalChapter />
        </>
      )}

      <footer className="border-t border-[var(--gold)]/10 py-10 text-center">
        <p className="font-hand text-2xl text-gold">com amor, sempre.</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          01.07.2024 — para sempre
        </p>
      </footer>

      <BookDialog open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
