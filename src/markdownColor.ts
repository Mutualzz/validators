export const MARKDOWN_COLOR_PRESETS: Record<string, string> = {
    red: "#ed4245",
    orange: "#e67e22",
    yellow: "#f1c40f",
    green: "#57f287",
    blue: "#3498db",
    purple: "#9b59b6",
    pink: "#eb459e",
    gray: "#95a5a6",
};

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const normalizeHex = (hex: string): string => {
    const raw = hex.slice(1).toLowerCase();
    if (raw.length === 3) {
        return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`;
    }
    return `#${raw}`;
};

export const resolveMarkdownTextColor = (input: string): string | null => {
    const value = input.trim();
    if (!value) return null;

    const preset = MARKDOWN_COLOR_PRESETS[value.toLowerCase()];
    if (preset) return preset;

    if (!HEX_COLOR_REGEX.test(value)) return null;
    return normalizeHex(value);
};
