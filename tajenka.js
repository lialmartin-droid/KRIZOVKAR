// Tajenka je české slovní spojení tvořené různými očíslovanými políčky křížovky.
// Výběr probíhá až po sestavení mřížky, takže každé písmeno má vždy platný zdroj.
const phrases = {
  mine: ['PILNÁ VČELA', 'DOMÁCÍ VEJCE', 'ZLATÉ RUCE', 'SLADKÝ MED', 'DOBRÁ PRÁCE', 'POD PROSEČÍ'],
  mix: ['OSTRÁ MYSL', 'DOBRÁ PRÁCE', 'VELKÁ VÝHRA', 'NOVÝ NÁPAD', 'PILNÁ VČELA'],
  bees: ['PILNÁ VČELA', 'SLADKÝ MED', 'VČELÍ MATKA', 'BOHATÁ SNŮŠKA', 'VONAVÝ VOSK', 'MEDOVÉ PLÁSTY'],
  chickens: ['ČERSTVÁ VEJCE', 'SLEPIČÍ RÁJ', 'ZDRAVÉ KUŘE', 'KOHOUT KOKRHÁ', 'DOBRÁ SNÁŠKA'],
  workshop: ['ZLATÉ RUCE', 'HOTOVÁ KŮLNA', 'NOVÝ PROJEKT', 'DOBRÁ PRÁCE', 'ŠIKOVNÉ RUCE'],
  work: ['DOBRÁ SMĚNA', 'BEZ PROSTOJŮ', 'TÝMOVÁ PRÁCE', 'DOBRÝ VÝKON', 'HOTOVÁ PRÁCE'],
  games: ['DOBRÁ HRA', 'VÍTĚZNÝ TAH', 'NOVÁ ÚROVEŇ', 'HRA ZAČÍNÁ', 'VÝHRA ČEKÁ'],
  nature: ['JIZERSKÉ HORY', 'ČERSTVÝ VZDUCH', 'LESNÍ STEZKA', 'ZELENÝ LES', 'LESNÍ KLID'],
  general: ['OSTRÁ MYSL', 'VELKÁ VÝHRA', 'DOBRÁ ODPOVĚĎ', 'NOVÝ NÁPAD', 'CHYTRÁ HLAVA']
};

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toUpperCase();

function cellsForPhrase(puzzle, phrase) {
  const letters = normalize(phrase).split('');
  const source = Object.entries(puzzle.cells);
  const options = letters.map(ch => source.filter(([, cell]) => cell.answer === ch).map(([k]) => k));
  if(options.some(group => !group.length)) return null;

  // Z každé skupiny se použije unikátní políčko. Volíme rozprostřené pozice,
  // aby tajenka nepocházela jen z jediného vyplněného slova.
  const used = new Set();
  const result = new Array(letters.length);
  const order = letters.map((_, i) => i).sort((a, b) => options[a].length - options[b].length);
  for(const i of order) {
    const candidates = options[i].filter(k => !used.has(k));
    if(!candidates.length) return null;
    const score = k => {
      const [r, c] = k.split(',').map(Number);
      const distance = result.filter(Boolean).reduce((sum, x) => {
        const [rr, cc] = x.split(',').map(Number);
        return sum + Math.min(8, Math.abs(rr-r) + Math.abs(cc-c));
      }, 0);
      return distance + Math.random() * 7;
    };
    candidates.sort((a, b) => score(b) - score(a));
    result[i] = candidates[0];
    used.add(candidates[0]);
  }
  return result;
}

export function createTajenka(puzzle) {
  const candidates = [...(phrases[puzzle.category] || phrases.mix)];
  // Občas zkusíme jinou vhodnou tajenku místo stejné první možnosti.
  for(let i=candidates.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  for(const phrase of candidates) {
    const cells = cellsForPhrase(puzzle, phrase);
    if(cells) return {phrase, cells};
  }
  // I pro extrémně neobvyklou mřížku vždy sestavíme řešitelnou tajenku.
  // Vybereme jedno kratší slovo už obsažené v křížovce.
  const fallback = [...puzzle.entries].sort((a,b) => b.answer.length-a.answer.length)
    .find(entry => entry.answer.length >= 4) || puzzle.entries[0];
  if(!fallback) throw Error('Křížovka nemá žádné odpovědi pro tajenku.');
  const cells = cellsForPhrase(puzzle, fallback.answer);
  if(!cells) throw Error('Nepodařilo se sestavit tajenku.');
  return {phrase:fallback.answer, cells};
}

export function tajenkaProgress(puzzle, values) {
  if(!puzzle?.tajenka) return {revealed:0, total:0, complete:false};
  const {cells} = puzzle.tajenka;
  const revealed = cells.filter(k => values[k] === puzzle.cells[k].answer).length;
  return {revealed, total:cells.length, complete:revealed === cells.length};
}
