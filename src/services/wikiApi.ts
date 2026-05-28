const BASE_URL = 'https://slime-rng.fandom.com/api.php';

export type SlimeType =
  | 'Base' | 'Big' | 'Huge' | 'Shiny' | 'Inverted'
  | 'BigShiny' | 'BigInverted' | 'BigShinyInverted'
  | 'HugeShiny' | 'HugeInverted' | 'HugeShinyInverted'
  | 'ShinyInverted';

export type SlimeImageMap = Record<string, Partial<Record<SlimeType, string>>>;

// Prefixes for the 5 base types — used in filename guessing
const TYPE_PREFIXES: Record<Extract<SlimeType, 'Base' | 'Big' | 'Huge' | 'Shiny' | 'Inverted'>, string> = {
  Base:     '',
  Big:      'big ',
  Huge:     'huge ',
  Shiny:    'shiny ',
  Inverted: 'inverted ',
};

// For combos we try multiple prefix orderings since wiki naming is inconsistent
const COMBO_PREFIXES: Record<string, string[]> = {
  BigShiny:          ['big shiny ',          'shiny big '         ],
  BigInverted:       ['big inverted ',        'inverted big '      ],
  BigShinyInverted:  ['big shiny inverted ',  'shiny inverted big ',  'inverted shiny big ' ],
  HugeShiny:         ['huge shiny ',          'shiny huge '        ],
  HugeInverted:      ['huge inverted ',       'inverted huge '     ],
  HugeShinyInverted: ['huge shiny inverted ', 'shiny huge inverted ', 'inverted huge shiny '],
  ShinyInverted:     ['shiny inverted ',      'inverted shiny '    ],
};

// Keywords each combo type must contain — used for fuzzy fallback search
const COMBO_KEYWORDS: Record<string, string[]> = {
  BigShiny:          ['big', 'shiny'],
  BigInverted:       ['big', 'inverted'],
  BigShinyInverted:  ['big', 'shiny', 'inverted'],
  HugeShiny:         ['huge', 'shiny'],
  HugeInverted:      ['huge', 'inverted'],
  HugeShinyInverted: ['huge', 'shiny', 'inverted'],
  ShinyInverted:     ['shiny', 'inverted'],
};

// ─── wiki api fetch utility ──────────────────────────────────────────────────

async function mwGet(params: Record<string, string>) {
  const qs = new URLSearchParams({ ...params, format: 'json', formatversion: '2', origin: '*' });
  const res = await fetch(`${BASE_URL}?${qs}`);
  if (!res.ok) throw new Error(`Wiki API ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`MediaWiki: ${JSON.stringify(data.error)}`);
  return data;
}

// ─── download the full wiki image index once ────────────────────────────────
// This is faster than individual lookups — we get every file URL in ~5 requests
// then all matching is instant local string lookups.

async function fetchAllWikiImages(): Promise<Record<string, string>> {
  const fileToUrl: Record<string, string> = {};
  let aicontinue: string | undefined;

  console.log('[wiki] Downloading image index...');

  for (let i = 0; i < 25; i++) {
    const params: Record<string, string> = {
      action: 'query',
      list: 'allimages',
      aiprop: 'url',
      ailimit: 'max',
    };
    if (aicontinue) params.aicontinue = aicontinue;

    const data = await mwGet(params);

    for (const img of (data.query?.allimages ?? [])) {
      if (img.title && img.url) {
        // Store lowercased so all our lookups can be case-insensitive
        fileToUrl[img.title.toLowerCase().trim()] = img.url;
      }
    }

    if (data.continue?.aicontinue) {
      aicontinue = data.continue.aicontinue;
    } else {
      break;
    }
  }

  console.log(`[wiki] Cached ${Object.keys(fileToUrl).length} files`);
  return fileToUrl;
}

// ─── public API ─────────────────────────────────────────────────────────────

export async function fetchCategoryMembers(categoryName: string): Promise<string[]> {
  const data = await mwGet({
    action: 'query',
    list: 'categorymembers',
    cmtitle: `Category:${categoryName}`,
    cmlimit: 'max',
  });
  return (data.query?.categorymembers ?? []).map((m: { title: string }) => m.title);
}

export async function fetchSlimeImages(slimeNames: string[]): Promise<SlimeImageMap> {
  if (!slimeNames.length) return {};

  const wikiFiles = await fetchAllWikiImages();
  const result: SlimeImageMap = {};

  for (const name of slimeNames) {
    const entry: Partial<Record<SlimeType, string>> = {};
    const cleanName = name.toLowerCase().trim();

    // "Scorchy / Boomy" → try both "scorchy" and "boomy" as filename parts
    const nameParts = name.includes('/')
      ? name.split('/').map(p => p.trim().toLowerCase())
      : [cleanName];

    // ── Helper: try common filename patterns for a given prefix + name ────────
    // e.g. prefix="big ", name="goopy" → tries "file:big goopy.png" etc.
    const tryFind = (prefix: string, namePart: string): string | null => {
      const candidates = [
        `file:${prefix}${namePart}.png`,
        `file:${prefix}${namePart}.gif`,
        `file:${prefix}${namePart} slime.png`,
        `file:${prefix}${namePart} slime.gif`,
      ];
      return candidates.find(c => wikiFiles[c]) ? wikiFiles[candidates.find(c => wikiFiles[c])!] : null;
    };

    // Try all name parts for a given prefix (handles "Scorchy / Boomy")
    const findWithPrefix = (prefix: string): string | null => {
      for (const part of nameParts) {
        const url = tryFind(prefix, part);
        if (url) return url;
      }
      return null;
    };

    // ── Helper: fuzzy keyword search across the entire file index ─────────────
    // Used as a last resort when exact prefix matching fails.
    // Finds any file whose name contains all required keywords + the slime name.
    const fuzzyFind = (keywords: string[]): string | null => {
      const allKeywords = [...keywords, nameParts[0]]; // always include slime name
      const match = Object.keys(wikiFiles).find(key =>
        (key.endsWith('.png') || key.endsWith('.gif')) &&
        allKeywords.every(kw => key.includes(kw))
      );
      return match ? wikiFiles[match] : null;
    };

    // ── 1. Base type ──────────────────────────────────────────────────────────
    let baseUrl = findWithPrefix('');
    // Extra fallback: find any file with the slime name that has no mutation keywords
    if (!baseUrl) {
      const fallback = Object.keys(wikiFiles).find(k =>
        nameParts.some(p => k.includes(p)) &&
        (k.endsWith('.png') || k.endsWith('.gif')) &&
        !k.includes('big') && !k.includes('huge') &&
        !k.includes('shiny') && !k.includes('inverted')
      );
      if (fallback) baseUrl = wikiFiles[fallback];
    }
    if (baseUrl) entry.Base = baseUrl;

    // ── 2. Single mutation types: Big, Huge, Shiny, Inverted ─────────────────
    for (const [type, prefix] of Object.entries(TYPE_PREFIXES) as [SlimeType, string][]) {
      if (type === 'Base') continue;
      const url = findWithPrefix(prefix);
      if (url) entry[type] = url;
    }

    // ── 3. Combo types ────────────────────────────────────────────────────────
    for (const [comboKey, prefixes] of Object.entries(COMBO_PREFIXES)) {
      let comboUrl: string | null = null;

      // Try each prefix ordering first (exact match)
      for (const prefix of prefixes) {
        comboUrl = findWithPrefix(prefix);
        if (comboUrl) break;
      }

      // If exact match failed, do a fuzzy keyword search as fallback
      // e.g. looks for any file containing "shiny", "inverted", and "goopy"
      if (!comboUrl) {
        comboUrl = fuzzyFind(COMBO_KEYWORDS[comboKey]);
      }

      if (comboUrl) entry[comboKey as SlimeType] = comboUrl;
    }

    result[cleanName] = entry;
  }

  // Log how many combo images were found
  const comboKeys = Object.keys(COMBO_PREFIXES) as SlimeType[];
  for (const comboKey of comboKeys) {
    const found = Object.values(result).filter(e => e[comboKey]).length;
    if (found > 0) console.log(`[wiki] ${comboKey}: ${found} images found`);
  }

  return result;
}