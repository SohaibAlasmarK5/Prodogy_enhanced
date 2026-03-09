# Prodigy Ventilation Systems Website

A professional, modern website for Prodigy Ventilation Systems built with HTML, CSS, and JavaScript.

## Features

### ✨ Core Features
- **Responsive Design**: Fully responsive layout that works on all devices (mobile, tablet, desktop)
- **Hero Slider**: Auto-rotating carousel with 3 slides showcasing company messaging
- **Professional Sections**: Home, About, Services, Contact with complete information
- **Contact Form**: Functional contact form with validation
- **Social Media Integration**: Links to Facebook, Instagram, Twitter, LinkedIn, and YouTube

### 🌓 Dark Theme Support
- Toggle between light and dark themes
- Theme preference saved in localStorage
- Smooth transitions between themes
- Click the moon/sun icon in the header to switch themes

### 🌍 Multi-Language Support (English/Arabic)
- Switch between English and Arabic languages
- Full RTL (Right-to-Left) support for Arabic
- Language preference saved in localStorage
- Click the language button in the header to switch languages

### 🎨 Design Features
- Red theme as primary color (#dc2626)
- Smooth animations and transitions
- Card-based layout with hover effects
- Modern UI/UX design
- Professional color scheme

## File Structure

```
/
├── index.html          # Main HTML file
├── styles/
│   └── style.css       # All CSS styles and themes
├── script.js           # All JavaScript functionality
└── src/
    └── imports/
        └── logo.png    # Company logo
```

## Usage

### Opening the Website
Simply open `index.html` in any modern web browser.

### Theme Toggle
Click the moon/sun icon button in the header to switch between light and dark themes.

### Language Toggle
Click the "العربية" or "English" button in the header to switch languages.

### Mobile Navigation
On mobile devices, click the hamburger menu icon to access navigation.

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

### Hero Slider
- Auto-advances every 5 seconds
- Manual navigation with prev/next buttons
- 3 slides with different messaging:
  1. "Clean Air Starts with Prodigy"
  2. "Efficient Ventilation Solutions"
  3. "Smart Air Control"

### Sections
1. **Stats Section**: Shows company achievements (25+ years, 1000+ projects, 100% satisfaction)
2. **About Section**: Highlights 4 key aspects (Global Standards, Innovation, Quality-First, Tailored Solutions)
3. **Services Section**: Industrial Ventilation, Commercial HVAC, Maintenance & Repair
4. **Features Section**: Why Choose Us (Expert Team, Quality Guarantee, Industry Leading)
5. **Contact Section**: Contact form and business information

### Contact Information
- **Phone**: +971 50 313 4010
- **Email**: info@prodigysystems.ae
- **Location**: Fujairah, United Arab Emirates
- **Business Hours**: 
  - Monday - Friday: 8:00 AM - 6:00 PM
  - Saturday: 9:00 AM - 4:00 PM
  - Sunday: Closed
  - 24/7 Emergency Service Available

## Customization

### Changing Colors
Edit the CSS variables in `/styles/style.css`:
```css
:root {
    --color-primary: #dc2626;  /* Change this for different primary color */
}
```

### Adding More Languages
1. Add `data-[lang]` attributes to HTML elements
2. Update the `updateLanguage()` function in `script.js`

### Modifying Content
Simply edit the text in `index.html` to update content.

## Technologies Used
- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- LocalStorage for preferences

## Performance
- Optimized images from Unsplash
- Minimal dependencies (only Font Awesome CDN)
- Fast loading times
- Smooth animations with CSS transitions

## Credits
Developed for Prodigy Ventilation Systems
Fujairah, United Arab Emirates

---

© 2026 Prodigy Ventilation Systems. All Rights Reserved.
