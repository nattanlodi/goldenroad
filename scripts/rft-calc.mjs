// Calculadora genérica: dado um mapa {nome:[rft,base]}, imprime a nota mesclada.
// média = média do RFT dos jogadores de playoff informados.
const K = 1.2;
const caps = { 88:[80,96], 84:[74,95], 81:[71,94], 78:[68,90] }; // base -> [lo,hi]
function run(label, entries){ // entries: [name, rft, base]
  const rfts = entries.map(e=>e[1]);
  const mean = rfts.reduce((a,v)=>a+v,0)/rfts.length;
  console.log(`\n== ${label} == (média RFT playoff ${mean.toFixed(1)})`);
  for(const [name,rft,base] of entries){
    const [lo,hi]=caps[base];
    let ov = Math.max(lo,Math.min(hi, base+Math.round((rft-mean)*K)));
    console.log(`  ${name.padEnd(12)} rft ${String(rft).padStart(4)} base ${base} => ${ov}`);
  }
}
// Worlds 2014 — playoff: SSW(camp), SHRC(vice), SSB+OMG(semi), TSM+C9+EDG+NWS(quartas)
run("2014 playoff", [
  // Samsung White (campeão, base 88)
  ["PawN",82.8,88],["Looper",79.9,88],["Mata",79.8,88],["DanDy",74.3,88],["imp",62.6,88],
  // Star Horn Royal Club (vice, base 84)
  ["Cola",50.4,84],["inSec",48.1,84],["Corn",55.6,84],["Uzi",57.0,84],["zero",61.0,84],
  // Samsung Blue (semi, base 81)
  ["Acorn",52.7,81],["Spirit",54.1,81],["Dade",57.0,81],["Deft",54.2,81],["Heart",59.4,81],
  // OMG (semi, base 81)
  ["Gogoing",65.7,81],["LoveLing",56.3,81],["Cool",64.1,81],["san",55.1,81],["Cloud",65.0,81],
  // TSM (quartas, base 78)
  ["Dyrus",53.6,78],["Amazing",0,78],["Bjergsen",63.2,78],["WildTurtle",50.4,78],["Lustboy",56.8,78],
  // Cloud9 (quartas, base 78)
  ["Balls",54.4,78],["Meteos",53.7,78],["Hai",54.2,78],["Sneaky",53.4,78],["LemonNation",60.1,78],
  // EDward Gaming (quartas, base 78)
  ["Korol",63.0,78],["Mann",57.1,78],["U",66.0,78],["NaMei",51.6,78],["fzzf",58.7,78],
  // NaJin White Shield (quartas, base 78)
  ["Save",53.1,78],["Watch",49.1,78],["Ggoong",67.2,78],["Zefa",50.7,78],["GorillA",56.6,78],
]);
