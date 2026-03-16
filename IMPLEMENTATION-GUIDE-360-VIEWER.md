# 360° Product Viewer Implementation Guide

## Overview
This guide explains how to implement the interactive 360° product viewer for all HS series fan products.

---

## ✨ Features

### Interactive Controls:
- **Drag to Rotate** - Mouse drag or touch swipe to rotate the product
- **Arrow Navigation** - Click left/right arrows to move between views
- **Thumbnail Strip** - Click any thumbnail to jump to that view
- **Labeled Views** - Click labeled buttons for specific angles (Front, Motor, Parts, etc.)
- **Auto-Rotate** - Optional automatic rotation with toggle button
- **Keyboard Support** - Use arrow keys for navigation
- **Loading Indicator** - Shows while images are preloading
- **Angle Counter** - Displays current view (e.g., "View: 3/10")
- **Responsive** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode** - Automatically adapts to your theme
- **Multilingual** - Supports English/Arabic labels

---

## 📁 File Structure

You need to create this folder structure:

```
Media/
  ├── HS-100P/
  │   ├── hs100-view-01-top-front.png
  │   ├── hs100-view-02-front-angle.png
  │   ├── hs100-view-03-top-detail.png
  │   ├── ... (up to 10 views)
  │
  ├── HS-125P/
  │   ├── hs125-view-01-top-front.png
  │   ├── ... (similar structure)
  │
  ├── HS-150P/
  │   ├── hs150-view-01-top-front.png
  │   ├── hs150-view-02-front-angle.png
  │   ├── hs150-view-03-top-detail.png
  │   ├── hs150-view-04-top-mount.png
  │   ├── hs150-view-05-label-detail.png
  │   ├── hs150-view-06-parts-exploded.png
  │   ├── hs150-view-07-motor-back.png
  │   ├── hs150-view-08-motor-internal.png
  │   ├── hs150-view-09-back-angle.png
  │   └── hs150-view-10-front-blade.png
  │
  ├── HS-200P/
  ├── HS-250P/
  └── HS-315P/
```

---

## 🖼️ Image Naming Convention

Based on your provided images, here's the recommended naming:

1. **hs150-view-01-top-front.png** - Top/front angle view (main product shot)
2. **hs150-view-02-front-angle.png** - Front view showing fan blades
3. **hs150-view-03-top-detail.png** - Top detail showing mounting points
4. **hs150-view-04-top-mount.png** - Top view with mounting bracket
5. **hs150-view-05-label-detail.png** - Close-up of product label/specifications
6. **hs150-view-06-parts-exploded.png** - Exploded/disassembled parts view
7. **hs150-view-07-motor-back.png** - Back view showing motor
8. **hs150-view-08-motor-internal.png** - Internal motor mechanism
9. **hs150-view-09-back-angle.png** - Back angle view (empty shell)
10. **hs150-view-10-front-blade.png** - Front perspective showing blade design

**Tips:**
- Use PNG format with transparent backgrounds for best quality
- Consistent image dimensions across all views (recommended: 1200x1200px or 1500x1500px)
- Clean white/neutral background if transparency isn't possible
- Center the product in each image for smooth transitions

---

## 💻 Implementation Steps

### Step 1: Add CSS and JS Files to Your Product Page

In the `<head>` section of your product page, add:

```html
<link rel="stylesheet" href="../../../styles/product-360-viewer.css">
```

Before the closing `</body>` tag, add:

```html
<script src="../../../scripts/product-360-viewer.js"></script>
```

### Step 2: Replace Static Product Image

Find this section in your HTML:
```html
<div class="product-image">
    <img src="../../../HSFan.png" alt="HS-150P">
</div>
```

Replace it with:
```html
<!-- 360° Product Viewer -->
<div class="product-360-viewer" id="product360Viewer"></div>
```

### Step 3: Initialize the Viewer

Add this script before the closing `</body>` tag:

```html
<script>
    // Initialize 360° Product Viewer for HS-150P
    const viewerContainer = document.getElementById('product360Viewer');
    const viewer = new Product360Viewer(viewerContainer, {
        images: [
            '../../../Media/HS-150P/hs150-view-01-top-front.png',
            '../../../Media/HS-150P/hs150-view-02-front-angle.png',
            '../../../Media/HS-150P/hs150-view-03-top-detail.png',
            '../../../Media/HS-150P/hs150-view-04-top-mount.png',
            '../../../Media/HS-150P/hs150-view-05-label-detail.png',
            '../../../Media/HS-150P/hs150-view-06-parts-exploded.png',
            '../../../Media/HS-150P/hs150-view-07-motor-back.png',
            '../../../Media/HS-150P/hs150-view-08-motor-internal.png',
            '../../../Media/HS-150P/hs150-view-09-back-angle.png',
            '../../../Media/HS-150P/hs150-view-10-front-blade.png'
        ],
        labels: [
            '<span data-en="Top Front" data-ar="أمامي علوي">Top Front</span>',
            '<span data-en="Front Angle" data-ar="زاوية أمامية">Front Angle</span>',
            '<span data-en="Top Detail" data-ar="تفاصيل علوية">Top Detail</span>',
            '<span data-en="Mount View" data-ar="عرض التثبيت">Mount View</span>',
            '<span data-en="Label" data-ar="الملصق">Label</span>',
            '<span data-en="Parts" data-ar="القطع">Parts</span>',
            '<span data-en="Motor" data-ar="المحرك">Motor</span>',
            '<span data-en="Internal" data-ar="داخلي">Internal</span>',
            '<span data-en="Back Angle" data-ar="زاوية خلفية">Back Angle</span>',
            '<span data-en="Blade View" data-ar="عرض الشفرة">Blade View</span>'
        ],
        autoRotate: false,
        autoRotateSpeed: 200
    });
</script>
```

---

## 🎨 Customization Options

### Configuration Object Properties:

```javascript
{
    images: [],              // Array of image URLs (required)
    labels: [],              // Array of label HTML strings (optional)
    autoRotate: false,       // Enable auto-rotation on load
    autoRotateSpeed: 200     // Milliseconds per frame (lower = faster)
}
```

### Example Configurations:

#### Simple viewer (no labels, just images):
```javascript
const viewer = new Product360Viewer(viewerContainer, {
    images: [
        '../../../Media/HS-100P/view-01.png',
        '../../../Media/HS-100P/view-02.png',
        '../../../Media/HS-100P/view-03.png'
    ]
});
```

#### With auto-rotate enabled:
```javascript
const viewer = new Product360Viewer(viewerContainer, {
    images: [...],
    autoRotate: true,
    autoRotateSpeed: 150  // Faster rotation
});
```

---

## 🌐 Arabic/English Translation Support

The viewer automatically works with your existing translation system. Labels use the `data-en` and `data-ar` attributes:

```html
'<span data-en="Front View" data-ar="عرض أمامي">Front View</span>'
```

All UI elements (buttons, hints, etc.) also have translation attributes and will update when the user switches language.

---

## 📱 Responsive Behavior

The viewer automatically adapts to different screen sizes:

- **Desktop**: Full drag interaction, arrow buttons, large thumbnails
- **Tablet**: Touch-optimized, medium thumbnails
- **Mobile**: Swipe gestures, compact controls, smaller thumbnails

---

## ✅ Implementation Checklist

For each HS series product:

- [ ] Create folder in `Media/` (e.g., `Media/HS-150P/`)
- [ ] Add all 10 product view images with consistent naming
- [ ] Add CSS file link to product page
- [ ] Add JS file link to product page
- [ ] Replace static image with viewer container
- [ ] Add initialization script with correct image paths
- [ ] Update image paths to match your folder structure
- [ ] Customize labels for each view angle
- [ ] Test drag, click, and touch interactions
- [ ] Test in light and dark modes
- [ ] Test in English and Arabic
- [ ] Test on mobile devices

---

## 🚀 Quick Copy Template for Other Models

For HS-200P, HS-250P, etc., just copy this template and replace "150" with the model number:

```javascript
const viewer = new Product360Viewer(document.getElementById('product360Viewer'), {
    images: [
        '../../../Media/HS-200P/hs200-view-01-top-front.png',
        '../../../Media/HS-200P/hs200-view-02-front-angle.png',
        '../../../Media/HS-200P/hs200-view-03-top-detail.png',
        '../../../Media/HS-200P/hs200-view-04-top-mount.png',
        '../../../Media/HS-200P/hs200-view-05-label-detail.png',
        '../../../Media/HS-200P/hs200-view-06-parts-exploded.png',
        '../../../Media/HS-200P/hs200-view-07-motor-back.png',
        '../../../Media/HS-200P/hs200-view-08-motor-internal.png',
        '../../../Media/HS-200P/hs200-view-09-back-angle.png',
        '../../../Media/HS-200P/hs200-view-10-front-blade.png'
    ],
    labels: [
        '<span data-en="Top Front" data-ar="أمامي علوي">Top Front</span>',
        '<span data-en="Front Angle" data-ar="زاوية أمامية">Front Angle</span>',
        '<span data-en="Top Detail" data-ar="تفاصيل علوية">Top Detail</span>',
        '<span data-en="Mount View" data-ar="عرض التثبيت">Mount View</span>',
        '<span data-en="Label" data-ar="الملصق">Label</span>',
        '<span data-en="Parts" data-ar="القطع">Parts</span>',
        '<span data-en="Motor" data-ar="المحرك">Motor</span>',
        '<span data-en="Internal" data-ar="داخلي">Internal</span>',
        '<span data-en="Back Angle" data-ar="زاوية خلفية">Back Angle</span>',
        '<span data-en="Blade View" data-ar="عرض الشفرة">Blade View</span>'
    ],
    autoRotate: false,
    autoRotateSpeed: 200
});
```

---

## 🎯 User Interactions

1. **Drag to Rotate** - Smooth dragging left/right changes views
2. **Click Arrows** - Navigate one view at a time
3. **Click Thumbnails** - Jump directly to any view
4. **Click Labels** - Jump to named perspectives (Front, Motor, etc.)
5. **Auto-Rotate Button** - Toggle automatic rotation
6. **Keyboard** - Use arrow keys for navigation
7. **Touch Swipe** - Mobile users can swipe to rotate

---

## 🔧 Troubleshooting

**Images not loading:**
- Check file paths are correct relative to HTML file
- Ensure images are in the correct folder structure
- Verify image file names match exactly (case-sensitive)

**Viewer not appearing:**
- Check that CSS file is loaded before body
- Check that JS file is loaded before initialization script
- Open browser console to check for errors

**Drag not working:**
- Ensure images have finished loading (check loading indicator)
- Try on different browser
- Check console for JavaScript errors

---

## 📝 Summary

You now have a professional 360° product viewer that:
- ✅ Shows all angles of your HS series fans
- ✅ Provides interactive drag/click/swipe controls
- ✅ Works on all devices (desktop, tablet, mobile)
- ✅ Supports dark mode
- ✅ Supports English/Arabic translation
- ✅ Looks professional and modern
- ✅ Doesn't break your existing design

**Next Steps:**
1. Create the `Media/` folder structure
2. Add your 10 product view images for each fan model
3. Apply the implementation to HS-150P (already done!)
4. Copy the template for other models (HS-100P, HS-125P, etc.)
5. Test thoroughly on all devices

---

Good luck! 🎉
