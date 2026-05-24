const BASE_URL = 'https://slime-rng.fandom.com/api.php';
const BATCH_SIZE = 50;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function mwGet(params: Record<string, string>) {
  const qs = new URLSearchParams({
    ...params,
    format: 'json',
    formatversion: '2',
    origin: '*',
  });
  const res = await fetch(`${BASE_URL}?${qs}`);
  if (!res.ok) throw new Error(`Wiki API ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`MediaWiki error: ${JSON.stringify(data.error)}`);
  return data;
}

export async function fetchCategoryMembers(categoryName: string): Promise<string[]> {
  const data = await mwGet({
    action: 'query',
    list: 'categorymembers',
    cmtitle: `Category:${categoryName}`,
    cmlimit: 'max',
  });
  const members = data.query?.categorymembers ?? [];
  console.log(`[wiki] Category "${categoryName}" → ${members.length} pages`);
  return members.map((m: { title: string }) => m.title);
}

type WikiPage = {
  title: string;
  missing?: true;
  images?: { title: string }[];
  imageinfo?: { url: string }[];
};

/** 
 * Resolves File: titles → CDN URLs in batches.
 */
async function resolveFileUrls(fileTitles: string[]): Promise<Record<string, string>> {
  const fileToUrl: Record<string, string> = {};
  for (const batch of chunk(fileTitles, BATCH_SIZE)) {
    const data = await mwGet({
      action: 'query',
      titles: batch.join('|'),
      prop: 'imageinfo',
      iiprop: 'url',
    });
    const pages: WikiPage[] = data.query?.pages ?? [];
    for (const page of pages) {
      if ('missing' in page) continue;
      const url = page.imageinfo?.[0]?.url;
      if (url) fileToUrl[page.title.toLowerCase()] = url;
    }
  }
  return fileToUrl;
}

/**
 * Strategy A: prop=images on the slime's wiki page.
 * Returns pageTitle (lower) → File: title.
 */
async function strategyPageImages(titles: string[]): Promise<Record<string, string>> {
  const pageToFile: Record<string, string> = {};
  for (const batch of chunk(titles, BATCH_SIZE)) {
    const data = await mwGet({
      action: 'query',
      titles: batch.join('|'),
      prop: 'images',
      imlimit: '20',
      redirects: '1',
    });
    const pages: WikiPage[] = data.query?.pages ?? [];
    for (const page of pages) {
      if ('missing' in page || !page.images?.length) continue;
      const baseName = page.title.split('/')[0].trim().toLowerCase();
      const best =
        page.images.find(img => img.title.toLowerCase().includes(baseName)) ??
        page.images.find(img => /\.(png|gif|webp)$/i.test(img.title));
      if (best) pageToFile[page.title.toLowerCase()] = best.title;
    }
  }
  console.log(`[wiki] Strategy A resolved ${Object.keys(pageToFile).length}/${titles.length}`);
  return pageToFile;
}

/**
 * Strategy B: guess common File: naming patterns directly.
 * Fandom wikis usually name files "SlimeName.png" or "SlimeName Slime.png".
 */
async function strategyGuessFilenames(
  slimeNames: string[],
  alreadyFound: Set<string>
): Promise<Record<string, string>> {
  const missing = slimeNames.filter(n => !alreadyFound.has(n.toLowerCase().trim()));
  if (missing.length === 0) return {};

  // Build candidate File: titles for each missing slime
  const candidates: { key: string; fileTitle: string }[] = [];
  for (const name of missing) {
    const parts = name.split('/').map(p => p.trim()); // "Scorchy / Boomy" → ["Scorchy", "Boomy"]
    for (const part of parts) {
      candidates.push(
        { key: name, fileTitle: `File:${part}.png` },
        { key: name, fileTitle: `File:${part}.gif` },
        { key: name, fileTitle: `File:${part} Slime.png` },
        { key: name, fileTitle: `File:${part}_Slime.png` },
      );
    }
  }

  const fileTitles = [...new Set(candidates.map(c => c.fileTitle))];
  const fileToUrl = await resolveFileUrls(fileTitles);

  const result: Record<string, string> = {};
  for (const { key, fileTitle } of candidates) {
    if (result[key.toLowerCase()]) continue; // already found
    const url = fileToUrl[fileTitle.toLowerCase()];
    if (url) result[key.toLowerCase()] = url;
  }

  console.log(`[wiki] Strategy B recovered ${Object.keys(result).length}/${missing.length} missing`);
  const stillMissing = missing.filter(n => !result[n.toLowerCase()]);
  if (stillMissing.length) console.warn('[wiki] No image found for:', stillMissing);

  return result;
}

/**
 * Given slime names from SLIME_REGISTRY, returns { lowercasedName → imageURL }.
 */
export async function fetchSlimeImages(slimeNames: string[]): Promise<Record<string, string>> {
  if (slimeNames.length === 0) return {};
  console.log(`[wiki] fetchSlimeImages() for ${slimeNames.length} slimes`);

  // Strategy A: scrape each slime's wiki page for its images
  const pageToFile = await strategyPageImages(slimeNames);
  const fileTitles = [...new Set(Object.values(pageToFile))];
  const fileToUrl = await resolveFileUrls(fileTitles);

  const result: Record<string, string> = {};
  for (const [pageKey, fileTitle] of Object.entries(pageToFile)) {
    const url = fileToUrl[fileTitle.toLowerCase()];
    if (url) result[pageKey] = url;
  }

  // Strategy B: guess filenames for anything still missing
  const fallback = await strategyGuessFilenames(slimeNames, new Set(Object.keys(result)));
  Object.assign(result, fallback);

  console.log(`[wiki] Done — ${Object.keys(result).length}/${slimeNames.length} images resolved`);
  return result;
}