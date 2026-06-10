// Curated roster of iconic Worlds team-campaigns.
// Roles order is always: TOP, JNG, MID, BOT, SUP
// "rating" is a subjective "legend" score (0-99) used only for the in-game line score.
// "champion" = won the World Championship that year.

export const TEAMS = [
  { id: "t1-2013", team: "SK Telecom T1", short: "SKT", year: 2013, league: "LCK", champion: true,
    players: [["TOP","Impact",90],["JNG","Bengi",92],["MID","Faker",99],["BOT","Piglet",88],["SUP","PoohManDu",84]] },
  { id: "t1-2015", team: "SK Telecom T1", short: "SKT", year: 2015, league: "LCK", champion: true,
    players: [["TOP","MaRin",90],["JNG","Bengi",90],["MID","Faker",99],["BOT","Bang",91],["SUP","Wolf",89]] },
  { id: "t1-2016", team: "SK Telecom T1", short: "SKT", year: 2016, league: "LCK", champion: true,
    players: [["TOP","Duke",87],["JNG","Blank",84],["MID","Faker",99],["BOT","Bang",91],["SUP","Wolf",89]] },
  { id: "t1-2022", team: "T1", short: "T1", year: 2022, league: "LCK", champion: false,
    players: [["TOP","Zeus",91],["JNG","Oner",90],["MID","Faker",98],["BOT","Gumayusi",91],["SUP","Keria",95]] },
  { id: "t1-2023", team: "T1", short: "T1", year: 2023, league: "LCK", champion: true,
    players: [["TOP","Zeus",93],["JNG","Oner",91],["MID","Faker",98],["BOT","Gumayusi",92],["SUP","Keria",96]] },
  { id: "t1-2024", team: "T1", short: "T1", year: 2024, league: "LCK", champion: true,
    players: [["TOP","Zeus",92],["JNG","Oner",91],["MID","Faker",98],["BOT","Gumayusi",92],["SUP","Keria",95]] },
  { id: "ssg-2017", team: "Samsung Galaxy", short: "SSG", year: 2017, league: "LCK", champion: true,
    players: [["TOP","CuVee",88],["JNG","Ambition",90],["MID","Crown",85],["BOT","Ruler",95],["SUP","CoreJJ",92]] },
  { id: "ssg-2016", team: "Samsung Galaxy", short: "SSG", year: 2016, league: "LCK", champion: false,
    players: [["TOP","CuVee",87],["JNG","Ambition",88],["MID","Crown",86],["BOT","Ruler",93],["SUP","CoreJJ",90]] },
  { id: "dwg-2020", team: "DAMWON Gaming", short: "DWG", year: 2020, league: "LCK", champion: true,
    players: [["TOP","Nuguri",92],["JNG","Canyon",95],["MID","ShowMaker",94],["BOT","Ghost",86],["SUP","BeryL",90]] },
  { id: "dk-2021", team: "DWG KIA", short: "DK", year: 2021, league: "LCK", champion: false,
    players: [["TOP","Khan",89],["JNG","Canyon",94],["MID","ShowMaker",93],["BOT","Ghost",86],["SUP","BeryL",90]] },
  { id: "drx-2022", team: "DRX", short: "DRX", year: 2022, league: "LCK", champion: true,
    players: [["TOP","Kingen",88],["JNG","Pyosik",85],["MID","Zeka",90],["BOT","Deft",92],["SUP","BeryL",91]] },
  { id: "edg-2021", team: "EDward Gaming", short: "EDG", year: 2021, league: "LPL", champion: true,
    players: [["TOP","Flandre",87],["JNG","Jiejie",88],["MID","Scout",90],["BOT","Viper",93],["SUP","Meiko",91]] },
  { id: "fpx-2019", team: "FunPlus Phoenix", short: "FPX", year: 2019, league: "LPL", champion: true,
    players: [["TOP","GimGoon",84],["JNG","Tian",91],["MID","Doinb",90],["BOT","Lwx",88],["SUP","Crisp",87]] },
  { id: "ig-2018", team: "Invictus Gaming", short: "IG", year: 2018, league: "LPL", champion: true,
    players: [["TOP","TheShy",94],["JNG","Ning",86],["MID","Rookie",93],["BOT","JackeyLove",92],["SUP","Baolan",82]] },
  { id: "jdg-2023", team: "JD Gaming", short: "JDG", year: 2023, league: "LPL", champion: false,
    players: [["TOP","369",89],["JNG","Kanavi",90],["MID","Knight",93],["BOT","Ruler",94],["SUP","Missing",86]] },
  { id: "rng-2018", team: "Royal Never Give Up", short: "RNG", year: 2018, league: "LPL", champion: false,
    players: [["TOP","Letme",84],["JNG","Mlxg",87],["MID","Xiaohu",89],["BOT","Uzi",95],["SUP","Ming",88]] },
  { id: "rng-2022", team: "Royal Never Give Up", short: "RNG", year: 2022, league: "LPL", champion: false,
    players: [["TOP","Breathe",85],["JNG","Wei",87],["MID","Xiaohu",89],["BOT","GALA",90],["SUP","Ming",89]] },
  { id: "g2-2019", team: "G2 Esports", short: "G2", year: 2019, league: "LEC", champion: false,
    players: [["TOP","Wunder",86],["JNG","Jankos",88],["MID","Caps",93],["BOT","Perkz",91],["SUP","Mikyx",87]] },
  { id: "g2-2018", team: "G2 Esports", short: "G2", year: 2018, league: "LEC", champion: false,
    players: [["TOP","Wunder",85],["JNG","Jankos",87],["MID","Perkz",90],["BOT","Hjarnan",83],["SUP","Wadid",82]] },
  { id: "fnc-2018", team: "Fnatic", short: "FNC", year: 2018, league: "LEC", champion: false,
    players: [["TOP","sOAZ",82],["JNG","Broxah",84],["MID","Caps",91],["BOT","Rekkles",92],["SUP","Hylissang",86]] },
  { id: "tpa-2012", team: "Taipei Assassins", short: "TPA", year: 2012, league: "LMS", champion: true,
    players: [["TOP","Stanley",82],["JNG","Lilballz",80],["MID","Toyz",86],["BOT","bebe",84],["SUP","MiSTakE",83]] }
];

export const ROLES = ["TOP","JNG","MID","BOT","SUP"];

export const ROLE_LABELS = { TOP:"Top", JNG:"Jungle", MID:"Mid", BOT:"Atirador", SUP:"Suporte" };
