# lueboo art portfolio

## Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

### Building for Production

Create a production build:

```bash
npm run build
```

## Content

`app/data/stacks.json` drives the whole site. Every stack is one of two types:

- `stack` — a set of standalone pieces listed by id in `itemIds`. Each piece
  gets its own `/item/:id` page, and Next walks the stack in `itemIds` order.
- `zine` — read page by page in a single viewer, from `pages`.

Piece ids in `itemIds` resolve against three sources, in order:
`EtsyListingsDownload.csv` (slugified title), `scavengerHunt.json`, then
`works.json`. Only CSV rows carry a `LISTING_ID`, so those are the pieces that
show a "Buy on Etsy" link; hunt pieces and `works.json` entries render the same
way without one. That's what lets a non-Etsy stack like Color behave exactly
like the Etsy-backed ones.

## Images

Raw scans and photos live in `originals/` (gitignored); only the optimized
`.webp` under `public/` is committed. To add artwork, drop the original in
`originals/<stack>/` and convert it:

```sh
magick originals/<stack>/<name>.heic -colorspace sRGB -resize 2000x2000 \
  -strip -quality 82 public/<stack>/<name>.webp
```

HEIC files from Apple devices carry a stale EXIF orientation tag that libheif
has already applied on decode — don't rotate or `-auto-orient` them, or they
come out sideways.

Stack previews render at 128px, so they use a smaller variant instead of the
full-size image. Etsy-backed pieces get theirs from the Etsy CDN
automatically; locally hosted images need generated thumbnails. After adding
or reordering zine pages in `app/data/stacks.json` or pieces in
`app/data/works.json`, run:

```sh
npm run thumbs
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

### Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.
