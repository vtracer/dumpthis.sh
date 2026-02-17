// small script to intermittently glitch the symbol text
(function(){
  const el = document.getElementById('symbol');
  if(!el) return;
  const base = el.textContent || '';

  function randInt(n){return Math.floor(Math.random()*n)}
  function pickChar(){
    const pool = ['▌','▐','▀','▄','▔','▁','▚','▞','▛',' '];
    return pool[randInt(pool.length)];
  }

  function glitchOnce(){
    const parts = base.split(' ');
    const glitched = parts.map(p => {
      if(Math.random() < 0.25) return pickChar();
      return p;
    }).join(' ');
    el.textContent = glitched;
    setTimeout(()=>{ el.textContent = base; }, 180 + randInt(200));
  }

  function loop(){
    // random pauses, occasional longer quiet
    glitchOnce();
    setTimeout(loop, 800 + randInt(2400));
  }

  // start after slight delay so page settles
  setTimeout(loop, 400 + randInt(800));
})();
