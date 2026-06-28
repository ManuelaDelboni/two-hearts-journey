import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookDialog } from "@/components/BookDialog";
import { Header } from "@/components/Header";
import { TravelsSection } from "@/components/TravelsSection";
import { StatisticsSection } from "@/components/StatisticsSection";
import { GamesSection } from "@/components/GamesSection";
import { FinalChapter } from "@/components/FinalChapter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nossa História — 2 anos do primeiro beijo" },
      { name: "description", content: "Um livro interativo para comemorar 2 anos do nosso primeiro beijo. Viagens, estatísticas, jogos e desejos." },
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
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.3 0.08 30 / 0.6), transparent 60%)",
          }}
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center select-none"
        >
          <span
            className="font-display leading-none"
            style={{
              fontSize: "clamp(20rem, 60vw, 56rem)",
              fontWeight: 800,
              background:
                "linear-gradient(180deg, oklch(0.52 0.22 255 / 0.10), oklch(0.52 0.22 255 / 0.02))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextStroke: "1px oklch(0.52 0.22 255 / 0.18)",
            }}
          >
          </span>
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
            Um livro interativo sobre as cidades, os números, os jogos e os desejos que escrevemos juntos.
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
