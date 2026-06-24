# Nossa História — 2 anos do primeiro beijo

Um livro interativo, romântico e responsivo para celebrar 2 anos do primeiro beijo. Construído com **React + TypeScript**, **TanStack Start**, **Tailwind CSS v4** e **Framer Motion**, em uma estética dark com tons dourados quentes inspirada em sites de storytelling da Apple.

## ✨ Seções

- **Hero + Livro animado**: ao abrir o site, o "Book of Love do Dr. Hakim" abre com uma animação de scrapbook.
- **Travels**: mapa-múndi interativo com zoom, pinos vermelhos para nossas casas (Paris, Ribeirão Preto) e azuis para visitas, com modal estilo passaporte/carimbo.
- **Statistics**: contadores animados (dias juntos, voos, km, vídeo-chamadas, etc.).
- **Games — "Level: Us"**: 4 mini-jogos
  1. Caça-Palavras (DESTINO, PRINCESA, COMEÇO, BEIJO, LONDRES, FESTA, AMOR, CONEXÃO)
  2. Sinuca Challenge (encaçapar bolas em ordem)
  3. Tennis Match (perguntas sobre o casal, com "Perfect match." no fim)
  4. F1: Nossa Pista (linha do tempo com cartas em envelope para cada marco)
- **Final Chapter — "To be continued..."**: céu cheio de estrelas; cada estrela revela um desejo, com efeito de máquina de escrever.

---

## 🖊️ Como editar textos

Todo o conteúdo vive em **`src/content/`** como JSON:

| Arquivo | O que controla |
| --- | --- |
| `book.json` | Capa do livro e carta interna do prólogo. |
| `travels.json` | Cidades, tipo (`home` ou `visit`), coordenadas `[longitude, latitude]`, notas e foto opcional. |
| `statistics.json` | Cartões de números (label, valor, sufixo, ícone). Ícones disponíveis: `heart`, `plane`, `globe`, `video`, `clock`, `coffee`. |
| `games.json` | Palavras do caça-palavras, perguntas do tênis e marcos da F1. |
| `final.json` | Lista de desejos das estrelas e frase de encerramento. |

Basta abrir o JSON, alterar o texto, salvar — o site recompila automaticamente no `dev` e atualiza no próximo deploy.

### Adicionar uma cidade

```json
{
  "id": "lisboa",
  "name": "Lisboa",
  "country": "Portugal",
  "type": "visit",        // "home" (vermelho) ou "visit" (azul)
  "coords": [-9.1393, 38.7223],  // [lng, lat]
  "note": "Próxima parada.",
  "photo": "/images/lisboa.jpg"  // opcional
}
```

---

## 📸 Como subir fotos

1. Coloque as imagens em **`public/images/`** (crie a pasta se não existir).
2. Referencie no JSON com caminho absoluto:
   - Para uma cidade: `"photo": "/images/paris.jpg"` em `travels.json`.
   - Para outros lugares (envelope, capa do livro), edite o JSON correspondente ou o componente.
3. Tamanho recomendado: até **1600 px** de largura, formato `jpg` ou `webp` para manter o site leve.

> Tudo dentro de `public/` é servido como estático; o caminho `/images/foo.jpg` no JSON resolve para `public/images/foo.jpg`.

---

## 🚀 Deploy automático no GitHub Pages

O projeto inclui o workflow **`.github/workflows/deploy.yml`** que:

1. Roda em cada push para a branch `main`.
2. Instala dependências com `bun install`.
3. Gera o build estático (`bun run build`).
4. Publica o conteúdo da pasta de saída em GitHub Pages.

### Passo a passo (primeira vez)

1. Crie um repositório no GitHub, por exemplo `our-story`.
2. Faça push do projeto para a branch `main`.
3. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Em **Settings → Actions → General → Workflow permissions**, marque **Read and write permissions**.
5. Cada push em `main` publica automaticamente em:

   ```
   https://SEU_USUARIO.github.io/our-story/
   ```

6. Caso o repositório se chame `SEU_USUARIO.github.io`, o site vai para a raiz `https://SEU_USUARIO.github.io/`.

### Sobre o base path

O TanStack Start é, por padrão, um app full-stack. Para hospedar **estático** no GitHub Pages, o workflow desabilita o nitro/SSR e publica os assets gerados. Se o site for servido em subpasta (`/our-story/`), defina a variável de ambiente no workflow:

```yaml
env:
  BASE_PATH: /our-story/
```

> Se algo não aparecer ao acessar a URL final, verifique:
> - se Pages está apontando para "GitHub Actions" (não branch);
> - se a aba **Actions** do repositório mostra o workflow como verde;
> - se o `BASE_PATH` confere com o nome do repositório.

---

## 📱 Como gerar um QR Code para a URL

Use qualquer um dos serviços abaixo (não precisa instalar nada):

### Opção 1 — Linha de comando (mais bonito)

```bash
npx qrcode "https://SEU_USUARIO.github.io/our-story" -o qr.png -t png -w 600 -s 4
```

Isso gera um arquivo `qr.png` que você pode imprimir, colar num quadro ou colocar num cartão.

### Opção 2 — Site

1. Abra: <https://qrcode.tec-it.com/> ou <https://www.qr-code-generator.com/>.
2. Cole a URL final do seu site.
3. Escolha cor (sugestão: dourado `#D4A75A` sobre fundo escuro `#1A1310`) e baixe em PNG/SVG.

### Opção 3 — API direta (link de imagem)

```
https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https%3A%2F%2FSEU_USUARIO.github.io%2Four-story
```

Abra esse link no navegador para baixar o QR code imediatamente.

---

## 🛠️ Desenvolvimento local

```bash
bun install
bun run dev
# abra http://localhost:8080
```

Estrutura principal:

```
src/
├── content/            # textos editáveis (JSON)
├── components/         # seções e jogos
│   ├── games/
│   ├── BookDialog.tsx
│   ├── Header.tsx
│   ├── TravelsSection.tsx
│   ├── StatisticsSection.tsx
│   ├── GamesSection.tsx
│   └── FinalChapter.tsx
├── routes/             # rotas TanStack
│   ├── __root.tsx
│   └── index.tsx
└── styles.css          # design system (tokens, dourado, paleta)
```

---

## ❤️ Créditos

Feito com amor — 01.07.2024 → para sempre.
