# lueboo retro art portfolio

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
full-size image. Listing stacks get theirs from the Etsy CDN automatically;
locally hosted zine pages need generated thumbnails. After adding or
reordering pages in `app/data/stacks.json`, run:

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
