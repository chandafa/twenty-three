const CONFIG = {
  recipientName: 'Meisya Al Zahra',
  senderName: 'Someone',
  age: 23,
  birthdayLabel: '30 Mei 2026',
  birthdayISO: '2026-05-30T00:00:00+07:00',
  driveFileId: '1zxEvhRdWimgy8cjzErxOxlGCCwdusHem',
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const DRIVE_PREVIEW_URL = `https://drive.google.com/file/d/${CONFIG.driveFileId}/preview`;
const DRIVE_VIEW_URL = `https://drive.google.com/file/d/${CONFIG.driveFileId}/view?usp=drive_link`;

let selectedWish = 'Semoga semua doa baik tercapai';
let soundEnabled = false;
let audioContext = null;
let lenisInstance = null;
let animeLoopsStarted = false;
let marqueeTween = null;
let marqueeResizeTimer = null;

window.addEventListener('DOMContentLoaded', () => {
  setDynamicText();
  initTheme();
  initSmoothScroll();
  initLoader();
  initScrollAnimations();
  initCursor();
  initTilt3D();
  initMagneticButtons();
  initScrollProgress();
  initMarquee();
  initCountdown();
  initMessageModal();
  initLetter();
  initWishWall();
  initSoundToggle();
  initSparkTrail();
});

function setDynamicText() {
  $$('[data-recipient]').forEach((el) => {
    el.textContent = CONFIG.recipientName;
  });

  $$('[data-sender]').forEach((el) => {
    el.textContent = CONFIG.senderName;
  });
}

function initTheme() {
  const button = $('#themeToggle');
  const icon = button?.querySelector('.theme-icon');
  const storageKey = 'birthday-theme-v7-mobile-centered';
  const savedTheme = localStorage.getItem(storageKey) || 'light';

  document.body.dataset.theme = savedTheme;
  updateIcon();

  button?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);

    if (window.gsap) {
      gsap.fromTo(document.body, { opacity: 0.88 }, { opacity: 1, duration: 0.38, ease: 'power2.out' });
    }

    updateIcon();
    showToast(nextTheme === 'dark' ? 'Dark mode aktif' : 'Light mode aktif');
  });

  function updateIcon() {
    if (!icon) return;
    icon.textContent = document.body.dataset.theme === 'dark' ? '☾' : '☀';
  }
}

function initSmoothScroll() {
  if (!window.Lenis) return;

  lenisInstance = new Lenis({
    duration: 1.08,
    smoothWheel: true,
    wheelMultiplier: 0.84,
    touchMultiplier: 1.1,
  });

  if (window.gsap) {
    lenisInstance.on('scroll', () => window.ScrollTrigger?.update());
    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return;
  }

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function initLoader() {
  const loader = $('#loader');
  const shell = $('.loader-shell');
  const bar = $('#loaderBar');
  const percent = $('#loaderPercent');

  if (!loader || !bar || !percent) {
    runHeroIntro();
    return;
  }

  if (!window.gsap) {
    loader.remove();
    revealAllImmediately();
    return;
  }

  const loadState = { value: 0 };

  gsap.set(shell, { y: 18, opacity: 0, scale: 0.96 });
  gsap.to(shell, { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'expo.out' });

  gsap.to(loadState, {
    value: 100,
    duration: 1.35,
    ease: 'power3.inOut',
    onUpdate: () => {
      const value = Math.round(loadState.value);
      bar.style.width = `${value}%`;
      percent.textContent = `${value}%`;
    },
    onComplete: () => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: () => {
          loader.remove();
          runHeroIntro();
        },
      });

      tl.to(shell, { y: -18, opacity: 0, scale: 0.98, duration: 0.42 })
        .to(loader, { yPercent: -100, duration: 0.88 }, '-=0.12');
    },
  });

  if (window.anime) {
    anime({
      targets: '.loader-orbit',
      rotate: '1turn',
      duration: 3200,
      easing: 'linear',
      loop: true,
    });
  }
}

function initScrollAnimations() {
  if (prefersReducedMotion()) {
    revealAllImmediately();
    return;
  }

  if (!window.gsap || !window.ScrollTrigger) {
    revealAllImmediately();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set('.reveal-item:not(.hero .reveal-item)', {
    y: 34,
    opacity: 0,
  });

  $$('.reveal-item').forEach((el) => {
    if (el.closest('.hero')) return;

    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      },
    });
  });

  gsap.to('.aurora-one', {
    y: 58,
    x: 26,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.7,
    },
  });

  gsap.to('.aurora-two', {
    y: -70,
    x: -38,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.7,
    },
  });

  gsap.to('.premium-card', {
    y: -18,
    rotateX: 1.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
    },
  });
}

function runHeroIntro() {
  if (prefersReducedMotion()) {
    revealAllImmediately();
    return;
  }

  if (!window.gsap) {
    revealAllImmediately();
    initAnimeLoops();
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.fromTo('.site-nav',
    { y: -28, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 }
  )
    .to('.title-line', {
      y: 0,
      opacity: 1,
      rotate: 0,
      duration: 1.05,
      stagger: 0.1,
    }, '-=0.32')
    .to('.hero .reveal-item', {
      y: 0,
      opacity: 1,
      duration: 0.86,
      stagger: 0.08,
    }, '-=0.72')
    .fromTo('.premium-card',
      { y: 46, opacity: 0, rotateX: -8, rotateY: 10, scale: 0.94 },
      { y: 0, opacity: 1, rotateX: 0, rotateY: 0, scale: 1, duration: 1.05 },
      '-=0.78'
    )
    .fromTo('.cake-layer',
      { y: 34, scaleX: 0.86, opacity: 0 },
      { y: 0, scaleX: 1, opacity: 1, duration: 0.68, stagger: 0.08, ease: 'back.out(1.7)' },
      '-=0.38'
    )
    .fromTo('.candle, .floating-pill, .mini-countdown div',
      { y: 18, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, scale: 1, duration: 0.58, stagger: 0.045 },
      '-=0.28'
    )
    .eventCallback('onComplete', initAnimeLoops);
}

function initAnimeLoops() {
  if (animeLoopsStarted || prefersReducedMotion() || !window.anime) return;
  animeLoopsStarted = true;

  anime({
    targets: '.flame',
    translateX: '-50%',
    rotate: [-47, -39],
    scale: [0.88, 1.12],
    duration: 820,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
  });

  anime({
    targets: '.cake-glow',
    scale: [0.94, 1.08],
    opacity: [0.5, 0.88],
    duration: 2600,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
  });

  anime({
    targets: '.cake-orbit',
    rotate: '1turn',
    duration: 12000,
    loop: true,
    easing: 'linear',
    delay: anime.stagger(900),
  });

  anime({
    targets: '.floating-pill',
    translateY: [-4, -18],
    duration: 2400,
    direction: 'alternate',
    loop: true,
    delay: anime.stagger(280),
    easing: 'easeInOutSine',
  });

  anime({
    targets: '.cake-layer',
    translateY: [0, -4],
    scaleX: [1, 1.012],
    duration: 3200,
    direction: 'alternate',
    loop: true,
    delay: anime.stagger(160),
    easing: 'easeInOutSine',
  });
}

function revealAllImmediately() {
  $$('.title-line, .reveal-item, .premium-card, .cake-layer, .floating-pill, .mini-countdown div').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}


function initMarquee() {
  const track = $('.marquee-track');
  const groups = $$('.marquee-group');

  if (!track || groups.length < 2) return;

  const setup = () => {
    const firstGroupWidth = groups[0].getBoundingClientRect().width;

    if (!firstGroupWidth) return;

    if (marqueeTween?.kill) marqueeTween.kill();
    track.classList.add('js-marquee-active');

    if (window.gsap) {
      gsap.set(track, { x: 0 });
      marqueeTween = gsap.to(track, {
        x: -firstGroupWidth,
        duration: Math.max(12, firstGroupWidth / 95),
        ease: 'none',
        repeat: -1,
        overwrite: true,
      });
      return;
    }

    if (window.anime) {
      track.style.transform = 'translate3d(0,0,0)';
      marqueeTween = anime({
        targets: track,
        translateX: [0, -firstGroupWidth],
        duration: Math.max(12000, (firstGroupWidth / 95) * 1000),
        easing: 'linear',
        loop: true,
      });
    }
  };

  requestAnimationFrame(setup);

  window.addEventListener('resize', () => {
    window.clearTimeout(marqueeResizeTimer);
    marqueeResizeTimer = window.setTimeout(setup, 180);
  });
}

function initCursor() {
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');

  if (!dot || !ring || matchMedia('(max-width: 1024px)').matches || prefersReducedMotion()) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.17;
    ringY += (mouseY - ringY) * 0.17;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  $$('a, button, [data-tilt]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '66px';
      ring.style.height = '66px';
      ring.style.borderColor = 'rgba(255,122,182,.72)';
    });

    el.addEventListener('mouseleave', () => {
      ring.style.width = '44px';
      ring.style.height = '44px';
      ring.style.borderColor = '';
    });
  });
}

function initTilt3D() {
  $$('[data-tilt]').forEach((wrapper) => {
    const target = wrapper.querySelector('.premium-card, .memory-card, .letter-card') || wrapper;
    const rotateX = window.gsap ? gsap.quickTo(target, 'rotationX', { duration: 0.42, ease: 'power3.out' }) : null;
    const rotateY = window.gsap ? gsap.quickTo(target, 'rotationY', { duration: 0.42, ease: 'power3.out' }) : null;
    const setX = window.gsap ? gsap.quickTo(target, 'x', { duration: 0.42, ease: 'power3.out' }) : null;
    const setY = window.gsap ? gsap.quickTo(target, 'y', { duration: 0.42, ease: 'power3.out' }) : null;

    wrapper.addEventListener('pointermove', (event) => {
      if (matchMedia('(max-width: 768px)').matches || prefersReducedMotion()) return;

      const rect = wrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -10;
      const ry = ((x / rect.width) - 0.5) * 12;

      target.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      target.style.setProperty('--my', `${(y / rect.height) * 100}%`);

      if (rotateX && rotateY && setX && setY) {
        rotateX(rx);
        rotateY(ry);
        setX((x / rect.width - 0.5) * 6);
        setY((y / rect.height - 0.5) * 6);
      } else {
        target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });

    wrapper.addEventListener('pointerleave', () => {
      if (rotateX && rotateY && setX && setY) {
        rotateX(0);
        rotateY(0);
        setX(0);
        setY(0);
      } else {
        target.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    });
  });
}

function initMagneticButtons() {
  $$('.magnetic').forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      if (matchMedia('(max-width: 768px)').matches || prefersReducedMotion()) return;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      if (window.gsap) {
        gsap.to(button, { x: x * 0.14, y: y * 0.14, duration: 0.32, ease: 'power3.out' });
      } else {
        button.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
      }
    });

    button.addEventListener('mouseleave', () => {
      if (window.gsap) gsap.to(button, { x: 0, y: 0, duration: 0.42, ease: 'elastic.out(1, .55)' });
      else button.style.transform = 'translate(0, 0)';
    });
  });
}

function initScrollProgress() {
  const progress = $('#scrollProgress');
  if (!progress) return;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max <= 0 ? 0 : (window.scrollY / max) * 100;
    progress.style.width = `${value}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initCountdown() {
  const birthday = new Date(CONFIG.birthdayISO).getTime();
  const days = $('#daysValue');
  const hours = $('#hoursValue');
  const minutes = $('#minutesValue');
  const seconds = $('#secondsValue');

  if (!days || !hours || !minutes || !seconds) return;

  function updateCountdown() {
    const diff = Math.max(0, birthday - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    days.textContent = String(d).padStart(2, '0');
    hours.textContent = String(h).padStart(2, '0');
    minutes.textContent = String(m).padStart(2, '0');
    seconds.textContent = String(s).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function initMessageModal() {
  const modal = $('#messageModal');
  const frame = $('#messageFrame');
  const openDriveLink = $('#openDriveLink');
  const closeButton = $('#closeMessage');
  const backdrop = $('#modalBackdrop');
  const openButtons = ['#openMessageTop', '#openMessageHero', '#openMessageLetter']
    .map((selector) => $(selector))
    .filter(Boolean);

  if (!modal || !frame || !openDriveLink) return;

  openDriveLink.href = DRIVE_VIEW_URL;

  const openModal = () => {
    frame.src = DRIVE_PREVIEW_URL;
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    if (window.gsap) {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.35 })
        .fromTo('.modal-card', { y: 34, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.55 }, '-=0.18');
    }

    fireConfetti(80);
    playChime();
  };

  const closeModal = () => {
    const cleanup = () => {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
      frame.src = '';
    };

    if (window.gsap) {
      gsap.timeline({ onComplete: cleanup })
        .to('.modal-card', { y: 24, opacity: 0, scale: 0.98, duration: 0.24, ease: 'power2.in' })
        .to('.modal-backdrop', { opacity: 0, duration: 0.18 }, '-=0.08');
    } else {
      cleanup();
    }
  };

  openButtons.forEach((button) => button.addEventListener('click', openModal));
  closeButton?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}

function initLetter() {
  const button = $('#letterBtn');
  const card = $('.letter-card');

  button?.addEventListener('click', () => {
    card?.classList.add('is-open');
    button.textContent = 'Magic Revealed ✦';

    if (window.gsap) {
      gsap.fromTo('.hidden-letter',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'expo.out', delay: 0.08 }
      );
    }

    fireConfetti(120);
    playChime();
    showToast('Pesan tambahan terbuka ✦');
  });

  $('#celebrateBtn')?.addEventListener('click', () => {
    fireConfetti(190);
    playChime();
    showToast('Happy 23rd Birthday, Meisya ✦');
  });
}

function initWishWall() {
  const selected = $('#selectedWish');
  const sendButton = $('#sendWishBtn');

  $$('.wish-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      $$('.wish-pill').forEach((item) => item.classList.remove('active'));
      pill.classList.add('active');
      selectedWish = pill.textContent.trim();
      if (selected) selected.textContent = selectedWish;

      if (window.anime) {
        anime({ targets: pill, scale: [1, 1.08, 1], duration: 480, easing: 'easeOutBack' });
      }

      tinyBurst(pill);
    });
  });

  sendButton?.addEventListener('click', () => {
    fireConfetti(150);
    playChime();
    showToast(`Wish sent: ${selectedWish}`);
  });
}

function initSoundToggle() {
  const button = $('#soundToggle');
  const icon = button?.querySelector('.sound-icon');

  button?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (icon) icon.textContent = soundEnabled ? '♫' : '♪';
    showToast(soundEnabled ? 'Sound aktif' : 'Sound nonaktif');
    if (soundEnabled) playChime(true);
  });
}

function initSparkTrail() {
  if (matchMedia('(max-width: 768px)').matches || prefersReducedMotion()) return;

  let lastSpark = 0;

  window.addEventListener('mousemove', (event) => {
    const now = Date.now();
    if (now - lastSpark < 120) return;
    lastSpark = now;

    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.textContent = Math.random() > 0.5 ? '✦' : '♡';
    spark.style.left = `${event.clientX}px`;
    spark.style.top = `${event.clientY}px`;
    document.body.appendChild(spark);

    if (window.gsap) {
      gsap.fromTo(spark,
        { y: 0, opacity: 1, scale: 1, rotate: 0 },
        { y: -38, opacity: 0, scale: 0, rotate: 18, duration: 0.8, ease: 'power2.out', onComplete: () => spark.remove() }
      );
    } else {
      window.setTimeout(() => spark.remove(), 800);
    }
  }, { passive: true });
}

function fireConfetti(amount = 100) {
  if (!window.confetti) return;

  window.confetti({
    particleCount: amount,
    spread: 78,
    startVelocity: 38,
    scalar: 0.82,
    origin: { y: 0.28 },
    colors: ['#ff7ab6', '#9b7cff', '#7ddcff', '#fff4d6', '#ffffff'],
  });
}

function tinyBurst(element) {
  if (!window.confetti) return;

  const rect = element.getBoundingClientRect();
  window.confetti({
    particleCount: 24,
    spread: 44,
    startVelocity: 18,
    scalar: 0.56,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
    colors: ['#ff7ab6', '#9b7cff', '#7ddcff', '#fff4d6'],
  });
}

function playChime(force = false) {
  if (!soundEnabled && !force) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioContext = audioContext || new AudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + index * 0.065;

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.11, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.48);
  });
}

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 1850);
}

function prefersReducedMotion() {
  return false;
}
