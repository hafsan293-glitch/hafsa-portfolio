// ============================================
//   HAFSA NOOR — MAIN.JS
//   GSAP Animations + All Interactions
// ============================================

gsap.registerPlugin(ScrollTrigger);

// ---- LOADER ----
const loader = document.getElementById('loader');
const loaderLine = document.getElementById('loaderLine');
const loaderLabel = document.getElementById('loaderLabel');

let progress = 0;
const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    if (loaderLine) loaderLine.style.width = progress + '%';
    if (loaderLabel) loaderLabel.textContent = Math.floor(progress) + '%';
    if (progress === 100) {
        setTimeout(() => {
            loader?.classList.add('out');
            initAnimations();
        }, 400);
    }
}, 80);

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let rx = 0, ry = 0, mx = 0, my = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cursor) cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
});

(function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(animRing);
})();

document.querySelectorAll('a,button,.skill-card,.p-card,.fp-image,.cta-btn,.cta-ghost').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor?.classList.add('expand'); ring?.classList.add('expand'); });
    el.addEventListener('mouseleave', () => { cursor?.classList.remove('expand'); ring?.classList.remove('expand'); });
});

// ---- HEADER SCROLL ----
window.addEventListener('scroll', () => {
    document.getElementById('header')?.classList.toggle('shrink', window.scrollY > 80);
});

// ---- HAMBURGER / MENU ----
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('fullscreenMenu');
menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    menu?.classList.toggle('open');
});
menu?.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn?.classList.remove('open');
        menu?.classList.remove('open');
    });
});

// ---- PAGE TRANSITIONS ----
document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel') && href.endsWith('.html')) {
        link.addEventListener('click', e => {
            e.preventDefault();
            gsap.to('body', { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: () => { window.location.href = href; } });
        });
    }
});
gsap.from('body', { opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 });

// ---- MAIN ANIMATIONS ----
function initAnimations() {

    // HERO animations
    const heroEl = document.getElementById('hero');
    if (heroEl) {
        heroEl.classList.add('loaded');
        gsap.to('#heroTag', { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
        gsap.to('.hero-name .line span', {
            y: 0, opacity: 1, duration: 1.2, stagger: 0.18, delay: 0.4, ease: 'power4.out'
        });
        gsap.to('#heroDesc', { opacity: 1, duration: 1, delay: 0.9, ease: 'power3.out' });
        gsap.to('#heroActions', { opacity: 1, duration: 1, delay: 1.1, ease: 'power3.out' });
        gsap.to('#heroScroll', { opacity: 1, duration: 1, delay: 1.4, ease: 'power3.out' });
        gsap.to('.hero-counter', { opacity: 1, duration: 1, delay: 1.4, ease: 'power3.out' });
    }

    // GSAP SCROLL REVEAL
    gsap.utils.toArray('.gsap-reveal').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 60 },
            {
                opacity: 1, y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // SKILL BARS
    gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 85%',
            onEnter: () => gsap.to(bar, { width: w, duration: 1.4, ease: 'power3.out' })
        });
    });

    // STAGGER PROJECT CARDS
    gsap.utils.toArray('.fp-item').forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
            {
                opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 80%' }
            }
        );
    });

    // STATS COUNTER ANIMATION
    gsap.utils.toArray('.stat-num').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
                gsap.from(el, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' });
            }
        });
    });

    // HORIZONTAL LINE REVEALS
    gsap.utils.toArray('.counter-line,.stat-divider').forEach(el => {
        gsap.from(el, {
            scaleX: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
        });
    });
}

// ---- FILTER BUTTONS ----
document.querySelectorAll('.f-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
        this.classList.add('on');
    });
});

// ---- PARALLAX HERO ----
window.addEventListener('scroll', () => {
    const hero = document.getElementById('heroImg');
    if (hero) {
        hero.style.transform = `scale(1.08) translateY(${window.scrollY * 0.15}px)`;
    }
});

// Init if no loader (inner pages)
if (!document.getElementById('loader')) initAnimations();
