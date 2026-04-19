
// Sticky Header
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 10);
});



// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const closeMenu = document.querySelector('.close-menu');
const mobileMenu = document.querySelector('.mobile-menu-overlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-nav a');

menuToggle.addEventListener('click', function () {
    mobileMenu.classList.add('open');
});

closeMenu.addEventListener('click', function () {
    mobileMenu.classList.remove('open');
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
    });
});


// Data Visualization Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const particleCount = 100;
const connectionDistance = 100;
const colors = ['#00f0ff', '#7b2ff7', '#ffffff'];

function resizeCanvas() {
    const canvasContainer = document.querySelector('.hero-visual');
    width = canvasContainer.offsetWidth;
    height = canvasContainer.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Recreate particles when canvas is resized
    createParticles();
}

function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections first
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distance / connectionDistance)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
            }
        }
    }
    ctx.stroke();

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
    }

    requestAnimationFrame(drawParticles);
}

// Initialize canvas
window.addEventListener('load', () => {
    resizeCanvas();
    drawParticles();
});

window.addEventListener('resize', resizeCanvas);

// Configuration & Global State
const devHosts = ['localhost', '127.0.0.1'];
const isDev = devHosts.includes(location.hostname);
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
setHrefById('goRegisterClient', '/register/client');

// Login buttons
setHrefByClass('login-btn', '/login/employee');
setHrefByClass('login-btn-client', '/login/client');
setHrefByClass('login-btn-employee', '/login/employee');


document.addEventListener('DOMContentLoaded', function () {
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