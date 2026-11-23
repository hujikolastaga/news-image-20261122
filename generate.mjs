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
  { time: '08:00 UTC', event: '186-drone tally' },
  { time: '12:09 UTC', event: 'COP31 collapses' },
  { time: '12:23 UTC', event: 'NROL-136 launch' },
  { time: '16:30 UTC', event: 'Anfield 4–0 rout' },
  { time: '19:30 UTC', event: 'Turin ATP final' }
];

const KPI_NUMBERS = [
  { num: '+49h', note: 'COP31 record overtime' },
  { num: '186', note: 'Drones fired at Ukraine' },
  { num: '258', note: 'Democrats US House' },
  { num: '24', note: 'Bodies Cikande fire' },
  { num: '720/9d', note: 'India Test record NZ' },
  { num: '50 pts', note: 'Wembanyama Spurs' }
];

const LEADS = [
  {
    id: 1,
    region: 'europe',
    location: 'ANTALYA, TÜRKIYE',
    beat: 'CLIMATE',
    badge: 'CONFIRMED · AP, REUTERS',
    stamp: 'NO DEAL · +49H',
    stampBg: '#A81D1D',
    subStamp: 'COP31 COLLAPSES',
    headline: 'COP31 ends in record overtime with no fossil-fuel deal',
    summary: 'Nearly 200 nations deadlocked 49 hours past Friday’s close after the draft Antalya Pact omitted fossil-fuel phase-out language. EU, UK and Pacific islands rejected it; talks defer to COP32 in Addis Ababa.',
    lat: 36.89,
    lon: 30.71,
    svg: `<svg viewBox="0 0 320 108" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#DCE8F3"/>
          <stop offset="100%" stop-color="#F1EAD9"/>
        </linearGradient>
      </defs>
      <rect width="320" height="108" fill="url(#sky1)"/>
      <circle cx="48" cy="64" r="30" fill="#1F6FA8" stroke="#143A57" stroke-width="2"/>
      <path d="M35,48 C45,45 52,53 48,61 C43,69 52,78 46,87 C36,87 28,75 28,63 C28,55 30,50 35,48 Z" fill="#329457"/>
      <path d="M58,53 C66,56 71,66 65,77 C61,83 55,80 54,70 C53,60 54,55 58,53 Z" fill="#329457"/>
      <rect x="94" y="28" width="102" height="72" rx="3" fill="#FFFDF8" stroke="#222" stroke-width="2"/>
      <text x="145" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="800" fill="#111">ANTALYA PACT</text>
      <line x1="104" y1="47" x2="186" y2="47" stroke="#C8C0B0" stroke-width="1"/>
      <text x="145" y="60" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="700" fill="#333">35% ELECTRICITY</text>
      <text x="145" y="75" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.2" font-weight="800" fill="#444">FOSSIL FUELS</text>
      <line x1="104" y1="72" x2="186" y2="72" stroke="#B91C1C" stroke-width="3.2"/>
      <text x="145" y="90" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.2" font-weight="800" fill="#B91C1C">1.5°C OVERSHOOT</text>
      <rect x="212" y="12" width="40" height="25" fill="#E30A17" stroke="#111" stroke-width="1.2"/>
      <circle cx="229" cy="24.5" r="6.5" fill="#FFF"/>
      <circle cx="231.2" cy="24.5" r="5.2" fill="#E30A17"/>
      <polygon points="236,24.5 241,22.5 239,24.5 241,26.5" fill="#FFF"/>
      <rect x="258" y="12" width="40" height="25" fill="#003399" stroke="#111" stroke-width="1.2"/>
      <circle cx="278" cy="24.5" r="7.5" fill="none" stroke="#FFCC00" stroke-width="1.8" stroke-dasharray="2,2.2"/>
      <circle cx="255" cy="64" r="22" fill="#FFF" stroke="#111" stroke-width="2.2"/>
      <line x1="255" y1="64" x2="255" y2="48" stroke="#B91C1C" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="255" y1="64" x2="268" y2="69" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="255" cy="64" r="2.2" fill="#111"/>
    </svg>`
  },
  {
    id: 2,
    region: 'africa',
    location: 'BENGHAZI, LIBYA',
    beat: 'UKRAINE WAR',
    badge: 'OFFICIALS · KYIV, REUTERS',
    stamp: 'MERKURY SUNK',
    stampBg: '#1F4B7A',
    subStamp: '7 SEA DRONES',
    headline: 'Ukrainian sea drones sink Russian corvette at Benghazi',
    summary: 'President Zelenskyy confirmed seven naval drones struck and sank the Steregushchiy-class corvette Merkury in Benghazi port (several dead, 10+ injured) and damaged a cargo ship; UN voiced alarm.',
    lat: 32.12,
    lon: 20.07,
    svg: `<svg viewBox="0 0 320 108" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="66" fill="#C9DFEE"/>
      <rect y="66" width="320" height="42" fill="#255D88"/>
      <rect x="12" y="42" width="18" height="24" fill="#D5C7B2"/>
      <rect x="34" y="34" width="22" height="32" fill="#C4B59D"/>
      <rect x="60" y="46" width="20" height="20" fill="#D5C7B2"/>
      <rect x="84" y="54" width="224" height="12" fill="#8C7E6D"/>
      <polygon points="240,60 306,60 300,72 246,72" fill="#64748B" stroke="#111" stroke-width="1.2"/>
      <rect x="262" y="48" width="24" height="12" fill="#475569"/>
      <g transform="translate(154,54) rotate(13)">
        <polygon points="-58,8 56,8 46,24 -48,24" fill="#4B5563" stroke="#111" stroke-width="1.6"/>
        <rect x="-24" y="-8" width="38" height="16" fill="#6B7280" stroke="#111" stroke-width="1.4"/>
        <line x1="-6" y1="-8" x2="-6" y2="-22" stroke="#111" stroke-width="2"/>
        <line x1="8" y1="-8" x2="8" y2="-18" stroke="#111" stroke-width="1.8"/>
      </g>
      <path d="M144,54 C136,34 152,22 166,28 C174,12 194,16 192,34 C204,34 206,50 190,54 Z" fill="#4B5563" opacity="0.82"/>
      <polygon points="150,60 158,38 167,52 174,34 182,58" fill="#F97316"/>
      <polygon points="156,60 162,46 169,56 174,44 178,60" fill="#FACC15"/>
      <path d="M16,92 L92,82" stroke="#E0F2FE" stroke-width="2" stroke-dasharray="5,3"/>
      <polygon points="92,80 112,77 108,84 88,85" fill="#111827"/>
      <path d="M44,98 L122,88" stroke="#E0F2FE" stroke-width="2" stroke-dasharray="4,3"/>
      <polygon points="122,86 140,83 136,89 118,90" fill="#111827"/>
    </svg>`
  },
  {
    id: 3,
    region: 'europe',
    location: 'KYIV REGION, UKRAINE',
    beat: 'WAR',
    badge: 'OFFICIALS · UKRAINE AF, AP',
    stamp: '186 DRONES',
    stampBg: '#1E293B',
    subStamp: '161 DOWNED · DYMER HIT',
    headline: '186 Russian drones hit Ukraine; Dymer apartment collapses',
    summary: 'Air defences downed or suppressed 161 of 186 UAVs (including 72 jet drones) overnight, Ukraine’s Air Force said. A strike shattered a five-story Dymer apartment block, killing at least 11–14 civilians.',
    lat: 50.78,
    lon: 30.30,
    svg: `<svg viewBox="0 0 320 108" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="108" fill="#142238"/>
      <path d="M16,96 Q90,26 154,32" fill="none" stroke="#93C5FD" stroke-width="1.6" stroke-dasharray="4,3"/>
      <path d="M28,96 Q116,18 202,24" fill="none" stroke="#93C5FD" stroke-width="1.6" stroke-dasharray="4,3"/>
      <g stroke="#FACC15" stroke-width="2">
        <line x1="72" y1="26" x2="86" y2="34"/><line x1="86" y1="26" x2="72" y2="34"/>
        <line x1="116" y1="30" x2="130" y2="38"/><line x1="130" y1="30" x2="116" y2="38"/>
        <line x1="146" y1="26" x2="162" y2="34"/>
      </g>
      <polygon points="150,24 166,28 152,32" fill="#EF4444"/>
      <polygon points="196,19 212,24 196,28" fill="#EF4444"/>
      <rect x="206" y="34" width="84" height="74" fill="#9CA3AF" stroke="#111" stroke-width="1.5"/>
      <polygon points="236,34 274,34 264,58 242,54" fill="#1F2937"/>
      <polygon points="244,54 256,36 266,54" fill="#F97316"/>
      <g fill="#FEF08A">
        <rect x="214" y="42" width="10" height="9"/><rect x="214" y="57" width="10" height="9"/>
        <rect x="214" y="72" width="10" height="9"/><rect x="272" y="57" width="10" height="9"/>
        <rect x="272" y="72" width="10" height="9"/><rect x="242" y="72" width="10" height="9"/>
      </g>
      <polygon points="222,108 248,92 288,96 306,108" fill="#4B5563"/>
    </svg>`
  }
];

const MIDS = [
  {
    id: 4,
    region: 'mideast',
    location: 'SITRA, BAHRAIN',
    tag: 'DISPUTED · MOFA / IRGC',
    stamp: '2 INJURED',
    stampBg: '#9D2B22',
    headline: 'Bahrain blames Iran for industrial fire; IRGC claims radar hits',
    summary: 'Manama said 2 hurt (1 critical) at civilian site; IRGC claimed Al-Riffa & Awali Patriot radars.',
    lat: 26.15,
    lon: 50.62,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#E8D8C3"/>
      <rect y="44" width="186" height="14" fill="#B59F84"/>
      <path d="M18,12 Q52,18 90,26" fill="none" stroke="#9D2B22" stroke-width="1.6" stroke-dasharray="3,2"/>
      <path d="M22,44 L36,28 L50,44" fill="none" stroke="#334155" stroke-width="2"/>
      <path d="M26,22 Q36,12 46,22" fill="none" stroke="#1E3A8A" stroke-width="2.6"/>
      <rect x="92" y="24" width="44" height="20" fill="#64748B" stroke="#111" stroke-width="1.2"/>
      <rect x="142" y="28" width="28" height="16" fill="#475569" stroke="#111" stroke-width="1.2"/>
      <polygon points="104,24 114,8 126,24" fill="#EA580C"/>
      <polygon points="110,24 116,13 122,24" fill="#FACC15"/>
      <path d="M112,10 C122,-2 142,2 146,16 C132,20 118,18 112,10 Z" fill="#4B5563" opacity="0.78"/>
    </svg>`
  },
  {
    id: 5,
    region: 'americas',
    location: 'UNITED STATES',
    tag: 'CONFIRMED · AP, BBC',
    stamp: '258 SEATS',
    stampBg: '#1D4ED8',
    headline: 'Democrats reach 258 US House seats, most since 1992',
    summary: 'Republican Virginia Foxx conceded NC-5 after recount by 330 votes.',
    lat: 36.1,
    lon: -80.2,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#EFF4FB"/>
      <rect x="16" y="34" width="52" height="18" fill="#CBD5E1" stroke="#475569" stroke-width="1"/>
      <path d="M26,34 A16,16 0 0,1 58,34 Z" fill="#94A3B8" stroke="#475569" stroke-width="1"/>
      <line x1="42" y1="12" x2="42" y2="18" stroke="#475569" stroke-width="1.6"/>
      <path d="M96,52 A44,44 0 0,1 174,52" fill="none" stroke="#DC2626" stroke-width="12"/>
      <path d="M96,52 A44,44 0 0,1 153,18" fill="none" stroke="#1D4ED8" stroke-width="12"/>
      <path d="M110,52 A30,30 0 0,1 160,52" fill="none" stroke="#DC2626" stroke-width="9"/>
      <path d="M110,52 A30,30 0 0,1 148,28" fill="none" stroke="#1D4ED8" stroke-width="9"/>
    </svg>`
  },
  {
    id: 6,
    region: 'europe',
    location: 'LIVERPOOL, UK',
    tag: 'CONFIRMED · BBC, GUARDIAN',
    stamp: '4–0 ANFIELD',
    stampBg: '#B91C1C',
    headline: 'Liverpool rout 10-man Man United 4–0 in Pochettino debut',
    summary: 'Yoro sent off; Szoboszlai, Wirtz & Ngumoha seal record debut defeat.',
    lat: 53.43,
    lon: -2.96,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#2E7D32"/>
      <line x1="93" y1="0" x2="93" y2="58" stroke="#E8F5E9" stroke-width="1.5"/>
      <circle cx="93" cy="29" r="14" fill="none" stroke="#E8F5E9" stroke-width="1.3"/>
      <rect x="134" y="10" width="46" height="38" fill="none" stroke="#E8F5E9" stroke-width="1.5"/>
      <circle cx="132" cy="30" r="6" fill="#FFF" stroke="#111" stroke-width="1.4"/>
      <rect x="102" y="12" width="13" height="20" rx="1.5" fill="#DC2626" stroke="#111" stroke-width="1.2"/>
    </svg>`
  },
  {
    id: 7,
    region: 'asia',
    location: 'CIKANDE, INDONESIA',
    tag: 'OFFICIALS · CNA, AP',
    stamp: '24 BODIES',
    stampBg: '#B45309',
    headline: '24 body bags recovered from burned Indonesian candy plant',
    summary: 'Search continues at PT Fonusa factory after Saturday fire; DNA checks start.',
    lat: -6.18,
    lon: 106.38,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#E9DFD1"/>
      <rect y="46" width="186" height="12" fill="#B5A694"/>
      <rect x="14" y="22" width="40" height="24" rx="2" fill="#FFF" stroke="#111" stroke-width="1.2"/>
      <rect x="30" y="26" width="8" height="3" fill="#DC2626"/><rect x="32.5" y="23.5" width="3" height="8" fill="#DC2626"/>
      <circle cx="24" cy="46" r="4" fill="#111"/><circle cx="44" cy="46" r="4" fill="#111"/>
      <rect x="96" y="24" width="76" height="28" fill="#57534E" stroke="#111" stroke-width="1.2"/>
      <polygon points="94,24 108,14 122,24 136,14 150,24 174,14 174,24" fill="#44403C"/>
      <polygon points="122,24 134,6 146,24" fill="#EA580C"/>
      <rect x="106" y="34" width="14" height="18" fill="#1C1917"/>
      <rect x="132" y="34" width="14" height="18" fill="#1C1917"/>
    </svg>`
  },
  {
    id: 8,
    region: 'asia',
    location: 'SEOUL, S. KOREA',
    tag: 'OFFICIALS · YONHAP, MOEF',
    stamp: 'KOSPI -5%',
    stampBg: '#B45309',
    headline: 'Seoul preps stabilization fund; education minister quits',
    summary: 'Lee Hyoung Il targets short-selling; Choi quits over 111 exam cheats.',
    lat: 37.57,
    lon: 126.98,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#F1F5F9"/>
      <line x1="10" y1="16" x2="176" y2="16" stroke="#CBD5E1" stroke-width="0.8" stroke-dasharray="2,2"/>
      <line x1="10" y1="32" x2="176" y2="32" stroke="#CBD5E1" stroke-width="0.8" stroke-dasharray="2,2"/>
      <polyline points="14,14 48,20 76,17 110,36 142,33 176,50" fill="none" stroke="#DC2626" stroke-width="3.2"/>
      <polygon points="176,50 165,49 173,39" fill="#DC2626"/>
      <circle cx="152" cy="18" r="10" fill="#FFF" stroke="#111" stroke-width="1.3"/>
      <path d="M145,18 A7,7 0 0,1 159,18" fill="#CD2E3A"/>
      <path d="M145,18 A7,7 0 0,0 159,18" fill="#0047A0"/>
    </svg>`
  },
  {
    id: 9,
    region: 'americas',
    location: 'LAS VEGAS, USA',
    tag: 'CONFIRMED · F1, FIA',
    stamp: 'P1 VERSTAPPEN',
    stampBg: '#5A3D82',
    headline: 'Verstappen wins chaotic Las Vegas GP with 35 lead swaps',
    summary: '04:00 UTC Sunday finish ahead of McLaren’s Norris (2nd) and Piastri (3rd).',
    lat: 36.11,
    lon: -115.17,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#1E1B4B"/>
      <rect y="40" width="186" height="18" fill="#334155"/>
      <line x1="12" y1="22" x2="62" y2="22" stroke="#93C5FD" stroke-width="1.6" stroke-dasharray="6,4"/>
      <path d="M84,42 L112,34 L154,34 L168,42 Z" fill="#E11D48"/>
      <circle cx="102" cy="44" r="6" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.5"/>
      <circle cx="152" cy="44" r="6" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.5"/>
      <rect x="160" y="6" width="18" height="12" fill="#FFF"/>
      <rect x="160" y="6" width="6" height="6" fill="#111"/><rect x="172" y="6" width="6" height="6" fill="#111"/>
      <rect x="166" y="12" width="6" height="6" fill="#111"/>
    </svg>`
  },
  {
    id: 10,
    region: 'europe',
    location: 'TURIN, ITALY',
    tag: 'CONFIRMED · ATP, AL JAZEERA',
    stamp: '6–2, 7–6',
    stampBg: '#1F4B7A',
    headline: 'Alcaraz tops Zverev 6–2, 7–6 for first ATP Finals title',
    summary: 'Spaniard sweeps world No. 1 in Turin final in straight sets.',
    lat: 45.07,
    lon: 7.69,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#1D4E89"/>
      <rect x="92" y="10" width="84" height="40" fill="#2563EB" stroke="#FFF" stroke-width="1.6"/>
      <line x1="134" y1="10" x2="134" y2="50" stroke="#FFF" stroke-width="1.5"/>
      <circle cx="114" cy="30" r="10" fill="#D9F99D" stroke="#111" stroke-width="1.2"/>
      <path d="M107,23 Q114,30 107,37 M121,23 Q114,30 121,37" fill="none" stroke="#FFF" stroke-width="1.4"/>
      <polygon points="48,14 68,14 64,28 52,28" fill="#FACC15" stroke="#111" stroke-width="1.2"/>
      <rect x="55" y="28" width="6" height="7" fill="#FACC15"/>
    </svg>`
  },
  {
    id: 11,
    region: 'oceania',
    location: 'WELLINGTON, NZ',
    tag: 'CONFIRMED · CRICBUZZ, HINDU',
    stamp: '720/9d',
    stampBg: '#0E7490',
    headline: 'India declare on record 720/9 against New Zealand',
    summary: 'Highest away Test score for India (Rahul 156, Pant 128); NZ trail 119/2.',
    lat: -41.29,
    lon: 174.78,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#CBE7C7"/>
      <polygon points="104,58 124,22 158,22 178,58" fill="#E5D5B5" stroke="#A89674"/>
      <line x1="134" y1="14" x2="134" y2="28" stroke="#111" stroke-width="2"/>
      <line x1="140" y1="14" x2="140" y2="28" stroke="#111" stroke-width="2"/>
      <line x1="146" y1="14" x2="146" y2="28" stroke="#111" stroke-width="2"/>
      <circle cx="164" cy="34" r="5.5" fill="#B91C1C" stroke="#111" stroke-width="1"/>
    </svg>`
  },
  {
    id: 12,
    region: 'africa',
    location: 'KHARTOUM, SUDAN',
    tag: 'REPORTED · AL JAZEERA',
    stamp: 'UN SITE HIT',
    stampBg: '#276749',
    headline: 'RSF drone strikes near Khartoum kill 4, hit UN site',
    summary: 'Pre-dawn strikes hit homes & UN compound near airport; air defences engaged.',
    lat: 15.5,
    lon: 32.56,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#E6DEC8"/>
      <path d="M18,16 L104,22" stroke="#B91C1C" stroke-width="1.8" stroke-dasharray="4,3"/>
      <polygon points="14,13 30,16 16,20" fill="#1F2937"/>
      <rect x="108" y="20" width="58" height="32" fill="#93C5FD" stroke="#1E3A8A" stroke-width="1.5"/>
      <text x="137" y="40" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="900" fill="#1E3A8A">UN</text>
      <polygon points="154,10 164,26 146,24" fill="#EA580C"/>
    </svg>`
  },
  {
    id: 13,
    region: 'asia',
    location: 'HONG KONG',
    tag: 'CONFIRMED · HKSAR, CHINA DAILY',
    stamp: '98.8% VOTE',
    stampBg: '#B45309',
    headline: 'Hong Kong fills all 723 Election Committee seats',
    summary: 'Provisional turnout reaches 98.79% among 856 candidates in 31 subsectors.',
    lat: 22.32,
    lon: 114.17,
    svg: `<svg viewBox="0 0 186 58" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="186" height="58" fill="#EFE7DA"/>
      <rect x="20" y="10" width="44" height="26" fill="#DE2910" stroke="#111" stroke-width="1.2"/>
      <circle cx="42" cy="23" r="6" fill="#FFF"/>
      <rect x="106" y="22" width="60" height="30" fill="#FFF" stroke="#111" stroke-width="1.5"/>
      <rect x="120" y="26" width="32" height="4" fill="#111"/>
      <polygon points="128,10 146,10 142,26 132,26" fill="#DC2626"/>
    </svg>`
  }
];

const BRIEFS = [
  { id: 14, region: 'europe', place: 'Portimão', text: 'Bezzecchi wins Portugal MotoGP; Marc Márquez 8th to seal 2026 title', src: 'MotoGP', lat: 37.23, lon: -8.63 },
  { id: 15, region: 'europe', place: 'Gulf of Finland', text: 'Towing starts on drone-damaged Russian cargo ship Sparta II', src: 'Reuters', lat: 60.1, lon: 26.2 },
  { id: 16, region: 'europe', place: 'Vatican', text: 'Pope Leo XIV hosts World Day of the Poor lunch for 1,300 guests', src: 'AP', lat: 41.9, lon: 12.45 },
  { id: 17, region: 'europe', place: 'Belgrade', text: 'Student-led coalition convenes Serbia’s new parliament after victory', src: 'Press', lat: 44.8, lon: 20.46 },
  { id: 18, region: 'europe', place: 'Paris', text: 'Sixth weekend of French rallies over housing and living costs', src: 'Al Jazeera', lat: 48.86, lon: 2.35 },
  { id: 19, region: 'mideast', place: 'Tehran', text: 'Iran starts 2-hour rolling power cuts; vows counter to US blockade', src: 'Tavanir, AP', lat: 35.69, lon: 51.39 },
  { id: 20, region: 'mideast', place: 'Gaza City', text: 'Israeli strikes kill 4; IDF intelligence warns on wider Iran war', src: 'Al Jazeera, FDD', lat: 31.5, lon: 34.47 },
  { id: 21, region: 'mideast', place: 'West Bank', text: 'Settlers torch 12+ Palestinian cars; Israeli opposition condemns', src: 'CNN, Haaretz', lat: 32.0, lon: 35.25 },
  { id: 22, region: 'mideast', place: 'Beirut', text: 'Muted 83rd Independence Day; UNIFIL begins south handover to LAF', src: 'AA, MEE', lat: 33.89, lon: 35.5 },
  { id: 23, region: 'mideast', place: 'Sanaa', text: 'Houthis claim Rabigh oil refinery strike; Saudis down western missile', src: 'Reuters', lat: 22.8, lon: 39.0 },
  { id: 24, region: 'americas', place: 'Vandenberg', text: 'SpaceX Falcon 9 launches classified NROL-136 spy mission (12:23 UTC)', src: 'NRO', lat: 34.74, lon: -120.57 },
  { id: 25, region: 'americas', place: 'Brasília', text: 'Ex-president Bolsonaro remains in ICU after bowel obstruction', src: 'Reuters', lat: -15.79, lon: -47.88 },
  { id: 26, region: 'americas', place: 'San Antonio', text: 'Wembanyama scores 50 pts, 19 reb as Spurs beat Pelicans 114–91', src: 'NBA', lat: 29.42, lon: -98.49 },
  { id: 27, region: 'americas', place: 'Florida', text: 'St Johns River hits record 18.8 ft near Cocoa; WPC warns coastal storm', src: 'NWS', lat: 28.39, lon: -80.74 },
  { id: 28, region: 'americas', place: 'Washington', text: 'US Justice Dept admits mistakenly deporting US citizen to Mexico', src: 'Guardian', lat: 38.9, lon: -77.03 },
  { id: 29, region: 'americas', place: 'Hawaii', text: 'Kilauea north vent overflows in precursor to new eruption', src: 'USGS', lat: 19.41, lon: -155.28 },
  { id: 30, region: 'asia', place: 'Naha, Japan', text: 'Okinawa celebrates Shuri Castle hall rebuild 7 years after fire', src: 'Yomiuri', lat: 26.21, lon: 127.72 },
  { id: 31, region: 'asia', place: 'Delhi', text: 'Emergency pollution curbs ordered as PM2.5 passes 200 ug/m3', src: 'PTI', lat: 28.61, lon: 77.21 },
  { id: 32, region: 'asia', place: 'Manipur', text: 'Toxic-liquor death toll climbs to 17; hundreds hospitalized', src: 'The Hindu', lat: 24.82, lon: 93.94 },
  { id: 33, region: 'asia', place: 'Guangzhou', text: 'China’s 2nd large homegrown cruise ship sails with 3,800+ guests', src: 'China Daily', lat: 23.13, lon: 113.26 },
  { id: 34, region: 'asia', place: 'N. Maluku', text: 'Mount Ibu & Semeru erupt; M5.4 quake hits NE of Bitung, Indonesia', src: 'Antara', lat: 1.49, lon: 127.63 },
  { id: 35, region: 'africa', place: 'Oyo, Congo', text: 'Kenya’s Ruto & DRC’s Tshisekedi agree to restore full diplomatic ties', src: 'Xinhua', lat: -1.16, lon: 15.97 },
  { id: 36, region: 'africa', place: 'Abuja', text: 'Nigeria breaks ground on $70M domestic passport printing plant', src: 'Pulse', lat: 9.06, lon: 7.49 },
  { id: 37, region: 'africa', place: 'W. Cape', text: 'Crews battle De Hoop–Malgas–Potberg wildfire near South Africa homes', src: 'Local', lat: -34.4, lon: 20.4 },
  { id: 38, region: 'oceania', place: 'Canberra', text: 'Marles rejects US CBO AUKUS report; opposition hits COP31 collapse', src: 'ABC', lat: -35.28, lon: 149.13 },
  { id: 39, region: 'oceania', place: 'Dubai / NZ', text: 'New Zealand Black Foils win SailGP Dubai final ($400K prize)', src: 'SailGP', lat: -36.85, lon: 174.76 },
  { id: 40, region: 'antarctica', place: 'Antarctica', text: 'Study ties Southern winter atmospheric rivers to global temp spikes', src: 'ARC / Melbourne', lat: -75.0, lon: 95.0 }
];

const ALL_STORIES = [...LEADS, ...MIDS, ...BRIEFS];

function verifyData() {
  if (ALL_STORIES.length !== 40) {
    throw new Error(`Expected 40 stories, got ${ALL_STORIES.length}`);
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
    padding: 10px 14px 8px 14px;
    display: flex;
    flex-direction: column;
  }
  .overline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    border-bottom: 2px solid #181818;
    padding-bottom: 3px;
  }
  .overline .left { color: #A81D1D; }
  .masthead {
    text-align: center;
    border-bottom: 1.5px solid #181818;
    padding: 2px 0 3px 0;
  }
  .masthead h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 52px;
    line-height: 1.0;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111111;
  }
  .masthead .subdeck {
    font-family: Georgia, "Times New Roman", serif;
    font-style: italic;
    font-size: 11.8px;
    color: #7A1414;
    margin-top: 2px;
  }
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    border-bottom: 1px solid #C8C0B0;
    padding: 3px 0;
    gap: 4px;
  }
  .kpi {
    text-align: center;
    border-right: 1px solid #D4CCC0;
    padding: 0 3px;
  }
  .kpi:last-child { border-right: none; }
  .kpi .num {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 17px;
    font-weight: 700;
    color: #A81D1D;
    line-height: 1.05;
  }
  .kpi .lbl {
    font-size: 8.6px;
    color: #2B2B2B;
    line-height: 1.15;
  }
  .region-bar {
    display: flex;
    height: 17px;
    margin-top: 3px;
    overflow: hidden;
  }
  .region-seg {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    font-size: 8.6px;
    font-weight: 800;
    letter-spacing: 0.02em;
    border-right: 1px solid #F6F2E8;
    white-space: nowrap;
    padding: 0 5px;
    min-width: fit-content;
  }
  .utc-strip {
    display: flex;
    align-items: stretch;
    border-top: 1px solid #C8C0B0;
    border-bottom: 2px solid #181818;
    margin-top: 3px;
    height: 20px;
    font-size: 8.8px;
  }
  .utc-badge {
    background: #181818;
    color: #FFF;
    font-weight: 800;
    padding: 0 7px;
    display: flex;
    align-items: center;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
  .utc-items {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    flex: 1;
  }
  .utc-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    border-left: 1px solid #D4CCC0;
    padding: 0 3px;
    white-space: nowrap;
  }
  .utc-item b { color: #A81D1D; }
  .leads {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 5px 0;
    border-bottom: 1.5px solid #181818;
  }
  .lead-card {
    border-right: 1px solid #C8C0B0;
    padding-right: 10px;
  }
  .lead-card:last-child { border-right: none; padding-right: 0; }
  .art-box {
    position: relative;
    border: 1px solid #B5AC9D;
    overflow: hidden;
  }
  .lead-art { height: 108px; }
  .stamp {
    position: absolute;
    left: 6px;
    top: 6px;
    color: #FFF;
    font-size: 16px;
    font-weight: 900;
    padding: 2px 6px;
    letter-spacing: 0.02em;
    line-height: 1.05;
    box-shadow: 0 1px 2px rgba(0,0,0,0.35);
  }
  .sub-stamp {
    position: absolute;
    right: 6px;
    bottom: 5px;
    background: rgba(17, 17, 17, 0.85);
    color: #FFF;
    font-size: 9px;
    font-weight: 800;
    padding: 2px 5px;
  }
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
    gap: 4px;
    font-size: 8.8px;
    font-weight: 800;
    color: #222;
  }
  .num-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    color: #FFF;
    font-size: 8.5px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .pill {
    font-size: 7.4px;
    font-weight: 800;
    border: 1px solid #555;
    padding: 1px 3px;
    color: #111;
    background: #EFE9DD;
    white-space: nowrap;
  }
  .lead-card h2 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 16.5px;
    line-height: 1.1;
    font-weight: 700;
    margin-top: 2px;
  }
  .lead-card p {
    font-size: 9.7px;
    line-height: 1.24;
    color: #262626;
    margin-top: 3px;
  }
  .mid-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 8px;
    row-gap: 5px;
    padding: 5px 0;
    border-bottom: 1.5px solid #181818;
  }
  .mid-card {
    border-right: 1px solid #D4CCC0;
    padding-right: 7px;
  }
  .mid-card:nth-child(5n) { border-right: none; padding-right: 0; }
  .mid-art { height: 58px; }
  .mid-stamp {
    position: absolute;
    left: 4px;
    bottom: 4px;
    color: #FFF;
    font-size: 14px;
    font-weight: 900;
    padding: 1.5px 5px;
    line-height: 1.05;
    box-shadow: 0 1px 2px rgba(0,0,0,0.35);
  }
  .mid-card h3 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 12px;
    line-height: 1.1;
    font-weight: 700;
    margin-top: 2px;
  }
  .mid-card p {
    font-size: 8.8px;
    line-height: 1.18;
    color: #2B2B2B;
    margin-top: 2px;
  }
  .lower-tier {
    display: grid;
    grid-template-columns: 248px 1fr;
    gap: 10px;
    padding: 6px 0 4px 0;
    flex: 1;
  }
  .sec-title {
    font-size: 9.2px;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #A81D1D;
    margin-bottom: 4px;
    border-bottom: 1px solid #C8C0B0;
    padding-bottom: 2px;
  }
  .briefs-cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 8px;
    row-gap: 4.5px;
  }
  .brief {
    font-size: 9.1px;
    line-height: 1.28;
    color: #1A1A1A;
  }
  .brief .bnum {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 13px;
    height: 13px;
    padding: 0 2px;
    border-radius: 6px;
    color: #FFF;
    font-size: 7.5px;
    font-weight: 800;
    margin-right: 2px;
    vertical-align: 0.5px;
  }
  .brief i { color: #555; }
  .date-check {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.2px solid #A81D1D;
    background: #EFE6D7;
    padding: 4px 7px;
    font-size: 8.9px;
    line-height: 1.26;
    margin-top: auto;
  }
  .dc-badge {
    background: #A81D1D;
    color: #FFF;
    font-weight: 800;
    font-size: 9.2px;
    padding: 5px 7px;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.8px;
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
    <div class="subdeck">COP31 collapses in record overtime with no fossil-fuel deal · Ukrainian sea drones sink Russian corvette in Libya · 186-drone barrage strikes Ukraine</div>
  </div>

  <div class="kpi-row">
    ${KPI_NUMBERS.map(k => `<div class="kpi"><div class="num">${k.num}</div><div class="lbl">${k.note}</div></div>`).join('')}
  </div>

  <div class="region-bar">
    ${REGIONS.map(r => `<div class="region-seg" style="flex:${counts[r.id]};background:${r.color};">${r.label} ${counts[r.id]}</div>`).join('')}
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
        <div class="stamp" style="background:${s.stampBg};">${s.stamp}</div>
        <div class="sub-stamp">${s.subStamp}</div>
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
        <div class="mid-stamp" style="background:${s.stampBg};">${s.stamp}</div>
      </div>
      <div class="meta-row">
        <div class="meta-left"><span class="num-dot" style="background:${regionColor[s.region]};">${s.id}</span><span style="font-size:7.6px;">${s.location}</span></div>
        <span class="pill" style="font-size:6.8px;">${s.tag.split(' · ')[0]}</span>
      </div>
      <h3>${s.headline}</h3>
      <p>${s.summary}</p>
    </div>`).join('')}
  </div>

  <div class="lower-tier">
    <div>
      <div class="sec-title">WHERE IT HAPPENED (PINS #1–13, DOTS #14–40)</div>
      ${buildWorldMapSvg(counts)}
    </div>
    <div>
      <div class="sec-title">ALSO ON SUNDAY 22 NOVEMBER 2026 — 27 WIRE BRIEFS ACROSS 7 CONTINENTS</div>
      <div class="briefs-cols">
        ${BRIEFS.map(b => `<div class="brief"><span class="bnum" style="background:${regionColor[b.region]};">${b.id}</span><b>${b.place}:</b> ${b.text}. <i>(${b.src})</i></div>`).join('')}
      </div>
    </div>
  </div>

  <div class="date-check">
    <div class="dc-badge">DATE CHECK</div>
    <div>
      <b>Every story on this page happened or was first reported on Sunday 22 November 2026 (00:00–23:59).</b>
      <b>Left out on purpose as earlier news (Nov 20–21):</b> Peru M6.7 quake, 5 Houthi missiles downed over Riyadh/Jizan, EU–Indonesia CEPA deal in Brussels, ESA BepiColombo Mercury orbit arrival, Sinaloa arrest of “El Chapo Isidro”, Cyclone Akvan Odisha landfall.
      <b>Not yet (Nov 23+):</b> Shuri Castle public reopening (Mon 23), NZ–India Test draw (Mon 23), Belgium air-traffic strike (Mon 23), Davis Cup Final 8 (Tue 24).
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
        const rect = page.getBoundingClientRect();
        const clipped = [];
        for (const el of document.querySelectorAll('.lead-card, .mid-card, .brief, .date-check, .footer')) {
          if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
            clipped.push(el.className + ':' + el.scrollHeight + '>' + el.clientHeight);
          }
        }
        return {
          scrollHeight: doc.scrollHeight,
          scrollWidth: doc.scrollWidth,
          pageBottom: Math.round(rect.bottom),
          clipped
        };
      })()`,
      returnByValue: true
    });

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
