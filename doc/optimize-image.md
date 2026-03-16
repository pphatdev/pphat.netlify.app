# Image Optimization Guide (PNG to WebP)

This project includes a script to convert PNG images into optimized WebP files.

## Script

- Source: `src/scripts/optimize-png-to-webp.ts`
- NPM command: `npm run optimize:png:webp`

## Basic Usage

Run with default settings:

```bash
npm run optimize:png:webp
```

Default behavior:
- Scans `public/assets` recursively
- Writes `.webp` files in the same directory structure
- Skips files that are already up to date

## Important: Pass Arguments Correctly

When using custom options with an npm script, always use `--` before script arguments:

```bash
npm run optimize:png:webp -- --input public/assets/projects/red-ant-express.com.kh --output public/assets/projects/red-ant-express.com.kh
```

Without `--`, npm may swallow the arguments and the script can fail.

## Available Options

- `--input <dir>`: source directory to scan recursively
- `--output <dir>`: destination directory for generated `.webp` files
- `--quality <1-100>`: WebP quality (default: `82`)
- `--effort <0-6>`: encoder effort, higher = slower but better compression (default: `4`)
- `--lossless`: enable lossless WebP output
- `--overwrite`: overwrite existing `.webp` files
- `--delete-original`: delete `.png` files after successful conversion
- `--help`: show help

## Common Examples

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

## Output Summary

After execution, the script prints:
- scanned
- converted
- skipped
- failed

If `failed > 0`, the command exits with a non-zero code.

## Recommended Workflow

1. Start with a single folder using `--input`.
2. Verify generated `.webp` images in browser.
3. Use `--overwrite` only when you need to regenerate.
4. Use `--delete-original` only after visual validation.
