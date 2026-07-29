export const MESSAGE_SEARCH_HAS_FILTERS = [
  "link",
  "embed",
  "file",
  "image",
  "video",
  "sticker",
] as const;

export type MessageSearchHasFilter = (typeof MESSAGE_SEARCH_HAS_FILTERS)[number];

export interface ParsedMessageSearchQuery {
  text: string;
  from?: string;
  in?: string;
  mentions?: string;
  has: MessageSearchHasFilter[];
  pinned?: boolean;
  before?: string;
  after?: string;
}

const MODIFIER_PATTERN =
  /(?:^|\s)(from|in|mentions|has|pinned|before|after):(?:"([^"]+)"|(\S+))/gi;

const HAS_FILTER_SET = new Set<string>(MESSAGE_SEARCH_HAS_FILTERS);

function formatModifier(key: string, value: string) {
  return /\s/.test(value) ? `${key}:"${value}"` : `${key}:${value}`;
}

export function parseMessageSearchQuery(raw: string): ParsedMessageSearchQuery {
  const parsed: ParsedMessageSearchQuery = {
    text: "",
    has: [],
  };

  let text = raw.trim();
  let match: RegExpExecArray | null;

  MODIFIER_PATTERN.lastIndex = 0;
  while ((match = MODIFIER_PATTERN.exec(raw)) !== null) {
    const key = match[1].toLowerCase();
    const value = (match[2] ?? match[3] ?? "").trim();
    if (!value) continue;

    switch (key) {
      case "from":
        parsed.from = value;
        break;
      case "in":
        parsed.in = value;
        break;
      case "mentions":
        parsed.mentions = value;
        break;
      case "has": {
        const normalized = value.toLowerCase();
        if (HAS_FILTER_SET.has(normalized)) {
          parsed.has.push(normalized as MessageSearchHasFilter);
        }
        break;
      }
      case "pinned":
        parsed.pinned = value.toLowerCase() === "true";
        break;
      case "before":
        parsed.before = value;
        break;
      case "after":
        parsed.after = value;
        break;
    }
  }

  MODIFIER_PATTERN.lastIndex = 0;
  text = text.replace(MODIFIER_PATTERN, " ").replace(/\s+/g, " ").trim();
  parsed.text = text;

  parsed.has = [...new Set(parsed.has)];
  return parsed;
}

export function buildMessageSearchQuery(parsed: ParsedMessageSearchQuery): string {
  const parts: string[] = [];

  if (parsed.text.trim()) {
    parts.push(parsed.text.trim());
  }
  if (parsed.from) {
    parts.push(formatModifier("from", parsed.from));
  }
  if (parsed.in) {
    parts.push(formatModifier("in", parsed.in));
  }
  if (parsed.mentions) {
    parts.push(formatModifier("mentions", parsed.mentions));
  }
  for (const filter of parsed.has) {
    parts.push(`has:${filter}`);
  }
  if (parsed.pinned) {
    parts.push("pinned:true");
  }
  if (parsed.before) {
    parts.push(formatModifier("before", parsed.before));
  }
  if (parsed.after) {
    parts.push(formatModifier("after", parsed.after));
  }

  return parts.join(" ").trim();
}

export function isMessageSearchQueryReady(raw: string): boolean {
  const parsed = parseMessageSearchQuery(raw);
  if (parsed.text.trim().length >= 2) return true;

  return Boolean(
    parsed.from ||
      parsed.in ||
      parsed.mentions ||
      parsed.has.length > 0 ||
      parsed.pinned ||
      parsed.before ||
      parsed.after,
  );
}

export function setMessageSearchModifier(
  raw: string,
  modifier: "from" | "in" | "mentions" | "pinned" | "before" | "after",
  value: string | boolean | undefined,
): string {
  const parsed = parseMessageSearchQuery(raw);

  switch (modifier) {
    case "from":
      parsed.from = typeof value === "string" ? value : undefined;
      break;
    case "in":
      parsed.in = typeof value === "string" ? value : undefined;
      break;
    case "mentions":
      parsed.mentions = typeof value === "string" ? value : undefined;
      break;
    case "pinned":
      parsed.pinned = value === true ? true : undefined;
      break;
    case "before":
      parsed.before = typeof value === "string" ? value : undefined;
      break;
    case "after":
      parsed.after = typeof value === "string" ? value : undefined;
      break;
  }

  return buildMessageSearchQuery(parsed);
}

export function toggleMessageSearchHasFilter(
  raw: string,
  filter: MessageSearchHasFilter,
): string {
  const parsed = parseMessageSearchQuery(raw);
  const index = parsed.has.indexOf(filter);

  if (index >= 0) {
    parsed.has.splice(index, 1);
  } else {
    parsed.has.push(filter);
  }

  return buildMessageSearchQuery(parsed);
}

export function hasMessageSearchHasFilter(
  raw: string,
  filter: MessageSearchHasFilter,
): boolean {
  return parseMessageSearchQuery(raw).has.includes(filter);
}
