const headerHTML = `
    <header>
        <div class="container nav-container">
            <a href="index.html" class="logo">
                <img src="assets/img/logo.jpeg" alt="PothansAI Logo" class="nav-img-logo">
                PothansAI
            </a>
            <nav class="desktop-nav">
                <a href="index.html#services">Services</a>
                <a href="index.html#how-it-works">How It Works</a>
                <a href="index.html#features">Features</a>
                <a href="join-team.html">Careers</a>
                <a href="#footer">Contact</a>
            </nav>
            <div class="mobile-toggle">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </header>
    <div class="mobile-menu-overlay">
        <div class="close-menu">
            <i class="fas fa-times"></i>
        </div>
        <nav class="mobile-nav">
            <a href="index.html#services">Services</a>
            <a href="index.html#how-it-works">How It Works</a>
            <a href="index.html#features">Features</a>
            <a href="join-team.html">Careers</a>
            <a href="#footer">Contact</a>
        </nav>
    </div>
    <canvas id="particleCanvas"></canvas>
`;

const footerHTML = `
    <footer id="footer">
        <div class="container footer-container">
            <div class="footer-brand">
                <div class="logo">
                    <img src="assets/img/logo.jpeg" alt="PothansAI Logo" class="nav-img-logo"> PothansAI
                </div>
                <p>Transforming Data into Growth with elite AI technology.</p>
                <div class="socials">
                    <a href="https://x.com/InfoPothansai"><i class="fa-brands fa-twitter"></i></a>
                    <a href="https://www.linkedin.com/company/pothanai/"><i class="fa-brands fa-linkedin-in"></i></a>
                    <a href="https://www.facebook.com/profile.php?id=61576844483722"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="https://www.instagram.com/info.pothansai/"><i class="fa-brands fa-instagram"></i></a>
                </div>
            </div>
            <div class="footer-links">
                <div class="link-group">
                    <h4>Company</h4>
                    <a href="#">About Us</a>
                    <a href="join-team.html">Careers</a>
                    <a href="#">Blog</a>
                </div>
                <div class="link-group">
                    <h4>Product</h4>
                    <a href="index.html#features">Features</a>
                    <a href="prabha.html">Prabha Analytics</a>
                    <a href="https://niyamam-seva-ai.duckdns.org/login">Niyamam Seva AI</a>
                </div>
                <div class="link-group">
                    <h4>Contact</h4>
                    <a href="mailto:info.pothansai@gmail.com">info.pothansai@gmail.com</a>
                    <a href="tel:+918848077749">+91 88480 77749</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 PothansAI. All rights reserved.</p>
        </div>
    </footer>
`;

document.addEventListener("DOMContentLoaded", () => {
    // Inject Header at start of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    // Inject Footer at end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Mobile Menu Logic
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMenu = document.querySelector('.close-menu');

    if (mobileToggle && mobileMenuOverlay) {
        mobileToggle.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
        });
        
        const closeMobileMenu = () => {
            mobileMenuOverlay.classList.remove('active');
        };

        closeMenu?.addEventListener('click', closeMobileMenu);
        
        // Close when clicking a link
        mobileMenuOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
});
