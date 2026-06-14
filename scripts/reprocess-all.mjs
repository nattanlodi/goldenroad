// ============================================================================
// REPROCESSA O JOGO INTEIRO — re-roda todos os rft-w/rft-msi-<ano>.mjs com a régua
// atual (rft-config.mjs), reaplica as CURADORIAS documentadas, e re-crava os overalls
// nos src/data/{worlds,msi}/<ano>.ts. Casa por nome (único por ano).
//
// USO: mude um knob em rft-config.mjs (ou opp-strength.mjs) e rode:
//   node scripts/reprocess-all.mjs            (aplica de verdade)
//   node scripts/reprocess-all.mjs --dry      (só mostra o que mudaria)
//
// Os dados de entrada (geral+playoff+tags) vivem nos rft-w/rft-msi-<ano>.mjs — não são
// tocados. Só os .ts (overalls finais) são reescritos.
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";

const DRY = process.argv.includes("--dry");
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// anos com motor novo
const WORLDS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const MSI = [2015, 2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025];

// --- CURADORIAS (overrides manuais somados ao recálculo cru, por nome normalizado) ---
// Documentadas em memory/overall-calibracao.md. DELTA = soma ao cru; teto 100.
const CUR_WORLDS = {
  2022: { kingen: 3, pyosik: 3, zeka: 3, deft: 3, beryl: 3 },                 // DRX +3 (zebra lendária)
  2023: { theshy: 2, weiwei: 2, xiaohu: 2, light: 2, crisp: 2, zeus: 1 },     // WBG vice +2; Zeus duplo-MVP (+1 extra além do fMVP do motor)
  2024: { knight: 1, faker: 1 },                                              // knight MVP torneio +1; Faker clutch +1
  2025: { kiin: 5, canyon: 5, chovy: 5, ruler: 5, duro: 5, bdd: 1 },          // Gen.G +5 (exclusivo); Bdd MVP torneio +1
};
const CUR_MSI = {}; // o MSI não tem curadorias externas hoje (o motor já aplica os MVPs).

function runEngine(cmd) {
  const out = execSync(cmd, { encoding: "utf8" });
  const o = {};
  for (const line of out.split("\n")) {
    const m = line.match(/^\s+(\S+)\s+base\s+\d+.*=>\s+(\d+)/);
    if (m) o[norm(m[1])] = +m[2];
  }
  return o;
}

function patchTs(path, cru, cur) {
  let ts = readFileSync(path, "utf8");
  let changed = 0; const log = [];
  ts = ts.replace(/\[\s*"([A-Z]+)",\s*"([^"]+)",\s*(\d+)((?:,\s*"[a-z]{2}")?)\s*\]/g, (full, role, name, oldOv, tail) => {
    const key = norm(name);
    let f = cru[key];
    if (f == null) return full; // suíça/play-in (sem playoff no motor) → mantém
    const d = (cur && cur[key]) || 0;
    f = Math.min(100, f + d);
    if (f !== +oldOv) { changed++; log.push(`    ${name.padEnd(12)} ${oldOv} -> ${f}${d ? ` (cur +${d})` : ""}`); }
    return `["${role}", "${name}", ${f}${tail}]`;
  });
  if (!DRY) writeFileSync(path, ts);
  return { changed, log };
}

let totalChanged = 0;
for (const y of WORLDS) {
  const mjs = `scripts/rft-w-${y}.mjs`;
  const ts = `src/data/worlds/${y}.ts`;
  if (!existsSync(mjs) || !existsSync(ts)) continue;
  const cru = runEngine(`node ${mjs}`);
  const { changed, log } = patchTs(ts, cru, CUR_WORLDS[y]);
  totalChanged += changed;
  console.log(`Worlds ${y}: ${changed} overalls ${DRY ? "mudariam" : "atualizados"}`);
  if (changed && log.length <= 12) log.forEach(l => console.log(l));
}
for (const y of MSI) {
  const mjs = `scripts/rft-msi-${y}.mjs`;
  const ts = `src/data/msi/${y}.ts`;
  if (!existsSync(mjs) || !existsSync(ts)) continue;
  const cru = runEngine(`node ${mjs}`);
  const { changed, log } = patchTs(ts, cru, CUR_MSI[y]);
  totalChanged += changed;
  console.log(`MSI ${y}: ${changed} overalls ${DRY ? "mudariam" : "atualizados"}`);
  if (changed && log.length <= 12) log.forEach(l => console.log(l));
}
console.log(`\n${DRY ? "[DRY] " : ""}TOTAL: ${totalChanged} overalls ${DRY ? "mudariam" : "re-cravados"}.`);
if (!DRY) console.log("⚠ rode `npx tsc --noEmit && npx vite build` p/ validar.");
