
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

// Chat Button
//document.getElementById('chatButton').addEventListener('click', function () {
    //alert('AI Assistant: Hello! How can I help you with your data analytics needs today?');
//});
const devHosts = ['localhost', '127.0.0.1'];  // add other dev hostnames if needed
const isDev = devHosts.includes(location.hostname);
const baseUrl = isDev ? 'http://localhost:4200' : '/app';

// Helper function to safely set href
function setHref(id, path) {
  const element = document.getElementById(id);
  if (element) {
    element.href = `${baseUrl}${path}`;
  }
}

// Set hrefs
setHref('goDashboard', '/dashboard/demo');
setHref('goDashboard1', '/dashboard/demo');
setHref('goRegister', '/register/employee');
setHref('goRegister1', '/register/employee');
setHref('goRegisterClient', '/register/client');
setHref('loginPage', '/login');
