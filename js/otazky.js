// Vlastní otázky pro offline Křížovkáře. Odpovědi zadáváme bez mezer a diakritiky.
// Obtížnost: 1 lehká, 2 střední, 3 těžká.
const SKUPINY = {
  vcely: {
    title: 'Včelaření', icon: '✦', entries: `
MED|Sladký produkt včel|1
UL|Domov včelstva|1
VCELA|Hmyz vyrábějící med|1
MATKA|Jediná plodná samice v běžném včelstvu|1
TRUBEC|Samec včely|1
DELNICE|Včela vykonávající práci v úlu|1
VOSK|Látka, z níž včely staví plástve|1
PYL|Zdroj bílkovin pro včelstvo|1
NEKTAR|Sladká šťáva sbíraná z květů|1
PLAST|Vosková stavba s buňkami|1
RAMEK|Dřevěná konstrukce držící plást|1
ROJ|Skupina včel odlétající s matkou|1
MEDNIK|Nástavek určený hlavně pro med|2
PLOD|Vajíčka, larvy a kukly v buňkách|2
ODDELEK|Nové malé včelstvo vytvořené z rámků|2
ZIHADLO|Obranný orgán včely|1
MEDOMET|Přístroj k vytáčení medu|2
KOURAK|Pomůcka vytvářející kouř u včel|2
SNU SKA|Přínos nektaru a pylu do úlu|2
PROPOLIS|Včelí tmel|2
MATECNIK|Zvláštní buňka pro vývoj matky|2
LARVA|Vývojové stadium mezi vajíčkem a kuklou|1
BUNKA|Šestihranný prostor v plástu|1
VICKO|Voskový uzávěr buňky se zásobami či plodem|2
VCE LSTVO|Soubor včel žijících v jednom úlu|2
PASTVA|Rostliny poskytující včelám potravu|2
CUKR|Surovina pro přípravu zimního krmení|1
ZASOBY|Zimní potrava uložená v plástech|1
KLESTIK|Parazit včel známý také jako varroa|3
VARROA|Latinské rodové jméno kleštíka|3
VYTA CENI|Získávání medu odstředěním plástů|2
KR MITKO|Nádoba pro podávání cukerného roztoku|2
PODLOZKA|Vložka pod úlem pro sledování spadu|2
CESNO|Vletový otvor úlu|2
DYM|Pomáhá při uklidnění včel|1
KUKLA|Vývojové stadium hmyzu po larvě|1
ZIMOVANI|Přečkání zimy včelstvem|2
SIRUP|Roztok cukru a vody ke krmení|1
VCE LAR|Člověk pečující o včely|1
ULICKA|Prostor mezi dvěma obsazenými plásty|3
ZAVICKOVANI|Uzavírání buněk voskovými víčky|3
KOS IK|Nádobka na pyl na zadních nohách včely|3
CHOV|Cílené rozmnožování včelstev|1
NEZMAR|Živočich se schopností regenerace (ne včela)|3`
  },
  slepice: {
    title: 'Slepice a zahrada', icon: '◈', entries: `
VEJCE|Co snáší slepice|1
SLEPICE|Samice kura domácího|1
KOHOUT|Samec kura domácího|1
KURE|Mladý kur domácí|1
KURNIK|Domek pro slepice|1
HNIZDO|Místo, kde slepice snáší vejce|1
BIDLO|Tyč, na níž slepice nocují|1
ZRNI|Obecný název obilného krmiva|1
PSENICE|Obilovina běžná v krmení drůbeže|1
KUKURICE|Obilovina se žlutými zrny na palici|1
SLUNECNICE|Rostlina s olejnatými semeny|1
CERVI|Sušené larvy jako doplňkové krmivo|1
NOSNICE|Slepice chovaná kvůli vajíčkům|1
SKORAPKA|Tvrdý obal vajíčka|1
BILEK|Průhledná část syrového vejce|1
ZLOUTEK|Žlutá část vejce|1
STELIVO|Materiál na dno kurníku|2
KVOCNA|Slepice sedící na násadových vejcích|2
KURATKO|Zdrobněle mládě slepice|1
VYBEH|Oplocený prostor pro drůbež|1
ZOB AK|Tvrdá část hlavy k přijímání potravy|1
HREBEN|Červený útvar na hlavě slepice|1
PERI|Tělesný pokryv ptáků|1
KRIDLO|Končetina ptáka určená k letu|1
OSTRUHA|Rohovitý výrůstek na noze kohouta|2
KRMIVO|Potrava podávaná hospodářským zvířatům|1
GRANULE|Lisovaná forma krmné směsi|1
REPA|Okopanina vhodná jako krmný doplněk|1
LIHNUTI|Proces, při němž se mládě dostává z vejce|2
LIHEN|Přístroj pro umělé líhnutí|2
PODSTYLKA|Vrstva slámy nebo hoblin v kurníku|2
VLA SKA|Štíhlé plemeno slepic s bílými ušními laloky|3
LEGHORN|Známé lehké nosné plemeno|2
SUSSEX|Anglické plemeno slepic|2
DOMINANT|Obchodní označení hybridních nosnic|2
KALCIUM|Jiný název pro vápník|3
VAPNIK|Minerál důležitý pro pevnost skořápky|1
KLOAKA|Společné vyústění trávicí a vylučovací soustavy ptáků|3
LALOK|Masitý útvar pod zobákem slepice|2
LISKA|Šelma ohrožující drůbež|1
KUNA|Menší šelma, která umí navštívit kurník|1
PLOT|Ohrazení výběhu|1
RANNI|Související s první částí dne|1`
  },
  dilna: {
    title: 'Dílna a stavba', icon: '⌂', entries: `
KLADIVO|Nástroj pro zatloukání hřebíků|1
HREBIK|Kovový spojovací prvek zatloukaný kladivem|1
SROUB|Spojovací prvek se závitem|1
MATICE|Kovový protikus šroubu|1
PILA|Nářadí k řezání materiálu|1
VRTACKA|Nářadí k vrtání otvorů|1
KLIC|Nářadí k utahování matic|1
KLESTE|Nástroj k uchopení a stisknutí|1
METR|Pomůcka pro měření délky|1
VODOVAHA|Pomůcka ke kontrole vodorovnosti|1
DREVO|Přírodní stavební materiál ze stromů|1
BETON|Směs cementu, kameniva a vody|1
CEMENT|Pojivo pro výrobu betonu|1
C IHLA|Pálený stavební blok|1
TRAM|Silný dřevěný nosník|1
LAT|Úzký prvek krovu|1
PALUBKA|Profilované prkno s perem a drážkou|2
PERGOLA|Zahradní zastřešená konstrukce|1
KULNA|Malá stavba na nářadí a vybavení|1
STRECHA|Horní krycí část domu|1
OKAP|Odvodnění okraje střechy|1
ZLAB|Kanál pro odvod vody|2
PATKA|Betonový základ pod sloup|2
KROV|Nosná konstrukce střechy|2
FOLIE|Tenká ochranná vrstva materiálu|1
IZOLACE|Ochrana proti chladu, vodě či hluku|2
BRUSKA|Elektrický nástroj k broušení|2
HOBLIK|Nástroj k opracování dřeva|2
TESAR|Řemeslník pracující s dřevěnými konstrukcemi|2
ZEDNIK|Řemeslník stavějící zdivo|1
MALTA|Směs pro spojování cihel|2
STERK|Drobné kamenné kamenivo|1
PRKNO|Plochý podélný kus řeziva|1
HRANOL|Dřevěný prvek obdélníkového průřezu|1
KOTVA|Prvek k upevnění do podkladu|2
SVERAK|Zařízení k pevnému sevření dílce|2
VYKRES|Technický podklad se zakreslenými rozměry|2
SKLON|Úhel nakloněné roviny|2
ROHOR|Ocelový úhelníkový profil|3
ZARUBEN|Rám ve stěně pro uchycení dveří|3`
  },
  vyroba: {
    title: 'Výroba a auta', icon: '⚙', entries: `
AUTO|Silniční motorové vozidlo|1
MOTOR|Zařízení pohánějící automobil|1
KOLO|Kruhová část vozidla s pneumatikou|1
BRZDA|Zařízení zpomalující pohyb|1
VOLANT|Ovládací prvek řízení auta|1
PALIVO|Benzín či nafta sloužící k pohonu|1
BENZIN|Kapalné palivo pro zážehový motor|1
NAFTA|Palivo pro vznětové motory|1
NADRZ|Zásobník na palivo|1
CERPADLO|Zařízení přemísťující kapalinu|1
FILTR|Součást zachycující nečistoty|1
SROUBOVAK|Nástroj pro otáčení šroubů|1
LINKA|Výrobní sestava pracovišť|1
SMENA|Časový úsek pracovní doby|1
TYM|Skupina spolupracujících lidí|1
MISTR|Vedoucí provozního kolektivu|1
KVALITA|Míra splnění požadavků na výrobek|1
ZMETEK|Nekvalitní výrobek určený k vyřazení|1
PROSTOJ|Doba, kdy zařízení nevyrábí|2
KANBAN|Systém řízení zásob pomocí signálů|2
POKAYOKE|Japonský systém předcházení chybám|3
GEMBA|Japonský pojem pro skutečné místo dění|3
REWORK|Oprava neshodného výrobku|3
SCRAP|Anglické označení materiálu k vyřazení|3
NORMA|Stanovený požadovaný výrobní výkon|1
TAKT|Interval mezi dvěma výrobky na lince|2
CYKLUS|Opakující se sled výrobních úkonů|2
AUDIT|Systematická kontrola dodržování pravidel|2
SKLAD|Prostor pro uložení materiálu|1
LOGISTIKA|Organizace pohybu materiálu a výrobků|2
BOZP|Zkratka bezpečnosti a ochrany zdraví při práci|2
MONTAZ|Sestavování dílů do celku|1
VYFUKOVANI|Výroba dutých plastových dílů tlakem vzduchu|3
PLAST|Materiál z polymerů|1
SENZOR|Prvek zjišťující fyzikální veličinu|2
ZAVADA|Porucha stroje|1
UREZ|Místo, kde byl materiál oddělen řezem|2
TEST|Ověření správné funkce výrobku|1
NAVOD|Instrukce k obsluze zařízení|1
SMEROVKA|Světlo signalizující změnu směru jízdy|1
PNEUMATIKA|Pryžový plášť na kole vozidla|2
PRUZINA|Pružný strojní prvek|2`
  },
  hry: {
    title: 'Hry a počítače', icon: '◇', entries: `
HRA|Zábavná činnost s pravidly|1
TETRIS|Hra se skládáním padajících dílků|1
HAD|Klasická hra, ve které tělo roste po sebrání bodu|1
MINECRAFT|Hra s kostkami a stavěním světa|1
FORTNITE|Populární battle royale hra od Epic Games|1
ROBLOX|Herní platforma s obsahem od hráčů|1
GAMEPAD|Ruční herní ovladač|1
KONZOLE|Samostatné zařízení určené ke hraní her|1
MONITOR|Obrazovka počítače|1
KLAVESNICE|Zařízení pro psaní na počítači|1
MYS|Polohovací zařízení počítače|1
PIXEL|Nejmenší obrazový bod displeje|1
LEVEL|Herní úroveň|1
BOSS|Významný silný nepřítel ve hře|1
QUEST|Úkol v RPG hrách|2
LOOT|Kořist po poražení nepřítele|2
RAID|Velká skupinová výprava v online RPG|2
DUNGEON|Podzemí nebo instance s nepřáteli|2
TANK|Role přijímající útoky nepřátel|2
HEALER|Postava léčící ostatní hráče|2
DPS|Zkratka pro poškození za sekundu|2
PALADIN|Fantasy povolání bojovníka se světlem|2
DRUID|Fantasy třída měnící podobu|2
ROGUE|Anglicky zloděj, třída v RPG|2
MAGE|Anglicky mág ve fantasy hrách|2
WARLOCK|Fantasy kouzelník užívající temnou magii|2
HORDA|Jedna ze dvou hlavních frakcí ve Warcraftu|2
ALIANCE|Protiklad Hordy ve Warcraftu|2
AZEROTH|Svět, v němž se odehrává Warcraft|2
ORC|Typická zelenokožá fantasy rasa|2
ELF|Dlouhověká fantasy rasa se špičatýma ušima|1
DRAGON|Anglicky drak|1
SERVER|Počítač poskytující služby klientům|2
GITHUB|Služba pro hostování Git repozitářů|2
HTML|Značkovací jazyk webových stránek|2
JAVASCRIPT|Programovací jazyk webových aplikací|2
CSS|Jazyk pro vzhled webových stránek|2
OFFLINE|Režim bez připojení k internetu|1
SAVE|Anglicky uložení hry|1
SKORE|Počet dosažených bodů v hře|1`
  },
  vedomosti: {
    title: 'Všeobecné znalosti', icon: '✧', entries: `
PRAHA|Hlavní město České republiky|1
BRNO|Druhé největší město Česka|1
VLTAVA|Nejdelší řeka na českém území|1
LABE|Řeka protékající Ústím nad Labem|1
JIZERA|Řeka protékající Turnovem|1
KRKONOSE|Nejvyšší české pohoří|1
SMRK|Jehličnatý strom s krátkými jehlicemi|1
BOROVICE|Jehličnatý strom s dlouhými jehlicemi|1
DUB|Listnatý strom s žaludy|1
BUK|Listnatý strom s bukvicemi|1
LIPA|Český národní strom|1
JABLKO|Plod jabloně|1
HRUSKA|Plod hrušně|1
TRESEN|Červený peckovitý plod stejnojmenného stromu|1
MRKEV|Oranžová kořenová zelenina|1
BRAMBORA|Hlíza používaná jako příloha|1
OKURKA|Podlouhlá zelenina často nakládaná|1
RAJCE|Červený plod používaný do salátů|1
MESIC|Přirozená družice Země|1
SLUNCE|Hvězda ve středu naší soustavy|1
ZEME|Planeta, na níž žijeme|1
MARS|Červená planeta|1
V ENUSE|Planeta pojmenovaná po římské bohyni lásky|1
JUPITER|Největší planeta Sluneční soustavy|1
SATURN|Planeta proslulá výraznými prstenci|1
KOMETA|Malé vesmírné těleso s ohonem u Slunce|2
GALAXIE|Velká gravitačně vázaná soustava hvězd|2
ATOM|Základní částice chemického prvku|2
KYSLIK|Plyn nezbytný pro lidské dýchání|1
VODIK|Nejlehčí chemický prvek|2
ZLATO|Drahý kov s chemickou značkou Au|1
STRIBRO|Kov s chemickou značkou Ag|1
ZELEZO|Kov s chemickou značkou Fe|1
LITR|Jednotka objemu|1
KILOGRAM|Jednotka hmotnosti rovná tisíci gramům|1
SEKUNDA|Základní jednotka času|1
MINUTA|Šedesát sekund|1
HODINA|Šedesát minut|1
TYDEN|Sedm dnů|1
PODZIM|Roční období po létě|1
ZIMA|Nejchladnější roční období|1
JARO|Roční období po zimě|1
LETO|Nejteplejší roční období|1
DUHA|Barevný oblouk vznikající lomem světla v kapkách|1
DUVERA|Pocit jistoty ve vztahu k někomu|2
KOMPAS|Přístroj k určování světových stran|2
MAPA|Zmenšený obraz zemského povrchu|1
OSTROV|Pevnina ze všech stran obklopená vodou|1
POLOOSTROV|Pevnina obklopená vodou ze tří stran|2
OCEAN|Rozsáhlá slaná vodní plocha|1
PODNEBI|Dlouhodobý charakter počasí v oblasti|2
TEPLOTA|Veličina měřená teploměrem|1
SNEH|Zmrzlé vodní srážky v podobě vloček|1
DEST|Kapalné srážky z oblaků|1
MRAK|Viditelná masa kapek či krystalků na obloze|1`
  }
};

function normalizuj(s = '') {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
}

const vse = [];
for (const [topic, group] of Object.entries(SKUPINY)) {
  for (const line of group.entries.trim().split('\n')) {
    const [raw, clue, d] = line.trim().split('|');
    const answer = normalizuj(raw);
    if (!answer || answer.length < 2 || answer.length > 13 || !clue) continue;
    vse.push({ id: `${topic}-${answer}`, topic, answer, clue, difficulty: Number(d) || 1 });
  }
}

// Vyloučení stejných odpovědí: jedna odpověď by jinak mohla mít v mřížce dvě otázky.
const uniq = new Map();
for (const entry of vse) if (!uniq.has(entry.answer)) uniq.set(entry.answer, entry);

const OTAZKY = [...uniq.values()];
const TEMATA = Object.fromEntries(Object.entries(SKUPINY).map(([id, v]) => [id, { id, title: v.title, icon: v.icon }]));

window.KRIZOVKAR_DATA = {OTAZKY, TEMATA, normalizuj};
