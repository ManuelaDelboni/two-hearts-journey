import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Player = "manuela" | "gabriel";
type Phase = "intro" | "pre_turn" | "rally" | "rally_end" | "won";

const TENNIS_POINTS = ["0", "15", "30", "40"];
const RALLY_SECS    = 60;
const WORDS_TO_WIN  = 6;
const WORDS_PER_RALLY = 15;  // extra buffer in case of skips

const WORD_POOL = [

  "APPLE",      "BALLOON",    "CAMERA",     "DANCE",      "ELEPHANT",
  "FLOWER",     "GUITAR",     "HELICOPTER", "ICE CREAM",  "JUNGLE",
  "KITE",       "LIGHTHOUSE", "MONKEY",     "NOTEBOOK",   "OCEAN",
  "PIZZA",      "QUEEN",      "RAINBOW",    "SUNSHINE",   "TIGER",
  "UMBRELLA",   "VIOLIN",     "WATERFALL",  "ZEBRA",      "CASTLE",
  "DRAGON",     "EAGLE",      "FOREST",     "GHOST",      "HOTEL",
  "ISLAND",     "JELLYFISH",  "KNIGHT",     "LION",       "MAGIC",
  "NURSE",      "ORANGE",     "PARROT",     "ROCKET",     "RIVER",
  "SHIP",       "TRAIN",      "VALLEY",     "WINTER",     "ZOMBIE",
  "BEACH",      "COFFEE",     "DIAMOND",    "FIRE",       "GARDEN",
  "HONEY",      "ICEBERG",    "JAZZ",       "KANGAROO",   "LEMON",
  "MOUNTAIN",   "NOODLE",     "PENGUIN",    "ROBOT",      "STORM",
  "TORNADO",    "UNICORN",    "VAMPIRE",    "WIZARD",     "YACHT",
  "CARTOON",    "COMPASS",    "FESTIVAL",   "GRAPES",     "HAMMER",
  "OPERA",      "EMPIRE",     "BRIDGE",     "DETECTIVE",  "EXPLOSION",
  "AIRPLANE",   "BUS",        "SUBWAY",     "ROAD",       "STREET",
  "CITY",       "VILLAGE",    "PARK",       "SQUARE",     "MARKET",
  "SHOP",       "SUPERMARKET","RESTAURANT", "KITCHEN",    "PLATE",
  "FORK",       "KNIFE",      "SPOON",      "CUP",        "BOTTLE",
  "SUN",        "MOON",       "STAR",       "SKY",        "CLOUD",
  "RAIN",       "SNOW",       "WIND",       "THUNDER",    "LIGHTNING",
  "HEAD",       "HAND",       "FOOT",       "ARM",        "LEG",
  "EYE",        "NOSE",       "MOUTH",      "EAR",
  "HAPPY",      "SAD",        "ANGRY",      "TIRED",      "SCARED",
  "SURPRISED",
  "GOOD",       "BAD",        "FAST",       "SLOW",       "STRONG",
  "WEAK",       "NEW",        "OLD",        "CLEAN",      "DIRTY",
  "PHONE CALL", "MESSAGE",    "PICTURE",    "VIDEO",      "MUSIC",
  "DANCE FLOOR","PARTY",      "BIRTHDAY",   "GIFT",
  "COOK",       "EAT",        "DRINK",      "BUY",        "SELL",
  "WORK",       "STUDY",      "HELP",       "TALK",       "LISTEN",
  "LOOK",       "TOUCH",      "DRAW",       "BUILD",

  // --- animals ---
  "DOG",        "CAT",        "BIRD",       "FISH",       "HORSE",
  "COW",        "PIG",        "SHEEP",      "DUCK",       "RABBIT",
  "MOUSE",      "BEAR",       "WOLF",       "FROG",       "SNAKE",
  "SPIDER",     "BEE",        "BUTTERFLY",  "TURTLE",     "WHALE",
  "SHARK",      "GOAT",       "CHICKEN",    "OWL",        "DEER",
  "SNAIL",

  // --- food & drink ---
  "BREAD",      "CHEESE",     "MILK",       "EGG",        "RICE",
  "SOUP",       "SALAD",      "CAKE",       "COOKIE",     "CHOCOLATE",
  "BUTTER",     "SUGAR",      "SALT",       "MEAT",       "BANANA",
  "STRAWBERRY", "WATERMELON", "POTATO",     "TOMATO",     "CARROT",
  "ONION",      "PASTA",      "SANDWICH",   "JUICE",      "TEA",
  "WATER",

  // --- colors ---
  "RED",        "BLUE",       "GREEN",      "YELLOW",     "BLACK",
  "WHITE",      "PURPLE",     "PINK",       "BROWN",      "GRAY",

  // --- numbers ---
  "ONE",        "TWO",        "THREE",      "FOUR",       "FIVE",
  "SIX",        "SEVEN",      "EIGHT",      "NINE",       "TEN",

  // --- family & people ---
  "MOTHER",     "FATHER",     "SISTER",     "BROTHER",    "BABY",
  "FAMILY",     "FRIEND",     "GRANDMOTHER","GRANDFATHER","TEACHER",
  "DOCTOR",

  // --- clothes ---
  "SHIRT",      "PANTS",      "SHOES",      "HAT",        "DRESS",
  "JACKET",     "SOCKS",      "GLOVES",     "SCARF",

  // --- house & objects ---
  "HOUSE",      "DOOR",       "WINDOW",     "TABLE",      "CHAIR",
  "BED",        "ROOM",       "WALL",       "ROOF",       "FLOOR",
  "LAMP",       "MIRROR",     "CLOCK",      "BOOK",       "PEN",
  "PENCIL",     "PAPER",      "BAG",        "KEY",        "BOX",

  // --- nature ---
  "TREE",       "LEAF",       "GRASS",      "ROCK",       "SAND",
  "LAKE",       "HILL",

  // --- body ---
  "HAIR",       "TOOTH",      "FINGER",     "KNEE",       "SHOULDER",
  "BACK",       "NECK",       "TONGUE",

  // --- adjectives ---
  "BIG",        "SMALL",      "HOT",        "COLD",       "TALL",
  "SHORT",      "HEAVY",      "LIGHT",      "LOUD",       "QUIET",
  "EASY",       "HARD",       "FULL",       "EMPTY",      "RICH",
  "POOR",       "YOUNG",      "BEAUTIFUL",  "UGLY",       "FUNNY",

  // --- verbs ---
  "RUN",        "WALK",       "JUMP",       "SWIM",       "FLY",
  "SING",       "READ",       "WRITE",      "SLEEP",      "WAKE",
  "OPEN",       "CLOSE",      "PLAY",       "WATCH",      "SMILE",
  "LAUGH",      "CRY",        "SIT",        "STAND",      "CLIMB",
  "THROW",      "CATCH",      "PUSH",       "PULL",       "CARRY",
  "WASH",       "BRUSH",      "WEAR",

  // --- places & transport ---
  "SCHOOL",     "HOSPITAL",   "LIBRARY",    "ZOO",        "FARM",
  "MUSEUM",     "AIRPORT",    "STATION",    "CAR",        "BICYCLE",
  "BOAT",       "TRUCK",

  // --- time ---
  "MORNING",    "NIGHT",      "TODAY",      "TOMORROW",   "YESTERDAY",
  "WEEK",       "MONTH",      "YEAR",       "HOUR",       "MINUTE"
];


function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function displayScore(mine: number, other: number) {
  if (mine >= 3 && other >= 3) {
    if (mine === other) return "Deuce";
    return mine > other ? "AD" : "40";
  }
  return TENNIS_POINTS[Math.min(mine, 3)];
}

function opponent(p: Player): Player {
  return p === "manuela" ? "gabriel" : "manuela";
}

function isGameWinner(score: Record<Player, number>, p: Player) {
  const other = opponent(p);
  return score[p] >= 4 && score[p] - score[other] >= 2;
}

function name(p: Player) {
  return p === "manuela" ? "Manuela" : "Gabriel";
}

export function TennisGame() {
  const [phase, setPhase]         = useState<Phase>("intro");
  const [server, setServer]       = useState<Player>("manuela");
  const [pointIdx, setPointIdx]   = useState<Record<Player, number>>({ manuela: 0, gabriel: 0 });
  const [words, setWords]         = useState<string[]>([]);
  const [wordIdx, setWordIdx]     = useState(0);
  const [correct, setCorrect]     = useState(0);
  const [timeLeft, setTimeLeft]   = useState(RALLY_SECS);
  const [feedback, setFeedback]   = useState<"correct" | "skip" | null>(null);
  const [rallyWon, setRallyWon]   = useState<boolean | null>(null);
  const [winner, setWinner]       = useState<Player | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const endRally = useCallback((won: boolean) => {
    stopTimer();
    setRallyWon(won);
    setPhase("rally_end");
  }, [stopTimer]);

  // Countdown
  useEffect(() => {
    if (phase !== "rally") return;
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return stopTimer;
  }, [phase, stopTimer]);

  // Time-up
  useEffect(() => {
    if (phase === "rally" && timeLeft <= 0) endRally(correct >= WORDS_TO_WIN);
  }, [phase, timeLeft, correct, endRally]);

  // Keyboard shortcuts during rally
  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (feedback !== null || phase !== "rally") return;
    setFeedback(isCorrect ? "correct" : "skip");
    const newCorrect = isCorrect ? correct + 1 : correct;

    if (isCorrect && newCorrect >= WORDS_TO_WIN) {
      setTimeout(() => { setCorrect(newCorrect); endRally(true); }, 500);
      return;
    }
    setTimeout(() => {
      setCorrect(newCorrect);
      setWordIdx(i => i + 1);
      setFeedback(null);
    }, 400);
  }, [feedback, phase, correct, endRally]);

  useEffect(() => {
    if (phase !== "rally") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleAnswer(true); }
      else if (e.key === "Escape" || e.key === "ArrowDown") { e.preventDefault(); handleAnswer(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handleAnswer]);

  const startGame = () => {
    const first: Player = Math.random() < 0.5 ? "manuela" : "gabriel";
    setServer(first);
    setPointIdx({ manuela: 0, gabriel: 0 });
    setWinner(null);
    setPhase("pre_turn");
  };

  const startRally = () => {
    setWords(shuffle(WORD_POOL).slice(0, WORDS_PER_RALLY));
    setWordIdx(0);
    setCorrect(0);
    setTimeLeft(RALLY_SECS);
    setFeedback(null);
    setRallyWon(null);
    setPhase("rally");
  };

  const advanceAfterRally = () => {
    const scorer: Player = rallyWon ? server : opponent(server);
    const newIdx = { ...pointIdx, [scorer]: pointIdx[scorer] + 1 };

    if (isGameWinner(newIdx, scorer)) {
      setWinner(scorer);
      setPointIdx(newIdx);
      setPhase("won");
      return;
    }
    setPointIdx(newIdx);
    setServer(s => opponent(s));
    setPhase("pre_turn");
  };

  const timerPct = Math.max(0, (timeLeft / RALLY_SECS) * 100);

  return (
    <div className="space-y-5">

      {/* Tennis court */}
      <div className="relative mx-auto aspect-[2/1] w-full overflow-hidden rounded-2xl border-4"
        style={{
          background: "linear-gradient(180deg, oklch(0.50 0.18 50), oklch(0.42 0.16 45))",
          borderColor: "oklch(0.96 0.012 80)",
        }}
      >
        {/* Net */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/80" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40 sm:h-36 sm:w-36" />

        {/* Player labels */}
        <span className="absolute left-4 top-3 text-xs font-bold uppercase tracking-wider text-white/60">Manuela</span>
        <span className="absolute right-4 top-3 text-xs font-bold uppercase tracking-wider text-white/60">Gabriel</span>

        {/* Score */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-around">
          <p className="font-display text-4xl font-bold text-white drop-shadow">{displayScore(pointIdx.manuela, pointIdx.gabriel)}</p>
          <p className="font-display text-4xl font-bold text-white drop-shadow">{displayScore(pointIdx.gabriel, pointIdx.manuela)}</p>
        </div>

        {/* Ball */}
        <motion.div
          className="absolute h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ background: "oklch(0.92 0.18 120)", boxShadow: "0 0 10px oklch(0.92 0.18 120 / 0.8)" }}
          animate={{
            left: server === "manuela" ? "20%" : "78%",
            top: ["45%", "18%", "45%"],
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            repeat: phase === "rally" ? Infinity : 0,
            repeatType: "mirror",
          }}
        />
      </div>

      {/* Game panel */}
      <div className="min-h-[220px] rounded-2xl border border-[var(--gold)]/15 bg-card/40 p-6">
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {phase === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <p className="max-w-sm text-sm leading-relaxed text-foreground/70">
                Um jogo em estilo tênis de palavras: um jogador descreve palavras em inglês (sem dizer a palavra),
                e o outro tenta adivinhar.
                <br />
                Você tem <strong className="text-foreground">1 minuto</strong> para acertar
                <strong className="text-foreground"> 6 palavras</strong>.
                <br />
                Acertou 6 → vence o rally.
              </p>
              <button onClick={startGame}
                className="rounded-full bg-gold px-7 py-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
              >
                Começar
              </button>
            </motion.div>
          )}

          {/* ── PRE TURN ── */}
          {phase === "pre_turn" && (
            <motion.div key={`pre_${server}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-foreground/40">Sacando</p>
              <p className="font-display text-3xl text-foreground">{name(server)}</p>
              <p className="max-w-xs text-sm leading-relaxed text-foreground/60">
                {name(server)}, vire a tela para <strong className="text-foreground">{name(opponent(server))}</strong>.
                <br />Você tem 60 segundos para fazer adivinhar 6 palavras!
              </p>
              <p className="text-xs text-foreground/30">
                Espaço / Enter = ✓ · Esc = ✗
              </p>
              <button onClick={startRally}
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
              >
                GO !
              </button>
            </motion.div>
          )}

          {/* ── RALLY ── */}
          {phase === "rally" && (
            <motion.div key="rally" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Timer row */}
              <div className="flex w-full items-center justify-between">
                <span className="text-sm">
                  <span className="font-bold text-emerald-400">{correct}</span>
                  <span className="text-foreground/40"> / {WORDS_TO_WIN}</span>
                </span>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-foreground/10">
                    <motion.div
                      className={`h-full rounded-full ${timeLeft <= 10 ? "bg-rose-400" : "bg-gold"}`}
                      animate={{ width: `${timerPct}%` }}
                      transition={{ duration: 0.9 }}
                    />
                  </div>

                  <span className={`w-10 text-right text-xl font-bold tabular-nums ${timeLeft <= 10 ? "text-rose-400" : "text-gold"}`}>
                    {Math.max(0, timeLeft)}s
                  </span>
                </div>
              </div>

              {/* Word card */}
              <AnimatePresence mode="wait">
                <motion.div key={wordIdx}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full rounded-2xl px-6 py-8 text-center transition-colors ${
                    feedback === "correct" ? "bg-emerald-500/15"
                    : feedback === "skip"  ? "bg-rose-500/10"
                    : "bg-card/50"
                  }`}
                >
                  <p className="font-display text-4xl font-bold tracking-widest text-foreground sm:text-5xl">
                    {words[wordIdx] ?? "…"}
                  </p>

                  {feedback && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`mt-2 text-sm font-semibold ${
                        feedback === "correct" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {feedback === "correct" ? "✓ Acertou!" : "✗ Pulou"}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex w-full gap-3">
                <button onClick={() => handleAnswer(false)} disabled={!!feedback}
                  className="flex-1 rounded-xl border-2 border-rose-500/30 bg-rose-500/10 py-4 text-sm font-bold uppercase tracking-wider text-rose-300 transition-all hover:bg-rose-500/20 active:scale-95 disabled:opacity-30"
                >
                  ✗  Pular
                </button>

                <button onClick={() => handleAnswer(true)} disabled={!!feedback}
                  className="flex-1 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 py-4 text-sm font-bold uppercase tracking-wider text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-30"
                >
                  ✓  Acertou
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RALLY END ── */}
          {phase === "rally_end" && (
            <motion.div key="rally_end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              {rallyWon ? (
                <>
                  <p className="font-display text-3xl text-gold">Rally vencido! 🎾</p>
                  <p className="text-sm text-foreground/70">{name(server)} marca um ponto.</p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl text-rose-300">Tempo esgotado!</p>
                  <p className="text-sm text-foreground/70">{name(opponent(server))} marca um ponto.</p>
                </>
              )}

              <p className="text-xs text-foreground/40">
                {correct} palavra{correct !== 1 ? "s" : ""} adivinhada{correct !== 1 ? "s" : ""}
              </p>

              <button onClick={advanceAfterRally}
                className="mt-1 rounded-full bg-gold px-7 py-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
              >
                Continuar →
              </button>
            </motion.div>
          )}

          {/* ── WON ── */}
          {phase === "won" && winner && (
            <motion.div key="won" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <p className="font-display text-4xl text-gradient-gold">
                {winner === "manuela" ? "Manuela vence! 💕" : "Gabriel vence! 🏆"}
              </p>

              <p className="font-hand text-2xl italic text-foreground/80">
                {winner === "manuela" ? "Imbatível. Vencemos juntos!" : "Parabéns!"}
              </p>

              <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                Game, Set & Match — {name(winner)}
              </p>

              <button onClick={startGame}
                className="rounded-full border border-[var(--gold)]/40 px-7 py-2.5 text-sm uppercase tracking-[0.15em] text-gold transition-colors hover:bg-[var(--gold)]/10"
              >
                Novo jogo
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
