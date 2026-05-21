// modules/KBLX_ASCII_BOOT.js
// KOBLLUX :: ASCII BOOT MODULE
// Perfis: 7-8 | 7-9

const KBLX_ASCII_BOOT_VERSION = '7.9.78K';

const KBLX_BOOT_PROFILES = {
  '7-8': {
    label: 'MAIN-0 7-8',
    hash: '1778•78K',
    tag: 'inline-7-8',
    signal: 'KAOS 6-0 :: RHEA IN 7-8',
  },
  '7-9': {
    label: 'MAIN-0 7-9',
    hash: '1778•78K',
    tag: 'inline-7-9',
    signal: 'KAOS 6-0 :: RHEA IN 7-9',
  },
};

function buildAscii(profile) {
  const title = profile.label;
  const signal = profile.signal;
  const tag = profile.tag;

  return `

██╗  ██╗ ██████╗ ██████╗ ██╗     ██╗     ██╗   ██╗██╗  ██╗
██║ ██╔╝██╔═══██╗██╔══██╗██║     ██║     ██║   ██║╚██╗██╔╝
█████╔╝ ██║   ██║██████╔╝██║     ██║     ██║   ██║ ╚███╔╝
██╔═██╗ ██║   ██║██╔══██╗██║     ██║     ██║   ██║ ██╔██╗
██║  ██╗╚██████╔╝██████╔╝███████╗███████╗╚██████╔╝██╔╝ ██╗
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝

╔══════════════════════════════════════════════════╗
║ KOBLLUX :: ${title.padEnd(34)}║
║ HASH :: ${profile.hash.padEnd(40)}║
║ TAG  :: ${tag.padEnd(42)}║
║ SIG  :: ${signal.padEnd(42)}║
╚══════════════════════════════════════════════════╝

            ◉
         ◉  |  ◉
      ◉──── 78K ────◉
         ◉  |  ◉
            ◉
`;
}

function bootKBLX(version = '7-8', opts = {}) {
  const profile = KBLX_BOOT_PROFILES[version] || KBLX_BOOT_PROFILES['7-8'];

  if (!opts.force && window.__KBLX_ASCII_BOOT_ACTIVE__ === profile.tag) {
    console.log(`[78K] boot skipped -> ${profile.tag} already active`);
    return profile;
  }

  window.__KBLX_ASCII_BOOT_ACTIVE__ = profile.tag;

  //if (opts.clear !== false) console.clear();

  console.group(`[KOBLLUX] ASCII BOOT :: ${profile.label}`);

  console.log(buildAscii(profile));

  console.log(
    `[78K] connected :: ${profile.label} :: ${profile.hash} :: ${profile.tag}`
  );

  console.log(`[78K] signal :: ${profile.signal}`);
  console.log(`[78K] app    :: generated.app`);
  console.log(`[78K] mode   :: ${version}`);
  console.log(`[78K] status :: online`);

  console.log(`
[00] init  :: ok
[01] core  :: ok
[02] sync  :: ok - view pending
[03] motor :: ready
[04] dock  :: ready
[05] orb   :: ready
[06] arch  :: ready
[07] flow  :: live
`);

  console.groupEnd();

  window.KBLX_BOOT = {
    version: KBLX_ASCII_BOOT_VERSION,
    profile: version,
    hash: profile.hash,
    tag: profile.tag,
    signal: profile.signal,
    ts: 1778715871351,
    id: '348fab2c-a5ef-4d12-8e5b-3fde8577db6a',
    meta: { app: 'generated.app' },
  };

  return profile;
}

export function bootKBLX78() {
  return bootKBLX('7-8');
}

export function bootKBLX79() {
  return bootKBLX('7-9');
}

export { bootKBLX, KBLX_BOOT_PROFILES, KBLX_ASCII_BOOT_VERSION };

const AUTO_PROFILE = window.KBLX_PROFILE || '7-8';
bootKBLX(AUTO_PROFILE);
