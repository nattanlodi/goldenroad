// Aplica os novos overalls (RFT recalculado) nos worlds/<ano>.ts, SÓ nos 8
// primeiros times de cada ano (os de playoff). Casa por nome de jogador dentro
// dos blocos de roster. Times de fase de grupos (9º+) ficam intactos.
//
// Uso: node apply-rft.mjs            (mostra o que mudaria, sem gravar)
//      node apply-rft.mjs --write    (grava)
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const WRITE = process.argv.includes("--write");
const YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// roda um rft-<ano>.mjs capturando os overalls que ele imprime (linha "Nome ... => NN")
import { execSync } from "node:child_process";

function novosDoAno(year) {
  const out = execSync(`npx tsx scripts/rft-${year}.mjs`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const map = new Map();
  for (const line of out.split("\n")) {
    const m = line.match(/^\s*(\S+)\s+base.*=>\s*(\d+)/);
    if (m) map.set(m[1], +m[2]);
  }
  return map;
}

let totalMudancas = 0;
for (const year of YEARS) {
  const novos = novosDoAno(year);
  const path = `src/data/worlds/${year}.ts`;
  let src = fs.readFileSync(path, "utf8");

  // pega os blocos { id: "...", ... players: [ ... ] } na ordem; só os 8 primeiros são playoff
  // (2011 tem 4, mas 2011 não passa por aqui). Vamos achar cada array de players.
  const playerArrays = [...src.matchAll(/players:\s*\[([\s\S]*?)\]\s*\}/g)];
  const mudancasAno = [];
  let novoSrc = src;
  playerArrays.forEach((arr, idx) => {
    if (idx >= 8) return; // só playoff
    const bloco = arr[0];
    // troca cada tupla ["ROLE","Nome",NN,...] pelo novo overall, casando por nome
    const novoBloco = bloco.replace(/\["(\w+)",\s*"([^"]+)",\s*(\d+)/g, (full, role, nome, ov) => {
      // tenta casar pelo nome exato; senão pela 1ª palavra (ex "Alex Ich" -> "Alex", "Hans Sama" -> "Hans")
      let novo = novos.get(nome);
      if (novo === undefined) novo = novos.get(nome.split(" ")[0]);
      if (novo === undefined) return full; // não achou: mantém
      if (novo !== +ov) mudancasAno.push(`${nome}: ${ov}->${novo}`);
      return `["${role}", "${nome}", ${novo}`;
    });
    novoSrc = novoSrc.replace(bloco, novoBloco);
  });

  totalMudancas += mudancasAno.length;
  console.log(`\n${year}: ${mudancasAno.length} mudanças`);
  if (mudancasAno.length) console.log("  " + mudancasAno.join(" · "));
  if (WRITE) fs.writeFileSync(path, novoSrc);
}
console.log(`\n${WRITE ? "GRAVADO" : "DRY-RUN"} · total ${totalMudancas} mudanças`);
void pathToFileURL;
