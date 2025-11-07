// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // You can add your form submission logic here
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Add scroll animation for elements
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Theme (dark / light) toggle with persistence
(function() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ? saved : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initial);
    updateToggle();

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggle();
    });

    function updateToggle() {
        const cur = document.documentElement.getAttribute('data-theme');
        toggle.textContent = cur === 'dark' ? '☀️' : '🌙';
        toggle.title = cur === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
})();



