import { useState, useEffect } from "react";

const links = [
  { href: "#travels", label: "Travels" },
  { href: "#statistics", label: "Statistics" },
  { href: "#games", label: "Games" },
  { href: "#final", label: "Final Chapter" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
      style={{
        background: scrolled ? "oklch(1 0 0 / 0.8)" : "transparent",
        borderBottom: scrolled ? "1px solid oklch(0.52 0.22 255 / 0.18)" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="font-display text-xl tracking-wide text-gradient-gold">
          Nossa História
        </a>
        <ul className="hidden items-center gap-8 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="text-gold sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>
      {open && (
        <div className="border-t border-[var(--gold)]/15 bg-background/95 px-5 py-4 sm:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm uppercase tracking-[0.18em] text-foreground/80"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
