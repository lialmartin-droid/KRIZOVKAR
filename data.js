// Otázky jsou uložené přímo v aplikaci. Neodesílají se na žádný server.
// Formát: ODPOVĚĎ | otázka | obtížnost (1–3)
const sets = {
  bees: `
MED|Sladký produkt, který včely vyrábějí z nektaru či medovice.|1
VCELA|Opylující hmyz žijící ve včelstvu.|1
MATKA|Jediná plodná samička v běžném včelstvu.|1
TRUBEC|Samec včely medonosné.|1
PLAST|Voskové dílo se šestiúhelníkovými buňkami.|1
VOSK|Materiál, ze kterého včely staví plásty.|1
ROJ|Skupina včel, která opouští původní úl.|1
PYL|Barevná zrnka z květů, která včely sbírají jako zdroj bílkovin.|1
NEKTAR|Sladká tekutina poskytovaná květy.|1
RAMEK|Dřevěná konstrukce, do které včely staví dílo.|1
CESNO|Vstupní otvor do úlu.|1
MEDNIK|Nástavek určený především k ukládání medných zásob.|1
DYMAK|Pomůcka vytvářející kouř k uklidnění včel.|1
MEDOMET|Zařízení pro odstřeďování medu z plástů.|1
ZIHADLO|Obranný orgán včely.|1
LARVA|Vývojové stadium včely před kuklou.|1
LIPA|Strom s květy, které mohou dát výraznou mednou snůšku.|1
REPKA|Žlutě kvetoucí olejnina významná pro jarní snůšku.|1
ODDELEK|Malé nově založené včelstvo, obvykle na několika rámcích.|2
MATECNIK|Zvláštní buňka pro vývoj nové včelí matky.|2
PLODISTE|Část úlu, kde se především vychovává plod.|2
NASTAVEK|Samostatný díl nástavkového úlu.|2
PROPOLIS|Pryskyřičná hmota, kterou včely tmelí a chrání úl.|2
MELIVO|Drobné zbytky padající na dno úlu, které se sledují při kontrole.|2
ZASOBY|Med a pyl uložené včelami pro pozdější využití.|2
SNUSKA|Období, kdy včely přinášejí nektar či medovici.|2
ZIMOVANI|Přečkání chladného období včelstvem.|2
KUKLA|Vývojové stadium včely mezi larvou a dospělcem.|2
KRMITKO|Pomůcka k podávání cukerného roztoku včelám.|2
VICKOVANI|Uzavírání buněk voskovými víčky.|3
TRUBCINA|Plod a dílo se zvětšenými buňkami pro trubce.|3
ROJENI|Přirozený způsob rozmnožování včelstev rozdělením kolonie.|3
PODMET|Prostor mezi spodními loučkami rámků a dnem úlu.|3
VCELSTVO|Společenství matky, dělnic a v sezoně také trubců.|2
AKAT|Strom, který může poskytovat světlý, pomalu krystalizující med.|2
`,
  chickens: `
SLEPICE|Samice kura domácího.|1
KOHOUT|Samec kura domácího.|1
KURNIK|Přístřešek, ve kterém drůbež nocuje.|1
VEJCE|Produkt snesený slepicí, který má skořápku.|1
BIDLO|Vodorovná tyč, na které slepice v noci sedí.|1
HNIZDO|Místo, kam slepice chodí snášet vejce.|1
ZLOUTEK|Žlutá část uvnitř vejce.|1
BILEK|Průhledná část syrového vejce obklopující žloutek.|1
SKORAPKA|Tvrdý vnější obal vejce.|1
KURE|Mládě kura domácího.|1
KVOCNA|Slepice, která chce sedět na vejcích a vysedět kuřata.|1
KRMIVO|Potrava určená hospodářským zvířatům.|1
VYBEH|Venkovní prostor, kde se slepice pohybují.|1
PSENICE|Obilovina často přidávaná drůbeži do krmiva.|1
VODA|Nápoj, který musí mít slepice stále k dispozici.|1
HREBEN|Červený výrůstek na hlavě slepice nebo kohouta.|1
PERI|Pokryv těla ptáků.|1
LISKA|Rezavá šelma, která může ohrozit drůbež.|1
SLUNECNICE|Olejnina, jejíž semena jsou oblíbeným doplňkem krmení.|2
NOSNICE|Slepice chovaná především pro produkci vajec.|2
VAPNIK|Minerál důležitý pro pevnost vaječné skořápky.|2
PODSTYLKA|Materiál na podlaze kurníku pro pohodlí a suché prostředí.|2
GRANULE|Lisovaná forma kompletní krmné směsi.|2
PREPEROVANI|Obměna starého peří za nové.|2
KREPELKA|Malý pták chovaný také pro drobná vejce.|2
LEGHORN|Známé lehké plemeno slepic s vysokou snáškou.|2
SUSSEX|Plemeno slepic často v bílém zbarvení s černým krkem.|2
SNASKA|Počet vajec snesených za určité období.|2
INKUBATOR|Přístroj udržující podmínky pro umělé líhnutí vajec.|3
KOKCIDIE|Prvoci, kteří mohou u drůbeže vyvolat střevní onemocnění.|3
SKUBANI|Odstraňování peří při přípravě drůbeže.|3
HRABANI|Přirozené rozhrabávání půdy při hledání potravy.|1
DARKSHELL|Obchodní označení nosnic snášejících tmavší vejce.|3
`,
  workshop: `
KULNA|Zahradní stavba pro skladování nářadí a vybavení.|1
DREVO|Materiál ze stromů, používaný ve stavebnictví.|1
BETON|Směs cementu, kameniva a vody, která ztvrdne.|1
HREBIK|Kovový spojovací prvek, který se zatlouká kladivem.|1
KLADIVO|Nástroj používaný například k zatloukání hřebíků.|1
PILA|Nástroj se zuby určený k řezání materiálu.|1
PRKNO|Podlouhlý plochý řezaný dřevěný materiál.|1
TRAM|Silnější nosný dřevěný prvek.|1
STRECHA|Horní krycí konstrukce stavby.|1
PLECH|Tenký válcovaný kovový materiál.|1
VRUT|Spojovací prvek se závitem určený zejména do dřeva.|1
METR|Nástroj k měření délky.|1
DILNA|Místnost nebo prostor k řemeslné práci.|1
BRUSKA|Elektrický nebo ruční nástroj k obrušování povrchů.|1
VRTACKA|Nářadí určené především k vrtání otvorů.|1
ZLAB|Podélný kanálek odvádějící například dešťovou vodu.|1
HRANOL|Dřevěný prvek s obdélníkovým či čtvercovým průřezem.|2
PALUBKA|Profilované prkno často používané na obklady.|2
PATKA|Spodní nosná část podpory sloupku nebo jiné konstrukce.|2
ROXOR|Hovorové označení žebírkové betonářské výztuže.|2
KOTVA|Prvek sloužící k pevnému uchycení konstrukce.|2
VODOVAHA|Pomůcka ke kontrole vodorovnosti a svislosti.|2
PERGOLA|Zahradní konstrukce často tvořená sloupky a trámy.|2
KROV|Nosná konstrukce šikmé střechy.|2
LAT|Úzký podlouhlý dřevěný profil například pod krytinu.|2
UHELNIK|Pomůcka k vyznačení nebo kontrole pravého úhlu.|2
MATICE|Součást šroubového spoje s vnitřním závitem.|2
PILINY|Drobné částice dřeva vznikající při řezání.|2
BEDNENI|Dočasná forma, do které se nalévá čerstvý beton.|3
VAZNICE|Vodorovný nosný trám krovu podpírající krokve.|3
KROKEV|Šikmý nosný prvek krovu vedený po spádu střechy.|3
SENDVIC|Druh stavebního panelu složeného z více vrstev.|3
`,
  games: `
TETRIS|Hra, ve které skládáš padající tvary z kostek.|1
MINECRAFT|Hra s těžbou surovin a stavěním z bloků.|1
FORTNITE|Online hra známá režimem battle royale.|1
ROBLOX|Platforma s mnoha hrami tvořenými komunitou.|1
WARCRAFT|Fantasy herní svět s orky a lidmi.|1
HAD|Jednoduchá hra, ve které se prodlužuje tělo po sbírání potravy.|1
KONZOLE|Zařízení primárně určené k hraní videoher.|1
LEVEL|Anglické označení herní úrovně.|1
BOSS|Zpravidla silný protivník na konci herní části.|1
MANA|Energie používaná v mnoha fantasy hrách ke kouzlení.|1
DRAK|Bájný tvor často vystupující ve fantasy hrách.|1
BITVA|Ozbrojený střet dvou stran.|1
KOUZLO|Magický útok nebo schopnost fantasy postavy.|1
MAPA|Zobrazení herní oblasti a jejího okolí.|1
ZOMBI|Nemrtvá postava známá z mnoha her.|1
PORTAL|Průchod, který v hrách spojuje dvě místa či světy.|1
RAID|Skupinová výprava proti obtížným nepřátelům v MMO.|2
HEALER|Role postavy zaměřená na léčení ostatních.|2
PALADIN|Fantasy povolání spojující boj a svatou magii.|2
EVOKER|Dračí hratelná třída ve World of Warcraft.|2
QUEST|Herní úkol, často s odměnou.|2
INVENTAR|Seznam předmětů nesených herní postavou.|2
BRNENI|Výbava, která snižuje utržené poškození.|2
DIAMANT|Vzácná surovina ve hře Minecraft.|2
NETHER|Nebezpečná dimenze v Minecraftu.|2
CREEPER|Zelený nepřítel v Minecraftu, který exploduje.|2
ENDERMAN|Vysoký nepřítel z Minecraftu schopný teleportace.|2
REDSTONE|Materiál pro vytváření obvodů a mechanismů v Minecraftu.|3
COOLDOWN|Čekací doba do opětovného použití schopnosti.|3
DUNGEON|Herní podzemí nebo instance s nepřáteli.|3
AGGRO|Herní označení pozornosti nepřítele vůči postavě.|3
TANK|Role postavy, která na sebe váže útoky nepřátel.|2
`,
  work: `
SMENA|Časový úsek, během kterého zaměstnanec pracuje.|1
LINKA|Výrobní uspořádání, kterým prochází produkt.|1
NORMA|Stanovené množství práce nebo kusů za čas.|1
VYKON|Množství odvedené práce za jednotku času.|1
VYROBA|Proces, při kterém vznikají nové produkty.|1
KVALITA|Míra, jak výrobek splňuje požadované vlastnosti.|1
KONTROLA|Ověřování, zda věc splňuje požadavky.|1
MONTAZ|Sestavování výrobku z jednotlivých součástek.|1
SKLAD|Prostor pro uložení materiálu nebo výrobků.|1
ROBOT|Automaticky řízený stroj pro vykonávání úloh.|1
SENZOR|Zařízení snímající fyzikální veličinu.|1
NOCNI|Typ směny probíhající převážně v noci.|1
RANNI|Typ směny začínající v časných hodinách.|1
CYKLUS|Opakující se sled výrobních operací.|1
ODPAD|Materiál určený k odstranění či dalšímu využití.|1
PROSTOJ|Doba, kdy linka nevyrábí, ačkoli by měla.|2
PRESCAS|Práce vykonaná nad stanovenou pracovní dobu za splnění zákonných podmínek.|2
KANBAN|Systém signálů pro řízení toku materiálu a práce.|2
GEMBA|Japonský výraz pro skutečné místo, kde vzniká hodnota.|2
REWORK|Anglický termín pro přepracování neshodného výrobku.|2
SCRAP|Anglické označení vyřazeného zmetkového materiálu.|2
UDRZBA|Činnost zajišťující provozuschopnost zařízení.|2
LOGISTIKA|Plánování a řízení toku zboží a materiálu.|2
SESTAVA|Komplet vzniklý spojením několika dílů.|2
PRUVODKA|Doklad putující s výrobkem nebo výrobní dávkou.|2
TAKT|Rytmus výroby odvozený od poptávky zákazníka.|3
POKAYOKE|Japonský přístup k prevenci neúmyslných chyb.|3
VYFUKOVANI|Technologie tváření plastu pomocí tlakového vzduchu.|3
NESHODA|Odchylka od stanoveného požadavku v kvalitě.|3
AUDIT|Systematické prověřování procesu podle daných kritérií.|3
PARETO|Analýza často zobrazovaná pravidlem 80/20.|3
`,
  nature: `
LES|Území porostlé stromy a další vegetací.|1
SMRK|Jehličnan s kratšími pichlavými jehlicemi.|1
BUK|Listnatý strom s hladkou šedou kůrou.|1
JEDLE|Jehličnan s plochými jehlicemi a vzpřímenými šiškami.|1
BORUVKA|Drobný modrofialový lesní plod.|1
MALINA|Sladké růžově červené souplodí z keře.|1
HOUBA|Organismus, jehož plodnice se často sbírají v lese.|1
HRIB|Houba s rourkami na spodku klobouku.|1
POTOK|Menší přírodní vodní tok.|1
REKA|Přirozený větší vodní tok.|1
KOPEC|Vyvýšenina v krajině.|1
VRCHOL|Nejvyšší bod hory nebo kopce.|1
SNEH|Zmrzlé srážky dopadající v podobě vloček.|1
BOURKA|Počasí spojené s blesky a hřměním.|1
KOS|Černý zpěvný pták se žlutým zobákem u samců.|1
SOVA|Pták s velkýma očima, který bývá aktivní v noci.|1
SRNEC|Samec menšího evropského jelena zvaného srnčí zvěř.|1
VEVERKA|Malý hlodavec s huňatým ocasem žijící na stromech.|1
JIZERA|Řeka pramenící v Jizerských horách.|2
SIPEK|Červený plod růže šípkové.|2
LEVANDULE|Aromatická rostlina s fialovými květy.|2
PRAMEN|Místo, kde podzemní voda přirozeně vyvěrá.|2
VODOPAD|Místo, kde voda padá přes skalní stupeň.|2
JEZERO|Vnitrozemská přírodní vodní nádrž.|2
JESTRAB|Dravý pták, který může lovit menší ptáky.|2
OPYLOVANI|Přenos pylu na bliznu květu.|2
RASELINA|Částečně rozložená organická hmota v mokřadech.|3
IZOTERMA|Spojnice míst se stejnou teplotou na mapě.|3
ROSNICE|Zelená stromová žába schopná šplhat po rostlinách.|3
MORENA|Tradiční figurína symbolizující konec zimy.|3
`,
  general: `
SLUNCE|Hvězda, kolem které obíhá Země.|1
MESIC|Přirozená družice Země.|1
PLANETA|Nebeské těleso obíhající hvězdu.|1
HVEZDA|Žhavé vesmírné těleso vyzařující vlastní světlo.|1
KNIHA|Svazek potištěných listů určený ke čtení.|1
KALENDAR|Přehled dnů, týdnů a měsíců.|1
TYDEN|Období trvající sedm dní.|1
MINUTA|Jednotka času o šedesáti sekundách.|1
SEVER|Světová strana opačná k jihu.|1
VYCHOD|Světová strana, kde přibližně vychází slunce.|1
SVETLO|Elektromagnetické záření viditelné lidským okem.|1
STIN|Tmavá oblast vytvořená překážkou v cestě světla.|1
TELEFON|Zařízení pro hlasovou komunikaci na dálku.|1
BATERIE|Zařízení ukládající energii chemickou cestou.|1
MOTOR|Stroj přeměňující energii na mechanický pohyb.|1
KABEL|Vodič nebo soubor vodičů v ochranném obalu.|1
POCITAC|Elektronické zařízení pro zpracování dat.|1
MONITOR|Obrazovka připojená k počítači.|1
HODINY|Přístroj měřící a ukazující čas.|1
MESTO|Větší sídlo s městským charakterem.|1
PRAHA|Hlavní město České republiky.|1
LIBEREC|Krajské město pod Ještědem.|1
VESNICE|Menší venkovské sídlo.|1
ELEKTRINA|Energie využívaná většinou domácích spotřebičů.|2
SIGNAL|Zpráva nebo informace přenášená určitým způsobem.|2
KLAVESNICE|Vstupní zařízení s klávesami pro psaní.|2
ATLANTIK|Oceán mezi Evropou a Amerikou.|2
ROVNIK|Pomyslná kružnice dělící Zemi na severní a jižní polokouli.|2
GRAVITACE|Přitažlivé působení mezi hmotnými tělesy.|2
PRESTUPNY|Přídavné jméno pro rok s 29. únorem.|2
FOTOSYNTEZA|Proces, při kterém rostliny ze světla získávají energii pro tvorbu cukrů.|3
ATMOSFERA|Plynný obal planety.|3
EKOSYSTEM|Společenstvo organismů a prostředí, ve kterém žijí.|3
ALGORITMUS|Přesně popsaný postup řešení úlohy.|3
` 
};

export const categories = [
  {id:'mine', name:'Moje témata', icon:'✦', description:'Včely, slepice, práce, dílna a hry'},
  {id:'mix', name:'Všehochuť', icon:'◈', description:'Všechna témata'},
  {id:'bees', name:'Včelařství', icon:'⬡', description:'Od medu po matečníky'},
  {id:'chickens', name:'Slepice', icon:'◉', description:'Chov, krmení a vejce'},
  {id:'workshop', name:'Dílna a stavba', icon:'⌁', description:'Nářadí a konstrukce'},
  {id:'work', name:'Výroba a práce', icon:'▤', description:'Linky, kvalita a směny'},
  {id:'games', name:'Hry', icon:'◆', description:'Videohry a herní pojmy'},
  {id:'nature', name:'Příroda', icon:'♣', description:'Les a Jizerské hory'},
  {id:'general', name:'Všeobecné', icon:'◎', description:'Od vesmíru po techniku'}
];

export const questions = Object.entries(sets).flatMap(([category, data]) => 
  data.trim().split('\n').map(line => {
    const [raw, clue, level] = line.split('|');
    return {answer:raw.replace(/\s+/g,'').toUpperCase(), clue, level:Number(level), category};
  })
);
