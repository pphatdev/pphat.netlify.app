# Image Optimization Guide

This project includes two image optimization scripts:

- `npm run optimize:png:webp`: convert PNG files into WebP
- `npm run optimize:webp`: re-optimize existing WebP files by directory

## Important: Pass Arguments Correctly

When using custom options with an npm script, always use `--` before script arguments:

```bash
npm run optimize:webp -- --input public/blogs/07-03-2026-kampot
```

Without `--`, npm may swallow the arguments and the script can fail.

## 1. PNG to WebP

Use this when your source files are PNG and you want to generate `.webp` versions.

- Source: `src/scripts/optimize-png-to-webp.ts`
- NPM command: `npm run optimize:png:webp`

### Basic Usage

```bash
npm run optimize:png:webp
```

Default behavior:
- Scans `public/assets` recursively
- Writes `.webp` files in the same directory structure
- Skips files that are already up to date

### Available Options

- `--input <dir>`: source directory to scan recursively
- `--output <dir>`: destination directory for generated `.webp` files
- `--quality <1-100>`: WebP quality (default: `82`)
- `--effort <0-6>`: encoder effort, higher = slower but better compression (default: `4`)
- `--lossless`: enable lossless WebP output
- `--overwrite`: overwrite existing `.webp` files
- `--delete-original`: delete `.png` files after successful conversion
- `--help`: show help

### Common Examples

Convert one project folder in place:

```bash
npm run optimize:png:webp -- --input public/assets/projects/pphat.netlify.app --output public/assets/projects/pphat.netlify.app
```

Convert with stronger compression:

```bash
npm run optimize:png:webp -- --input public/assets/projects/blog-leatsophat.vercel.app --quality 75 --effort 6
```

Create lossless WebP files:

```bash
npm run optimize:png:webp -- --input public/assets/projects --lossless
```

Overwrite existing output files:

```bash
npm run optimize:png:webp -- --input public/assets/projects --overwrite
```

Delete original PNG files after conversion:

```bash
npm run optimize:png:webp -- --input public/assets/projects --delete-original
```

### Output Summary

After execution, the script prints:
- scanned
- converted
- skipped
- failed

If `failed > 0`, the command exits with a non-zero code.

## 2. WebP by Directory

Use this when the images are already `.webp` and you want to compress them further in place or into another directory.

- Source: `src/scripts/optimize-webp-by-dir.ts`
- NPM command: `npm run optimize:webp`

### Basic Usage

```bash
npm run optimize:webp -- --input public/blogs/07-03-2026-kampot
```

Default behavior:
- Scans the given directory recursively for `.webp` files
- Optimizes files in place by default
- Keeps the same filenames and directory structure

### Available Options

- `--input <dir>`: source directory to scan recursively
- `--output <dir>`: destination directory for optimized `.webp` files
- `--quality <1-100>`: WebP quality (default: `78`)
- `--alpha-quality <0-100>`: alpha channel quality (default: `85`)
- `--effort <0-6>`: encoder effort, higher = slower but better compression (default: `6`)
- `--lossless`: enable lossless WebP output
- `--near-lossless`: enable near-lossless WebP output
- `--overwrite`: overwrite destination files even if they are newer than the source
- `--help`: show help

### Common Examples

Optimize one blog folder in place:

```bash
npm run optimize:webp -- --input public/blogs/07-03-2026-kampot
```

Optimize all blog assets with stronger compression:

```bash
npm run optimize:webp -- --input public/assets/blogs --quality 74 --effort 6
```

Write optimized files to a separate folder:

```bash
npm run optimize:webp -- --input public/assets/blogs --output public/assets/blogs-optimized --overwrite
```

Preserve more detail with near-lossless mode:

```bash
npm run optimize:webp -- --input public/assets/blogs --near-lossless
```

Use full lossless mode:

```bash
npm run optimize:webp -- --input public/assets/blogs --lossless
```

### Output Summary

After execution, the script prints:
- scanned
- optimized
- skipped
- failed
- bytes before
- bytes after
- saved bytes
- reduction percentage

If `failed > 0`, the command exits with a non-zero code.

## Recommended Workflow

1. Start with a single folder using `--input`.
2. For existing WebP images, prefer `npm run optimize:webp` before regenerating assets.
3. Verify visual quality in browser after changing `--quality`, `--lossless`, or `--near-lossless`.
4. Use a separate `--output` directory when comparing quality and file size side by side.
5. Use stronger compression only after checking that text, gradients, and transparent edges still look clean.
