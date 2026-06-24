import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import games from "@/content/games.json";

type Cell = { r: number; c: number; ch: string };

const SIZE = 12;

function buildGrid(words: string[]) {
  const grid: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  const placements: { word: string; cells: { r: number; c: number }[] }[] = [];
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
  ];

  const tryPlace = (word: string) => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      const endR = r + dr * (word.length - 1);
      const endC = c + dc * (word.length - 1);
      if (endR < 0 || endR >= SIZE || endC < 0 || endC >= SIZE) continue;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        if (grid[rr][cc] && grid[rr][cc] !== word[i]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      const cells: { r: number; c: number }[] = [];
      for (let i = 0; i < word.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        grid[rr][cc] = word[i];
        cells.push({ r: rr, c: cc });
      }
      placements.push({ word, cells });
      return true;
    }
    return false;
  };

  for (const w of words) tryPlace(w);

  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) grid[r][c] = alpha[Math.floor(Math.random() * alpha.length)];
    }
  }
  return { grid, placements };
}

function cellKey(r: number, c: number) {
  return `${r}-${c}`;
}

export function WordSearchGame() {
  const words = games.wordSearch.words.map((w) => w.toUpperCase());
  const [{ grid, placements }, setBoard] = useState(() => buildGrid(words));
  const [selection, setSelection] = useState<Cell[]>([]);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [pop, setPop] = useState<string | null>(null);

  useEffect(() => {
    // re-roll grid only once on mount
  }, []);

  const clickCell = (r: number, c: number) => {
    const ch = grid[r][c];
    const last = selection[selection.length - 1];
    if (last && last.r === r && last.c === c) {
      setSelection(selection.slice(0, -1));
      return;
    }
    const next = [...selection, { r, c, ch }];
    setSelection(next);
    const word = next.map((s) => s.ch).join("");
    const match = placements.find((p) => p.word === word && !foundWords.has(p.word));
    if (match) {
      const nf = new Set(foundCells);
      match.cells.forEach((c) => nf.add(cellKey(c.r, c.c)));
      setFoundCells(nf);
      setFoundWords(new Set([...foundWords, match.word]));
      setPop(match.word);
      setSelection([]);
      setTimeout(() => setPop(null), 1200);
    } else if (next.length > 10) {
      setSelection([]);
    }
  };

  const reset = () => {
    setBoard(buildGrid(words));
    setSelection([]);
    setFoundCells(new Set());
    setFoundWords(new Set());
  };

  const selSet = useMemo(() => new Set(selection.map((s) => cellKey(s.r, s.c))), [selection]);
  const allFound = foundWords.size === words.length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="relative">
        <div
          className="mx-auto grid w-full max-w-[480px] gap-1 rounded-xl border border-[var(--gold)]/15 bg-card/60 p-3"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((ch, c) => {
              const k = cellKey(r, c);
              const isFound = foundCells.has(k);
              const isSel = selSet.has(k);
              return (
                <button
                  key={k}
                  onClick={() => clickCell(r, c)}
                  className={`aspect-square rounded text-[10px] font-bold sm:text-xs transition-all ${
                    isFound
                      ? "bg-[oklch(0.5_0.18_140)] text-white shadow-[0_0_12px_oklch(0.6_0.2_140/0.6)]"
                      : isSel
                        ? "bg-gold text-primary-foreground"
                        : "bg-background/40 text-foreground/80 hover:bg-background/70"
                  }`}
                >
                  {ch}
                </button>
              );
            }),
          )}
        </div>
        <AnimatePresence>
          {pop && (
            <motion.div
              key={pop}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.5_0.18_140)] px-6 py-3 text-2xl font-bold text-white shadow-glow"
            >
              ✓ {pop}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-xl border border-[var(--gold)]/15 bg-card/40 p-5 lg:w-64">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold/70">Encontre</p>
        <ul className="space-y-1.5">
          {words.map((w) => (
            <li
              key={w}
              className={`text-sm transition-all ${
                foundWords.has(w) ? "text-[oklch(0.7_0.18_140)] line-through" : "text-foreground/85"
              }`}
            >
              {w}
            </li>
          ))}
        </ul>
        {allFound && (
          <p className="mt-4 font-display text-lg italic text-gold">Todas as palavras. Como você.</p>
        )}
        <button
          onClick={reset}
          className="mt-4 w-full rounded-md border border-[var(--gold)]/30 px-3 py-1.5 text-xs uppercase tracking-wider text-gold hover:bg-[var(--gold)]/10"
        >
          Embaralhar
        </button>
      </div>
    </div>
  );
}
