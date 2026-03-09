# How to Use Dark Theme & Arabic Translation

## 🎯 Quick Start

1. Open `index.html` in your web browser
2. Look at the **top-right corner** of the website header
3. You'll see TWO buttons next to "Get Quote":
   - **🌙 Moon Icon** = Theme Toggle
   - **"العربية"** = Language Toggle

---

## 🌓 Dark Theme

### How to Switch:
1. Find the **moon icon button** (🌙) in the header
2. **Click it once** → Website turns DARK
3. The icon changes to a **sun** (☀️)
4. **Click again** → Back to LIGHT mode

### What Changes:
- ✅ Background colors (white → dark gray)
- ✅ Text colors (dark → light)
- ✅ All cards and sections
- ✅ Navigation and footer

### Automatic Save:
- Your choice is **saved automatically**
- Close and reopen the browser → Your theme is still there!

---

## 🌍 Arabic Translation

### How to Switch:
1. Find the **"العربية" button** next to the theme button
2. **Click it once** → Everything switches to Arabic
3. The text flows **right-to-left** (RTL)
4. The button now says **"English"**
5. **Click again** → Back to English

### What Translates:
- ✅ Navigation menu (Home, Technical Support, Products, About Us)
- ✅ Hero slider text (all 3 slides)
- ✅ Stats section (Years Experience, Projects Completed, etc.)
- ✅ All buttons ("Get Quote", "View Products")
- ✅ Dropdown menus

### RTL Layout:
- Text aligns to the RIGHT
- Menu items flow right-to-left
- Icons flip direction automatically

### Automatic Save:
- Your language choice is **saved automatically**
- Refresh the page → Your language is still there!

---

## 📱 On Mobile

### Desktop View (Wide Screen):
```
┌──────────────────────────────────────────────────┐
│  [LOGO]  Home  Support▼  Products▼  About       │
│                          [🌙] [العربية] [Quote]  │
└──────────────────────────────────────────────────┘
```

### Mobile View (Narrow Screen):
```
┌──────────────────────────────────────┐
│  [LOGO]         [🌙] [العربية] [☰]   │
└──────────────────────────────────────┘
```

On mobile:
- The "Get Quote" button is hidden to save space
- Theme and language buttons remain visible
- Click the hamburger menu (☰) to see navigation

---

##  Examples

### Example 1: Switch to Dark Mode
1. Click the **moon icon** 🌙
2. ✅ Done! Website is now dark

### Example 2: Switch to Arabic
1. Click **"العربية"**
2. ✅ Done! Website is now in Arabic

### Example 3: Dark Mode + Arabic
1. Click the **moon icon** 🌙 → Dark mode ON
2. Click **"العربية"** → Arabic ON
3. ✅ You now have dark mode in Arabic!

---

## 🔄 Reset to Default

Want to go back to the original?
1. Click the **sun icon** ☀️ → Light mode
2. Click **"English"** → English language
3. ✅ Back to the original look!

---

## ⚙️ Technical Details

### Where Settings Are Saved:
- **Browser localStorage** (on your computer)
- Each browser stores its own settings
- Clear browser data = settings reset

### Supported Browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Any modern browser

### No Internet Required:
- All features work **offline**
- No server needed
- No database needed

---

## ❓ Troubleshooting

### "I don't see the buttons!"
**Solution:** 
- Refresh the page (Ctrl+R or Cmd+R)
- Clear browser cache
- Make sure CSS file is loaded (`styles/style.css`)
- Check browser console for errors (F12)

### "Dark mode doesn't work!"
**Solution:**
- Check if JavaScript is enabled
- Make sure `script.js` is loaded
- Open browser console (F12) and check for errors

### "Arabic text looks broken!"
**Solution:**
- Make sure your browser supports Arabic fonts
- Check that the page encoding is UTF-8
- Try a different browser

### "Settings don't save!"
**Solution:**
- Check if browser allows localStorage
- Try in normal mode (not incognito/private)
- Clear browser cache and try again

---

## 🎨 Customization

### Want to change the colors?
Edit `/styles/style.css` and modify these variables:

```css
:root {
    --color-primary: #dc2626;  /* Red color */
}

[data-theme="dark"] {
    --color-bg: #111827;  /* Dark background */
    --color-text: #f9fafb;  /* Light text */
}
```

### Want to add more languages?
Edit `/index.html` and add more `data-` attributes:

```html
<a href="#" data-en="Home" data-ar="الرئيسية" data-fr="Accueil">Home</a>
```

Then update `/script.js` to handle the new language.

---

## 📞 Support

If you need help:
- Check the main README.md file
- Look at the code comments
- Contact: info@prodigysystems.ae

---

**Last Updated:** March 2026
**Made for:** Prodigy Ventilation Systems
