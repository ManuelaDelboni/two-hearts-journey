import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import games from "@/content/games.json";
import { SectionTitle } from "./SectionTitle";
import { WordSearchGame } from "./games/WordSearchGame";
import { SinucaGame } from "./games/SinucaGame";
import { TennisGame } from "./games/TennisGame";
import { F1Game } from "./games/F1Game";

const TABS = [
  { id: "word", label: "Caça-Palavras" },
  { id: "sinuca", label: "Sinuca" },
  { id: "tennis", label: "Tennis Match" },
  { id: "f1", label: "F1: Nossa Pista" },
] as const;

export function GamesSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("word");

  return (
    <section id="games" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle eyebrow="Chapter III" title={games.title} subtitle={games.subtitle} />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2 text-xs uppercase tracking-[0.18em] transition-all sm:text-sm ${
                tab === t.id
                  ? "bg-gold text-primary-foreground shadow-glow"
                  : "border border-[var(--gold)]/20 text-foreground/70 hover:border-[var(--gold)]/50 hover:text-gold"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-[var(--gold)]/15 bg-card/30 p-5 backdrop-blur-sm sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {tab === "word" && <WordSearchGame />}
              {tab === "sinuca" && <SinucaGame />}
              {tab === "tennis" && <TennisGame />}
              {tab === "f1" && <F1Game />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
