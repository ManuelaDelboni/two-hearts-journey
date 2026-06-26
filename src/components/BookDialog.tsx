import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import book from "@/content/book.json";

// Hardcoded warm/gold palette — the popup keeps its original aesthetic
// independent of the page-level tech blue theme.
const GOLD = "oklch(0.82 0.14 80)";
const GOLD_SOFT = "oklch(0.88 0.09 85)";
const EMBER = "oklch(0.55 0.18 30)";
const GOLD_GRADIENT = `linear-gradient(135deg, ${GOLD_SOFT}, ${GOLD} 50%, ${EMBER})`;
const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function BookDialog({ open, onClose }: Props) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!open) setOpened(false);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const half = Math.ceil(book.letter.paragraphs.length / 2);
  const leftParagraphs = book.letter.paragraphs.slice(0, half);
  const rightParagraphs = book.letter.paragraphs.slice(half);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: "radial-gradient(ellipse at center, rgba(20,10,5,0.85), rgba(0,0,0,0.95))",
            fontFamily: SERIF,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Fechar"
            className="absolute right-5 top-5 z-10 rounded-full px-3 py-1 text-sm transition-opacity hover:opacity-80"
            style={{ color: GOLD_SOFT, border: `1px solid ${GOLD}55` }}
          >
            ✕
          </button>

          <div
            className="relative w-full max-w-5xl"
            style={{ perspective: 2200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="relative mx-auto"
              initial={{ rotateX: -20, scale: 0.85, opacity: 0 }}
              animate={{ rotateX: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Closed cover view */}
              <AnimatePresence mode="wait">
                {!opened ? (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto"
                    style={{ width: "min(420px, 90vw)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpened(true)}
                      className="group relative block w-full cursor-pointer"
                      style={{ aspectRatio: "3 / 4" }}
                    >
                      <div
                        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md p-8 text-center transition-transform group-hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.32 0.08 30) 0%, oklch(0.22 0.06 25) 60%, oklch(0.16 0.04 20) 100%)",
                          boxShadow:
                            "0 30px 80px -20px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.6), inset 8px 0 30px rgba(0,0,0,0.4), -10px 0 0 -6px rgba(0,0,0,0.4)",
                        }}
                      >
                        {/* Spine */}
                        <div
                          className="absolute inset-y-0 left-0 w-3"
                          style={{
                            background:
                              "linear-gradient(to right, rgba(0,0,0,0.6), transparent)",
                          }}
                        />
                        <div className="absolute inset-3 rounded-sm" style={{ border: `1px solid ${GOLD}66` }} />
                        <div className="absolute inset-5 rounded-sm" style={{ border: `1px solid ${GOLD}33` }} />
                        <p className="font-hand text-xl" style={{ color: `${GOLD}cc` }}>prólogo</p>
                        <h1
                          className="mt-3 text-4xl sm:text-5xl"
                          style={{
                            fontFamily: SERIF,
                            background: GOLD_GRADIENT,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                          }}
                        >
                          {book.cover.title}
                        </h1>
                        <p className="mt-2 italic" style={{ fontFamily: SERIF, color: `${GOLD_SOFT}cc` }}>
                          {book.cover.subtitle}
                        </p>
                        <div className="mt-8 flex items-center gap-3">
                          <span className="h-px w-12" style={{ background: `${GOLD}80` }} />
                          <span className="font-hand text-2xl" style={{ color: GOLD }}>♥</span>
                          <span className="h-px w-12" style={{ background: `${GOLD}80` }} />
                        </div>
                        <p className="mt-6 text-xs uppercase tracking-[0.3em]" style={{ color: `${GOLD}99` }}>
                          {book.cover.stamp}
                        </p>
                        <p
                          className="mt-10 text-[11px] uppercase tracking-[0.3em] opacity-70 transition-opacity group-hover:opacity-100"
                          style={{ color: GOLD_SOFT }}
                        >
                          ✦ clique para abrir ✦
                        </p>
                      </div>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="opened"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative grid aspect-[16/10] w-full grid-cols-2 overflow-hidden rounded-md"
                    style={{
                      boxShadow:
                        "0 30px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.15)",
                    }}
                  >
                    {/* Left white page */}
                    <div
                      className="paper-texture relative flex flex-col justify-between p-8 sm:p-10"
                      style={{ background: "#fbf7ee" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="font-hand"
                        style={{ color: "oklch(0.28 0.06 30)" }}
                      >
                        <p className="mb-4 text-2xl sm:text-3xl">{book.letter.salutation}</p>
                        {leftParagraphs.map((p, i) => (
                          <p key={i} className="mt-3 text-base leading-relaxed sm:text-lg">
                            {p}
                          </p>
                        ))}
                      </motion.div>
                      <p className="text-right text-xs italic opacity-50" style={{ color: "oklch(0.3 0.06 30)" }}>
                        — i —
                      </p>
                    </div>

                    {/* Right white page */}
                    <div
                      className="paper-texture relative flex flex-col justify-between p-8 sm:p-10"
                      style={{ background: "#fbf7ee" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="font-hand"
                        style={{ color: "oklch(0.28 0.06 30)" }}
                      >
                        {rightParagraphs.map((p, i) => (
                          <p key={i} className="mt-3 text-base leading-relaxed sm:text-lg">
                            {p}
                          </p>
                        ))}
                        <p className="mt-8 text-right text-2xl italic" style={{ fontFamily: SERIF }}>
                          {book.letter.signature}
                        </p>
                      </motion.div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setOpened(false)}
                          className="text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
                          style={{ color: "oklch(0.3 0.06 30)" }}
                        >
                          ← fechar livro
                        </button>
                        <button
                          onClick={onClose}
                          className="rounded-full px-5 py-2 text-sm font-medium transition-transform hover:scale-[1.03]"
                          style={{
                            background: "oklch(0.25 0.06 30)",
                            color: GOLD_SOFT,
                            boxShadow: `0 0 40px -8px ${GOLD}59`,
                          }}
                        >
                          Entrar na nossa história →
                        </button>
                      </div>
                    </div>

                    {/* Center spine shadow */}
                    <div
                      className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5), transparent)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
