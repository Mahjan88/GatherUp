// Prints what the Ticketmaster Discovery API returns for a pasted link or a
// keyword, following the same steps as TicketmasterService.resolveUrl.
// Talks to Ticketmaster only: no database, Supabase or API server needed.
//
//   pnpm --filter @gatherup/api tm:probe "<ticketmaster url | keyword>" [--raw]
//
// --raw also writes every full JSON response to a temp folder.

import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  keywordCandidates,
  parseTicketmasterUrl,
  urlIdOf,
} from '../src/modules/ticketmaster/ticketmaster.url.js';

const DISCOVERY_URL = 'https://app.ticketmaster.com/discovery/v2';
const apiKey = process.env.TICKETMASTER_API_KEY;
const args = process.argv.slice(2);
const raw = args.includes('--raw');
const input = args
  .filter((a) => a !== '--raw')
  .join(' ')
  .trim();

if (!apiKey) {
  console.error('TICKETMASTER_API_KEY is not set in services/api/.env');
  process.exit(1);
}
if (!input) {
  console.error('Usage: tm:probe "<ticketmaster url | keyword>" [--raw]');
  process.exit(1);
}

const rawDir = join(tmpdir(), `tm-probe-${Date.now()}`);
let requestCount = 0;

async function get(path: string, params: Record<string, string | undefined>) {
  const url = new URL(`${DISCOVERY_URL}${path}`);
  for (const [k, v] of Object.entries(params))
    if (v) url.searchParams.set(k, v);
  console.log(`\n→ GET ${url.pathname}${url.search || ''}`);
  url.searchParams.set('apikey', apiKey!);

  const response = await fetch(url);
  const body = (await response.json().catch(() => null)) as any;
  console.log(`  ${response.status} ${response.statusText}`);
  if (raw && body) {
    mkdirSync(rawDir, { recursive: true });
    const file = join(rawDir, `${++requestCount}.json`);
    writeFileSync(file, JSON.stringify(body, null, 2));
    console.log(`  full response: ${file}`);
  }
  if (!response.ok)
    console.log(' ', JSON.stringify(body?.fault ?? body?.errors ?? body));
  return response.ok ? body : null;
}

function printEvents(body: any, wantedUrlId?: string) {
  const events: any[] = body?._embedded?.events ?? [];
  console.log(
    `  ${body?.page?.totalElements ?? 0} total, showing ${events.length}`
  );
  for (const e of events) {
    const v = e._embedded?.venues?.[0];
    const match = wantedUrlId && urlIdOf(e.url) === wantedUrlId;
    console.log(
      `  ${match ? '✔ MATCH' : '-'} ${e.name}\n` +
        `      id=${e.id}  urlId=${urlIdOf(e.url)}\n` +
        `      ${e.dates?.start?.localDate ?? '?'} ${e.dates?.start?.localTime ?? ''}` +
        ` · ${v?.name ?? '?'}, ${v?.city?.name ?? '?'} ${v?.state?.stateCode ?? ''}\n` +
        `      url=${e.url}`
    );
  }
  return events.find((e) => wantedUrlId && urlIdOf(e.url) === wantedUrlId);
}

async function probeEvent(
  urlId: string,
  tokens: string[],
  date: string | null,
  stateCode: string | null
) {
  // Shows whether the id from the link works as a Discovery id
  console.log('\n## 1. Try the link id directly as a Discovery id');
  const direct = await get(`/events/${urlId}.json`, {});
  if (direct) console.log(`  found: ${direct.name} (${direct.id})`);

  console.log('\n## 2. Search by slug keywords + date/state filters');
  for (const keyword of keywordCandidates(tokens)) {
    const body = await get('/events.json', {
      keyword,
      stateCode: stateCode ?? undefined,
      localStartDateTime: date
        ? `${date}T00:00:00,${date}T23:59:59`
        : undefined,
      countryCode: 'US,CA',
      sort: 'date,asc',
      size: '50',
    });
    const match = printEvents(body, urlId);
    if (match) {
      console.log(`\nResolved: ${match.name} → Discovery id ${match.id}`);
      return;
    }
  }
  console.log(
    '\nNo result matched the link id; the app would ask the user to pick.'
  );
}

async function probeArtist(urlId: string, tokens: string[]) {
  console.log('\n## 1. Search attractions by slug keyword');
  const body = await get('/attractions.json', {
    keyword: tokens.join(' '),
    size: '20',
  });
  const attractions: any[] = body?._embedded?.attractions ?? [];
  for (const a of attractions) {
    console.log(
      `  ${urlIdOf(a.url) === urlId ? '✔ MATCH' : '-'} ${a.name}  id=${a.id}  url=${a.url}`
    );
  }
  const attraction =
    attractions.find((a) => urlIdOf(a.url) === urlId) ??
    attractions.find((a) => a.name.toLowerCase() === tokens.join(' '));
  if (!attraction) return console.log('\nNo attraction found.');

  console.log(`\n## 2. Upcoming events for ${attraction.name}`);
  printEvents(
    await get('/events.json', {
      attractionId: attraction.id,
      countryCode: 'US,CA',
      sort: 'date,asc',
      size: '50',
      startDateTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    })
  );
}

const parsed = /^https?:\/\//i.test(input) ? parseTicketmasterUrl(input) : null;
if (/^https?:\/\//i.test(input) && !parsed) {
  console.error('Not a Ticketmaster event or artist link');
  process.exit(1);
}
console.log(
  'Parsed:',
  JSON.stringify(parsed ?? { kind: 'keyword', keyword: input })
);

if (parsed?.kind === 'event') {
  await probeEvent(parsed.urlId, parsed.tokens, parsed.date, parsed.stateCode);
} else if (parsed?.kind === 'artist') {
  await probeArtist(parsed.urlId, parsed.tokens);
} else {
  printEvents(
    await get('/events.json', {
      keyword: input,
      countryCode: 'US,CA',
      sort: 'date,asc',
      size: '20',
    })
  );
}
