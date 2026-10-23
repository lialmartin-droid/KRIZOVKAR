(() => {
  'use strict';
  const {novaKrizovka, popisTematu, validatePuzzle} = window.KRIZOVKAR_ENGINE;
  const {normalizuj, OTAZKY} = window.KRIZOVKAR_DATA;
  const STORAGE = 'krizovkar-classic-v2-save';
  const THEME = 'krizovkar-classic-v2-theme';
  const $ = id => document.getElementById(id);
  const state = {
    puzzle:null, letters:{}, hints:0, activeId:null, pos:null, direction:'across', tab:'across',
    showWrong:false, completed:false, lastClickWasActive:false
  };
  const tileEls = new Map();
  let feedbackTimer;

  function key(r,c){return `${r}-${c}`;}
  function getCell(r,c){return state.puzzle?.cells[r]?.[c] || null;}
  function getWord(id){return state.puzzle?.words.find(w=>w.id===id) || null;}
  function points(word){
    const dr=word.dir==='down'?1:0, dc=word.dir==='across'?1:0;
    return [...word.answer].map((_,i)=>({row:word.row+i*dr,col:word.col+i*dc}));
  }
  function getValue(row,col){return state.letters[key(row,col)] || '';}
  function wordDone(word){return points(word).every((p,i)=>getValue(p.row,p.col)===word.answer[i]);}
  function wordAt(row,col,dir){
    const cell=getCell(row,col); if(!cell) return null;
    return getWord(cell[dir]||cell[dir==='across'?'down':'across']);
  }
  function findWordAt(row,col,prefer=state.direction){
    const cell=getCell(row,col); if(!cell)return null;
    const current=getWord(state.activeId);
    if(current && (cell.across===current.id || cell.down===current.id)) return current;
    return wordAt(row,col,prefer);
  }
  function selectedWord(){return getWord(state.activeId);}
  function save() {
    try {
      const data={version:2,puzzle:state.puzzle,letters:state.letters,hints:state.hints,activeId:state.activeId,pos:state.pos,direction:state.direction,tab:state.tab,completed:state.completed};
      localStorage.setItem(STORAGE,JSON.stringify(data));
    } catch(err) { /* Režim soukromého prohlížení může omezit ukládání. */ }
  }
  function load(){
    try {
      const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');
      if(saved?.version!==2||!validatePuzzle(saved.puzzle)||saved.puzzle.width>23||saved.puzzle.height>23)return false;
      const allowed=new Set();
      for(let r=0;r<saved.puzzle.height;r++)for(let c=0;c<saved.puzzle.width;c++)if(saved.puzzle.cells[r][c])allowed.add(key(r,c));
      state.puzzle=saved.puzzle;state.letters={};
      for(const [k,v] of Object.entries(saved.letters||{})) if(allowed.has(k)) state.letters[k]=normalizuj(v).slice(0,1);
      state.hints=Math.max(0,Number(saved.hints)||0);
      state.tab=['across','down'].includes(saved.tab)?saved.tab:'across';
      state.activeId=getWord(saved.activeId)?.id||state.puzzle.words[0]?.id||null;
      state.direction=getWord(state.activeId)?.dir||'across';
      state.pos=state.puzzle.cells[saved.pos?.row]?.[saved.pos?.col]?saved.pos:{row:getWord(state.activeId)?.row??0,col:getWord(state.activeId)?.col??0};
      $('topic').value=state.puzzle.topic;$('level').value=state.puzzle.level;
      return true;
    }catch{return false;}
  }
  function showMessage(text,type=''){
    window.clearTimeout(feedbackTimer);
    $('message').textContent=text;
    $('message').className=`message ${type}`;
    if(type!=='positive'&&type!=='warning')feedbackTimer=setTimeout(()=>{$('message').textContent='';},7000);
  }
  function chooseWord(word, pos={row:word.row,col:word.col}, focus=false) {
    if(!word)return;
    state.activeId=word.id;state.direction=word.dir;state.pos=pos;
    state.tab=word.dir;
    updateClues();updateVisuals();updateCurrent();
    save();
    if(focus) focusAt(pos.row,pos.col);
  }
  function focusAt(r,c){
    const tile=tileEls.get(key(r,c));
    if(!tile)return;
    const input=tile.querySelector('input');
    if(!input)return;
    try{input.focus({preventScroll:true});input.select();}catch{input.focus();}
  }
  function selectCell(r,c,fromClick=false){
    const cell=getCell(r,c);if(!cell)return;
    let word=findWordAt(r,c);
    if(fromClick&&state.lastClickWasActive&&cell.across&&cell.down){
      const dir=word?.dir==='across'?'down':'across';
      word=getWord(cell[dir]);
    }
    if(word)chooseWord(word,{row:r,col:c},false);
    state.lastClickWasActive=false;
  }
  function focusNext(inverse=false){
    const word=selectedWord();if(!word)return;
    const all=points(word);
    let i=all.findIndex(p=>p.row===state.pos?.row&&p.col===state.pos?.col);
    if(i<0)i=0;
    const next=all[(i+(inverse?-1:1)+all.length)%all.length];
    chooseWord(word,next,true);
  }
  function countDone(){return state.puzzle.words.filter(wordDone).length;}
  function countFilled(){return Object.entries(state.letters).filter(([k,v])=>v&&tileEls.has(k)).length;}
  function updateCurrent(){
    const word=selectedWord();if(!word)return;
    const marker=$('currentClue').querySelector('.clue-marker');
    marker.textContent=word.dir==='across'?'→':'↓';
    const title=$('currentClue').querySelector('strong');
    title.textContent=`${word.number}. ${word.clue} (${word.answer.length})`;
    const small=$('currentClue').querySelector('small');
    small.textContent=word.dir==='across'?'VODOROVNĚ':'SVISLE';
  }
  function updateClues(){
    $('tabAcross').classList.toggle('active',state.tab==='across');
    $('tabDown').classList.toggle('active',state.tab==='down');
    $('tabAcross').setAttribute('aria-selected',String(state.tab==='across'));
    $('tabDown').setAttribute('aria-selected',String(state.tab==='down'));
    const list=$('clueList');list.replaceChildren();
    const words=state.puzzle.words.filter(w=>w.dir===state.tab).sort((a,b)=>a.number-b.number);
    for(const w of words) {
      const done=wordDone(w);
      const item=document.createElement('button');item.type='button';
      item.className=`clue-item${done?' done':''}${w.id===state.activeId?' current':''}`;
      item.setAttribute('aria-label',`${w.number}. ${w.clue}, ${w.answer.length} písmen`);
      const number=document.createElement('span');number.className='clue-number';number.textContent=`${w.number}.`;
      const label=document.createElement('span');label.className='clue-text';label.textContent=`${w.clue} (${w.answer.length})`;
      item.append(number,label);
      if(done){const check=document.createElement('span');check.className='check';check.textContent='✓';item.append(check);}
      item.addEventListener('click',()=>chooseWord(w,{row:w.row,col:w.col},true));
      list.append(item);
    }
  }
  function solvedAt(cell){return (!!cell?.across&&wordDone(getWord(cell.across)))|| (!!cell?.down&&wordDone(getWord(cell.down)));}
  function updateVisuals(){
    const active=selectedWord();
    const activeKeys=new Set(active?points(active).map(p=>key(p.row,p.col)):[]);
    let all=0,filled=0;
    for(let r=0;r<state.puzzle.height;r++)for(let c=0;c<state.puzzle.width;c++){
      const cell=getCell(r,c);if(!cell)continue;
      all++;
      const k=key(r,c),tile=tileEls.get(k);
      const val=getValue(r,c);if(val)filled++;
      const isActive=state.pos?.row===r&&state.pos?.col===c;
      tile.classList.toggle('in-word',activeKeys.has(k));
      tile.classList.toggle('is-active',isActive);
      tile.classList.toggle('is-correct',!!val&&val===cell.letter&&solvedAt(cell));
      tile.classList.toggle('is-wrong',state.showWrong&&!!val&&val!==cell.letter);
      tile.classList.toggle('secret',!!cell.secret);
      const input=tile.querySelector('input');
      if(input.value!==val)input.value=val;
      input.setAttribute('aria-label',`Řádek ${r+1}, sloupec ${c+1}${cell.number?`, otázka ${cell.number}`:''}`);
    }
    const done=countDone();
    $('statWords').textContent=`${done} / ${state.puzzle.words.length}`;
    const percent=all?Math.round(100*filled/all):0;
    $('statCells').textContent=`${percent} %`;
    $('statHints').textContent=String(state.hints);
    $('progressBar').style.width=`${percent}%`;
    updateSecret();
    if(done===state.puzzle.words.length&&!state.completed){
      state.completed=true;
      showMessage(`Výborně! Křížovka je vyřešená. Tajenka: ${state.puzzle.tajenka.answer}`,'positive');
    } else if(done<state.puzzle.words.length)state.completed=false;
  }
  function updateSecret(){
    const container=$('secretLetters');container.replaceChildren();
    let revealed=0;
    state.puzzle.tajenka.positions.forEach((p,i)=>{
      const target=state.puzzle.tajenka.answer[i];
      const cell=getCell(p.row,p.col);
      const visible=state.completed || (getValue(p.row,p.col)===target&&solvedAt(cell));
      const box=document.createElement('span');box.className=`secret-letter ${visible?'':'hidden-letter'}`;
      box.textContent=visible?target:'·';box.title=`Tajenka – písmeno ${i+1}`;
      container.append(box); if(visible) revealed++;
    });
    const status=$('secretStatus');
    status.classList.toggle('won',revealed===state.puzzle.tajenka.answer.length);
    status.textContent=revealed===state.puzzle.tajenka.answer.length?`Tajenka je odhalená: ${state.puzzle.tajenka.answer}`:`Odhaleno ${revealed} z ${state.puzzle.tajenka.answer.length} písmen`;
  }
  function createGrid(){
    tileEls.clear();const grid=$('crossword');grid.replaceChildren();
    grid.style.setProperty('--cols',state.puzzle.width);
    grid.style.setProperty('--rows',state.puzzle.height);
    for(let r=0;r<state.puzzle.height;r++)for(let c=0;c<state.puzzle.width;c++){
      const cell=getCell(r,c);const tile=document.createElement('div');
      tile.className='cell'+(!cell?' block':'');
      if(cell){
        const input=document.createElement('input');input.type='text';input.inputMode='text';input.maxLength=1;
        input.autocomplete='off';input.spellcheck=false;input.autocapitalize='characters';
        input.dataset.r=r;input.dataset.c=c;
        input.addEventListener('pointerdown',()=>{state.lastClickWasActive=state.pos?.row===r&&state.pos?.col===c;});
        input.addEventListener('focus',()=>{
          // focus může přijít také programově po zadání písmene.
          if(state.pos?.row!==r||state.pos?.col!==c)selectCell(r,c,false);
        });
        input.addEventListener('click',()=>{
          selectCell(r,c,true);
          input.select();
        });
        input.addEventListener('input',ev=>{
          const typed=normalizuj(ev.target.value).slice(-1);
          if(typed)state.letters[key(r,c)]=typed;
          else delete state.letters[key(r,c)];
          state.showWrong=false;
          updateVisuals();updateClues();save();
          if(typed)focusNext(false);
        });
        input.addEventListener('keydown',ev=>{
          if(ev.key==='Backspace'){
            ev.preventDefault();
            if(getValue(r,c)) delete state.letters[key(r,c)];
            else {const word=selectedWord();if(word){const ps=points(word),i=ps.findIndex(p=>p.row===r&&p.col===c);const previous=ps[Math.max(0,i-1)];if(previous){delete state.letters[key(previous.row,previous.col)];chooseWord(word,previous,true);}}}
            state.showWrong=false;updateVisuals();updateClues();save();return;
          }
          if(ev.key==='ArrowLeft'||ev.key==='ArrowRight'||ev.key==='ArrowUp'||ev.key==='ArrowDown'){
            ev.preventDefault();
            const dir=ev.key==='ArrowLeft'||ev.key==='ArrowRight'?'across':'down';
            const nextWord=wordAt(r,c,dir);
            if(!nextWord)return;
            const pts=points(nextWord);const idx=pts.findIndex(p=>p.row===r&&p.col===c);
            const backward=ev.key==='ArrowLeft'||ev.key==='ArrowUp';
            const next=pts[Math.max(0,Math.min(pts.length-1,idx+(backward?-1:1)))];
            chooseWord(nextWord,next,true);
          }
          if(ev.key==='Enter'||ev.key===' '){
            ev.preventDefault();
            const cell=getCell(r,c);if(cell.across&&cell.down){const word=getWord(cell[state.direction==='across'?'down':'across']);chooseWord(word,{row:r,col:c},true);}
          }
        });
        input.addEventListener('paste',ev=>{
          const raw=(ev.clipboardData||window.clipboardData)?.getData('text')||'';
          const letters=normalizuj(raw);if(!letters)return;
          ev.preventDefault();
          const word=selectedWord();if(!word)return;
          const cells=points(word);const start=cells.findIndex(p=>p.row===r&&p.col===c);
          for(let i=0;i<letters.length&&start+i<cells.length;i++){
            const p=cells[start+i];state.letters[key(p.row,p.col)]=letters[i];
          }
          state.showWrong=false;updateVisuals();updateClues();save();
          const dest=cells[Math.min(cells.length-1,start+letters.length)];chooseWord(word,dest,true);
        });
        tile.append(input);
        if(cell.number){const num=document.createElement('span');num.className='number';num.textContent=cell.number;tile.append(num);}
        if(cell.secret){const n=document.createElement('span');n.className='secret-n';n.textContent=cell.secret;tile.append(n);}
        tileEls.set(key(r,c),tile);
      }
      grid.append(tile);
    }
    resizeGrid();
  }
  function resizeGrid(){
    if(!state.puzzle)return;
    const width=$('gridHolder').clientWidth-5;
    const size=Math.max(13,Math.min(33,Math.floor(width/state.puzzle.width)));
    $('crossword').style.setProperty('--size',`${size}px`);
  }
  function render(){
    $('topic').value=state.puzzle.topic;$('level').value=state.puzzle.level;
    $('puzzleHeading').textContent=popisTematu(state.puzzle.topic);
    $('wordCount').textContent=`${state.puzzle.words.length} slov`;
    const across=state.puzzle.words.filter(w=>w.dir==='across').length;
    $('acrossCount').textContent=across;
    $('downCount').textContent=state.puzzle.words.length-across;
    createGrid();updateVisuals();updateClues();updateCurrent();
  }
  function start(topic,level,seed=Date.now()) {
    try {
      const p=novaKrizovka({topic,level,seed});
      if(!validatePuzzle(p)||p.words.length<7)throw Error('Příliš málo slov.');
      state.puzzle=p;state.letters={};state.hints=0;state.showWrong=false;state.completed=false;
      state.activeId=p.words[0].id;state.pos={row:p.words[0].row,col:p.words[0].col};
      state.direction=p.words[0].dir;state.tab=p.words[0].dir;
      render();save();showMessage('Nová křížovka je připravená.');
    }catch(err){showMessage('Nepodařilo se sestavit křížovku. Zkus to znovu.','warning');console.error(err);}
  }
  function onNew(){
    const hasWork=Object.values(state.letters).some(Boolean);
    if(hasWork&&!state.completed&&!confirm('Chceš začít novou křížovku? Současná rozehraná hra bude nahrazena.'))return;
    start($('topic').value,$('level').value,Date.now()^Math.floor(Math.random()*1e9));
  }
  function check(){
    const tiles=[];let missing=0;
    for(let r=0;r<state.puzzle.height;r++)for(let c=0;c<state.puzzle.width;c++){
      const cell=getCell(r,c);if(!cell)continue;
      if(!getValue(r,c))missing++;
      else if(getValue(r,c)!==cell.letter)tiles.push(key(r,c));
    }
    state.showWrong=true;updateVisuals();save();
    if(!tiles.length&&!missing)showMessage('Všechna políčka jsou správně!','positive');
    else if(tiles.length)showMessage(`${tiles.length} ${tiles.length===1?'chybné políčko':'chybných políček'} (červeně). Zbývá doplnit: ${missing}.`,'warning');
    else showMessage(`Zatím bez chyb. Zbývá doplnit ${missing} políček.`,'positive');
  }
  function hint(){
    const word=selectedWord();if(!word)return;
    const choices=points(word);let pos=state.pos;
    let cell=getCell(pos.row,pos.col);
    if(getValue(pos.row,pos.col)===cell.letter){
      pos=choices.find(p=>getValue(p.row,p.col)!==getCell(p.row,p.col).letter);
      if(!pos){showMessage('Toto slovo už máš správně.','positive');return;}
      cell=getCell(pos.row,pos.col);
    }
    state.letters[key(pos.row,pos.col)]=cell.letter;state.hints++;
    state.showWrong=false;
    chooseWord(word,pos,false);updateVisuals();updateClues();save();
    showMessage('Doplnil jsem správné písmeno.');
    const idx=choices.findIndex(p=>p.row===pos.row&&p.col===pos.col);
    const next=choices[idx+1]||pos;
    chooseWord(word,next,false);
  }
  function erase(){
    const word=selectedWord();if(!word)return;
    for(const p of points(word)){
      const cell=getCell(p.row,p.col);
      const crossing=word.dir==='across'?getWord(cell.down):getWord(cell.across);
      if(crossing&&wordDone(crossing))continue; // Správně vyřešené křížení ponecháme.
      delete state.letters[key(p.row,p.col)];
    }
    state.showWrong=false;updateVisuals();updateClues();save();showMessage('Vybrané slovo je smazané.');
  }
  function setTab(dir){
    state.tab=dir;updateClues();save();
  }
  function setTheme(theme){
    document.documentElement.dataset.theme=theme;
    $('themeButton').title=theme==='dark'?'Přepnout na světlý vzhled':'Přepnout na tmavý vzhled';
    try{localStorage.setItem(THEME,theme);}catch{}
  }
  function downloadBackup(){
    const raw=JSON.stringify({version:2,puzzle:state.puzzle,letters:state.letters,hints:state.hints,activeId:state.activeId,pos:state.pos,direction:state.direction,tab:state.tab,completed:state.completed});
    if(!state.puzzle){showMessage('Zatím není co zálohovat.');return;}
    const blob=new Blob([raw],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download=`krizovkar-zaloha-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
    showMessage('Záloha byla připravena ke stažení.','positive');
  }
  async function restoreBackup(file){
    if(!file)return;
    try{
      const raw=await file.text();const obj=JSON.parse(raw);
      if(obj.version!==2||!validatePuzzle(obj.puzzle)||obj.puzzle.width>23||obj.puzzle.height>23)throw Error('Neplatný soubor');
      if(!confirm('Obnovit zálohu? Současná rozehraná křížovka bude nahrazena.'))return;
      localStorage.setItem(STORAGE,raw);
      if(!load())throw Error('Obnova se nezdařila');
      state.showWrong=false;state.completed=false;
      render();save();showMessage('Záloha byla obnovena.','positive');
    }catch{showMessage('Nepodařilo se načíst zálohu verze 2.0.','warning');}
    finally{$('importFile').value='';}
  }

  $('newButton').addEventListener('click',onNew);
  $('checkButton').addEventListener('click',check);
  $('hintButton').addEventListener('click',hint);
  $('eraseButton').addEventListener('click',erase);
  $('tabAcross').addEventListener('click',()=>setTab('across'));
  $('tabDown').addEventListener('click',()=>setTab('down'));
  $('themeButton').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
  $('exportButton').addEventListener('click',downloadBackup);
  $('importButton').addEventListener('click',()=>$('importFile').click());
  $('importFile').addEventListener('change',e=>restoreBackup(e.target.files[0]));
  window.addEventListener('resize',resizeGrid);
  try{setTheme(localStorage.getItem(THEME)|| (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));}catch{setTheme('light');}
  if(load()){render();showMessage('Rozehraná křížovka byla obnovena.');}
  else start('all','medium');
  if('serviceWorker' in navigator && /^https?:$/.test(location.protocol))navigator.serviceWorker.register('./sw.js').catch(()=>{});
  console.info('Křížovkář 2.0 · otázek:',OTAZKY.length);
})();
