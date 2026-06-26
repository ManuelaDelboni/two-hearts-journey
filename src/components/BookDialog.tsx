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
        >
          <div className="relative w-full max-w-5xl" style={{ perspective: 2000 }}>
            <motion.div
              className="relative mx-auto"
              initial={{ rotateX: -25, scale: 0.85, opacity: 0 }}
              animate={{ rotateX: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="relative grid aspect-[16/10] w-full grid-cols-2 overflow-hidden rounded-md"
                style={{ boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.15)" }}
              >
                {/* Left page (cover or interior) */}
                <motion.div
                  className="relative origin-right"
                  initial={false}
                  animate={{ rotateY: opened ? -170 : 0 }}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "right center" }}
                >
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    style={{
                      backfaceVisibility: "hidden",
                      background:
                        "linear-gradient(135deg, oklch(0.32 0.08 30) 0%, oklch(0.22 0.06 25) 60%, oklch(0.16 0.04 20) 100%)",
                      boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), inset 8px 0 30px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div className="absolute inset-3 rounded-sm" style={{ border: `1px solid ${GOLD}66` }} />
                    <div className="absolute inset-5 rounded-sm" style={{ border: `1px solid ${GOLD}33` }} />
                    <p className="font-hand text-xl" style={{ color: `${GOLD}cc` }}>prólogo</p>
                    <h1
                      className="mt-3 text-4xl sm:text-6xl"
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
                  </div>
                  <div
                    className="paper-texture absolute inset-0 flex items-center justify-center p-10"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <div className="font-hand text-2xl leading-relaxed sm:text-3xl" style={{ color: "oklch(0.3 0.06 30)" }}>
                      <p className="mb-3">{book.letter.salutation}</p>
                      <p className="text-base leading-relaxed sm:text-lg">{book.letter.paragraphs[0]}</p>
                      <p className="mt-3 text-base leading-relaxed sm:text-lg">{book.letter.paragraphs[1]}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right page */}
                <div className="paper-texture relative flex flex-col justify-between p-8 sm:p-10">
                  <div className="font-hand" style={{ color: "oklch(0.28 0.06 30)" }}>
                    <AnimatePresence>
                      {opened && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        >
                          <p className="text-base leading-relaxed sm:text-lg">{book.letter.paragraphs[2]}</p>
                          <p className="mt-3 text-base leading-relaxed sm:text-lg">{book.letter.paragraphs[3]}</p>
                          <p className="mt-8 text-right text-2xl italic" style={{ fontFamily: SERIF }}>
                            {book.letter.signature}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => (opened ? onClose() : setOpened(true))}
                      className="group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03]"
                      style={{
                        background: "oklch(0.25 0.06 30)",
                        color: GOLD_SOFT,
                        boxShadow: `0 0 40px -8px ${GOLD}59`,
                      }}
                    >
                      <span className="relative z-10">{opened ? "Entrar na nossa história →" : book.cta}</span>
                    </button>
                  </div>
                </div>

                <div
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6), transparent)" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
