import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENTRY_PNG = join(HERE, 'entry.png');
const PREVIEW_300_PNG = join(HERE, '..', 'preview-300.png');

const REGIONS = [
  { id: 'europe', label: 'EUROPE', color: '#1F4B7A' },
  { id: 'mideast', label: 'MIDDLE EAST', color: '#9D2B22' },
  { id: 'asia', label: 'ASIA', color: '#B45309' },
  { id: 'americas', label: 'AMERICAS', color: '#5A3D82' },
  { id: 'africa', label: 'AFRICA', color: '#276749' },
  { id: 'oceania', label: 'OCEANIA', color: '#0E7490' },
  { id: 'antarctica', label: 'ANTARCTICA', color: '#475569' }
];

const UTC_STOPS = [
  { time: '04:00 UTC', event: 'Las Vegas GP' },
  { time: '08:00 UTC', event: '186 drones hit' },
  { time: '12:09 UTC', event: 'COP31 fails' },
  { time: '12:23 UTC', event: 'NROL-136 launch' },
  { time: '19:30 UTC', event: 'ATP Finals' }
];

const LEADS = [
  {
    id: 1,
    region: 'europe',
    location: 'ANTALYA, TÜRKIYE',
    beat: 'CLIMATE',
    badge: 'CONFIRMED · AP, REUTERS',
    headline: 'COP31 ends in overtime with no fossil-fuel deal',
    summary: 'Nearly 200 nations split after 49h overtime as EU, UK and Pacific states rejected a draft omitting fossil-fuel phase-out.',
    lat: 36.89,
    lon: 30.71,
    svg: `<svg viewBox="0 0 320 144" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#DCE8F3"/>
          <stop offset="100%" stop-color="#F1EAD9"/>
        </linearGradient>
      </defs>
      <rect width="320" height="144" fill="url(#sky1)"/>
      <text x="160" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="14.5" font-weight="900" fill="#111" letter-spacing="0.4">ANTALYA PACT · +49H</text>
      <rect x="18" y="36" width="68" height="44" fill="#E30A17" stroke="#111" stroke-width="1.5"/>
      <circle cx="47" cy="58" r="11.5" fill="#FFF"/><circle cx="50.8" cy="58" r="9.2" fill="#E30A17"/>
      <polygon points="60,58 68,54.5 65,58 68,61.5" fill="#FFF"/>
      <polygon points="112,30 156,30 152,50 159,67 151,84 157,102 112,102" fill="#FFFDF8" stroke="#222" stroke-width="1.8"/>
      <polygon points="164,30 208,30 208,102 164,102 158,84 166,67 159,50" fill="#FFFDF8" stroke="#222" stroke-width="1.8"/>
      <line x1="120" y1="45" x2="148" y2="45" stroke="#9CA3AF" stroke-width="2.8"/>
      <line x1="120" y1="57" x2="146" y2="57" stroke="#9CA3AF" stroke-width="2.8"/>
      <line x1="120" y1="69" x2="150" y2="69" stroke="#B91C1C" stroke-width="3"/>
      <line x1="120" y1="81" x2="145" y2="81" stroke="#9CA3AF" stroke-width="2.8"/>
      <line x1="172" y1="45" x2="200" y2="45" stroke="#9CA3AF" stroke-width="2.8"/>
      <line x1="174" y1="57" x2="200" y2="57" stroke="#9CA3AF" stroke-width="2.8"/>
      <line x1="172" y1="69" x2="200" y2="69" stroke="#B91C1C" stroke-width="3"/>
      <line x1="173" y1="81" x2="200" y2="81" stroke="#9CA3AF" stroke-width="2.8"/>
      <rect x="234" y="36" width="68" height="44" fill="#003399" stroke="#111" stroke-width="1.5"/>
      <circle cx="268" cy="58" r="14" fill="none" stroke="#FFCC00" stroke-width="2.8" stroke-dasharray="2.5,4"/>
      <rect x="64" y="109" width="192" height="27" rx="2" fill="#A81D1D"/>
      <text x="160" y="128" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="900" fill="#FFF" letter-spacing="0.5">NO CONSENSUS</text>
    </svg>`
  },
  {
    id: 2,
    region: 'africa',
    location: 'BENGHAZI, LIBYA',
    beat: 'WAR',
    badge: 'OFFICIALS · KYIV, REUTERS',
    headline: 'Sea drones sink Russian corvette at Benghazi',
    summary: 'President Zelenskyy said seven Ukrainian drones sank warship Merkury in port (several dead, 10+ hurt) and damaged a ship.',
    lat: 32.12,
    lon: 20.07,
    svg: `<svg viewBox="0 0 320 144" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="78" fill="#C9DFEE"/>
      <rect y="78" width="320" height="66" fill="#255D88"/>
      <rect x="12" y="48" width="22" height="30" fill="#D5C7B2"/>
      <rect x="38" y="38" width="24" height="40" fill="#C4B59D"/>
      <rect x="66" y="52" width="22" height="26" fill="#D5C7B2"/>
      <rect x="90" y="66" width="218" height="12" fill="#8C7E6D"/>
      <polygon points="244,72 308,72 302,84 250,84" fill="#64748B" stroke="#111" stroke-width="1.2"/>
      <rect x="266" y="60" width="24" height="12" fill="#475569"/>
      <g transform="translate(154,66) rotate(13)">
        <polygon points="-62,8 60,8 50,25 -52,25" fill="#4B5563" stroke="#111" stroke-width="1.6"/>
        <rect x="-24" y="-9" width="40" height="17" fill="#6B7280" stroke="#111" stroke-width="1.4"/>
        <line x1="-6" y1="-9" x2="-6" y2="-26" stroke="#111" stroke-width="2.2"/>
        <line x1="10" y1="-9" x2="10" y2="-19" stroke="#111" stroke-width="2"/>
      </g>
      <path d="M144,66 C136,44 152,32 166,38 C174,22 194,26 192,44 C204,44 206,60 190,66 Z" fill="#4B5563" opacity="0.82"/>
      <polygon points="150,72 158,46 167,61 174,42 182,70" fill="#F97316"/>
      <polygon points="156,72 162,54 169,66 174,52 178,72" fill="#FACC15"/>
      <path d="M14,104 L88,94" stroke="#E0F2FE" stroke-width="2.4" stroke-dasharray="5,3"/>
      <polygon points="88,92 112,89 108,96 84,97" fill="#111827"/>
      <rect x="136" y="109" width="172" height="27" rx="2" fill="#0F172A"/>
      <text x="222" y="128" text-anchor="middle" font-family="Arial,sans-serif" font-size="15.5" font-weight="900" fill="#FFF" letter-spacing="0.4">MERKURY SUNK</text>
    </svg>`
  },
  {
    id: 3,
    region: 'europe',
    location: 'KYIV REGION, UKRAINE',
    beat: 'WAR',
    badge: 'OFFICIALS · UKRAINE AF, AP',
    headline: '186 Russian drones hit Ukraine; Dymer flats struck',
    summary: 'Air defences downed 161 of 186 UAVs overnight; strike hit a 5-story Dymer apartment, killing at least 11–14.',
    lat: 50.78,
    lon: 30.30,
    svg: `<svg viewBox="0 0 320 144" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="144" fill="#142238"/>
      <path d="M16,102 Q90,24 154,30" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,3"/>
      <path d="M28,102 Q116,16 202,22" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,3"/>
      <g stroke="#FACC15" stroke-width="2.4">
        <line x1="72" y1="26" x2="86" y2="34"/><line x1="86" y1="26" x2="72" y2="34"/>
        <line x1="116" y1="30" x2="130" y2="38"/><line x1="130" y1="30" x2="116" y2="38"/>
      </g>
      <polygon points="150,22 168,26 152,30" fill="#EF4444"/>
      <polygon points="196,17 214,22 196,26" fill="#EF4444"/>
      <rect x="206" y="34" width="84" height="86" fill="#9CA3AF" stroke="#111" stroke-width="1.5"/>
      <polygon points="236,34 274,34 264,62 242,58" fill="#1F2937"/>
      <polygon points="244,58 256,38 266,58" fill="#F97316"/>
      <g fill="#FEF08A">
        <rect x="214" y="42" width="10" height="10"/><rect x="214" y="59" width="10" height="10"/>
        <rect x="214" y="76" width="10" height="10"/><rect x="272" y="59" width="10" height="10"/>
        <rect x="272" y="76" width="10" height="10"/><rect x="242" y="76" width="10" height="10"/>
      </g>
      <rect x="12" y="109" width="186" height="27" rx="2" fill="#B91C1C"/>
      <text x="105" y="128" text-anchor="middle" font-family="Arial,sans-serif" font-size="15.5" font-weight="900" fill="#FFF" letter-spacing="0.4">161 / 186 DOWNED</text>
    </svg>`
  }
];

const MIDS = [
  {
    id: 4,
    region: 'mideast',
    location: 'SITRA, BAHRAIN',
    tag: 'DISPUTED · MOFA / IRGC',
    headline: 'Bahrain blames Iran for fire; IRGC claims radar hits',
    summary: 'Manama said 2 hurt at civilian plant; IRGC claimed Patriot radars.',
    lat: 26.15,
    lon: 50.62,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#E8D8C3"/>
      <rect y="50" width="186" height="16" fill="#B59F84"/>
      <path d="M16,50 L28,33 L40,50" fill="none" stroke="#334155" stroke-width="2"/>
      <path d="M19,27 Q28,18 37,27" fill="none" stroke="#1E3A8A" stroke-width="2.6"/>
      <rect x="44" y="29" width="34" height="21" fill="#64748B" stroke="#111" stroke-width="1.2"/>
      <polygon points="53,29 61,12 69,29" fill="#EA580C"/>
      <polygon points="57,29 61,19 65,29" fill="#FACC15"/>
      <text x="136" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="16.5" font-weight="900" fill="#9D2B22">2 INJURED</text>
      <text x="136" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#333">DISPUTED</text>
    </svg>`
  },
  {
    id: 5,
    region: 'americas',
    location: 'UNITED STATES',
    tag: 'CONFIRMED · AP, BBC',
    headline: 'Democrats reach 258 House seats, most since 1992',
    summary: 'Republican Virginia Foxx conceded NC-5 after 330-vote recount.',
    lat: 36.1,
    lon: -80.2,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#EFF4FB"/>
      <path d="M16,56 A40,40 0 0,1 88,56" fill="none" stroke="#DC2626" stroke-width="11"/>
      <path d="M16,56 A40,40 0 0,1 69,23" fill="none" stroke="#1D4ED8" stroke-width="11"/>
      <path d="M29,56 A27,27 0 0,1 75,56" fill="none" stroke="#DC2626" stroke-width="8"/>
      <path d="M29,56 A27,27 0 0,1 65,33" fill="none" stroke="#1D4ED8" stroke-width="8"/>
      <text x="138" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="900" fill="#1D4ED8">258</text>
      <text x="138" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#111">SEATS</text>
    </svg>`
  },
  {
    id: 6,
    region: 'europe',
    location: 'LIVERPOOL, UK',
    tag: 'CONFIRMED · BBC',
    headline: 'Liverpool rout 10-man Man United 4–0 at Anfield',
    summary: 'Yoro sent off; heaviest debut defeat for Pochettino at Man Utd.',
    lat: 53.43,
    lon: -2.96,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#1F6D2E"/>
      <line x1="92" y1="0" x2="92" y2="66" stroke="#DCFCE7" stroke-width="1.4"/>
      <rect x="14" y="14" width="38" height="38" fill="none" stroke="#DCFCE7" stroke-width="1.4"/>
      <circle cx="62" cy="33" r="7" fill="#FFF" stroke="#111" stroke-width="1.4"/>
      <rect x="74" y="14" width="12" height="20" rx="1.5" fill="#DC2626" stroke="#111" stroke-width="1.2"/>
      <text x="139" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="900" fill="#FFF">4–0</text>
      <text x="139" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FEF08A">ANFIELD</text>
    </svg>`
  },
  {
    id: 7,
    region: 'asia',
    location: 'INDONESIA',
    tag: 'OFFICIALS · CNA, AP',
    headline: '24 body bags found in burned Banten candy plant',
    summary: 'Rescuers search Cikande factory rubble; DNA identification begins.',
    lat: -6.18,
    lon: 106.38,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#E9DFD1"/>
      <rect y="52" width="186" height="14" fill="#B5A694"/>
      <rect x="14" y="27" width="66" height="29" fill="#57534E" stroke="#111" stroke-width="1.2"/>
      <polygon points="12,27 24,16 36,27 48,16 60,27 80,16 80,27" fill="#44403C"/>
      <polygon points="36,27 46,8 56,27" fill="#EA580C"/>
      <text x="136" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="19.5" font-weight="900" fill="#B45309">24 DEAD</text>
      <text x="136" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#222">INDONESIA</text>
    </svg>`
  },
  {
    id: 8,
    region: 'asia',
    location: 'SEOUL, S. KOREA',
    tag: 'OFFICIALS · YONHAP',
    headline: 'Seoul preps stock fund; education minister quits',
    summary: 'Stabilization fund ready after Kospi -5%; Choi quits over exam row.',
    lat: 37.57,
    lon: 126.98,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#F1F5F9"/>
      <polyline points="10,16 34,24 54,20 74,44 94,56" fill="none" stroke="#DC2626" stroke-width="3.2"/>
      <polygon points="94,56 83,54 91,44" fill="#DC2626"/>
      <circle cx="24" cy="46" r="9" fill="#FFF" stroke="#111" stroke-width="1.2"/>
      <path d="M17,46 A7,7 0 0,1 31,46" fill="#CD2E3A"/><path d="M17,46 A7,7 0 0,0 31,46" fill="#0047A0"/>
      <text x="138" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="900" fill="#DC2626">-5%</text>
      <text x="138" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#111">KOSPI · FUND</text>
    </svg>`
  },
  {
    id: 9,
    region: 'americas',
    location: 'LAS VEGAS, USA',
    tag: 'CONFIRMED · F1, FIA',
    headline: 'Verstappen wins Las Vegas GP with 35 lead swaps',
    summary: '04:00 UTC finish ahead of McLaren’s Norris (2nd) and Piastri (3rd).',
    lat: 36.11,
    lon: -115.17,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#1E1B4B"/>
      <rect y="46" width="186" height="20" fill="#334155"/>
      <path d="M14,48 L38,39 L78,39 L92,48 Z" fill="#E11D48"/>
      <circle cx="30" cy="50" r="6" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.5"/>
      <circle cx="76" cy="50" r="6" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.5"/>
      <rect x="14" y="10" width="22" height="14" fill="#FFF"/>
      <rect x="14" y="10" width="7" height="7" fill="#111"/><rect x="28" y="10" width="8" height="7" fill="#111"/><rect x="21" y="17" width="7" height="7" fill="#111"/>
      <text x="138" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="900" fill="#FFF">P1</text>
      <text x="138" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FACC15">VERSTAPPEN</text>
    </svg>`
  },
  {
    id: 10,
    region: 'europe',
    location: 'TURIN, ITALY',
    tag: 'CONFIRMED · ATP',
    headline: 'Alcaraz tops Zverev 6–2, 7–6 for ATP Finals title',
    summary: 'Spaniard defeats world No. 1 in straight sets in Turin final.',
    lat: 45.07,
    lon: 7.69,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#1D4E89"/>
      <rect x="12" y="13" width="72" height="40" fill="#2563EB" stroke="#FFF" stroke-width="1.6"/>
      <line x1="48" y1="13" x2="48" y2="53" stroke="#FFF" stroke-width="1.5"/>
      <circle cx="31" cy="33" r="9.5" fill="#D9F99D" stroke="#111" stroke-width="1.2"/>
      <text x="137" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="19.5" font-weight="900" fill="#FFF">6–2, 7–6</text>
      <text x="137" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FEF08A">ATP FINALS</text>
    </svg>`
  },
  {
    id: 11,
    region: 'oceania',
    location: 'WELLINGTON, NZ',
    tag: 'CONFIRMED · HINDU',
    headline: 'India declare on record 720/9 against New Zealand',
    summary: 'Highest away Test total for India; NZ trail at 119/2.',
    lat: -41.29,
    lon: 174.78,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#CBE7C7"/>
      <polygon points="14,66 32,25 66,25 84,66" fill="#E5D5B5" stroke="#A89674"/>
      <line x1="42" y1="14" x2="42" y2="31" stroke="#111" stroke-width="2"/>
      <line x1="48" y1="14" x2="48" y2="31" stroke="#111" stroke-width="2"/>
      <line x1="54" y1="14" x2="54" y2="31" stroke="#111" stroke-width="2"/>
      <circle cx="70" cy="41" r="6" fill="#B91C1C" stroke="#111" stroke-width="1"/>
      <text x="136" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="#0E7490">720/9</text>
      <text x="136" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#111">RECORD</text>
    </svg>`
  },
  {
    id: 12,
    region: 'africa',
    location: 'KHARTOUM, SUDAN',
    tag: 'REPORTED · AJ',
    headline: 'RSF drones kill 4 near Khartoum, hit UN compound',
    summary: 'Pre-dawn strikes hit homes and UN site near airport.',
    lat: 15.5,
    lon: 32.56,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#E6DEC8"/>
      <path d="M14,16 L46,24" stroke="#B91C1C" stroke-width="2" stroke-dasharray="4,3"/>
      <polygon points="10,12 28,16 14,22" fill="#1F2937"/>
      <rect x="44" y="21" width="46" height="35" fill="#93C5FD" stroke="#1E3A8A" stroke-width="1.5"/>
      <text x="67" y="43" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#1E3A8A">UN</text>
      <polygon points="82,12 92,27 74,25" fill="#EA580C"/>
      <text x="139" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="18.5" font-weight="900" fill="#276749">UN HIT</text>
      <text x="139" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#111">4 KILLED</text>
    </svg>`
  },
  {
    id: 13,
    region: 'asia',
    location: 'HONG KONG',
    tag: 'CONFIRMED · HKSAR',
    headline: 'Hong Kong fills all 723 Election Committee seats',
    summary: 'Turnout reaches 98.79% across 31 contested subsectors.',
    lat: 22.32,
    lon: 114.17,
    svg: `<svg viewBox="0 0 186 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="66" fill="#EFE7DA"/>
      <rect x="14" y="10" width="38" height="22" fill="#DE2910" stroke="#111" stroke-width="1.2"/>
      <circle cx="33" cy="21" r="5" fill="#FFF"/>
      <rect x="20" y="35" width="60" height="25" fill="#FFF" stroke="#111" stroke-width="1.5"/>
      <rect x="34" y="39" width="32" height="3.5" fill="#111"/>
      <polygon points="42,25 58,25 55,39 45,39" fill="#DC2626"/>
      <text x="136" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" font-weight="900" fill="#B45309">98.8%</text>
      <text x="136" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#111">723 SEATS</text>
    </svg>`
  }
];

const BRIEFS = [
  { id: 14, region: 'europe', place: 'Portimão', text: 'Bezzecchi wins MotoGP Portugal; Márquez takes 2026 title', src: 'MotoGP', lat: 37.23, lon: -8.63 },
  { id: 15, region: 'europe', place: 'Vatican', text: 'Pope Leo XIV hosts World Day of the Poor lunch for 1,300', src: 'AP', lat: 41.9, lon: 12.45 },
  { id: 16, region: 'mideast', place: 'Tehran', text: 'Iran starts 2-hr power cuts; vows US blockade counter', src: 'Tavanir, AP', lat: 35.69, lon: 51.39 },
  { id: 17, region: 'mideast', place: 'Gaza City', text: 'Israeli strikes kill 4; IDF warns against wider Iran war', src: 'AJ, FDD', lat: 31.5, lon: 34.47 },
  { id: 18, region: 'asia', place: 'Naha, Japan', text: 'Okinawa marks Shuri Castle hall rebuild 7 yrs post-fire', src: 'Yomiuri', lat: 26.21, lon: 127.72 },
  { id: 19, region: 'asia', place: 'Delhi', text: 'Emergency smog curbs ordered as PM2.5 passes 200', src: 'PTI', lat: 28.61, lon: 77.21 },
  { id: 20, region: 'americas', place: 'Vandenberg', text: 'SpaceX Falcon 9 launches classified NROL-136 mission', src: 'NRO', lat: 34.74, lon: -120.57 },
  { id: 21, region: 'americas', place: 'San Antonio', text: 'Wembanyama hits 50 pts, 19 reb as Spurs win 114–91', src: 'NBA', lat: 29.42, lon: -98.49 },
  { id: 22, region: 'africa', place: 'Oyo, Congo', text: 'Kenya’s Ruto & DRC’s Tshisekedi restore diplomatic ties', src: 'Xinhua', lat: -1.16, lon: 15.97 },
  { id: 23, region: 'oceania', place: 'Canberra', text: 'Marles rejects US CBO report warning on AUKUS subs', src: 'ABC', lat: -35.28, lon: 149.13 },
  { id: 24, region: 'antarctica', place: 'Antarctica', text: 'Study ties winter atmospheric rivers to global temp spikes', src: 'ARC', lat: -75.0, lon: 95.0 }
];

const ALL_STORIES = [...LEADS, ...MIDS, ...BRIEFS];

function verifyData() {
  if (ALL_STORIES.length !== 24) {
    throw new Error(`Expected 24 stories, got ${ALL_STORIES.length}`);
  }
  const counts = Object.fromEntries(REGIONS.map(r => [r.id, 0]));
  const seenIds = new Set();
  for (const s of ALL_STORIES) {
    if (seenIds.has(s.id)) throw new Error(`Duplicate story id ${s.id}`);
    seenIds.add(s.id);
    if (!(s.region in counts)) throw new Error(`Unknown region ${s.region}`);
    counts[s.region] += 1;
  }
  for (const r of REGIONS) {
    if (counts[r.id] < 1) throw new Error(`Region ${r.id} has zero stories`);
  }
  const sum = Object.values(counts).reduce((a, b) => a + b, 0);
  if (sum !== ALL_STORIES.length) throw new Error(`Region sum mismatch ${sum}`);
  return counts;
}

function projectLonLat(lon, lat) {
  const x = ((lon + 180) / 360) * 246;
  const clampedLat = Math.max(-78, Math.min(78, lat));
  const y = ((82 - clampedLat) / 164) * 144;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

function buildWorldMapSvg(counts) {
  const regionColor = Object.fromEntries(REGIONS.map(r => [r.id, r.color]));
  const pinDots = BRIEFS.map(b => {
    const [x, y] = projectLonLat(b.lon, b.lat);
    return `<circle cx="${x}" cy="${y}" r="2.2" fill="${regionColor[b.region]}" stroke="#FFF" stroke-width="0.6" opacity="0.92"/>`;
  }).join('');
  const leadPins = [...LEADS, ...MIDS].map(s => {
    const [x, y] = projectLonLat(s.lon, s.lat);
    return `<g><circle cx="${x}" cy="${y}" r="6.3" fill="${regionColor[s.region]}" stroke="#FFFDF8" stroke-width="1.2"/><text x="${x}" y="${y + 2.6}" text-anchor="middle" font-family="Arial,sans-serif" font-size="7.5" font-weight="800" fill="#FFF">${s.id}</text></g>`;
  }).join('');

  return `<svg viewBox="0 0 246 146" width="246" height="146" xmlns="http://www.w3.org/2000/svg" style="display:block;border:1px solid #C8C0B0;background:#DCE7EF;">
    <path d="M16,25 L42,18 L76,22 L84,35 L76,48 L68,62 L60,69 L54,66 L48,57 L40,52 L34,42 L18,35 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M58,74 L76,76 L92,88 L88,106 L78,125 L70,132 L64,118 L60,95 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M74,11 L96,7 L104,16 L88,20 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M113,25 L128,18 L146,20 L152,30 L146,41 L132,46 L118,43 L111,34 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M114,49 L134,48 L148,57 L156,74 L148,100 L136,112 L128,102 L124,81 L110,69 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M148,25 L198,18 L228,27 L232,44 L218,60 L202,69 L188,78 L174,71 L162,62 L148,53 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M196,86 L214,83 L222,95 L214,109 L198,107 L192,95 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M232,107 L239,102 L242,110 L234,114 Z" fill="#D5CBB8" stroke="#A69A85" stroke-width="0.7"/>
    <path d="M14,134 L236,134 L236,144 L14,144 Z" fill="#EAECEF" stroke="#B6BECA" stroke-width="0.6"/>
    ${pinDots}
    ${leadPins}
  </svg>
  <div style="font-size:8.6px;line-height:1.35;margin-top:4px;color:#222;">
    ${REGIONS.map(r => `<span style="display:inline-block;margin-right:6px;"><b style="color:${r.color};">● ${r.label}</b> ${counts[r.id]}</span>`).join('')}
  </div>`;
}

function buildHtml(counts) {
  const regionColor = Object.fromEntries(REGIONS.map(r => [r.id, r.color]));
  const total = ALL_STORIES.length;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    height: 1024px;
    overflow: hidden;
    background: #F6F2E8;
    color: #111111;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 8px 14px 6px 14px;
    display: flex;
    flex-direction: column;
  }
  .overline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.2px;
    font-weight: 800;
    letter-spacing: 0.06em;
    border-bottom: 2px solid #181818;
    padding-bottom: 2px;
  }
  .overline .left { color: #A81D1D; }
  .masthead {
    text-align: center;
    border-bottom: 1.5px solid #181818;
    padding: 2px 0 3px 0;
  }
  .masthead h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 54px;
    line-height: 1.0;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111111;
  }
  .masthead .subdeck {
    font-family: Georgia, "Times New Roman", serif;
    font-style: italic;
    font-size: 13px;
    color: #7A1414;
    margin-top: 1px;
  }
  .utc-strip {
    display: flex;
    align-items: stretch;
    border-top: 1px solid #C8C0B0;
    border-bottom: 2px solid #181818;
    margin-top: 2px;
    height: 22px;
    font-size: 9.8px;
  }
  .utc-badge {
    background: #181818;
    color: #FFF;
    font-weight: 800;
    padding: 0 9px;
    display: flex;
    align-items: center;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
  .utc-items {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    flex: 1;
  }
  .utc-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border-left: 1px solid #D4CCC0;
    padding: 0 4px;
    white-space: nowrap;
  }
  .utc-item b { color: #A81D1D; }
  .leads {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 11px;
    padding: 5px 0;
    border-bottom: 1.5px solid #181818;
  }
  .lead-card {
    border-right: 1px solid #C8C0B0;
    padding-right: 11px;
  }
  .lead-card:last-child { border-right: none; padding-right: 0; }
  .art-box {
    position: relative;
    border: 1px solid #B5AC9D;
    overflow: hidden;
  }
  .lead-art { height: 136px; }
  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    gap: 4px;
  }
  .meta-left {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9.2px;
    font-weight: 800;
    color: #111;
  }
  .num-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    color: #FFF;
    font-size: 9px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .pill {
    font-size: 7.8px;
    font-weight: 800;
    border: 1px solid #555;
    padding: 1px 4px;
    color: #111;
    background: #EFE9DD;
    white-space: nowrap;
  }
  .lead-card h2 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 20.5px;
    line-height: 1.08;
    font-weight: 700;
    margin-top: 3px;
  }
  .lead-card p {
    font-size: 11.2px;
    line-height: 1.24;
    color: #222;
    margin-top: 3px;
  }
  .mid-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 9px;
    row-gap: 6px;
    padding: 6px 0;
    border-bottom: 1.5px solid #181818;
  }
  .mid-card {
    border-right: 1px solid #D4CCC0;
    padding-right: 8px;
  }
  .mid-card:nth-child(5n) { border-right: none; padding-right: 0; }
  .mid-art { height: 62px; }
  .mid-card h3 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 13.8px;
    line-height: 1.1;
    font-weight: 700;
    margin-top: 3px;
  }
  .mid-card p {
    font-size: 9.9px;
    line-height: 1.2;
    color: #262626;
    margin-top: 2px;
  }
  .lower-tier {
    display: grid;
    grid-template-columns: 248px 1fr;
    gap: 12px;
    padding: 7px 0 5px 0;
  }
  .sec-title {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #A81D1D;
    margin-bottom: 5px;
    border-bottom: 1px solid #C8C0B0;
    padding-bottom: 2px;
  }
  .briefs-cols {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 12px;
    row-gap: 6px;
  }
  .brief {
    font-size: 11.1px;
    line-height: 1.28;
    color: #111;
  }
  .brief .bnum {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 15px;
    height: 15px;
    padding: 0 3px;
    border-radius: 7.5px;
    color: #FFF;
    font-size: 8.5px;
    font-weight: 800;
    margin-right: 3px;
    vertical-align: 0.5px;
  }
  .brief i { color: #555; }
  .date-check {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.4px solid #A81D1D;
    background: #EFE6D7;
    padding: 5px 8px;
    font-size: 9.7px;
    line-height: 1.26;
    margin-top: auto;
  }
  .dc-badge {
    background: #A81D1D;
    color: #FFF;
    font-weight: 800;
    font-size: 10px;
    padding: 6px 8px;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.4px;
    color: #333;
    border-top: 1px solid #C8C0B0;
    padding-top: 3px;
    margin-top: 3px;
  }
</style>
</head>
<body>
<div class="page">
  <div class="overline">
    <span class="left">THE WORLD ON ONE PAGE · SUNDAY EDITION</span>
    <span>${total} STORIES · ALL 7 CONTINENTS · 14 FIELDS · EVERY ONE FROM SUNDAY 22 NOVEMBER 2026</span>
  </div>

  <div class="masthead">
    <h1>Sunday 22 November 2026</h1>
    <div class="subdeck">COP31 ends with no fossil-fuel deal · Sea drones sink Russian warship in Libya · 186 drones strike Ukraine</div>
  </div>

  <div class="utc-strip">
    <div class="utc-badge">THE DAY IN UTC</div>
    <div class="utc-items">
      ${UTC_STOPS.map(u => `<div class="utc-item"><b>${u.time}</b><span>${u.event}</span></div>`).join('')}
    </div>
  </div>

  <div class="leads">
    ${LEADS.map(s => `<div class="lead-card">
      <div class="art-box lead-art">
        ${s.svg}
      </div>
      <div class="meta-row">
        <div class="meta-left"><span class="num-dot" style="background:${regionColor[s.region]};">${s.id}</span><span>${s.location} · ${s.beat}</span></div>
        <span class="pill">${s.badge}</span>
      </div>
      <h2>${s.headline}</h2>
      <p>${s.summary}</p>
    </div>`).join('')}
  </div>

  <div class="mid-grid">
    ${MIDS.map(s => `<div class="mid-card">
      <div class="art-box mid-art">
        ${s.svg}
      </div>
      <div class="meta-row">
        <div class="meta-left"><span class="num-dot" style="background:${regionColor[s.region]};">${s.id}</span><span style="font-size:8.6px;">${s.location}</span></div>
        <span class="pill" style="font-size:7.6px;">${s.tag.split(' · ')[0]}</span>
      </div>
      <h3>${s.headline}</h3>
      <p>${s.summary}</p>
    </div>`).join('')}
  </div>

  <div class="lower-tier">
    <div>
      <div class="sec-title">WORLD MAP (#1–13 PINS · #14–24 DOTS)</div>
      ${buildWorldMapSvg(counts)}
    </div>
    <div>
      <div class="sec-title">ALSO ON SUNDAY 22 NOVEMBER 2026 — 11 WIRE BRIEFS ACROSS ALL 7 CONTINENTS</div>
      <div class="briefs-cols">
        ${BRIEFS.map(b => `<div class="brief"><span class="bnum" style="background:${regionColor[b.region]};">${b.id}</span><b>${b.place}:</b> ${b.text}. <i>(${b.src})</i></div>`).join('')}
      </div>
    </div>
  </div>

  <div class="date-check">
    <div class="dc-badge">DATE CHECK</div>
    <div>
      <b>Every story happened or was first reported on Sunday 22 November 2026.</b>
      <b>Left out as earlier news (Nov 20–21):</b> Peru M6.7 quake, Riyadh missile interceptions, EU–Indonesia CEPA, BepiColombo Mercury arrival, Cyclone Akvan landfall.
      <b>Not yet (Nov 23+):</b> Shuri Castle reopening (Mon 23), NZ–India Test draw (Mon 23), Belgium air-traffic strike (Mon 23).
    </div>
  </div>

  <div class="footer">
    <span><b>EPISTEMOLOGY:</b> [CONFIRMED] 2+ outlets · [OFFICIALS] named ministry/command · [REPORTED] wire dispatch · [DISPUTED] conflicting claims</span>
    <span><b>SOURCES:</b> AP, Reuters, AFP, BBC, Al Jazeera, Guardian, Kyodo, CNA, F1, ATP, USGS · Original vector drawings</span>
  </div>
</div>
</body>
</html>`;
}

function findChromePath() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error('No headless Chromium browser found');
}

async function renderPng(htmlPath) {
  const chrome = findChromePath();
  const profileDir = mkdtempSync(join(tmpdir(), 'mf-news22-'));
  const proc = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`,
    'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  try {
    const wsUrl = await new Promise((resolve, reject) => {
      let buf = '';
      const t = setTimeout(() => reject(new Error(`Timeout starting Chrome: ${buf}`)), 15000);
      proc.stderr.on('data', chunk => {
        buf += chunk.toString('utf8');
        const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (m) {
          clearTimeout(t);
          resolve(m[1]);
        }
      });
      proc.on('exit', c => {
        clearTimeout(t);
        reject(new Error(`Chrome exited ${c}: ${buf}`));
      });
    });

    const pages = await fetch(wsUrl.replace('ws://', 'http://').replace(/\/devtools\/browser\/.*/, '/json/list')).then(r => r.json());
    const target = pages.find(p => p.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res);
      ws.addEventListener('error', rej);
    });

    let seq = 0;
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++seq;
      const onMsg = ev => {
        const msg = JSON.parse(ev.data);
        if (msg.id === id) {
          ws.removeEventListener('message', onMsg);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false
    });

    await call('Page.navigate', { url: 'file:///' + htmlPath.replace(/\\/g, '/') });
    await new Promise(r => setTimeout(r, 400));

    const layoutCheck = await call('Runtime.evaluate', {
      expression: `(() => {
        const doc = document.documentElement;
        const page = document.querySelector('.page');
        const footer = document.querySelector('.footer');
        const rect = page.getBoundingClientRect();
        const fRect = footer.getBoundingClientRect();
        const clipped = [];
        for (const el of document.querySelectorAll('.lead-card, .mid-card, .brief, .date-check, .footer')) {
          if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
            clipped.push(el.className + ':' + el.scrollHeight + '>' + el.clientHeight);
          }
        }
        if (fRect.bottom > 1022) {
          clipped.push('footer_overflow:' + Math.round(fRect.bottom));
        }
        return {
          scrollHeight: doc.scrollHeight,
          scrollWidth: doc.scrollWidth,
          pageBottom: Math.round(rect.bottom),
          footerBottom: Math.round(fRect.bottom),
          clipped
        };
      })()`,
      returnByValue: true
    });
    if (layoutCheck.result.value.clipped.length > 0) {
      throw new Error('Layout overflow/clipping detected: ' + JSON.stringify(layoutCheck.result.value));
    }

    const fullShot = await call('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1024, height: 1024, scale: 1 },
      captureBeyondViewport: true
    });
    const pngBytes = Buffer.from(fullShot.data, 'base64');
    writeFileSync(ENTRY_PNG, pngBytes);

    // Also render 300x300 thumbnail preview outside repo/ for visual inspection
    await call('Page.navigate', {
      url: 'data:text/html,' + encodeURIComponent(`<!doctype html><body style="margin:0;width:300px;height:300px;overflow:hidden;"><img src="data:image/png;base64,${fullShot.data}" style="width:300px;height:300px;display:block;"/></body>`)
    });
    await call('Emulation.setDeviceMetricsOverride', {
      width: 300,
      height: 300,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 200));
    const thumbShot = await call('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 300, height: 300, scale: 1 }
    });
    mkdirSync(dirname(PREVIEW_300_PNG), { recursive: true });
    writeFileSync(PREVIEW_300_PNG, Buffer.from(thumbShot.data, 'base64'));

    ws.close();
    return { bytes: pngBytes.byteLength, layout: layoutCheck.result.value };
  } finally {
    proc.kill();
    await new Promise(r => setTimeout(r, 200));
    try { rmSync(profileDir, { recursive: true, force: true }); } catch {}
  }
}

async function run() {
  const counts = verifyData();
  const html = buildHtml(counts);
  const tmpHtml = join(tmpdir(), 'news-image-20261122.html');
  writeFileSync(tmpHtml, html, 'utf8');
  const result = await renderPng(tmpHtml);
  const png = readFileSync(ENTRY_PNG);
  const w = png.readUInt32BE(16);
  const h = png.readUInt32BE(20);
  console.log(JSON.stringify({ file: ENTRY_PNG, width: w, height: h, bytes: result.bytes, counts, layout: result.layout }, null, 2));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
