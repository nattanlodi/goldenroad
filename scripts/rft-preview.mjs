// Protótipo da fórmula de mescla (colocação + RFT) — validação em 2013.
// base por colocação (ancora) + ajuste individual derivado do RFT do evento.

// RFT 1.0 do Worlds 2013 (só os times que viram playoff no nosso pool):
// SKT (campeão), Royal Club (vice), NaJin BS (semi), Fnatic (semi),
// Gamania (quartas), Gambit (quartas), OMG (quartas), C9 (quartas)
const RFT_2013 = {
  // SKT — campeão
  Impact:66.6, Bengi:56.2, Faker:60.8, Piglet:59.3, PoohManDu:57.0,
  // Royal Club — vice
  Ackerman:53.5, Tabe:51.7, Wh1t3zZ:58.1, Uzi:51.2,
  // NaJin Black Sword — semi
  Expession:62.4, Watch:49.4, Nagne:55.0, PraY:48.1, Cain:49.9,
  // Fnatic — semi
  sOAZ:66.5, Cyanide:54.1, xPeke:63.2, Puszu:57.8, YellOwStaR:60.4,
  // Gambit — quartas
  Darien:62.4, Diamondprox:50.7, "Alex Ich":59.1, Genja:49.2, Voidle:52.0,
  // OMG — quartas
  Gogoing:65.6, LoveLing:54.0, Cool:63.9, san:55.6, comA:63.0,
  // Cloud9 — quartas
  BalIs:61.7, Meteos:52.1, /*Hai mid?*/ Sneaky:47.6, LemonNation:50.6,
  // Samsung Ozone (Gamania? não) — usar Gamania Bears se houver; fallback
};

const vals = Object.values(RFT_2013);
const mean = vals.reduce((a,v)=>a+v,0)/vals.length;
const sd = Math.sqrt(vals.reduce((a,v)=>a+(v-mean)**2,0)/vals.length);
const max = Math.max(...vals);
console.log(`RFT 2013 (pool playoff): média ${mean.toFixed(1)} · desvio ${sd.toFixed(1)} · max ${max}`);

const K = 1.2;
// base por colocação
function preview(name, base, capLo, capHi){
  const rft = RFT_2013[name];
  if(rft==null){ console.log(`  ${name.padEnd(12)} (sem RFT)`); return; }
  let adj = Math.round((rft-mean)*K);
  let ov = base+adj;
  ov = Math.max(capLo, Math.min(capHi, ov));
  console.log(`  ${name.padEnd(12)} RFT ${String(rft).padStart(4)}  base ${base}  adj ${adj>=0?'+':''}${adj}  => ${ov}`);
}
console.log("\n-- SKT (campeão, base 88, cap 80-99) --");
["Impact","Bengi","Faker","Piglet","PoohManDu"].forEach(n=>preview(n,88,80,96));
console.log("-- Royal Club (vice, base 84, cap 74-96) --");
["Ackerman","Tabe","Wh1t3zZ","Uzi"].forEach(n=>preview(n,84,74,95));
console.log("-- Fnatic (semi, base 81, cap 71-96) --");
["sOAZ","Cyanide","xPeke","Puszu","YellOwStaR"].forEach(n=>preview(n,81,71,94));
console.log("-- OMG (quartas, base 78, cap 68-90) --");
["Gogoing","LoveLing","Cool","san","comA"].forEach(n=>preview(n,78,68,90));
