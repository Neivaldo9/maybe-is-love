(() => {
  const WHATSAPP_NUMBER = '258851971086';
  const MUSIC_FILE = 'audio/best-part.mp3';

  const letters = [['A','Adorable'],['B','Beautiful'],['C','Cute'],['D','Dreamy'],['E','Enchanting'],['F','Funny'],['G','Gorgeous'],['H','Heavenly'],['I','Irresistible'],['J','Joyful']];
  const lines = [
    ['🎲', 'Ludo', 'No Ludo preciso de um seis para sair de casa. Contigo só preciso de um “oi”.'],
    ['🔮', 'Marble Master', 'Sou como a bolinha no labirinto: passo por todos os obstáculos e o destino é sempre o teu sorriso.'],
    ['🎶', 'Best Part', 'Dizem que há uma melhor parte do dia. A minha é quando tu apareces.'],
    ['🌷', 'Timidez', 'Não precisas de dizer nada. O teu sorriso já fala por ti.']
  ];
  const diceLines = ['Um… o número de pessoas que me faz sorrir assim. 💗', 'Dois: tu e eu no mesmo sítio. Só isso. 🌷', 'Três: as vezes que penso em ti antes de dormir… ou mais. 😌', 'Quatro: as estações do ano, e em todas eu queria ver o teu sorriso. 🌸', 'Cinco: quase lá… só falta um seis para eu te ver. 😏', 'Seis! Agora podes sair de casa… para me ver. 😌'];
  const progs = ['Pôr do sol com “Best Part” 🌇', 'Gelado e uma partida de Ludo 🍦', 'Um episódio de “A Different World” 📺'];
  const days = ['Esta semana', 'No fim de semana', 'Quando tu puderes'];
  const palette = ['#ffb7d6', '#ffd9a0', '#ff8fa8', '#e9b3ff', '#ffc4a3', '#b8f0cf'];

  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll('.screen')];
  let cur = 0;
  function go(i) {
    cur = i;
    screens.forEach((s, k) => s.classList.toggle('active', k === i));
    $('fill').style.width = `${(i + 1) / screens.length * 100}%`;
    scrollTo({ top: 0 });
    if (i === 5) runLetter();
  }
  document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => go(cur + 1)));
  go(0);

  function softReveal(el, text, delay = 0) {
    el.textContent = '';
    const words = text.split(' ');
    words.forEach((word, k) => {
      const w = document.createElement('span');
      w.className = 'w'; w.textContent = word; w.style.animationDelay = `${delay + k * 0.07}s`;
      el.appendChild(w); el.appendChild(document.createTextNode(' '));
    });
    return delay + words.length * 0.07;
  }
  function runLetter() {
    let t = 0.3;
    document.querySelectorAll('#letter p').forEach(p => { p.dataset.full = p.dataset.full || p.textContent; t = softReveal(p, p.dataset.full, t) + 0.5; });
    $('afterLetter').style.animationDelay = `${t}s`;
    $('letter').onclick = () => {
      document.querySelectorAll('#letter .w').forEach(w => { w.style.animationDelay = '0s'; });
      $('afterLetter').style.animationDelay = '0s';
    };
  }

  // Música
  const audio = new Audio(MUSIC_FILE);
  audio.loop = true; audio.volume = .7;
  async function setMusic(on) {
    try { if (on) await audio.play(); else audio.pause(); } catch (_) { on = false; }
    $('music').textContent = on ? '♫' : '♫ ✕';
    $('music').setAttribute('aria-pressed', String(on));
  }
  $('music').addEventListener('click', () => setMusic(audio.paused));
  $('startMusic').addEventListener('click', () => setMusic(true));

  // Alfabeto
  let opened = 0;
  letters.forEach(([l, w], i) => {
    const b = document.createElement('button');
    b.className = 'tile'; b.textContent = l; b.setAttribute('aria-label', `${l} de ${w}`);
    b.addEventListener('click', () => {
      if (b.classList.contains('on')) return;
      b.classList.add('on'); b.textContent = w; b.style.background = palette[i % palette.length];
      if (++opened === letters.length) softReveal($('maguiNote'), 'E no fim de tudo, M-A-G-U-I: Marvelous, Adorable, Gorgeous, Unique, Irresistible. 💜');
    });
    $('tiles').appendChild(b);
  });

  // Cantadas
  lines.forEach(([icon, label, text]) => {
    const c = document.createElement('button');
    c.className = 'card'; c.innerHTML = `<b>${icon} ${label}</b><p></p>`;
    c.addEventListener('click', () => { if (!c.dataset.open) { c.dataset.open = 1; softReveal(c.querySelector('p'), text); } });
    $('cards').appendChild(c);
  });

  // Ludo
  let rolls = 0;
  const used = [];
  const faces = '⚀⚁⚂⚃⚄⚅';
  $('roll').addEventListener('click', () => {
    if (rolls >= 3 || $('dice').classList.contains('roll')) return;
    $('dice').classList.add('roll');
    setTimeout(() => {
      $('dice').classList.remove('roll');
      let n = 5;
      if (rolls < 2) { do { n = Math.floor(Math.random() * 5); } while (used.includes(n)); used.push(n); }
      $('dice').textContent = faces[n];
      softReveal($('diceMsg'), diceLines[n]);
      if (++rolls === 3) { $('roll').hidden = true; $('afterDice').hidden = false; } else $('roll').textContent = 'Lançar outra vez 🎲';
    }, 650);
  });

  // Convite
  let prog = '', day = '';
  function chips(box, items, set) {
    items.forEach(t => {
      const c = document.createElement('button');
      c.className = 'chip'; c.textContent = t;
      c.addEventListener('click', () => { box.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); set(t); update(); });
      box.appendChild(c);
    });
  }
  const wa = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  function update() {
    $('yes').href = wa(`Oi! Adorei o site 💜 Vamos sim: ${prog || 'um programa à tua escolha'}. ${day || 'Quando der para ti.'}`);
    $('maybe').href = wa('Oi! Adorei o site 💜 Talvez outro dia, mas gostei muito da surpresa.');
  }
  chips($('progs'), progs, t => { prog = t; });
  chips($('days'), days, t => { day = t; });
  update();
  [$('yes'), $('maybe')].forEach(a => a.addEventListener('click', e => {
    if (WHATSAPP_NUMBER.includes('X')) { e.preventDefault(); alert('Falta pôr o número do WhatsApp no js/app.js'); }
  }));

  // Flores a cair 
  const layer = document.createElement('div');
  layer.className = 'flower-layer';
  document.body.appendChild(layer);
  for (let i = 0; i < 18; i++) {
    const f = document.createElement('span'), g = document.createElement('i');
    f.className = 'flower'; g.textContent = ['✿', '❀', '✾'][i % 3]; g.style.color = palette[i % palette.length];
    f.appendChild(g);
    f.style.left = `${Math.random() * 96}%`; f.style.fontSize = `${16 + Math.random() * 16}px`;
    f.style.animationDuration = `${12 + Math.random() * 10}s`; f.style.animationDelay = `${-Math.random() * 20}s`;
    f.style.setProperty('--sway', `${Math.random() * 80 - 40}px`);
    layer.appendChild(f);
  }
  document.addEventListener('pointerdown', e => {
    layer.querySelectorAll('.flower').forEach(f => {
      const r = f.getBoundingClientRect(), p = 14;
      if (e.clientX > r.left - p && e.clientX < r.right + p && e.clientY > r.top - p && e.clientY < r.bottom + p) {
        const g = f.firstChild; g.style.color = palette[Math.floor(Math.random() * palette.length)];
        g.classList.remove('pop'); void g.offsetWidth; g.classList.add('pop');
      }
    });
  }, { passive: true });
})();
