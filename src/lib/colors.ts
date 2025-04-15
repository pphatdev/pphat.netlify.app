import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

// Adding TypeScript interface for the plugin parameter
interface PluginParams {
    addBase: (base: Record<string, Record<string, string>>) => void;
    theme: (path: string) => Record<string, string>;
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
export default function addVariablesForColors({ addBase, theme }: PluginParams) {
    const allColors = flattenColorPalette(theme("colors"));
    const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val as string])
    );

    addBase({
        ":root": newVars,
    });
}
