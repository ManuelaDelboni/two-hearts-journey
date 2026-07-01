import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Player = "manuela" | "gabriel";

interface WordPuzzle {
  word: string;
  hint: string;
}

const WORD_POOL: WordPuzzle[] = [
  { word: "AMOUR", hint: "Sentiment entre deux personnes qui s'aiment" },
  { word: "BISOU", hint: "Petit geste affectueux" },
  { word: "COEUR", hint: "Symbole classique de l'amour" },
  { word: "ROSE", hint: "Fleur souvent offerte" },
  { word: "LUNE", hint: "Satellite naturel de la Terre" },
  { word: "SOLEIL", hint: "Étoile qui éclaire nos journées" },
  { word: "ETOILE", hint: "Brille dans le ciel la nuit" },
  { word: "REVE", hint: "Histoire imaginée pendant le sommeil" },
  { word: "MER", hint: "Grande étendue d'eau salée" },
  { word: "PLAGE", hint: "Bord de mer recouvert de sable" },
  { word: "VOYAGE", hint: "Déplacement vers une destination" },
  { word: "ARBRE", hint: "Grande plante avec un tronc" },
  { word: "CHAT", hint: "Animal domestique qui miaule" },
  { word: "CHIEN", hint: "Meilleur ami de l'homme" },
  { word: "LIVRE", hint: "Objet que l'on lit" },
  { word: "PHOTO", hint: "Image prise avec un appareil" },
  { word: "DANSE", hint: "Art de bouger en rythme" },
  { word: "MUSIQUE", hint: "Art des sons et des mélodies" },
  { word: "AMI", hint: "Personne à qui l'on fait confiance" },
  { word: "BONHEUR", hint: "État de grande satisfaction" },
  { word: "JOIE", hint: "Sentiment de plaisir" },
  { word: "CALME", hint: "Absence d'agitation" },
  { word: "NUAGE", hint: "Masse blanche dans le ciel" },
  { word: "ORAGE", hint: "Pluie avec éclairs et tonnerre" },
  { word: "VENT", hint: "Air en mouvement" },
  { word: "NEIGE", hint: "Tombe du ciel en hiver" },
  { word: "POMME", hint: "Fruit rouge ou vert" },
  { word: "POIRE", hint: "Fruit vert à chair blanche" },
  { word: "CERISE", hint: "Petit fruit rouge" },
  { word: "RAISIN", hint: "Fruit utilisé pour faire du vin" },
  { word: "PAIN", hint: "Aliment fabriqué avec de la farine" },
  { word: "FROMAGE", hint: "Produit laitier" },
  { word: "CAFE", hint: "Boisson chaude énergisante" },
  { word: "THE", hint: "Boisson chaude à base de feuilles" },
  { word: "MAISON", hint: "Lieu où l'on habite" },
  { word: "JARDIN", hint: "Espace vert autour d'une maison" },
  { word: "PORTE", hint: "Permet d'entrer dans une pièce" },
  { word: "FENETRE", hint: "Ouverture qui laisse passer la lumière" },
  { word: "TABLE", hint: "Meuble utilisé pour manger" },
  { word: "CHAISE", hint: "Meuble sur lequel on s'assoit" },
  { word: "VELO", hint: "Moyen de transport à deux roues" },
  { word: "TRAIN", hint: "Transport circulant sur des rails" },
  { word: "AVION", hint: "Moyen de transport qui vole" },
  { word: "BATEAU", hint: "Moyen de transport sur l'eau" },
  { word: "PARIS", hint: "Capitale de la France" },
  { word: "LONDRES", hint: "Capitale du Royaume-Uni" },
  { word: "ROME", hint: "Capitale de l'Italie" },
  { word: "ANNECY", hint: "Ville française célèbre pour son lac" },
  { word: "AMSTERDAM", hint: "Ville des canaux aux Pays-Bas" },
  { word: "CHILI", hint: "Pays d'Amérique du Sud" },
  { word: "SUISSE", hint: "Pays connu pour ses montagnes et son chocolat" },

  // Couleurs
  { word: "ROUGE", hint: "Couleur des roses et du sang" },
  { word: "BLEU", hint: "Couleur du ciel par beau temps" },
  { word: "VERT", hint: "Couleur de l'herbe" },
  { word: "JAUNE", hint: "Couleur du soleil" },
  { word: "BLANC", hint: "Couleur de la neige" },
  { word: "NOIR", hint: "Couleur de la nuit" },

  // Animaux
  { word: "CHEVAL", hint: "Animal que l'on peut monter" },
  { word: "OISEAU", hint: "Animal qui vole souvent dans le ciel" },
  { word: "POISSON", hint: "Animal qui vit dans l'eau" },
  { word: "LAPIN", hint: "Petit animal aux longues oreilles" },
  { word: "OURS", hint: "Grand animal vivant dans la forêt" },
  { word: "TORTUE", hint: "Animal lent avec une carapace" },

  // École et travail
  { word: "ECOLE", hint: "Lieu où les enfants apprennent" },
  { word: "ELEVE", hint: "Personne qui étudie" },
  { word: "CLASSE", hint: "Salle où les élèves apprennent" },
  { word: "CRAYON", hint: "Objet utilisé pour écrire ou dessiner" },
  { word: "CAHIER", hint: "Carnet pour prendre des notes" },
  { word: "PROFESSEUR", hint: "Personne qui enseigne" },

  // Corps humain
  { word: "MAIN", hint: "Partie du corps avec cinq doigts" },
  { word: "TETE", hint: "Partie du corps qui contient le cerveau" },
  { word: "YEUX", hint: "Ils servent à voir" },
  { word: "BOUCHE", hint: "Elle sert à parler et manger" },
  { word: "BRAS", hint: "Membre supérieur du corps" },
  { word: "PIED", hint: "Partie du corps utilisée pour marcher" },

  // Famille
  { word: "MAMAN", hint: "La mère dans une famille" },
  { word: "PAPA", hint: "Le père dans une famille" },
  { word: "FRERE", hint: "Garçon ayant les mêmes parents" },
  { word: "SOEUR", hint: "Fille ayant les mêmes parents" },
  { word: "FAMILLE", hint: "Groupe de personnes liées" },
  { word: "ENFANT", hint: "Jeune personne" },

  // Nourriture
  { word: "BANANE", hint: "Fruit jaune apprécié des singes" },
  { word: "ORANGE", hint: "Fruit riche en vitamine C" },
  { word: "CHOCOLAT", hint: "Douceur fabriquée à partir de cacao" },
  { word: "PIZZA", hint: "Plat italien très populaire" },
  { word: "LAIT", hint: "Boisson produite par les vaches" },
  { word: "EAU", hint: "Liquide indispensable à la vie" },

  // Verbes simples
  { word: "MANGER", hint: "Action de prendre un repas" },
  { word: "BOIRE", hint: "Action d'avaler un liquide" },
  { word: "DORMIR", hint: "Se reposer pendant la nuit" },
  { word: "LIRE", hint: "Découvrir le contenu d'un texte" },
  { word: "ECRIRE", hint: "Tracer des lettres ou des mots" },
  { word: "MARCHER", hint: "Se déplacer à pied" },

  // Adjectifs
  { word: "GRAND", hint: "Qui a une taille importante" },
  { word: "PETIT", hint: "Qui a une taille réduite" },
  { word: "HEUREUX", hint: "Qui ressent du bonheur" },
  { word: "TRISTE", hint: "Qui ressent de la peine" },
  { word: "RAPIDE", hint: "Qui va vite" },
  { word: "LENT", hint: "Qui prend du temps" },

  // Ville et quotidien
  { word: "RUE", hint: "Voie de circulation dans une ville" },
  { word: "PLACE", hint: "Espace public dans une ville" },
  { word: "MAGASIN", hint: "Lieu où l'on fait des achats" },
  { word: "HOTEL", hint: "Lieu où l'on dort en voyage" },
  { word: "RESTAURANT", hint: "Lieu où l'on mange" },
  { word: "PARC", hint: "Espace vert public" },

  // Temps
  { word: "JOUR", hint: "Période de vingt-quatre heures" },
  { word: "NUIT", hint: "Période où il fait sombre" },
  { word: "MATIN", hint: "Début de la journée" },
  { word: "SOIR", hint: "Fin de la journée" },
  { word: "SEMAINE", hint: "Période de sept jours" },
  { word: "MOIS", hint: "Période d'environ trente jours" },

  // Expressions courantes
  { word: "BONJOUR", hint: "Salutation utilisée le jour" },
  { word: "BONSOIR", hint: "Salutation utilisée le soir" },
  { word: "MERCI", hint: "Mot utilisé pour remercier" },
  { word: "PARDON", hint: "Mot utilisé pour s'excuser" },
  { word: "OUI", hint: "Réponse positive" },
  { word: "NON", hint: "Réponse négative" }
];

// 10 balls positioned on the table
const BALL_POSITIONS = [
  { x: 20, y: 35 }, { x: 15, y: 62 }, { x: 30, y: 78 }, { x: 35, y: 45 }, { x: 25, y: 55 },
  { x: 72, y: 40 }, { x: 78, y: 65 }, { x: 65, y: 55 }, { x: 62, y: 38 }, { x: 75, y: 52 },
];

const BALL_COLORS = [
  "oklch(0.72 0.20 40)",  "oklch(0.65 0.22 20)",  "oklch(0.68 0.20 350)",
  "oklch(0.70 0.18 60)",  "oklch(0.62 0.22 30)",  "oklch(0.55 0.22 255)",
  "oklch(0.50 0.20 270)", "oklch(0.52 0.20 290)", "oklch(0.48 0.18 240)",
  "oklch(0.54 0.22 265)",
];

const POCKETS = [
  { x: 2.5, y: 6 }, { x: 50, y: 3 }, { x: 97.5, y: 6 },
  { x: 2.5, y: 94 }, { x: 50, y: 97 }, { x: 97.5, y: 94 },
];

const WIN_TARGET = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeWord(s: string) {
  return s.trim().toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function randomUnpocketedIdx(
  pocketed: Set<number>,
  total: number
): number | null {
  const available: number[] = [];

  for (let i = 0; i < total; i++) {
    if (!pocketed.has(i)) {
      available.push(i);
    }
  }

  if (available.length === 0) {
    return null;
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function SinucaGame() {
  const [phase, setPhase]           = useState<"intro" | "playing" | "won">("intro");
  const [currentPlayer, setCurrentPlayer] = useState<Player>("manuela");
  const [ballWords, setBallWords]   = useState<WordPuzzle[]>([]);
  const [activeBallIdx, setActiveBallIdx] = useState(0);
  const [pocketed, setPocketed]     = useState<Set<number>>(new Set());
  const [scores, setScores]         = useState({ manuela: 0, gabriel: 0 });
  const [input, setInput]           = useState("");
  const [feedback, setFeedback]     = useState<"correct" | "wrong" | null>(null);
  const [shaking, setShaking]       = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [winner, setWinner]         = useState<Player | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    const first: Player = Math.random() < 0.5 ? "manuela" : "gabriel";
    const words = shuffle(WORD_POOL).slice(0, 10);
    setCurrentPlayer(first);
    setBallWords(words);
    setActiveBallIdx(
      Math.floor(Math.random() * words.length)
    );
    setPocketed(new Set());
    setScores({ manuela: 0, gabriel: 0 });
    setInput("");
    setFeedback(null);
    setShaking(false);
    setTransitioning(false);
    setWinner(null);
    setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const confirm = useCallback(() => {
    if (!ballWords[activeBallIdx] || transitioning || feedback) return;
    const correct = normalizeWord(input) === ballWords[activeBallIdx].word;

    setFeedback(correct ? "correct" : "wrong");
    if (!correct) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
    setTransitioning(true);

    const nextPlayer: Player = currentPlayer === "manuela" ? "gabriel" : "manuela";
    const newScores = { ...scores };

    setTimeout(() => {
      let newPocketed = pocketed;

      if (correct) {
        newScores[currentPlayer]++;
        newPocketed = new Set([...pocketed, activeBallIdx]);
        setPocketed(newPocketed);
        setScores(newScores);

        if (newScores[currentPlayer] >= WIN_TARGET) {
          setWinner(currentPlayer);
          setPhase("won");
          return;
        }

        const next = randomUnpocketedIdx(
          newPocketed,
          ballWords.length
        );

        if (next !== null) {
  setActiveBallIdx(next);
        }
      }
      // Wrong: same ball stays active for next player

      setCurrentPlayer(nextPlayer);
      setInput("");
      setFeedback(null);
      setTransitioning(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 900);
  }, [ballWords, activeBallIdx, input, transitioning, feedback, currentPlayer, scores, pocketed]);

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") confirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, confirm]);

  const activeWord = ballWords[activeBallIdx];

  return (
    <div className="select-none">
      <AnimatePresence mode="wait">

        {/* INTRO */}
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 py-12 text-center"
          >
            <p className="font-display text-3xl italic text-gold">Sinuca Challenge</p>
            <p className="max-w-sm text-sm leading-relaxed text-foreground/70">
              Jogo por turnos entre Manuela e Gabriel. Cada bola esconde uma palavra — escreva a palavra completa e confirme.
              Se errar, a vez passa. Quem embolsar {WIN_TARGET} bolas primeiro ganha!
            </p>
            <button onClick={startGame}
              className="rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
            >
              Começar o jogo
            </button>
          </motion.div>
        )}

        {/* WON */}
        {phase === "won" && winner && (
          <motion.div key="won" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-12 text-center"
          >
            <p className="font-display text-4xl text-gold">
              {winner === "manuela" ? "Manuela ganhou! 💕" : "Gabriel ganhou! 🏆"}
            </p>
            <p className="font-hand text-2xl italic text-foreground/80">
              {winner === "manuela" ? "Sabia que você ia ganhar, princesa." : "Você é bom demais nisso!"}
            </p>
            <div className="flex gap-6 text-sm text-foreground/50">
              <span>Manuela: {scores.manuela}</span>
              <span>Gabriel: {scores.gabriel}</span>
            </div>
            <button onClick={startGame}
              className="rounded-full border border-[var(--gold)]/40 px-8 py-3 text-sm uppercase tracking-[0.15em] text-gold transition-colors hover:bg-[var(--gold)]/10"
            >
              Jogar de novo
            </button>
          </motion.div>
        )}

        {/* PLAYING */}
        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

            {/* Scores */}
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 ${
                currentPlayer === "manuela"
                  ? "bg-[oklch(0.65_0.22_20)]/15 ring-2 ring-[oklch(0.65_0.22_20)]/50"
                  : "opacity-40"
              }`}>
                <span className="h-3 w-3 rounded-full" style={{ background: "oklch(0.65 0.22 20)" }} />
                <span className="font-semibold">Manuela</span>
                <span className="font-bold text-gold">{scores.manuela}</span>
              </div>

              <span className="text-xs italic text-foreground/30">{WIN_TARGET} para ganhar</span>

              <div className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 ${
                currentPlayer === "gabriel"
                  ? "bg-[oklch(0.52_0.20_270)]/15 ring-2 ring-[oklch(0.52_0.20_270)]/50"
                  : "opacity-40"
              }`}>
                <span className="font-bold text-gold">{scores.gabriel}</span>
                <span className="font-semibold">Gabriel</span>
                <span className="h-3 w-3 rounded-full" style={{ background: "oklch(0.52 0.20 270)" }} />
              </div>
            </div>

            {/* Billiard table */}
            <div className="relative mx-auto aspect-[2/1] w-full overflow-hidden rounded-2xl border-[10px]"
              style={{
                background: "radial-gradient(ellipse at 50% 40%, oklch(0.44 0.12 150), oklch(0.28 0.08 150))",
                borderColor: "oklch(0.28 0.06 30)",
                boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {POCKETS.map((p, i) => (
                <div key={i} className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-8 sm:w-8"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, background: "#000", boxShadow: "inset 0 0 8px #000" }}
                />
              ))}

              {BALL_POSITIONS.map((pos, idx) => {
                const isPocketed = pocketed.has(idx);
                const isActive   = idx === activeBallIdx;
                const pocket     = POCKETS[idx < 5 ? 3 : 5];

                return (
                  <motion.div key={idx}
                    className="absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold text-white sm:h-12 sm:w-12 sm:text-sm"
                    style={{
                      left: `${pos.x}%`,
                      top:  `${pos.y}%`,
                      background: BALL_COLORS[idx],
                      boxShadow: isActive
                        ? `inset -3px -4px 6px rgba(0,0,0,0.4), inset 3px 3px 5px rgba(255,255,255,0.25), 0 0 18px ${BALL_COLORS[idx]}, 0 0 36px ${BALL_COLORS[idx]}88`
                        : "inset -3px -4px 6px rgba(0,0,0,0.4), inset 3px 3px 5px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.5)",
                    }}
                    animate={
                      isPocketed
                        ? { left: `${pocket.x}%`, top: `${pocket.y}%`, scale: 0, opacity: 0 }
                        : isActive && shaking
                          ? { x: [0, -10, 14, -12, 8, -4, 0], y: [0, 6, -8, 10, -4, 0] }
                          : { x: 0, y: 0 }
                    }
                    transition={isPocketed ? { duration: 0.55, ease: "easeIn" } : { duration: 0.45 }}
                  >
                    {idx + 1}
                  </motion.div>
                );
              })}
            </div>

            {/* Puzzle */}
            {activeWord && (
              <div className="space-y-4 rounded-2xl border border-[var(--gold)]/20 bg-card/50 p-5">
                <div className="text-center">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-foreground/40">indice</p>
                  <p className="font-display text-lg italic text-foreground/85">{activeWord.hint}</p>
                  <p className="mt-1 text-xs text-foreground/30">{activeWord.word.length} lettres</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => { if (!feedback && !transitioning) setInput(e.target.value.toUpperCase()); }}
                    onKeyDown={e => { if (e.key === "Enter") confirm(); }}
                    disabled={!!feedback || transitioning}
                    placeholder="· · · · ·"
                    maxLength={20}
                    className="w-full max-w-xs rounded-xl border bg-card/80 px-5 py-3 text-center text-2xl font-bold uppercase tracking-[0.3em] text-foreground placeholder:text-foreground/20 focus:outline-none disabled:opacity-50 transition-colors"
                    style={{
                      borderColor: feedback === "correct"
                        ? "oklch(0.65 0.22 140)"
                        : feedback === "wrong"
                          ? "oklch(0.65 0.22 20)"
                          : "oklch(0.6 0.15 80 / 0.3)",
                    }}
                  />

                  <AnimatePresence mode="wait">
                    {feedback ? (
                      <motion.p key={feedback}
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`text-sm font-semibold ${feedback === "correct" ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {feedback === "correct" ? "✓ Correct ! Balle embolsée." : `✗ Raté — c'était « ${activeWord.word} »`}
                      </motion.p>
                    ) : (
                      <motion.button key="confirm"
                        onClick={confirm}
                        disabled={!input.trim() || transitioning}
                        className="rounded-full bg-gold px-6 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground shadow-glow transition-opacity hover:opacity-90 disabled:opacity-30"
                      >
                        Confirmer
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <p className="text-center text-xs uppercase tracking-[0.2em] text-foreground/35">
              {transitioning ? "…" : `vez de ${currentPlayer === "manuela" ? "Manuela" : "Gabriel"}`}
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
