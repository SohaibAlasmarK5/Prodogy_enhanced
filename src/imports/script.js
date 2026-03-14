// Prodigy Ventilation Systems - Main JavaScript

// Language Toggle
const languageToggle = document.getElementById('language-toggle');
const html = document.documentElement;

languageToggle?.addEventListener('click', () => {
    const currentLang = html.getAttribute('lang') || 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    html.setAttribute('lang', newLang);
    html.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    
    languageToggle.textContent = newLang === 'en' ? 'العربية' : 'English';
    
    // Translate all elements
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.hasAttribute('data-en-placeholder')) {
                el.placeholder = newLang === 'en' 
                    ? el.getAttribute('data-en-placeholder')
                    : el.getAttribute('data-ar-placeholder');
            }
        } else {
            el.textContent = newLang === 'en' 
                ? el.getAttribute('data-en')
                : el.getAttribute('data-ar');
        }
    });
    
    localStorage.setItem('language', newLang);
});

// Load saved language
const savedLang = localStorage.getItem('language');
if (savedLang && savedLang === 'ar') {
    languageToggle?.click();
}

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto slide
let autoSlideInterval = setInterval(nextSlide, 5000);

// Manual controls
document.querySelector('.next-slide')?.addEventListener('click', () => {
    nextSlide();
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
});

document.querySelector('.prev-slide')?.addEventListener('click', () => {
    prevSlide();
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
});

// Current year in footer
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Calculate years since 2024
const yearsExpElement = document.getElementById('years-exp');
if (yearsExpElement) {
    const foundedYear = 2024;
    const currentYear = new Date().getFullYear();
    const yearsExp = currentYear - foundedYear;
    yearsExpElement.textContent = (yearsExp > 0 ? yearsExp : 1) + '+';
}

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
});

// Theme toggle (if exists)
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        
        // Change icon
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        localStorage.setItem('theme', newTheme);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}