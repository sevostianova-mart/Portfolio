(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// progress + nav
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });
$('#burger').onclick = () => $('#menu').classList.toggle('open');
$$('#menu a').forEach(a => a.onclick = () => $('#menu').classList.remove('open'));

// cursor
const cur = $('#cursor') || document.createElement('i');
addEventListener('mousemove', e => { cur.style.opacity = 1; cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.card')));

// typed
const words = ['интерактивные уроки', 'сайты с ИИ и геймификацией', 'образовательные программы', 'методики для ОГЭ, ЕГЭ и олимпиад'];
let wi = 0, ci = 0, del = false;
(function type() {
  const w = words[wi], t = $('#typed');
  t.textContent = w.slice(0, ci);
  if (!del && ci === w.length) { del = true; return setTimeout(type, 1500); }
  if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
  ci += del ? -1 : 1;
  setTimeout(type, del ? 30 : 70);
})();

// reveal + counters + bars
const fmt = (v, dec) => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v);
function count(el) {
  const to = +el.dataset.to, from = +(el.dataset.from || 0), dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '';
  const t0 = performance.now(), d = 1800;
  (function step(t) {
    const p = Math.min((t - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (el.dataset.pre || '') + fmt(from + (to - from) * e, dec) + suf;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  const b = $('b[data-to]', e.target); if (b) count(b);
  io.unobserve(e.target);
}), { threshold: .15 });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
const bio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .4 });
$$('.bar').forEach(b => bio.observe(b));

// filters
$$('#filters button').forEach(b => b.onclick = () => {
  $$('#filters button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  const all = b.dataset.f === 'all', box = $('#cards');
  let n = 0;
  $$('#cards .card').forEach(c => { const hide = !all && c.dataset.cat !== b.dataset.f; c.classList.toggle('hide', hide); if (!hide) n++; });
  box.classList.toggle('flt', !all);
  box.classList.toggle('flt2', !all && n % 3 !== 0);
});

// lightbox
const lb = $('#lb');
$$('.card:not(.link):not(.stat):not(.miro)').forEach(c => c.onclick = () => { $('#lbImg').src = c.dataset.lb; $('#lbCap').textContent = c.dataset.title; lb.classList.add('on'); });
$$('.doc-imgs img').forEach(im => im.onclick = () => { $('#lbImg').src = im.dataset.lb; $('#lbCap').textContent = im.closest('.doc-imgs').dataset.title; lb.classList.add('on'); });
lb.onclick = () => lb.classList.remove('on');
addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));

// miro tabs
{const m=$('.card.miro');if(m){const names=JSON.parse(m.dataset.names),img=$('#miroImg');let k=0;
const set=i=>{k=i;img.src=`img/miro${i}.webp`;$$('.mtabs button',m).forEach((b,x)=>b.classList.toggle('on',x==i))};
$$('.mtabs button',m).forEach((b,i)=>b.onclick=()=>set(i));
img.onclick=()=>{$('#lbImg').src=img.src;$('#lbCap').textContent=`Доска Miro · ${String(k).padStart(2,'0')} · ${names[k]}`;lb.classList.add('on')};}}

// confetti
const cv = $('#confetti'), cx = cv.getContext('2d');
function confetti() {
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#6c3cf0', '#ff4d8d', '#ffc93c', '#12cdbf', '#ff8a3c'];
  const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4, s: Math.random() * 8 + 5, c: cols[Math.random() * 5 | 0], r: Math.random() * 6 }));
  let f = 0;
  (function draw() {
    cx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .2; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); cx.restore(); });
    if (++f < 140) requestAnimationFrame(draw); else cx.clearRect(0, 0, cv.width, cv.height);
  })();
}

// mini lesson
const Q = [
  { e: '', q: 'Please send me the ___ of yesterday\'s meeting.', o: ['minutes', 'agenda', 'deadline', 'stakeholder'], a: 0 },
  { e: '', q: 'Could I ___ one more point to the agenda?', o: ['add', 'adds', 'adding', 'to adding'], a: 0 },
  { e: '', q: 'I\'m afraid I ___ agree with that.', o: ['can\'t', 'don\'t', 'aren\'t', 'haven\'t'], a: 0 },
  { e: '', q: 'Choose the best way to end small talk politely.', o: ['It was great talking to you.', 'I have to go now.', 'Stop talking.', 'Whatever.'], a: 0 },
  { e: '', q: 'We need to ___ the launch until the 15th.', o: ['postpone', 'chair', 'follow', 'wrap'], a: 0 },
];
Q.forEach(q => { const c = q.o[q.a]; q.o = q.o.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]); q.a = q.o.indexOf(c); });
let qi = 0, stars = 0, streak = 0;
const gB = $('#gBody'), gF = $('#gFb'), gN = $('#gNext');
function render() {
  const q = Q[qi];
  $('#gQ').textContent = `Вопрос ${qi + 1} / ${Q.length}`;
  $('#gBar').style.width = (qi / Q.length * 100) + '%';
  gB.innerHTML = `<div class="q"><span class="em">${q.e}</span>${q.q}</div><div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>`;
  gF.textContent = ''; gN.hidden = true;
  $$('.opt', gB).forEach(b => b.onclick = () => answer(+b.dataset.i));
}
function answer(i) {
  const q = Q[qi], opts = $$('.opt', gB);
  opts.forEach(o => o.disabled = true);
  opts[q.a].classList.add('ok');
  if (i === q.a) {
    streak++; stars += streak >= 3 ? 2 : 1;
    gF.textContent = streak >= 3 ? `🔥 Серия ×${streak}! Двойные звёзды!` : '🎉 Верно! +1 звезда';
  } else { opts[i].classList.add('no'); streak = 0; gF.textContent = '💡 Почти! Правильный ответ подсвечен — запомните его.'; }
  const s = $('#gStars'); s.textContent = '★ ' + stars; s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop');
  gN.textContent = qi === Q.length - 1 ? 'Узнать результат →' : 'Дальше →'; gN.hidden = false;
}
gN.onclick = () => {
  if (++qi < Q.length) return render();
  $('#gBar').style.width = '100%'; confetti();
  gB.innerHTML = `<div class="end"><div class="big">${stars >= 6 ? '🏆' : '🌟'}</div><h3>Вы набрали ★ ${stars}!</h3><p>Именно так я встраиваю мотивацию в обучение: мгновенная обратная связь, серии и награды.</p><br><button class="btn" id="again">Сыграть ещё раз</button></div>`;
  gF.textContent = ''; gN.hidden = true;
  $('#again').onclick = () => { qi = 0; stars = 0; streak = 0; $('#gStars').textContent = '★ 0'; render(); };
};
render();
})();
