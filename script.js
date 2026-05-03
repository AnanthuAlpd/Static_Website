
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
let canvas, ctx, particlesArray = [];
let mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor(x, y, dx, dy, size, color) {
        this.x = x; this.y = y;
        this.dx = dx; this.dy = dy;
        this.size = size; this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 5;
            this.y -= (dy / distance) * force * 5;
        } else {
            this.x += this.dx;
            this.y += this.dy;
        }
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    const count = Math.floor((canvas.width * canvas.height) / 4000);
    const colors = ['#00f0ff', '#7b2ff7', '#ffffff'];
    for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        particlesArray.push(new Particle(
            Math.random() * (canvas.width - size * 4) + size * 2,
            Math.random() * (canvas.height - size * 4) + size * 2,
            (Math.random() * 0.8) - 0.4,
            (Math.random() * 0.8) - 0.4,
            size,
            colors[Math.floor(Math.random() * colors.length)]
        ));
    }
}

function connectParticles() {
    const threshold = (canvas.width / 7) * (canvas.height / 7);
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dist =
                (particlesArray[a].x - particlesArray[b].x) ** 2 +
                (particlesArray[a].y - particlesArray[b].y) ** 2;
            if (dist < threshold) {
                const opacity = 1 - dist / 20000;
                ctx.strokeStyle = `rgba(123, 47, 247, ${opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => p.update());
    connectParticles();
}

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

    canvas = document.getElementById('particleCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });
        initParticles();
        animateParticles();
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
});