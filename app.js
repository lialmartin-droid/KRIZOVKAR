import {categories} from './data.js';
import {generatePuzzle} from './generator.js';
import {createTajenka, tajenkaProgress} from './tajenka.js';

const STORAGE_KEY='krizovkar-progress-1';
const PREF_KEY='krizovkar-preferences-1';
const $=id=>document.getElementById(id);
const key=(r,c)=>`${r},${c}`;
const clean=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z]/g,'').toUpperCase();
const safeLoad=(name)=>{try{return JSON.parse(localStorage.getItem(name)||'null')}catch{return null}};

let puzzle=null;
let values={};
let hints=new Set();
let wrong=new Set();
let currentWord=null;
let currentCell=null;
let seconds=0;
let solved=false;
let pointerBefore=null;
let pointerActive=false;
let category='mine';
let difficulty=2;
let theme='dark';

const box=$('board');
const selection=$('category');
const entriesById=()=>new Map((puzzle?.entries||[]).map(e=>[e.id,e]));
const wordCells=(word)=>Array.from({length:word.answer.length},(_,i)=>key(word.r+(word.dir==='down'?i:0),word.c+(word.dir==='across'?i:0)));
const cellInput=(k)=>box.querySelector(`input[data-key="${k}"]`);
const complete=(entry)=>wordCells(entry).every((k,i)=>values[k]===entry.answer[i]);
const correct=()=>puzzle && Object.values(puzzle.cells).every(c=>values[key(c.r,c.c)]===c.answer);
const getCategory=()=>categories.find(c=>c.id===category)||categories[0];

function save(){
  if(!puzzle)return;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({puzzle,values,hints:[...hints],seconds,solved,currentWord,currentCell}));}catch{}
}
function savePrefs(){
  try{localStorage.setItem(PREF_KEY,JSON.stringify({category,difficulty,theme}));}catch{}
}
function showMessage(text,error=false){
  const message=$('message');
  message.textContent=text;
  message.classList.toggle('is-error',error);
  message.hidden=false;
}
function clearMessage(){$('message').hidden=true;}
function formattedTime(){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function renderTajenka(){
  const panel=$('tajenkaPanel');
  if(!puzzle?.tajenka){panel.hidden=true;return;}
  panel.hidden=false;
  const {phrase,cells}=puzzle.tajenka;
  const progress=tajenkaProgress(puzzle,values);
  $('tajenkaCount').textContent=`${progress.revealed} / ${progress.total} písmen`;
  $('tajenkaCount').classList.toggle('is-complete',progress.complete);
  const slots=$('tajenkaSlots');
  slots.replaceChildren();
  let n=0;
  for(const char of phrase.toUpperCase()){
    if(char===' '){
      const space=document.createElement('span');space.className='tajenka-space';space.setAttribute('aria-hidden','true');
      slots.append(space);continue;
    }
    const k=cells[n];
    const button=document.createElement('button');button.type='button';button.className='tajenka-slot';
    if(values[k]===puzzle.cells[k].answer){button.textContent=char;button.classList.add('is-revealed')}
    else {button.textContent='·';}
    button.title=`Písmeno tajenky ${n+1}: přejít na označené políčko`;
    button.setAttribute('aria-label',`Tajenka: písmeno ${n+1} z ${cells.length}, ${values[k]===puzzle.cells[k].answer?'správně vyplněné':'neodhalené'}`);
    button.addEventListener('click',()=>{
      selectCell(k,false,true);
      cellInput(k)?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    });
    slots.append(button);
    n++;
  }
  $('tajenkaResult').hidden=!progress.complete;
  if(progress.complete)$('tajenkaResult').textContent=`Tajenka: ${phrase}!`;
}
function renderStats(){
  if(!puzzle)return;
  const total=Object.keys(puzzle.cells).length;
  const count=Object.keys(values).filter(k=>values[k]).length;
  const percent=Math.round(count/total*100);
  $('fillStat').textContent=`${count} / ${total}`;
  $('timerStat').textContent=formattedTime();
  $('hintStat').textContent=String(hints.size);
  $('progressFill').style.width=`${percent}%`;
  $('statusLabel').textContent=solved?'Hotovo!':`Vyplněno ${percent} %`;
  $('puzzleTitle').textContent=solved?'Křížovka dokončena':(categories.find(c=>c.id===puzzle.category)?.name||'Křížovka');
}
function setTheme(next){
  theme=next;
  document.documentElement.dataset.theme=theme;
  $('themeIcon').textContent=theme==='dark'?'☼':'☾';
  document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#101923':'#f2f4ef';
  savePrefs();
}
function updateDifficulty(){
  document.querySelectorAll('[data-difficulty]').forEach(b=>{
    b.classList.toggle('is-on',Number(b.dataset.difficulty)===difficulty);
    b.setAttribute('aria-pressed',String(Number(b.dataset.difficulty)===difficulty));
  });
}
function changeSetup(){
  selection.value=category;
  $('categoryDescription').textContent=getCategory().description;
  updateDifficulty();
  savePrefs();
}

function pickWordForCell(cell,toggle){
  let nextId;
  if(toggle && cell.words.length===2 && cell.words.includes(currentWord)){
    nextId=cell.words.find(id=>id!==currentWord);
  }else if(cell.words.includes(currentWord)){
    nextId=currentWord;
  }else{
    const words=entriesById();
    nextId=cell.words.find(id=>words.get(id)?.dir==='across')??cell.words[0];
  }
  return nextId;
}
function selectCell(k,toggle=false,focus=false){
  const cell=puzzle.cells[k]; if(!cell)return;
  currentWord=pickWordForCell(cell,toggle);
  currentCell=k;
  updateHighlights();
  if(focus)cellInput(k)?.focus({preventScroll:true});
  save();
}
function selectWord(id,focus=false){
  const entry=puzzle.entries.find(e=>e.id===id);if(!entry)return;
  currentWord=id;
  currentCell=wordCells(entry).find(k=>!values[k])||wordCells(entry)[0];
  updateHighlights();
  if(focus){
    const input=cellInput(currentCell);
    if(input){
      $('boardScroller').scrollIntoView({behavior:'smooth',block:'center'});
      input.focus({preventScroll:true});
    }
  }
  save();
}
function updateHighlights(){
  if(!puzzle)return;
  const words=entriesById();
  const entry=words.get(currentWord);
  const activeSet=new Set(entry?wordCells(entry):[]);
  for(const sq of box.querySelectorAll('.square:not(.is-blank)')){
    const k=sq.dataset.key;
    sq.classList.toggle('is-in-word',activeSet.has(k));
    sq.classList.toggle('is-current',k===currentCell);
    sq.classList.toggle('is-wrong',wrong.has(k));
    sq.classList.toggle('is-hinted',hints.has(k));
  }
  document.querySelectorAll('.clue-item').forEach(item=>{
    item.classList.toggle('is-active',Number(item.dataset.word)===currentWord);
  });
  if(entry){
    $('activeClue').innerHTML='';
    const number=document.createElement('span');number.className='active-number';number.textContent=`${entry.number}${entry.dir==='across'?' →':' ↓'}`;
    const clue=document.createElement('span');clue.textContent=entry.clue;
    $('activeClue').append(number,clue);
  }
}
function renderClues(){
  const across=puzzle.entries.filter(e=>e.dir==='across').sort((a,b)=>a.number-b.number);
  const down=puzzle.entries.filter(e=>e.dir==='down').sort((a,b)=>a.number-b.number);
  for(const [dir,rows] of [['across',across],['down',down]]){
    const parent=$(dir+'Clues');parent.replaceChildren();
    for(const entry of rows){
      const item=document.createElement('button');item.type='button';item.className='clue-item';item.dataset.word=entry.id;
      if(complete(entry))item.classList.add('is-complete');
      const number=document.createElement('span');number.className='clue-num';number.textContent=entry.number+'.';
      const body=document.createElement('span');body.className='clue-body';
      const txt=document.createElement('span');txt.textContent=entry.clue;
      const sub=document.createElement('span');sub.className='clue-letters';sub.textContent=`${entry.answer.length} písmen`;
      body.append(txt,sub);item.append(number,body);
      if(complete(entry)){const tick=document.createElement('span');tick.className='clue-check';tick.textContent='✓';item.append(tick)}
      item.addEventListener('click',()=>selectWord(entry.id,true));
      parent.append(item);
    }
  }
  $('acrossCount').textContent=String(across.length);
  $('downCount').textContent=String(down.length);
  $('wordCount').textContent=`${puzzle.entries.length} slov`;
}
function renderBoard(){
  box.replaceChildren();
  box.style.gridTemplateColumns=`repeat(${puzzle.cols},var(--box-size))`;
  box.style.gridTemplateRows=`repeat(${puzzle.rows},var(--box-size))`;
  const tajenkaNumbers=new Map((puzzle.tajenka?.cells||[]).map((k,i)=>[k,i+1]));
  for(let r=0;r<puzzle.rows;r++)for(let c=0;c<puzzle.cols;c++){
    const k=key(r,c),cell=puzzle.cells[k];
    const sq=document.createElement('div');sq.className='square'+(!cell?' is-blank':'');sq.dataset.key=k;
    if(cell){
      const input=document.createElement('input');
      input.type='text';input.maxLength=2;input.inputMode='text';input.autocapitalize='characters';input.autocomplete='off';input.spellcheck=false;
      input.dataset.key=k;input.value=values[k]||'';
      input.setAttribute('aria-label',`Řádek ${r+1}, sloupec ${c+1}${cell.number?`, začátek otázky ${cell.number}`:''}`);
      sq.append(input);
      if(cell.number){const number=document.createElement('span');number.className='cell-number';number.textContent=cell.number;sq.append(number)}
      if(tajenkaNumbers.has(k)){
        sq.classList.add('is-tajenka');
        const mark=document.createElement('span');mark.className='tajenka-mark';
        mark.textContent=String(tajenkaNumbers.get(k));mark.setAttribute('aria-hidden','true');
        sq.append(mark);
        input.setAttribute('aria-label',input.getAttribute('aria-label')+`, písmeno tajenky ${tajenkaNumbers.get(k)}`);
      }
    }
    box.append(sq);
  }
  $('sizeLabel').textContent=`${puzzle.cols} × ${puzzle.rows}`;
  requestAnimationFrame(()=>{
    $('scrollNote').hidden=$('boardScroller').scrollWidth<=$('boardScroller').clientWidth+2;
  });
  $('boardTitle').textContent='Doplň chybějící písmena';
  updateHighlights();
  renderTajenka();
}
function afterChange(){
  clearMessage();
  renderClues();
  updateHighlights();
  renderStats();
  renderTajenka();
  if(!solved && correct())finish();
  save();
}
function finish(){
  solved=true;
  $('hintBtn').disabled=true;
  $('checkBtn').disabled=true;
  renderStats();
  const hintText=hints.size===0?'bez jediné nápovědy':`s ${hints.size} odhalenými písmeny`;
  const tajenka=puzzle.tajenka?.phrase ? ` Tajenka: ${puzzle.tajenka.phrase}.` : '';
  showMessage(`Výborně! Křížovka je správně vyřešená ${hintText}. Čas: ${formattedTime()}.${tajenka} Pro další křížovku klikni na „Nová křížovka“.`);
  save();
}
function stepInWord(step,erase=false){
  const entry=puzzle.entries.find(e=>e.id===currentWord);if(!entry)return;
  const cells=wordCells(entry);const index=cells.indexOf(currentCell);
  const next=cells[index+step];if(!next)return;
  if(erase){delete values[next];wrong.delete(next);const input=cellInput(next);if(input)input.value='';}
  selectCell(next,false,true);
  if(erase)afterChange();
}

box.addEventListener('pointerdown',event=>{
  if(!event.target.matches('input[data-key]'))return;
  pointerActive=true;
  pointerBefore=currentCell;
});
box.addEventListener('click',event=>{
  const input=event.target.closest('input[data-key]');if(!input)return;
  const k=input.dataset.key;
  selectCell(k,pointerActive && pointerBefore===k);
  pointerActive=false;
});
box.addEventListener('focusin',event=>{
  const input=event.target.closest('input[data-key]');
  if(input && !pointerActive && input.dataset.key!==currentCell)selectCell(input.dataset.key);
});
box.addEventListener('input',event=>{
  const input=event.target.closest('input[data-key]');if(!input)return;
  const k=input.dataset.key;
  if(!puzzle.cells[k])return;
  const letter=clean(input.value).slice(-1);
  input.value=letter;
  wrong.delete(k);
  if(letter) values[k]=letter;else delete values[k];
  if(currentCell!==k)selectCell(k);
  afterChange();
  if(letter && !solved)stepInWord(1);
});
box.addEventListener('keydown',event=>{
  const input=event.target.closest('input[data-key]');if(!input)return;
  const k=input.dataset.key;
  if(event.key==='Backspace' && !input.value){event.preventDefault();stepInWord(-1,true);return;}
  if(event.key==='Enter' || event.key===' '){event.preventDefault();selectCell(k,true);return;}
  const deltas={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowUp:[-1,0],ArrowDown:[1,0]};
  if(!deltas[event.key])return;
  event.preventDefault();
  const [r,c]=k.split(',').map(Number),[dr,dc]=deltas[event.key];
  let nr=r+dr,nc=c+dc;
  while(nr>=0 && nc>=0 && nr<puzzle.rows && nc<puzzle.cols){
    const nextKey=key(nr,nc);
    if(puzzle.cells[nextKey]){selectCell(nextKey,false,true);return;}
    nr+=dr;nc+=dc;
  }
});

function newPuzzle(force=false){
  if(!force && puzzle && !solved && Object.keys(values).length>0){
    if(!window.confirm('Začít novou křížovku? Aktuální rozehraná křížovka bude nahrazena.'))return;
  }
  try{
    puzzle=generatePuzzle(category,difficulty);
    puzzle.tajenka=createTajenka(puzzle);
    values={};hints=new Set();wrong=new Set();seconds=0;solved=false;
    const first=puzzle.entries.filter(e=>e.dir==='across').sort((a,b)=>a.number-b.number)[0]||puzzle.entries[0];
    currentWord=first.id;currentCell=wordCells(first)[0];
    $('hintBtn').disabled=false;$('checkBtn').disabled=false;
    $('boardScroller').scrollLeft=0;
    clearMessage();
    renderBoard();renderClues();updateHighlights();renderStats();save();
  }catch(error){showMessage('Křížovku se nepodařilo vytvořit. Zkus jiné téma nebo novou křížovku.',true);console.error(error)}
}

function restore(){
  const data=safeLoad(STORAGE_KEY);
  if(!data?.puzzle?.cells || !Array.isArray(data.puzzle.entries))return false;
  if(data.puzzle.version!==1)return false;
  puzzle=data.puzzle;
  // Starší uložené křížovky zachováme a jen jim přiřadíme tajenku.
  if(!puzzle.tajenka || !Array.isArray(puzzle.tajenka.cells)) puzzle.tajenka=createTajenka(puzzle);
  category=puzzle.category;
  difficulty=puzzle.difficulty;
  values=data.values||{};
  hints=new Set(data.hints||[]);
  seconds=Number(data.seconds)||0;
  solved=Boolean(data.solved);
  currentWord=data.currentWord;
  currentCell=data.currentCell;
  if(!puzzle.entries.some(e=>e.id===currentWord))currentWord=puzzle.entries[0].id;
  if(!puzzle.cells[currentCell])currentCell=wordCells(puzzle.entries.find(e=>e.id===currentWord))[0];
  changeSetup();
  $('hintBtn').disabled=solved;$('checkBtn').disabled=solved;
  renderBoard();renderClues();updateHighlights();renderStats();save();
  if(solved)showMessage(`Tuto křížovku už máš vyřešenou. Čas: ${formattedTime()}. Můžeš si vygenerovat další.`);
  return true;
}

$('checkBtn').addEventListener('click',()=>{
  wrong=new Set();
  for(const [k,cell] of Object.entries(puzzle.cells)){
    if(values[k] && values[k]!==cell.answer)wrong.add(k);
  }
  updateHighlights();
  const count=Object.keys(values).filter(k=>values[k]).length;
  if(correct())finish();
  else if(wrong.size)showMessage(`Našel jsem ${wrong.size} nesprávně vyplněných políček. Jsou označená růžově.`,true);
  else if(count<Object.keys(puzzle.cells).length)showMessage('Zatím bez chyb. Některá políčka ale ještě čekají na doplnění.');
  save();
});
$('hintBtn').addEventListener('click',()=>{
  const entry=puzzle.entries.find(e=>e.id===currentWord);if(!entry || solved)return;
  const cells=wordCells(entry);
  const k=cells.find(x=>values[x]!==puzzle.cells[x].answer);
  if(!k){showMessage('Aktuální slovo už máš správně. Vyber jinou otázku.');return;}
  values[k]=puzzle.cells[k].answer;
  hints.add(k);wrong.delete(k);
  cellInput(k).value=values[k];
  selectCell(k,false);
  afterChange();
});
$('newBtn').addEventListener('click',()=>newPuzzle());
selection.addEventListener('change',()=>{category=selection.value;changeSetup()});
document.querySelectorAll('[data-difficulty]').forEach(button=>button.addEventListener('click',()=>{
  difficulty=Number(button.dataset.difficulty);updateDifficulty();savePrefs();
}));
$('themeBtn').addEventListener('click',()=>setTheme(theme==='dark'?'light':'dark'));
$('aboutBtn').addEventListener('click',()=>$('aboutDialog').showModal());
$('closeDialog').addEventListener('click',()=>$('aboutDialog').close());
$('dialogOk').addEventListener('click',()=>$('aboutDialog').close());
$('aboutDialog').addEventListener('click',event=>{if(event.target===$('aboutDialog'))$('aboutDialog').close()});

for(const item of categories){const option=document.createElement('option');option.value=item.id;option.textContent=`${item.icon}  ${item.name}`;selection.append(option)}
const prefs=safeLoad(PREF_KEY)||{};
if(categories.some(c=>c.id===prefs.category))category=prefs.category;
if([1,2,3].includes(prefs.difficulty))difficulty=prefs.difficulty;
setTheme(prefs.theme==='light'?'light':'dark');
changeSetup();
if(!restore())newPuzzle(true);
window.setInterval(()=>{
  if(puzzle && !solved && !document.hidden){seconds++;$('timerStat').textContent=formattedTime();if(seconds%10===0)save()}
},1000);
window.addEventListener('pagehide',save);
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
