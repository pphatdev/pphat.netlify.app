#!/usr/bin/env node

import { mkdir, readdir, stat, writeFile } from "fs/promises";
import { dirname, extname, join, relative, resolve } from "path";
import sharp from "sharp";

type CliOptions = {
    inputDir: string;
    outputDir: string;
    quality: number;
    effort: number;
    alphaQuality: number;
    lossless: boolean;
    nearLossless: boolean;
    overwrite: boolean;
};

type OptimizationSummary = {
    scanned: number;
    optimized: number;
    skipped: number;
    failed: number;
    bytesBefore: number;
    bytesAfter: number;
};

function printHelp() {
    console.log(`\nWebP optimizer by directory\n
Usage:
    npm run optimize:webp -- [options]\n
Options:
    --input <dir>           Source directory to scan recursively (default: public/assets)
    --output <dir>          Output directory (default: same as --input)
    --quality <1-100>       WebP quality (default: 78)
    --alpha-quality <0-100> Alpha channel quality (default: 85)
    --effort <0-6>          WebP encoding effort (default: 6)
    --lossless              Enable lossless WebP
    --near-lossless         Enable near-lossless WebP
    --overwrite             Overwrite destination even if it is newer than source
    --help                  Show this help\n
Examples:
    npm run optimize:webp -- --input public/blogs/07-03-2026-kampot
    npm run optimize:webp -- --input public/assets/blogs --quality 74 --effort 6
    npm run optimize:webp -- --input public/assets/blogs --output public/assets/blogs-optimized --overwrite\n
`);
}

function parseNumber(value: string | undefined, fallback: number, min: number, max: number): number {
    if (!value) return fallback;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < min || numeric > max) {
        throw new Error(`Invalid numeric value: ${value}. Expected ${min}-${max}.`);
    }
    return Math.round(numeric);
}

function parseArgs(argv: string[]): CliOptions {
    let inputDir = resolve(process.cwd(), "public", "assets");
    let outputDir = inputDir;
    let quality = 78;
    let effort = 6;
    let alphaQuality = 85;
    let lossless = false;
    let nearLossless = false;
    let overwrite = false;

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        switch (arg) {
            case "--input": {
                const value = argv[index + 1];
                if (!value) throw new Error("--input requires a directory path.");
                inputDir = resolve(process.cwd(), value);
                if (outputDir === resolve(process.cwd(), "public", "assets")) {
                    outputDir = inputDir;
                }
                index += 1;
                break;
            }
            case "--output": {
                const value = argv[index + 1];
                if (!value) throw new Error("--output requires a directory path.");
                outputDir = resolve(process.cwd(), value);
                index += 1;
                break;
            }
            case "--quality":
                quality = parseNumber(argv[index + 1], quality, 1, 100);
                index += 1;
                break;
            case "--alpha-quality":
                alphaQuality = parseNumber(argv[index + 1], alphaQuality, 0, 100);
                index += 1;
                break;
            case "--effort":
                effort = parseNumber(argv[index + 1], effort, 0, 6);
                index += 1;
                break;
            case "--lossless":
                lossless = true;
                break;
            case "--near-lossless":
                nearLossless = true;
                break;
            case "--overwrite":
                overwrite = true;
                break;
            case "--help":
            case "-h":
                printHelp();
                process.exit(0);
                break;
            default:
                throw new Error(`Unknown argument: ${arg}`);
        }
    }

    if (lossless && nearLossless) {
        throw new Error("--lossless and --near-lossless cannot be used together.");
    }

    return {
        inputDir,
        outputDir,
        quality,
        effort,
        alphaQuality,
        lossless,
        nearLossless,
        overwrite,
    };
}

async function collectWebpFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectWebpFiles(fullPath)));
            continue;
        }

        if (entry.isFile() && extname(entry.name).toLowerCase() === ".webp") {
            files.push(fullPath);
        }
    }

    return files;
}

function toOutputPath(sourceFile: string, options: CliOptions): string {
    const relativePath = relative(options.inputDir, sourceFile);
    return join(options.outputDir, relativePath);
}

async function optimizeOne(sourceFile: string, options: CliOptions): Promise<"optimized" | "skipped"> {
    const destinationFile = toOutputPath(sourceFile, options);
    await mkdir(dirname(destinationFile), { recursive: true });
    const isInPlace = destinationFile === sourceFile;

    if (!options.overwrite && !isInPlace) {
        try {
            const [sourceStats, destinationStats] = await Promise.all([
                stat(sourceFile),
                stat(destinationFile),
            ]);

            if (destinationStats.mtimeMs >= sourceStats.mtimeMs && destinationStats.size > 0) {
                return "skipped";
            }
        } catch {
            // Destination doesn't exist yet, continue.
        }
    }

    const pipeline = sharp(sourceFile).rotate().webp({
        quality: options.quality,
        alphaQuality: options.alphaQuality,
        effort: options.effort,
        lossless: options.lossless,
        nearLossless: options.nearLossless,
    });

    if (isInPlace) {
        const buffer = await pipeline.toBuffer();
        await writeFile(destinationFile, buffer);
    } else {
        await pipeline.toFile(destinationFile);
    }

    return "optimized";
}

async function run() {
    const options = parseArgs(process.argv.slice(2));
    const summary: OptimizationSummary = {
        scanned: 0,
        optimized: 0,
        skipped: 0,
        failed: 0,
        bytesBefore: 0,
        bytesAfter: 0,
    };

    console.log("Scanning:", options.inputDir);
    const sourceFiles = await collectWebpFiles(options.inputDir);
    summary.scanned = sourceFiles.length;

    if (sourceFiles.length === 0) {
        console.log("No .webp files found.");
        return;
    }

    console.log(`Found ${sourceFiles.length} WebP files.`);
    console.log("Output directory:", options.outputDir);

    for (const file of sourceFiles) {
        try {
            const beforeStats = await stat(file);
            const result = await optimizeOne(file, options);
            const outputFile = toOutputPath(file, options);
            const afterStats = await stat(outputFile);

            summary.bytesBefore += beforeStats.size;
            summary.bytesAfter += afterStats.size;

            if (result === "optimized") {
                summary.optimized += 1;
                const savedBytes = beforeStats.size - afterStats.size;
                console.log(`Optimized: ${relative(process.cwd(), file)} (${savedBytes} bytes)`);
            } else {
                summary.skipped += 1;
                console.log(`Skipped:   ${relative(process.cwd(), file)} (up-to-date)`);
            }
        } catch (error) {
            summary.failed += 1;
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Failed:    ${relative(process.cwd(), file)} -> ${message}`);
        }
    }

    const deltaBytes = summary.bytesBefore - summary.bytesAfter;
    const reduction = summary.bytesBefore > 0
        ? ((deltaBytes / summary.bytesBefore) * 100).toFixed(2)
        : "0.00";

    console.log("\nSummary");
    console.log("- scanned:      ", summary.scanned);
    console.log("- optimized:    ", summary.optimized);
    console.log("- skipped:      ", summary.skipped);
    console.log("- failed:       ", summary.failed);
    console.log("- bytes before: ", summary.bytesBefore);
    console.log("- bytes after:  ", summary.bytesAfter);
    console.log("- saved bytes:  ", deltaBytes);
    console.log("- reduction:    ", `${reduction}%`);

    if (summary.failed > 0) {
        process.exitCode = 1;
    }
}

run().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("optimize-webp-by-dir failed:", message);
    process.exit(1);
});