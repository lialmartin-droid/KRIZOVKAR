import {questions} from './data.js';

const SIZE = 27;
const CENTER = Math.floor(SIZE / 2);
const KEY = (r,c) => `${r},${c}`;
const shuffle = a => {
  const out = [...a];
  for(let i=out.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [out[i],out[j]]=[out[j],out[i]];
  }
  return out;
};

function chooseBank(category, difficulty){
  const groups = category === 'mine' ? ['bees','chickens','work','workshop','games']
    : category === 'mix' ? ['bees','chickens','work','workshop','games','nature','general']
    : [category];
  let rows = questions.filter(q => groups.includes(q.category) && (difficulty === 1 ? q.level === 1 : difficulty === 2 ? q.level <= 2 : true));
  if(difficulty === 3){
    // Náročnější otázky mají přednost, jednodušší slova dovolí lepší křížení.
    rows = [...shuffle(rows.filter(x=>x.level===3)),...shuffle(rows.filter(x=>x.level===2)),...shuffle(rows.filter(x=>x.level===1))];
    rows = [...rows.slice(0,21),...shuffle(rows.slice(21)).slice(0,9)];
  } else {
    rows = shuffle(rows).slice(0, category === 'mine' || category === 'mix' ? 42 : 31);
  }
  return shuffle(rows).filter(q => q.answer.length>=3 && q.answer.length<=11);
}

function createAttempt(words, target){
  const grid = new Map();
  const placed = [];
  let minR=SIZE, maxR=0, minC=SIZE, maxC=0;
  const initialPool = words.filter(x=>x.answer.length>=5 && x.answer.length<=10);
  const initial = (initialPool.length ? shuffle(initialPool).slice(0,8) : shuffle(words))
    .sort((a,b)=>b.answer.length-a.answer.length)[0];
  if(!initial) return null;

  function commit(word, r, c, dir){
    const dr = dir==='down'?1:0, dc = dir==='across'?1:0;
    for(let i=0;i<word.answer.length;i++) {
      const rr=r+i*dr,cc=c+i*dc,k=KEY(rr,cc);
      const cell=grid.get(k) || {ch:word.answer[i], across:false, down:false};
      cell[dir]=true;grid.set(k,cell);
      minR=Math.min(minR,rr);maxR=Math.max(maxR,rr);
      minC=Math.min(minC,cc);maxC=Math.max(maxC,cc);
    }
    placed.push({...word, r,c,dir});
  }

  function valid(word,r,c,dir){
    const dr=dir==='down'?1:0,dc=dir==='across'?1:0;
    const eR=r+(word.answer.length-1)*dr, eC=c+(word.answer.length-1)*dc;
    if(r<1 || c<1 || eR>=SIZE-1 || eC>=SIZE-1) return null;
    if(grid.has(KEY(r-dr,c-dc))||grid.has(KEY(eR+dr,eC+dc))) return null;
    let crosses=0;
    for(let i=0;i<word.answer.length;i++){
      const rr=r+i*dr,cc=c+i*dc,cell=grid.get(KEY(rr,cc));
      if(cell){
        if(cell.ch!==word.answer[i] || cell[dir]) return null;
        crosses++;
      }else{
        if(dir==='across'){
          if(grid.has(KEY(rr-1,cc))||grid.has(KEY(rr+1,cc))) return null;
        }else{
          if(grid.has(KEY(rr,cc-1))||grid.has(KEY(rr,cc+1))) return null;
        }
      }
    }
    if(!crosses) return null;
    const nminR=Math.min(minR,r),nmaxR=Math.max(maxR,eR),nminC=Math.min(minC,c),nmaxC=Math.max(maxC,eC);
    const oldArea=(maxR-minR+1)*(maxC-minC+1);
    const newArea=(nmaxR-nminR+1)*(nmaxC-nminC+1);
    const width=nmaxC-nminC+1,height=nmaxR-nminR+1;
    return {crosses, score:crosses*38 - (newArea-oldArea)*.42 + word.answer.length*.52 - Math.max(width-19,0)*1.4 - Math.max(height-19,0)*1.4 + Math.random()*8};
  }

  commit(initial,CENTER,CENTER-Math.floor(initial.answer.length/2),'across');
  const remaining=words.filter(x=>x!==initial);
  while(placed.length<target && remaining.length){
    const occupied=[...grid.entries()].map(([id,cell])=>{const [r,c]=id.split(',').map(Number);return {r,c,...cell};});
    let options=[];
    for(let wi=0;wi<remaining.length;wi++){
      const q=remaining[wi];
      let best=null;
      for(const dir of ['across','down']){
        for(let i=0;i<q.answer.length;i++){
          for(const cell of occupied){
            if(cell.ch!==q.answer[i] || cell[dir]) continue;
            const r=cell.r-(dir==='down'?i:0),c=cell.c-(dir==='across'?i:0);
            const result=valid(q,r,c,dir);
            if(result && (!best||result.score>best.score)) best={...result,r,c,dir,wi};
          }
        }
      }
      if(best) options.push(best);
    }
    if(!options.length)break;
    options.sort((a,b)=>b.score-a.score);
    // Mírná náhodnost nabízí různé rébusy při každém spuštění.
    const chosen=options[Math.floor(Math.random()*Math.min(options.length,3))];
    const [word]=remaining.splice(chosen.wi,1);
    commit(word,chosen.r,chosen.c,chosen.dir);
  }
  let intersections=0;
  for(const cell of grid.values()) if(cell.across&&cell.down) intersections++;
  return {placed,grid,minR,maxR,minC,maxC,intersections,
    value:placed.length*1000 + intersections*16 - (maxR-minR+1)*(maxC-minC+1)*.2};
}

export function generatePuzzle(category='mine',difficulty=2){
  const bank = chooseBank(category,difficulty);
  if(bank.length<8) throw Error('Pro toto téma není dostatek otázek.');
  const target = difficulty===1?11:difficulty===2?13:14;
  let best=null;
  for(let i=0;i<22;i++){
    const attempt=createAttempt(shuffle(bank).slice(0,27), target);
    if(attempt && (!best || attempt.value>best.value))best=attempt;
    if(best?.placed.length===target && best.intersections>=target) break;
  }
  if(!best || best.placed.length<5)throw Error('Nepodařilo se poskládat křížovku.');
  const margin=0;
  const rows=best.maxR-best.minR+1+2*margin;
  const cols=best.maxC-best.minC+1+2*margin;
  const entries=best.placed.map((word,index)=>({...word,id:index+1,
    r:word.r-best.minR+margin,c:word.c-best.minC+margin}));
  // Číslování podle polohy; obě orientace na stejném políčku sdílí číslo.
  const origins=[...new Set(entries.map(e=>KEY(e.r,e.c)))].sort((a,b)=>{
    const [ar,ac]=a.split(',').map(Number),[br,bc]=b.split(',').map(Number);
    return ar-br || ac-bc;
  });
  const nums=new Map(origins.map((s,i)=>[s,i+1]));
  const output=entries.map(e=>({...e,number:nums.get(KEY(e.r,e.c))}));
  const cells={};
  for(const e of output){
    for(let i=0;i<e.answer.length;i++){
      const r=e.r+(e.dir==='down'?i:0),c=e.c+(e.dir==='across'?i:0),id=KEY(r,c);
      const cell=cells[id] || {r,c,answer:e.answer[i],words:[],number:nums.get(id)||null};
      cell.words.push(e.id); cells[id]=cell;
    }
  }
  return {version:1,id:Date.now()+'-'+Math.random().toString(36).slice(2,8),category,difficulty,
    rows,cols,entries:output,cells};
}
