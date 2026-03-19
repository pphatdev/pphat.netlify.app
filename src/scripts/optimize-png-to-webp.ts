#!/usr/bin/env node

import { readdir, mkdir, rm, stat } from "fs/promises";
import { dirname, extname, join, relative, resolve } from "path";
import sharp from "sharp";

type CliOptions = {
    inputDir: string;
    outputDir: string;
    quality: number;
    effort: number;
    lossless: boolean;
    overwrite: boolean;
    deleteOriginal: boolean;
};

type ConversionSummary = {
    scanned: number;
    converted: number;
    skipped: number;
    failed: number;
};

function printHelp() {
    console.log(`\nPNG -> WebP optimizer\n
Usage:
    npm run optimize:png:webp -- [options]\n
Options:
    --input <dir>        Source directory to scan recursively (default: public/assets)
    --output <dir>       Output directory (default: same as --input)
    --quality <1-100>    WebP quality (default: 82)
    --effort <0-6>       WebP encoding effort (default: 4)
    --lossless           Enable lossless WebP
    --overwrite          Overwrite existing .webp files
    --delete-original    Delete source .png after successful conversion
    --help               Show this help\n
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
    let quality = 82;
    let effort = 4;
    let lossless = false;
    let overwrite = false;
    let deleteOriginal = false;

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
            case "--effort":
                effort = parseNumber(argv[index + 1], effort, 0, 6);
                index += 1;
                break;
            case "--lossless":
                lossless = true;
                break;
            case "--overwrite":
                overwrite = true;
                break;
            case "--delete-original":
                deleteOriginal = true;
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

    return {
        inputDir,
        outputDir,
        quality,
        effort,
        lossless,
        overwrite,
        deleteOriginal,
    };
}

async function collectPngFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectPngFiles(fullPath)));
            continue;
        }

        if (entry.isFile() && extname(entry.name).toLowerCase() === ".png") {
            files.push(fullPath);
        }
    }

    return files;
}

function toWebpPath(sourceFile: string, options: CliOptions): string {
    const relativePath = relative(options.inputDir, sourceFile);
    return join(options.outputDir, relativePath.replace(/\.png$/i, ".webp"));
}

async function convertOne(sourceFile: string, options: CliOptions): Promise<"converted" | "skipped"> {
    const destinationFile = toWebpPath(sourceFile, options);
    await mkdir(dirname(destinationFile), { recursive: true });

    if (!options.overwrite) {
        try {
            const [sourceStats, destinationStats] = await Promise.all([
                stat(sourceFile),
                stat(destinationFile),
            ]);

            if (destinationStats.mtimeMs >= sourceStats.mtimeMs) {
                return "skipped";
            }
        } catch {
            // Destination doesn't exist yet, continue.
        }
    }

    await sharp(sourceFile)
        .rotate()
        .webp({
            quality: options.quality,
            effort: options.effort,
            lossless: options.lossless,
        })
        .toFile(destinationFile);

    if (options.deleteOriginal) {
        await rm(sourceFile);
    }

    return "converted";
}

async function run() {
    const options = parseArgs(process.argv.slice(2));
    const summary: ConversionSummary = {
        scanned: 0,
        converted: 0,
        skipped: 0,
        failed: 0,
    };

    console.log("Scanning:", options.inputDir);
    const sourceFiles = await collectPngFiles(options.inputDir);
    summary.scanned = sourceFiles.length;

    if (sourceFiles.length === 0) {
        console.log("No .png files found.");
        return;
    }

    console.log(`Found ${sourceFiles.length} PNG files.`);
    console.log("Output directory:", options.outputDir);

    for (const file of sourceFiles) {
        try {
            const result = await convertOne(file, options);
            if (result === "converted") {
                summary.converted += 1;
                console.log(`Converted: ${relative(process.cwd(), file)}`);
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

    console.log("\nSummary");
    console.log("- scanned:   ", summary.scanned);
    console.log("- converted: ", summary.converted);
    console.log("- skipped:   ", summary.skipped);
    console.log("- failed:    ", summary.failed);

    if (summary.failed > 0) {
        process.exitCode = 1;
    }
}

run().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("optimize-png-to-webp failed:", message);
    process.exit(1);
});
