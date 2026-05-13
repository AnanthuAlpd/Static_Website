
// ============================================================
// Header Scroll Effect
// ============================================================
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============================================================
// Scroll Reveal Observer (Premium UI)
// ============================================================
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-scroll');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });


// ============================================================
// Canvas Particle Network (Premium UI)
// ============================================================


// Configuration & Global State
const devHosts = ['localhost', '127.0.0.1', ''];
const isDev = devHosts.includes(location.hostname) || location.protocol === 'file:';
const baseUrl = isDev ? 'http://localhost:4200' : '/app';
const apiBaseUrl = isDev ? 'http://localhost:5000' : '';

// Helper function to safely set href by class
function setHrefByClass(className, path) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
        element.href = `${baseUrl}${path}`;
    });
}

function setHrefById(id, path) {
    const element = document.getElementById(id);
    if (element) {
        element.href = `${baseUrl}${path}`;
    }
}

// Set hrefs
setHrefById('goDashboard', '/dashboard/demo');
setHrefById('goRegister1', '/register/employee');
setHrefById('goLoginPrabha', '/login/client');
setHrefById('joinTeamRegister', '/login/employee');

// Login buttons
setHrefByClass('login-btn', '/login/employee');
setHrefByClass('login-btn-client', '/login/client');
setHrefByClass('login-btn-employee', '/login/employee');


document.addEventListener('DOMContentLoaded', function () {
    // Premium UI Init
    document.querySelectorAll('.fade-in-scroll, .scale-in-scroll, .fade-up-scroll').forEach(el => {
        el.classList.add('hidden-scroll');
        revealObserver.observe(el);
    });

    const rolesWrapper = document.querySelector('.roles-card-wrapper');
    if (rolesWrapper) {
        const cardObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    rolesWrapper.classList.add('card-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        cardObserver.observe(rolesWrapper);
    }



    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(card);
    });

    // --- PREMIUM ROLLING VISITOR COUNTER LOGIC ---
    function updateRollingCount(container, target) {
        container.innerHTML = '';
        const targetStr = target.toLocaleString();
        const digits = targetStr.split('');

        // Create individual strips for each character
        digits.forEach((char, index) => {
            if (/\d/.test(char)) {
                const containerDiv = document.createElement('div');
                containerDiv.className = 'digit-container';

                const strip = document.createElement('div');
                strip.className = 'digit-strip';

                // Add digits 0-9 to the strip
                for (let i = 0; i <= 9; i++) {
                    const span = document.createElement('span');
                    span.innerText = i;
                    strip.appendChild(span);
                }

                containerDiv.appendChild(strip);
                container.appendChild(containerDiv);

                // Set initial position to 0
                strip.style.transform = 'translateY(0)';

                // Animate to target with a slight delay for staggered effect
                setTimeout(() => {
                    const targetDigit = parseInt(char);
                    // translateY by index of the digit (each digit is 1.5em high per CSS)
                    strip.style.transform = `translateY(-${targetDigit * 1.5}em)`;
                }, 100 + (index * 100));
            } else {
                // Handle commas or other symbols
                const symbol = document.createElement('div');
                symbol.className = 'comma';
                symbol.innerText = char;
                container.appendChild(symbol);
            }
        });
    }

    async function fetchVisitorCount() {
        const countContainer = document.getElementById('visitor-count');
        if (!countContainer) return;

        // Check Session Storage to prevent redundant calls
        const cachedCount = sessionStorage.getItem('pothansai_visitor_count');
        const cacheTime = sessionStorage.getItem('pothansai_visitor_time');
        const cacheTTL = 10 * 60 * 1000; // 10 minutes

        if (cachedCount && cacheTime && (Date.now() - cacheTime < cacheTTL)) {
            updateRollingCount(countContainer, parseInt(cachedCount));
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/api/public/visitor-count`);
            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();
            if (result.status === 'success' && result.data) {
                const count = result.data.count;

                sessionStorage.setItem('pothansai_visitor_count', count);
                sessionStorage.setItem('pothansai_visitor_time', Date.now());

                updateRollingCount(countContainer, count);
            }
        } catch (error) {
            console.error('Error fetching visitor count:', error);
            countContainer.innerText = '---';
        }
    }

    // Initialize visitor count
    fetchVisitorCount();

    // Initialize Hero Bubbles Card
    if (document.getElementById('bbcCard')) {
        new BBCEngine('bbcCard');
    }
});

// ============================================================
// Bubble Card Engine  (BBC)
// ============================================================

/* ---- Fragment particle emitted on bubble click-burst ---- */
class BBCParticle {
    constructor(x, y, color, char) {
        this.x    = x;
        this.y    = y;
        this.char = char;
        this.color = color;
        this.isLetter = char && char.trim().length > 0;
        this.vx   = (Math.random() - 0.5) * 11;
        this.vy   = (Math.random() - 0.5) * 11 - 3;
        this.gravity = 0.18;
        this.size = Math.random() * 3 + 1;
        this.fontSize = Math.random() * 9 + 7;
        this.life  = 1.0;
        this.decay = Math.random() * 0.022 + 0.010;
    }
    update() {
        this.x  += this.vx;
        this.y  += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.97;
        this.life = Math.max(0, this.life - this.decay);
    }
    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = this.color;
        if (this.isLetter) {
            ctx.fillStyle = this.color;
            ctx.font      = `bold ${this.fontSize}px Outfit`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.char, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

/* ---- Main engine ---- */
class BBCEngine {
    constructor(cardId) {
        this.card   = document.getElementById(cardId);
        if (!this.card) return;
        this.canvas = document.getElementById('bbcCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.bubbles   = [];
        this.particles = [];
        this.orbs      = [];   /* small decorative hollow circles */

        /* 15 keyword words */
        this.words = [
            'Job Opportunities', 'Part Time Jobs', 'Cash Your Free Time',
            'No Experience',     'No Investment',  'Anyone can Join',
            'Create Your Team',  'Be A Leader',    'Be Your Hero',
            'Your Workspace',    'Your Workplace',  'Predict Growth',
            'AI Growth',         'Smart Tools',    'Be a Legend'
        ];

        /* VIBGYOR vivid palette */
        this.colors = [
            '#FF3333', '#FF7700', '#FFE000',
            '#00E676', '#7C4DFF', '#E040FB',
            '#FF1493', '#00FFCC', '#FF6B35',
            '#ADFF2F'
        ];

        /* Sizes of card measured after layout */
        this.W = 0; this.H = 0;
        this.pillBottom = 0; /* Y below pill badge — bubbles live here */

        this.resize();
        this.fillBubbles();
        this.fillOrbs();
        this.attachEvents();
        this.loop();

        window.addEventListener('resize', () => this.resize());
    }

    /* ---- Dimensions ---- */
    resize() {
        const cr = this.card.getBoundingClientRect();
        const cvr = this.canvas.getBoundingClientRect();
        this.W = this.canvas.width  = cvr.width;
        this.H = this.canvas.height = cvr.height;

        this.offsetX = cr.left - cvr.left;
        this.cardW   = cr.width;

        /* Brand text at top (top wall for balloons) */
        const brand = this.card.querySelector('.bbc-brand');
        if (brand) {
            const br = brand.getBoundingClientRect();
            this.brandBottom = br.bottom - cvr.top;
        } else {
            this.brandBottom = (cr.top - cvr.top) + 40;
        }

        /* Anchor = top edge of Pill Badge at bottom */
        const pill = document.getElementById('bbcPill');
        if (pill) {
            const pr = pill.getBoundingClientRect();
            this.anchorBaseY = pr.top - cvr.top + 5;  /* tie string slightly inside pill */
        } else {
            this.anchorBaseY = this.H - 80;
        }
    }

    /* ---- Spawn 15 balloons floating UP from Pill Badge at bottom ---- */
    fillBubbles() {
        this.bubbles = [];
        const anchorY = this.anchorBaseY;  /* top of pill badge */
        const areaTop = this.brandBottom + 10; /* stop below brand text */
        const cols = 3;
        const rows = Math.ceil(this.words.length / cols);
        const colW = this.cardW / cols;
        const rowH = (anchorY - areaTop) / rows;

        this.words.forEach((word, i) => {
            const charLen = word.replace(/\s/g, '').length;
            const base    = Math.min(68, 44 + Math.max(0, charLen - 6) * 1.8);
            const r       = base + Math.random() * 5;
            const color   = this.colors[i % this.colors.length];
            const col     = i % cols;
            const row     = Math.floor(i / cols);

            /* Anchor X spread within column of the card, shifted by canvas offset */
            const anchorX = this.offsetX + colW * col + colW / 2 + (Math.random() - 0.5) * colW * 0.55;

            /* Target balloon centre Y, one row band each (going upwards) */
            const targetCY = anchorY - r
                           - rowH * row
                           - rowH / 2
                           + (Math.random() - 0.5) * rowH * 0.45;
            const clampedY = Math.max(Math.min(anchorY - r - 8, targetCY), areaTop + r);

            /* String length = distance upward from anchor to balloon centre */
            const stringLen = Math.max(r + 12, anchorY - clampedY);
            const angle     = (Math.random() - 0.5) * 0.35;

            this.bubbles.push({
                word, color, r, anchorX, anchorY, stringLen, angle,
                angleV: (Math.random() - 0.5) * 0.003,
                x: anchorX + Math.sin(angle) * stringLen,
                y: anchorY - Math.cos(angle) * stringLen, /* SUBTRACT: float UP */
                alpha: 0, fadingIn: true
            });
        });
    }

    /* ---- Click / tap to pop a balloon ---- */
    attachEvents() {
        const handler = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const my = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

            for (let i = this.bubbles.length - 1; i >= 0; i--) {
                const b  = this.bubbles[i];
                /* b.x / b.y is the balloon CENTER */
                const dx = mx - b.x, dy = my - b.y;
                if (Math.sqrt(dx*dx + dy*dy) <= b.r) {
                    this.burst(b, b.x, b.y);
                    this.bubbles.splice(i, 1);
                    setTimeout(() => this.respawn(b.word, b.color, b.anchorX, b.anchorY), 3000);
                    break;
                }
            }
        };
        this.canvas.addEventListener('click',      handler);
        this.canvas.addEventListener('touchstart', handler, { passive: true });
    }

    /* Burst: emit letter fragments + debris */
    burst(b, cx, cy) {
        const letters = b.word.split('');
        letters.forEach(ch => {
            for (let k = 0; k < 2; k++) {
                this.particles.push(new BBCParticle(
                    cx + (Math.random() - 0.5) * b.r,
                    cy + (Math.random() - 0.5) * b.r,
                    b.color, ch
                ));
            }
        });
        for (let k = 0; k < 28; k++) {
            this.particles.push(new BBCParticle(cx, cy, b.color, ''));
        }
    }

    /* Respawn a popped balloon — floats up from pill badge */
    respawn(word, color, anchorX, anchorY) {
        const charLen = word.replace(/\s/g, '').length;
        const base    = Math.min(68, 44 + Math.max(0, charLen - 6) * 1.8);
        const r       = base + Math.random() * 5;
        anchorX = anchorX !== undefined ? anchorX : this.offsetX + this.cardW * (0.1 + Math.random() * 0.8);
        anchorY = anchorY !== undefined ? anchorY : this.anchorBaseY;
        const areaTop  = this.brandBottom + 10;
        const targetCY = anchorY - r - 8 - Math.random() * Math.max(1, anchorY - areaTop - r * 2 - 8);
        const stringLen = Math.max(r + 12, anchorY - targetCY);
        const angle     = (Math.random() - 0.5) * 0.35;
        this.bubbles.push({
            word, color, r, anchorX, anchorY, stringLen, angle,
            angleV: (Math.random() - 0.5) * 0.003,
            x: anchorX + Math.sin(angle) * stringLen,
            y: anchorY - Math.cos(angle) * stringLen, /* float UP */
            alpha: 0, fadingIn: true
        });
    }

    /* ---- Small decorative balloons ---- */
    fillOrbs() {
        this.orbs = [];
        const count   = 22;
        const anchorY = this.anchorBaseY;
        const areaTop = this.brandBottom + 10;
        for (let i = 0; i < count; i++) {
            const r     = 6 + Math.random() * 8;   /* 6–14 px radius */
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const anchorX = this.offsetX + this.cardW * (0.05 + Math.random() * 0.9);
            const targetCY = anchorY - r - 8 - Math.random() * Math.max(1, anchorY - areaTop - r * 2 - 8);
            const stringLen = Math.max(r + 10, anchorY - targetCY);
            const angle     = (Math.random() - 0.5) * 0.45;
            this.orbs.push({
                color, r, anchorX, anchorY, stringLen, angle,
                angleV: (Math.random() - 0.5) * 0.005,
                x: anchorX + Math.sin(angle) * stringLen,
                y: anchorY - Math.cos(angle) * stringLen,
                alpha: 0, fadingIn: true
            });
        }
    }

    /* ---- Animation loop ---- */
    loop() {
        this.ctx.clearRect(0, 0, this.W, this.H);
        this.updateOrbs();
        this.updateBubbles();
        this.drawStrings();
        this.drawBodies();
        this.updateParticles();
        requestAnimationFrame(() => this.loop());
    }

    updateOrbs() {
        const areaTop = this.brandBottom + 10;
        for (const o of this.orbs) {
            if (o.fadingIn) {
                o.alpha = Math.min(1, o.alpha + 0.018);
                if (o.alpha >= 1) o.fadingIn = false;
            }

            /* Pendulum physics */
            o.angleV += -0.0007 * Math.sin(o.angle);
            o.angleV += (Math.random() - 0.5) * 0.00015;
            o.angleV *= 0.995;
            o.angle  += o.angleV;
            o.angle   = Math.max(-1.5, Math.min(1.5, o.angle));

            o.x = o.anchorX + Math.sin(o.angle) * o.stringLen;
            o.y = o.anchorY - Math.cos(o.angle) * o.stringLen;

            /* Left / right / top wall clamp */
            if (o.x - o.r < 2) {
                o.x = o.r + 2;
                o.angle = Math.asin(Math.max(-0.99, Math.min(0.99, (o.x - o.anchorX) / o.stringLen)));
                o.angleV *= -0.4;
            }
            if (o.x + o.r > this.W - 2) {
                o.x = this.W - o.r - 2;
                o.angle = Math.asin(Math.max(-0.99, Math.min(0.99, (o.x - o.anchorX) / o.stringLen)));
                o.angleV *= -0.4;
            }
            if (o.y - o.r < areaTop) {
                o.y = areaTop + o.r;
                o.angleV *= -0.4;
            }
        }
    }

    updateBubbles() {
        const areaTop = this.brandBottom + 10;  /* balloons stay below brand text */

        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];

            if (b.fadingIn) {
                b.alpha = Math.min(1, b.alpha + 0.02);
                if (b.alpha >= 1) b.fadingIn = false;
            }

            /* Pendulum / Buoyancy — floating UP from bottom anchor */
            b.angleV += -0.0007 * Math.sin(b.angle);
            b.angleV += (Math.random() - 0.5) * 0.00012;
            b.angleV *= 0.997;
            b.angle  += b.angleV;
            b.angle   = Math.max(-1.3, Math.min(1.3, b.angle));

            /* Position: floating upward */
            b.x = b.anchorX + Math.sin(b.angle) * b.stringLen;
            b.y = b.anchorY - Math.cos(b.angle) * b.stringLen;

            /* Left / right wall clamp */
            if (b.x - b.r < 2) {
                b.x     = b.r + 2;
                b.angle = Math.asin(Math.max(-0.99, Math.min(0.99, (b.x - b.anchorX) / b.stringLen)));
                b.angleV *= -0.4;
            }
            if (b.x + b.r > this.W - 2) {
                b.x     = this.W - b.r - 2;
                b.angle = Math.asin(Math.max(-0.99, Math.min(0.99, (b.x - b.anchorX) / b.stringLen)));
                b.angleV *= -0.4;
            }
            /* Top wall (below brand text) */
            if (b.y - b.r < areaTop) {
                b.y      = areaTop + b.r;
                b.angleV *= -0.4;
            }
        }
    }

    drawStrings() {
        const ctx = this.ctx;
        
        /* 1. Small balloons (orbs) strings */
        for (const o of this.orbs) {
            const knotH = Math.max(3, o.r * 0.15);
            const knotTipY = o.y + o.r + knotH;
            ctx.save();
            ctx.globalAlpha = o.alpha * 0.85;
            const cpX = (o.x + o.anchorX) / 2 + Math.sin(o.angle) * 10;
            const cpY = (knotTipY + o.anchorY) / 2 + 4;
            ctx.beginPath();
            ctx.moveTo(o.x, knotTipY);
            ctx.quadraticCurveTo(cpX, cpY, o.anchorX, o.anchorY);
            ctx.strokeStyle = 'rgba(255,255,255,0.30)';
            ctx.lineWidth   = 0.8;
            ctx.stroke();
            ctx.restore();
        }

        /* 2. Main balloons strings */
        for (const b of this.bubbles) {
            const knotH = Math.max(5, b.r * 0.12);
            const knotTipY = b.y + b.r + knotH;
            ctx.save();
            ctx.globalAlpha = b.alpha;
            const cpX = (b.x + b.anchorX) / 2 + Math.sin(b.angle) * 18;
            const cpY = (knotTipY + b.anchorY) / 2 + 8;
            ctx.beginPath();
            ctx.moveTo(b.x, knotTipY);
            ctx.quadraticCurveTo(cpX, cpY, b.anchorX, b.anchorY);
            ctx.strokeStyle = 'rgba(255,255,255,0.50)';
            ctx.lineWidth   = 1.2;
            ctx.stroke();
            ctx.restore();
        }
    }

    drawBodies() {
        const ctx = this.ctx;
        
        /* 1. Small balloons (orbs) bodies */
        for (const o of this.orbs) {
            const cx = o.x, cy = o.y, r = o.r;
            const rx  = r * 0.82;
            const ry  = r;
            const knotH = Math.max(3, r * 0.15);
            const knotW = Math.max(2, r * 0.12);
            const knotTipY = cy + ry + knotH;

            ctx.save();
            ctx.globalAlpha = o.alpha * 0.85;

            /* Body */
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.fillStyle   = 'rgba(8, 2, 40, 0.78)';
            ctx.shadowBlur  = 8;
            ctx.shadowColor = o.color;
            ctx.fill();
            ctx.strokeStyle = o.color;
            ctx.lineWidth   = 1.5;
            ctx.stroke();
            ctx.shadowBlur  = 0;

            /* Sheen */
            const sheen = ctx.createRadialGradient(cx - rx*0.3, cy - ry*0.35, 0, cx, cy, rx*0.8);
            sheen.addColorStop(0, 'rgba(255,255,255,0.25)');
            sheen.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = sheen;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            /* Knot */
            ctx.beginPath();
            ctx.moveTo(cx - knotW, cy + ry);
            ctx.lineTo(cx + knotW, cy + ry);
            ctx.lineTo(cx, knotTipY);
            ctx.closePath();
            ctx.fillStyle = o.color;
            ctx.fill();

            ctx.restore();
        }

        /* 2. Main balloons bodies */
        for (const b of this.bubbles) {
            const cx = b.x, cy = b.y, r = b.r;
            const rx  = r * 0.82;
            const ry  = r;
            const knotH = Math.max(5, r * 0.12);
            const knotW = Math.max(4, r * 0.10);
            const knotTipY = cy + ry + knotH;

            ctx.save();
            ctx.globalAlpha = b.alpha;

            /* Body */
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.fillStyle   = 'rgba(8, 2, 40, 0.78)';
            ctx.shadowBlur  = 12;
            ctx.shadowColor = b.color;
            ctx.fill();
            ctx.strokeStyle = b.color;
            ctx.lineWidth   = 2.5;
            ctx.stroke();
            ctx.shadowBlur  = 0;

            /* Sheen */
            const sheen = ctx.createRadialGradient(cx - rx*0.32, cy - ry*0.38, 0, cx, cy, rx*0.85);
            sheen.addColorStop(0, 'rgba(255,255,255,0.20)');
            sheen.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = sheen;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            /* Knot */
            ctx.beginPath();
            ctx.moveTo(cx - knotW, cy + ry);
            ctx.lineTo(cx + knotW, cy + ry);
            ctx.lineTo(cx, knotTipY);
            ctx.closePath();
            ctx.fillStyle = b.color;
            ctx.fill();

            /* Word text */
            const fs = Math.max(10, Math.min(15, r / 3.0));
            ctx.fillStyle    = '#ffffff';
            ctx.font         = `800 ${fs}px Outfit, sans-serif`;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            this.wrapText(ctx, b.word, cx, cy - ry * 0.05, rx * 1.82, fs + 1);

            ctx.restore();
        }
    }

    wrapText(ctx, text, x, y, maxW, lineH) {
        const words = text.split(' ');
        let line = '', lines = [];
        for (const w of words) {
            const test = line ? line + ' ' + w : w;
            if (ctx.measureText(test).width > maxW && line) {
                lines.push(line); line = w;
            } else { line = test; }
        }
        if (line) lines.push(line);
        const startY = y - ((lines.length - 1) * lineH) / 2;
        lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineH));
    }

    updateParticles() {
        const ctx = this.ctx;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(ctx);
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }
}