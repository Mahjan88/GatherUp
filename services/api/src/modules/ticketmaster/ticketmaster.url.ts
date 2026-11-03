// Parses public Ticketmaster links without fetching them. Shapes seen in
// Discovery API results:
//   /{name}-{city}-{state}-{MM}-{DD}-{YYYY}/event/{urlId}   one show (US/CA)
//   /{name}-{city}-{DD}-{MM}-{YYYY}/event/{urlId}           one show (UK/IE/AU/NZ)
//   /event/{name}-tickets/{numericId}                       one show (DE/ES/NL…)
//   /{name}-tickets/artist/{legacyId}                       every show
// The ids in these URLs are not Discovery API ids, so the slug is only used
// to build a search; a result is confirmed by matching the id in its URL.

const REGIONS: Record<string, string> = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  'district-of-columbia': 'DC',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new-hampshire': 'NH',
  'new-jersey': 'NJ',
  'new-mexico': 'NM',
  'new-york': 'NY',
  'north-carolina': 'NC',
  'north-dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode-island': 'RI',
  'south-carolina': 'SC',
  'south-dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west-virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
  // Canada
  alberta: 'AB',
  'british-columbia': 'BC',
  manitoba: 'MB',
  'new-brunswick': 'NB',
  'nova-scotia': 'NS',
  ontario: 'ON',
  quebec: 'QC',
  saskatchewan: 'SK',
};

// Ticketmaster sites that put the month before the day in event slugs
const MONTH_FIRST_HOSTS = /(^|\.)ticketmaster\.(com|ca)$/i;

/** GatherUp only supports US and Canada events for now */
export const SUPPORTED_COUNTRIES = ['US', 'CA'] as const;

/** Links from ticketmaster.com / ticketmaster.ca (US and Canada sites) */
export function isSupportedHost(raw: string) {
  try {
    return MONTH_FIRST_HOSTS.test(new URL(raw.trim()).hostname);
  } catch {
    return false;
  }
}

const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'of', 'tickets']);

export type ParsedTicketmasterUrl =
  | {
      kind: 'event';
      urlId: string;
      /** Name + city words, in slug order */
      tokens: string[];
      /** YYYY-MM-DD */
      date: string | null;
      stateCode: string | null;
    }
  | { kind: 'artist'; urlId: string; tokens: string[] };

export function parseTicketmasterUrl(
  raw: string
): ParsedTicketmasterUrl | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (!/(^|\.)ticketmaster\.[a-z.]{2,10}$/i.test(url.hostname)) return null;

  const toTokens = (slug: string) =>
    decodeURIComponent(slug)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);

  const european = url.pathname.match(/^\/event\/([^/]+)\/(\d+)/);
  if (european) {
    let tokens = toTokens(european[1]);
    if (tokens.at(-1) === 'tickets') tokens = tokens.slice(0, -1);
    return {
      kind: 'event',
      urlId: european[2],
      tokens,
      date: null,
      stateCode: null,
    };
  }

  const match = url.pathname.match(
    /^\/([^/]+)\/(event|artist)\/([A-Za-z0-9]+)/
  );
  if (!match) return null;
  const [, slug, kind, urlId] = match;
  let tokens = toTokens(slug);

  if (kind === 'artist') {
    if (tokens.at(-1) === 'tickets') tokens = tokens.slice(0, -1);
    return { kind: 'artist', urlId, tokens };
  }

  let date: string | null = null;
  const [a, b, yyyy] = tokens.slice(-3);
  if (/^\d{2}$/.test(a) && /^\d{2}$/.test(b) && /^\d{4}$/.test(yyyy ?? '')) {
    let [mm, dd] = MONTH_FIRST_HOSTS.test(url.hostname) ? [a, b] : [b, a];
    if (Number(mm) > 12) [mm, dd] = [dd, mm];
    date = `${yyyy}-${mm}-${dd}`;
    tokens = tokens.slice(0, -3);
  }

  let stateCode: string | null = null;
  // Longest region name first ("district-of-columbia", "new-york", "york"…)
  for (const n of [3, 2, 1]) {
    const code = REGIONS[tokens.slice(-n).join('-')];
    if (tokens.length > n && code) {
      stateCode = code;
      tokens = tokens.slice(0, -n);
      break;
    }
  }

  if (tokens.at(-1) === 'tickets') tokens = tokens.slice(0, -1);
  return { kind: 'event', urlId, tokens, date, stateCode };
}

/**
 * Keyword guesses, broadest first. The city sits between the name and the
 * state and has no delimiter, so instead of guessing where it starts we try
 * growing prefixes and let the date/state filters narrow the results.
 */
export function keywordCandidates(tokens: string[], max = 3): string[] {
  const out: string[] = [];
  for (let n = 1; n <= tokens.length && out.length < max; n++) {
    const words = tokens.slice(0, n);
    if (n === 1 && STOPWORDS.has(words[0])) continue;
    out.push(words.join(' '));
  }
  return out;
}

/** The id in a Ticketmaster event or artist URL, if any */
export function urlIdOf(url: string | null | undefined) {
  if (!url) return null;
  const path = new URL(url).pathname;
  return (
    path.match(/^\/event\/[^/]+\/(\d+)/)?.[1] ??
    path.match(/\/(?:event|artist)\/([A-Za-z0-9]+)/)?.[1] ??
    null
  );
}
