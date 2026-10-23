(() => {
'use strict';
const { OTAZKY, TEMATA } = window.KRIZOVKAR_DATA;

function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(a, rand) {
  const copy = a.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
const SIZE = 23;
function emptyBoard() {
  return Array.from({length: SIZE}, () => Array.from({length: SIZE}, () => null));
}
const nr = (dir) => dir === 'across' ? 0 : 1;
const nc = (dir) => dir === 'across' ? 1 : 0;

function boundsWith(existing, row, col, word, dir) {
  const endR = row + (word.length - 1) * nr(dir);
  const endC = col + (word.length - 1) * nc(dir);
  return {
    minR: Math.min(existing.minR, row, endR),
    maxR: Math.max(existing.maxR, row, endR),
    minC: Math.min(existing.minC, col, endC),
    maxC: Math.max(existing.maxC, col, endC)
  };
}
function canPlace(board, answer, row, col, dir, bounds, maxSide) {
  const dr = nr(dir), dc = nc(dir);
  const endR = row + (answer.length-1)*dr, endC = col + (answer.length-1)*dc;
  if (row < 1 || col < 1 || endR >= SIZE-1 || endC >= SIZE-1) return null;
  if (board[row-dr][col-dc] || board[endR+dr][endC+dc]) return null;
  const nextBounds = boundsWith(bounds, row, col, answer, dir);
  const height = nextBounds.maxR - nextBounds.minR + 1;
  const width = nextBounds.maxC - nextBounds.minC + 1;
  if (height > maxSide || width > maxSide) return null;
  let crosses = 0;
  for (let i = 0; i < answer.length; i++) {
    const r = row+i*dr, c = col+i*dc;
    const cell = board[r][c];
    if (cell) {
      if (cell.letter !== answer[i] || cell[dir]) return null;
      crosses++;
    } else {
      if (dir === 'across') {
        if (board[r-1][c] || board[r+1][c]) return null;
      } else if (board[r][c-1] || board[r][c+1]) return null;
    }
  }
  if (crosses < 1) return null;
  const area = height * width;
  return {crosses, nextBounds, area};
}
function place(board, entry, row, col, dir, id) {
  const dr = nr(dir), dc = nc(dir);
  for (let i=0; i<entry.answer.length; i++) {
    const r=row+i*dr, c=col+i*dc;
    if (!board[r][c]) board[r][c] = {letter:entry.answer[i], across:null,down:null};
    board[r][c][dir] = id;
  }
}
function attempt(seed, topic, level) {
  const rand = rng(seed);
  const maxSide = level === 'easy' ? 15 : level === 'medium' ? 17 : 19;
  const target = level === 'easy' ? 13 : level === 'medium' ? 17 : 20;
  let pool = OTAZKY.filter(w => (topic === 'all' || w.topic === topic) && (level !== 'easy' || w.difficulty === 1));
  if (level === 'hard') pool = shuffle(pool, rand).sort((a,b) => (b.difficulty-a.difficulty) * (rand() > .5 ? 1 : .3));
  else pool = shuffle(pool, rand);
  const board = emptyBoard();
  let bounds={minR:SIZE,maxR:0,minC:SIZE,maxC:0};
  const starterPool=pool.filter(w=>w.answer.length>=5 && w.answer.length<=9);
  const starter=starterPool[Math.floor(rand()*starterPool.length)] || pool[0];
  if (!starter) return null;
  const row=Math.floor(SIZE/2), col=Math.floor((SIZE-starter.answer.length)/2);
  const words=[];
  place(board,starter,row,col,'across',starter.id);
  words.push({...starter,row,col,dir:'across'});
  bounds=boundsWith(bounds,row,col,starter.answer,'across');
  const used=new Set([starter.answer]);
  const remaining=pool.filter(w=> !used.has(w.answer) && w.answer.length<=maxSide);
  // Ve více průchodech zkoušíme i slova, která zatím nešlo umístit.
  for(let pass=0;pass<4 && words.length<target;pass++) {
    let additions=0;
    for(const entry of remaining) {
      if(used.has(entry.answer)) continue;
      let best=null;
      for(let i=0;i<entry.answer.length;i++) {
        const char=entry.answer[i];
        for(let r=Math.max(1,bounds.minR);r<=Math.min(SIZE-2,bounds.maxR);r++) {
          for(let c=Math.max(1,bounds.minC);c<=Math.min(SIZE-2,bounds.maxC);c++) {
            const cell=board[r][c];
            if(!cell || cell.letter!==char) continue;
            for(const dir of ['across','down']) {
              if(cell[dir]) continue;
              const sr=r-i*nr(dir), sc=c-i*nc(dir);
              const fit=canPlace(board,entry.answer,sr,sc,dir,bounds,maxSide);
              if(!fit) continue;
              const diff=fit.area-(bounds.maxR-bounds.minR+1)*(bounds.maxC-bounds.minC+1);
              // Víc křížení, menší roztažení mřížky a mírná náhoda.
              const score=fit.crosses*32-diff*1.25+rand()*10;
              if(!best || score>best.score) best={row:sr,col:sc,dir,score,bounds:fit.nextBounds};
            }
          }
        }
      }
      if(best) {
        place(board,entry,best.row,best.col,best.dir,entry.id);
        words.push({...entry,row:best.row,col:best.col,dir:best.dir});
        bounds=best.bounds;
        used.add(entry.answer);
        additions++;
        if(words.length>=target) break;
      }
    }
    if(!additions) break;
  }
  const height=bounds.maxR-bounds.minR+1, width=bounds.maxC-bounds.minC+1;
  const cropped=Array.from({length:height},(_,r) => Array.from({length:width},(_,c)=> {
    const cell=board[r+bounds.minR][c+bounds.minC];
    return cell ? {...cell} : null;
  }));
  const translated=words.map(w=>({...w,row:w.row-bounds.minR,col:w.col-bounds.minC}));
  return {cells:cropped,words:translated,width,height,level,topic,seed, score:words.length*1000-(height*width)};
}

const TAJENKY = {
  all: ['POKLAD','VITEZ','RADOST','PRIRODA','DOMOV','JIZERA','ZABAVA','KRASA','MED','LES'],
  vcely: ['VCELA','MED','VOSK','ROJ','ULY','NEKTAR','MATKA'],
  slepice: ['VEJCE','KURNIK','KOHOUT','SLEPICE','PERI','DVOREK'],
  dilna: ['DILNA','STAVBA','DREVO','HREBIK','DOMOV'],
  vyroba: ['MOTOR','AUTO','VYROBA','KVALITA','TYM','PALIVO'],
  hry: ['HRAC','TETRIS','VITEZ','SKORE','LEVEL','HRA'],
  vedomosti: ['JIZERA','PRAHA','PRIRODA','ZEME','RADOST','OCEAN']
};

function secretFor(puzzle, seed) {
  const rand=rng(seed^0x4231);
  const options=shuffle(TAJENKY[puzzle.topic]||TAJENKY.all,rand);
  const positions=new Map();
  for(let r=0;r<puzzle.height;r++) for(let c=0;c<puzzle.width;c++) {
    const cell=puzzle.cells[r][c];
    if(cell) {
      if(!positions.has(cell.letter)) positions.set(cell.letter,[]);
      positions.get(cell.letter).push({row:r,col:c});
    }
  }
  for(const secret of options) {
    const selected=Array(secret.length);
    const used=new Set();
    const indices=Array.from(secret,(_,i)=>i).sort((a,b)=> (positions.get(secret[a])?.length||0)-(positions.get(secret[b])?.length||0));
    let success=true;
    for(const i of indices) {
      const candidates=shuffle(positions.get(secret[i]) || [],rand).filter(p=>!used.has(`${p.row}-${p.col}`));
      candidates.sort((a,b)=>{
        const rowsA=selected.filter(p=>p&&p.row===a.row).length;
        const rowsB=selected.filter(p=>p&&p.row===b.row).length;
        return rowsA-rowsB;
      });
      if(!candidates.length) {success=false;break;}
      selected[i]=candidates[0];used.add(`${candidates[0].row}-${candidates[0].col}`);
    }
    if(success) return {answer:secret, positions:selected};
  }
  // Žádná zavádějící tajenka: kdyby slova k vybrané tajence chyběla, vytvoříme ji z existujících písmen.
  const all=[];
  for(let r=0;r<puzzle.height;r++) for(let c=0;c<puzzle.width;c++) if(puzzle.cells[r][c]) all.push({row:r,col:c});
  const selected=shuffle(all,rand).slice(0,5);
  return {answer:selected.map(p=>puzzle.cells[p.row][p.col].letter).join(''),positions:selected};
}

function novaKrizovka({topic='all',level='medium',seed=Date.now()}={}) {
  let best=null;
  for(let i=0;i<4;i++) {
    const puzzle=attempt((seed+i*14991)>>>0,topic,level);
    if(puzzle && (!best||puzzle.score>best.score)) best=puzzle;
  }
  if(!best) throw new Error('Nepodařilo se sestavit křížovku.');
  best.words.sort((a,b)=>a.row-b.row || a.col-b.col || (a.dir==='across'?-1:1));
  const indexes=new Map(); let next=1;
  for(const w of best.words) {
    const key=`${w.row}-${w.col}`;
    if(!indexes.has(key)) indexes.set(key,next++);
    w.number=indexes.get(key);
  }
  for(const [key,value] of indexes) {
    const [r,c]=key.split('-').map(Number);
    best.cells[r][c].number=value;
  }
  const tajenka=secretFor(best,seed);
  for(let i=0;i<tajenka.positions.length;i++) {
    const {row,col}=tajenka.positions[i];
    best.cells[row][col].secret=i+1;
  }
  best.tajenka=tajenka;
  delete best.score;
  return best;
}

function popisTematu(id) {return id==='all'?'Všechna témata':(TEMATA[id]?.title||'Všechna témata');}

function validatePuzzle(p) {
  if(!p || !Array.isArray(p.cells) || !Array.isArray(p.words) || !p.cells.length) return false;
  if(p.height!==p.cells.length || p.cells.some(row=>!Array.isArray(row)||row.length!==p.width)) return false;
  return p.words.every(w => w.answer && w.answer.split('').every((letter,i)=>p.cells[w.row+i*nr(w.dir)]?.[w.col+i*nc(w.dir)]?.letter===letter));
}

window.KRIZOVKAR_ENGINE = {novaKrizovka, popisTematu, validatePuzzle};

})();
