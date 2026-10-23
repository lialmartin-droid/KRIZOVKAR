const puzzle = {
  id: "svedska-001",
  size: 13,
  words: [
    { id: "A1", dir: "across", clue: "nejlepsi pritel cloveka", cluePos: [1, 3], answer: "PES", answerStart: [1, 4], secretIndexes: [2] },
    { id: "A2", dir: "across", clue: "jede po kolejich", cluePos: [2, 4], answer: "VLAK", answerStart: [2, 5], secretIndexes: [1] },
    { id: "A3", dir: "across", clue: "sladkost od vcel", cluePos: [3, 4], answer: "MED", answerStart: [3, 5], secretIndexes: [1] },
    { id: "D1", dir: "down", clue: "zenske jmeno", cluePos: [1, 7], answer: "ADA", answerStart: [2, 7], secretIndexes: [] },
    { id: "A4", dir: "across", clue: "co delame v noci", cluePos: [4, 4], answer: "SPAT", answerStart: [4, 5], secretIndexes: [1] },
    { id: "A5", dir: "across", clue: "nadoba pro psa", cluePos: [5, 4], answer: "MISKA", answerStart: [5, 5], secretIndexes: [1] },
    { id: "A6", dir: "across", clue: "opak dne", cluePos: [6, 3], answer: "NOC", answerStart: [6, 4], secretIndexes: [2] },
    { id: "A7", dir: "across", clue: "opak noci", cluePos: [7, 4], answer: "DEN", answerStart: [7, 5], secretIndexes: [1] },
    { id: "A8", dir: "across", clue: "misto plne stromu", cluePos: [8, 4], answer: "LES", answerStart: [8, 5], secretIndexes: [1] },
    { id: "D3", dir: "down", clue: "domov vcel", cluePos: [8, 0], answer: "UL", answerStart: [9, 0], secretIndexes: [] },
    { id: "D4", dir: "down", clue: "sladka pochoutka", cluePos: [8, 2], answer: "MED", answerStart: [9, 2], secretIndexes: [] },
    { id: "D5", dir: "down", clue: "co se muze zdat", cluePos: [8, 3], answer: "SEN", answerStart: [9, 3], secretIndexes: [] },
    { id: "A9", dir: "across", clue: "diky ni slysite", cluePos: [10, 6], answer: "UCHO", answerStart: [10, 7], secretIndexes: [] },
    { id: "D7", dir: "down", clue: "vykrik pochopeni", cluePos: [8, 9], answer: "AHA", answerStart: [9, 9], secretIndexes: [] },
    { id: "D8", dir: "down", clue: "tece z kohoutku", cluePos: [8, 11], answer: "VODA", answerStart: [9, 11], secretIndexes: [] }
  ]
};

const crosswordEl = document.getElementById('crossword');
const currentClueEl = document.getElementById('currentClue');
const secretAnswerEl = document.getElementById('secretAnswer');
const toggleDirBtn = document.getElementById('toggleDirBtn');
const dirLabel = document.getElementById('dirLabel');
const checkBtn = document.getElementById('checkBtn');
const clearBtn = document.getElementById('clearBtn');
const resetBtn = document.getElementById('resetBtn');

const stateKey = `krizovkar-${puzzle.id}`;
let grid = [];
let selectedCell = null;
let selectedWordId = null;
let selectedDir = 'across';
let answers = loadAnswers();

function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

function buildGrid() {
  grid = Array.from({ length: puzzle.size }, (_, row) => Array.from({ length: puzzle.size }, (_, col) => ({
    row,
    col,
    type: 'block',
    words: [],
    secret: false,
    solution: ''
  })));

  for (const word of puzzle.words) {
    const [cr, cc] = word.cluePos;
    grid[cr][cc] = { row: cr, col: cc, type: 'clue', clue: word.clue, dir: word.dir, wordId: word.id };

    const [sr, sc] = word.answerStart;
    for (let i = 0; i < word.answer.length; i++) {
      const r = sr + (word.dir === 'down' ? i : 0);
      const c = sc + (word.dir === 'across' ? i : 0);
      const cell = grid[r][c];
      if (cell.type === 'block') {
        grid[r][c] = { row: r, col: c, type: 'answer', words: [word.id], solution: normalize(word.answer[i]), secret: false };
      } else if (cell.type === 'answer') {
        if (cell.solution !== normalize(word.answer[i])) {
          console.warn(`Konflikt v bunce ${r},${c}: ${cell.solution} vs ${word.answer[i]}`);
        }
        if (!cell.words.includes(word.id)) cell.words.push(word.id);
      } else {
        console.warn(`Neplatne umisteni slova ${word.id}`);
      }
      if (word.secretIndexes.includes(i)) grid[r][c].secret = true;
    }
  }
}

function renderGrid() {
  crosswordEl.innerHTML = '';
  for (const row of grid) {
    for (const cell of row) {
      const wrapper = document.createElement('div');
      wrapper.className = 'cell';
      wrapper.dataset.row = cell.row;
      wrapper.dataset.col = cell.col;

      if (cell.type === 'block') {
        wrapper.classList.add('block');
      } else if (cell.type === 'clue') {
        wrapper.classList.add('clue-cell');
        wrapper.innerHTML = `<div class="clue-inner"><div class="clue-text">${escapeHtml(cell.clue)}</div><div class="clue-dir">${cell.dir === 'across' ? '→' : '↓'}</div></div>`;
      } else if (cell.type === 'answer') {
        wrapper.classList.add('answer-cell');
        if (cell.secret) wrapper.classList.add('secret-cell');
        const input = document.createElement('input');
        input.maxLength = 1;
        input.className = 'answer-input';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.inputMode = 'text';
        input.value = answers[keyOf(cell.row, cell.col)] || '';
        input.dataset.row = cell.row;
        input.dataset.col = cell.col;
        input.addEventListener('focus', () => selectCell(cell.row, cell.col));
        input.addEventListener('click', () => handleRepeatSelection(cell.row, cell.col));
        input.addEventListener('input', (e) => handleInput(e, cell.row, cell.col));
        input.addEventListener('keydown', (e) => handleKeydown(e, cell.row, cell.col));
        wrapper.appendChild(input);
      }
      crosswordEl.appendChild(wrapper);
    }
  }
  updateSecret();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
}

function keyOf(r, c) { return `${r}-${c}`; }

function loadAnswers() {
  try {
    return JSON.parse(localStorage.getItem(stateKey)) || {};
  } catch {
    return {};
  }
}

function saveAnswers() {
  localStorage.setItem(stateKey, JSON.stringify(answers));
}

function getCell(r, c) {
  return grid[r]?.[c] || null;
}

function getWord(wordId) {
  return puzzle.words.find(w => w.id === wordId);
}

function getWordCells(wordId) {
  const word = getWord(wordId);
  const [sr, sc] = word.answerStart;
  return Array.from({ length: word.answer.length }, (_, i) => ({
    row: sr + (word.dir === 'down' ? i : 0),
    col: sc + (word.dir === 'across' ? i : 0)
  }));
}

function chooseWordForCell(cell, desiredDir) {
  if (!cell || cell.type !== 'answer' || cell.words.length === 0) return null;
  const dirMatch = cell.words.find(id => getWord(id).dir === desiredDir);
  return dirMatch || cell.words[0];
}

function handleRepeatSelection(r, c) {
  const cell = getCell(r, c);
  if (!cell || cell.type !== 'answer') return;
  if (selectedCell && selectedCell.row === r && selectedCell.col === c && cell.words.length > 1) {
    selectedDir = selectedDir === 'across' ? 'down' : 'across';
  }
  selectCell(r, c);
}

function selectCell(r, c) {
  const cell = getCell(r, c);
  if (!cell || cell.type !== 'answer') return;
  selectedCell = { row: r, col: c };
  selectedWordId = chooseWordForCell(cell, selectedDir);
  selectedDir = getWord(selectedWordId).dir;
  dirLabel.textContent = selectedDir === 'across' ? '→' : '↓';

  document.querySelectorAll('.answer-cell').forEach(el => el.classList.remove('selected', 'in-word'));
  for (const { row, col } of getWordCells(selectedWordId)) {
    const cellEl = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cellEl) cellEl.classList.add('in-word');
  }
  const selectedEl = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
  if (selectedEl) selectedEl.classList.add('selected');

  const word = getWord(selectedWordId);
  currentClueEl.innerHTML = `<strong>${word.dir === 'across' ? 'Vodorovne' : 'Svisle'}:</strong> ${word.clue}<br><small>Delka odpovedi: ${word.answer.length}</small>`;
}

function moveInCurrentWord(step) {
  if (!selectedWordId || !selectedCell) return;
  const cells = getWordCells(selectedWordId);
  const index = cells.findIndex(pos => pos.row === selectedCell.row && pos.col === selectedCell.col);
  const next = cells[index + step];
  if (!next) return;
  const input = document.querySelector(`input[data-row="${next.row}"][data-col="${next.col}"]`);
  input?.focus();
}

function handleInput(e, r, c) {
  const input = e.target;
  let value = normalize(input.value).slice(-1);
  value = value.replace(/[^A-Z]/g, '');
  input.value = value;
  answers[keyOf(r, c)] = value;
  saveAnswers();
  updateSecret();
  clearChecks();
  if (value) moveInCurrentWord(1);
}

function handleKeydown(e, r, c) {
  if (e.key === 'Backspace') {
    const current = e.target.value;
    if (current) {
      answers[keyOf(r, c)] = '';
      saveAnswers();
      updateSecret();
      clearChecks();
      return;
    }
    e.preventDefault();
    moveInCurrentWord(-1);
    return;
  }
  if (e.key === 'ArrowRight') { e.preventDefault(); focusNeighbor(r, c + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); focusNeighbor(r, c - 1); }
  if (e.key === 'ArrowDown') { e.preventDefault(); focusNeighbor(r + 1, c); }
  if (e.key === 'ArrowUp') { e.preventDefault(); focusNeighbor(r - 1, c); }
}

function focusNeighbor(r, c) {
  const cell = getCell(r, c);
  if (cell?.type !== 'answer') return;
  const input = document.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
  input?.focus();
}

function updateSecret() {
  const secretCells = [];
  for (const row of grid) {
    for (const cell of row) {
      if (cell.type === 'answer' && cell.secret) secretCells.push(cell);
    }
  }
  secretAnswerEl.innerHTML = '';
  secretCells.forEach(cell => {
    const slot = document.createElement('div');
    slot.className = 'secret-slot';
    slot.textContent = answers[keyOf(cell.row, cell.col)] || '•';
    secretAnswerEl.appendChild(slot);
  });
}

function clearChecks() {
  document.querySelectorAll('.answer-cell').forEach(el => el.classList.remove('correct', 'wrong'));
}

function checkAnswers() {
  clearChecks();
  for (const row of grid) {
    for (const cell of row) {
      if (cell.type !== 'answer') continue;
      const user = answers[keyOf(cell.row, cell.col)] || '';
      const el = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
      if (!user) continue;
      el.classList.add(user === cell.solution ? 'correct' : 'wrong');
    }
  }
}

function clearAll() {
  if (!confirm('Opravdu vymazat všechna písmena?')) return;
  answers = {};
  saveAnswers();
  document.querySelectorAll('.answer-input').forEach(input => input.value = '');
  updateSecret();
  clearChecks();
  currentClueEl.textContent = 'Klepni na políčko v křížovce.';
}

function resetGame() {
  if (!confirm('Začít znovu? Tím vymažeš uložený postup.')) return;
  localStorage.removeItem(stateKey);
  answers = {};
  renderGrid();
  currentClueEl.textContent = 'Klepni na políčko v křížovce.';
}

toggleDirBtn.addEventListener('click', () => {
  selectedDir = selectedDir === 'across' ? 'down' : 'across';
  dirLabel.textContent = selectedDir === 'across' ? '→' : '↓';
  if (selectedCell) selectCell(selectedCell.row, selectedCell.col);
});
checkBtn.addEventListener('click', checkAnswers);
clearBtn.addEventListener('click', clearAll);
resetBtn.addEventListener('click', resetGame);

buildGrid();
renderGrid();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
