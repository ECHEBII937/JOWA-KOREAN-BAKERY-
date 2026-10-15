(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var WHATSAPP = '254743277790';

  /* Footer year */
  $('#yr').textContent = new Date().getFullYear();

  /* Sticky nav colour + mobile menu */
  var nav = $('#nav'), links = $('#links'), burger = $('#burger');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  function toggleMenu(open) {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    nav.classList.toggle('solid', open || window.scrollY > 40);
  }
  burger.addEventListener('click', function () { toggleMenu(!links.classList.contains('open')); });
  $$('a', links).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

  /* Sprinkles: falling candy bits that scatter away from the cursor */
  var cv = $('#sprinkles'), ctx = cv.getContext('2d');
  var colours = ['#FBBF14', '#5BC8F5', '#8DC63F', '#FFFFFF', '#4A1C0F'];
  var bits = [], mouse = { x: -999, y: -999 }, W, H;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
    var n = Math.min(70, Math.round(W / 22));
    while (bits.length < n) bits.push(make(true));
    bits.length = n;
  }
  function make(anywhere) {
    return { x: Math.random() * W, y: anywhere ? Math.random() * H : -20, a: Math.random() * 6.28,
      s: 0.4 + Math.random() * 1.1, r: (Math.random() - .5) * .03, c: colours[Math.random() * colours.length | 0],
      l: 12 + Math.random() * 10, vx: 0 };
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round'; ctx.lineWidth = 6;
    bits.forEach(function (b, i) {
      var dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) { b.vx += dx / d * 1.2; }
      b.vx *= 0.92; b.x += b.vx; b.y += b.s; b.a += b.r;
      if (b.y > H + 20) bits[i] = make(false);
      var cx = Math.cos(b.a) * b.l / 2, cy = Math.sin(b.a) * b.l / 2;
      ctx.strokeStyle = b.c; ctx.beginPath();
      ctx.moveTo(b.x - cx, b.y - cy); ctx.lineTo(b.x + cx, b.y + cy); ctx.stroke();
    });
    if (!reduce) requestAnimationFrame(draw);
  }
  size(); draw();
  window.addEventListener('resize', size);
  cv.parentElement.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  /* Click the logo to throw a burst of sprinkles */
  $('.hero-logo img').addEventListener('click', function () {
    for (var i = 0; i < 24; i++) { var b = make(false); b.y = H * 0.35; b.x = W * 0.75 + (Math.random() - .5) * 200; bits.push(b); }
    setTimeout(function () { bits.splice(70); }, 6000);
    if (reduce) draw();
  });

  /* Menu tabs */
  var tabs = $$('.tab'), cards = $$('.card');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.toggle('on', x === t); });
      var f = t.getAttribute('data-f');
      cards.forEach(function (c) { c.classList.toggle('hide', f !== 'all' && c.getAttribute('data-c') !== f); });
    });
  });

  /* "Add to order" fills the reservation form */
  var itemSel = $('#item');
  function pick(name) {
    var opt = $$('option', itemSel).filter(function (o) { return o.textContent === name; })[0];
    if (opt) itemSel.value = opt.value;
  }
  $$('.add').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = document.createElement('div'); txt.innerHTML = b.getAttribute('data-item');
      pick(txt.textContent);
      $('#reserve').scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { $('input[name=name]').focus({ preventScroll: true }); }, 700);
    });
  });
  $('#chickenCta').addEventListener('click', function () { pick('Korean fried chicken'); });

  /* Lightbox */
  var lb = $('#lightbox'), lbImg = $('img', lb);
  $$('.lb').forEach(function (img) {
    img.addEventListener('click', function () { lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; });
  });
  lb.addEventListener('click', function () { lb.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });

  /* Reservation form -> WhatsApp */
  var form = $('#form'), err = $('#err'), date = $('#date');
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  date.min = today.toISOString().slice(0, 10);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, bad = [];
    ['name', 'phone', 'date'].forEach(function (k) { f[k].classList.remove('bad'); if (!f[k].value.trim()) { bad.push(k); f[k].classList.add('bad'); } });
    var digits = f.phone.value.replace(/\D/g, '');
    if (f.phone.value.trim() && digits.length < 9) { bad.push('phone'); f.phone.classList.add('bad'); }
    if (bad.length) { err.textContent = 'Please check your name, a valid phone number and the pick-up date.'; return; }
    err.textContent = '';
    var d = new Date(f.date.value + 'T00:00').toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' });
    var text = 'Hello Jowa! I would like to reserve:\n' +
      '- Item: ' + f.item.value + '\n- Quantity: ' + f.qty.value + '\n- Pick-up: ' + d + '\n' +
      '- Name: ' + f.name.value.trim() + '\n- Phone: ' + f.phone.value.trim() +
      (f.msg.value.trim() ? '\n- Note: ' + f.msg.value.trim() : '');
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    err.style.color = '#1b5e20'; err.textContent = 'Opening WhatsApp. Send the message and we will confirm with you.';
  });

  /* Gentle reveal for key blocks */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: .15 });
    $$('.about > *, .cards > div, .split > *').forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
