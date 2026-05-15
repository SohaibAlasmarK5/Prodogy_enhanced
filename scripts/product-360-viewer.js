/**
 * 360° Product Viewer for Prodigy HS Series Fans
 * Supports drag-to-rotate, thumbnail navigation, and auto-rotation
 */

// Product Image Database - All images in Media/ folders

const PRODUCT_IMAGES = {
    'HS-100P': {
        basePath: '../../../Media/HS-100P/',
        images: [
            'Hs.JPG',
            '1.JPG',
            '2.JPG',
            '3.JPG',
            '4.JPG',
            '5.mp4'
        ],
        fallback: '../../../Media/HS_100P_125P.jpg'
    },
    'HS-125P': {
        basePath: '../../../Media/HS-125P/',
        images: [
            'HS.JPG',
            '1.JPG',
            '2.JPG',
            '3.JPG',
            '4.JPG',
            '5.JPG',
            '6.mp4'
        ],
        fallback: '../../../Media/HS_100P_125P.jpg'
    },
    'HS-150P': {
        basePath: '../../../Media/HS-150P/',
        images: [
            'HS.JPG',
            '1.JPG',
            '2.JPG',
            '3.JPG',
            '4.JPG',
            '5.JPG',
            '6.mp4'
        ],
        fallback: '../../../Media/HS_150P.jpg'
    },
    'HS-200P': {
        basePath: '../../../Media/HS-200P/',
        images: [
            'HS.JPG',
            '1.JPG',
            '2.JPG',
            '3.JPG',
            '4.JPG',
            '5.mp4'
        ],
        fallback: '../../../Media/HS_200P.jpg'
    },
    'HS-250P': {
        basePath: '../../../Media/HS-250P/',
        images: [
            'HS.JPG',
            '1.JPG',
            '2.JPG',
            '3.JPG',
            '4.JPG',
            '5.mp4'
        ],
        fallback: '../../../Media/HS_250P_315P.jpg'
    },
    'HS-315P': {
        basePath: '../../../Media/HS-315P/',
        images: [
            'HS.JPG',
            '1.JPG',
            '2.JPG',
            '3.JPG',
            '4.JPG',
            '5.mp4'
        ],
        fallback: '../../../Media/HS_250P_315P.jpg'
    }
};

class Product360Viewer {
    constructor(containerSelector, productModel) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('360 Viewer container not found:', containerSelector);
            return;
        }

        this.productModel = productModel;
        this.productData = PRODUCT_IMAGES[productModel];

        if (!this.productData) {
            console.error('Product model not found:', productModel);
            this.showFallbackImage();
            return;
        }

        this.currentImageIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.isAutoRotating = false;
        this.autoRotateInterval = null;
        this.preloadedImages = [];
        this.imagesLoaded = false;

        this.init();
    }

    init() {
        this.createViewerHTML();
        this.cacheElements();
        this.preloadImages();
        this.attachEventListeners();
    }
    isVideo(filename) {
        return /\.(mp4|webm|ogg)$/i.test(filename);
    }
    createViewerHTML() {
        this.container.innerHTML = `
            <div class="viewer-360-container">
                <!-- Main Image Display -->
                <div class="viewer-360-main">
                    <div class="viewer-360-image-wrapper">
                        <img id="viewer360MainImage" 
                             src="${this.productData.fallback}" 
                             alt="${this.productModel} - 360° View" 
                             class="viewer-360-image"
                             draggable="false">
                        
                        <!-- Loading Overlay -->
                        <div class="viewer-360-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading 360° View...</p>
                        </div>
                    </div>
                    
                    <!-- Control Buttons -->
                    <div class="viewer-360-controls">
                        <button id="viewer360AutoRotate" class="viewer-360-btn" title="Auto Rotate">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button id="viewer360Fullscreen" class="viewer-360-btn" title="Fullscreen">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button id="viewer360Reset" class="viewer-360-btn" title="Reset View">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Thumbnail Navigation -->
                <div class="viewer-360-thumbnails">
                    <button class="thumbnail-scroll-btn left" id="thumbnailScrollLeft">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="thumbnail-track" id="viewer360ThumbnailTrack">
                        ${this.createThumbnails()}
                    </div>
                    <button class="thumbnail-scroll-btn right" id="thumbnailScrollRight">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    createThumbnails() {
        return this.productData.images.map((file, index) => {
            const isVid = this.isVideo(file);
            const thumbSrc = isVid ? this.productData.fallback : this.productData.basePath + file;
            return `
            <div class="viewer-360-thumbnail ${index === 0 ? 'active' : ''}" 
                 data-index="${index}" title="View ${index + 1}">
                <img src="${thumbSrc}" alt="View ${index + 1}"
                     onerror="this.src='${this.productData.fallback}'">
                ${isVid ? '<span class="video-badge"><i class="fas fa-play"></i></span>' : ''}
            </div>
        `;
        }).join('');
    }
    cacheElements() {
        this.mainImage = document.getElementById('viewer360MainImage');
        this.loadingOverlay = this.container.querySelector('.viewer-360-loading');
        this.autoRotateBtn = document.getElementById('viewer360AutoRotate');
        this.fullscreenBtn = document.getElementById('viewer360Fullscreen');
        this.resetBtn = document.getElementById('viewer360Reset');
        this.thumbnailTrack = document.getElementById('viewer360ThumbnailTrack');
        this.thumbnails = this.container.querySelectorAll('.viewer-360-thumbnail');
        this.scrollLeftBtn = document.getElementById('thumbnailScrollLeft');
        this.scrollRightBtn = document.getElementById('thumbnailScrollRight');
    }

    preloadImages() {
        this.loadingOverlay.style.display = 'flex';
        let loadedCount = 0;
        const imageFiles = this.productData.images.filter(f => !this.isVideo(f));
        const totalToLoad = imageFiles.length || 1;

        this.productData.images.forEach((file, index) => {
            if (this.isVideo(file)) {
                this.preloadedImages[index] = { type: 'video', src: this.productData.basePath + file };
                loadedCount++;  // count it immediately
                if (loadedCount === this.productData.images.length) this.onImagesLoaded();
                return;
            }
            const img = new Image();
            img.onerror = () => {
                img.src = this.productData.fallback;
                this.preloadedImages[index] = { type: 'image', el: img, src: this.productData.fallback }; // ← use fallback src
                loadedCount++;
                if (loadedCount === this.productData.images.length) this.onImagesLoaded();
            };
            img.onload = () => {
                this.preloadedImages[index] = { type: 'image', el: img, src: img.src }; // ← only set after confirmed loaded
                loadedCount++;
                if (loadedCount === this.productData.images.length) this.onImagesLoaded();
            };
            img.src = this.productData.basePath + file;
            this.preloadedImages[index] = { type: 'image', el: img, src: img.src };
        });
    }

    onImagesLoaded() {
        this.imagesLoaded = true;
        this.loadingOverlay.style.display = 'none';
        this.showImage(0);
    }

    showImage(index) {
        if (!this.imagesLoaded || !this.preloadedImages[index]) return;
        this.currentImageIndex = index;

        const media = this.preloadedImages[index];
        const wrapper = this.container.querySelector('.viewer-360-image-wrapper');

        // Remove existing media element
        wrapper.querySelectorAll('img.viewer-360-image, video.viewer-360-image').forEach(el => el.remove());

        if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.src;
            video.className = 'viewer-360-image';
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.muted = true; // required for autoplay in most browsers
            wrapper.prepend(video);
            this.mainImage = video;
        } else {
            const img = document.createElement('img');
            img.src = media.src;
            img.className = 'viewer-360-image';
            img.alt = `${this.productModel} - View ${index + 1}`;
            img.draggable = false;
            wrapper.prepend(img);
            this.mainImage = img;

            // Re-attach drag listeners since it's a new element
            img.addEventListener('mousedown', this.onDragStart.bind(this));
            img.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            img.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
            img.addEventListener('touchend', this.onDragEnd.bind(this));
        }

        this.thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
        this.scrollThumbnailIntoView(index);
    }

    scrollThumbnailIntoView(index) {
        const thumbnail = this.thumbnails[index];
        if (thumbnail) {
            thumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    attachEventListeners() {
        // Mouse drag events
        this.mainImage.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));

        // Touch events
        this.mainImage.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.mainImage.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.mainImage.addEventListener('touchend', this.onDragEnd.bind(this));

        // Control buttons
        this.autoRotateBtn?.addEventListener('click', this.toggleAutoRotate.bind(this));
        this.fullscreenBtn?.addEventListener('click', this.toggleFullscreen.bind(this));
        this.resetBtn?.addEventListener('click', this.resetView.bind(this));

        // Thumbnail clicks
        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.showImage(index);
                this.stopAutoRotate();
            });
        });

        // Thumbnail scroll buttons
        this.scrollLeftBtn?.addEventListener('click', () => {
            this.thumbnailTrack.scrollBy({ left: -200, behavior: 'smooth' });
        });
        this.scrollRightBtn?.addEventListener('click', () => {
            this.thumbnailTrack.scrollBy({ left: 200, behavior: 'smooth' });
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.onKeyPress.bind(this));
    }

    onDragStart(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.mainImage.style.cursor = 'grabbing';
        this.stopAutoRotate();
    }

    onDragMove(e) {
        if (!this.isDragging) return;

        this.currentX = e.clientX;
        const diffX = this.currentX - this.startX;
        const sensitivity = 15; // pixels needed to change image

        if (Math.abs(diffX) > sensitivity) {
            const direction = diffX > 0 ? -1 : 1;
            this.rotateImage(direction);
            this.startX = this.currentX;
        }
    }

    onTouchStart(e) {
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.stopAutoRotate();
    }

    onTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        this.currentX = e.touches[0].clientX;
        const diffX = this.currentX - this.startX;
        const sensitivity = 15;

        if (Math.abs(diffX) > sensitivity) {
            const direction = diffX > 0 ? -1 : 1;
            this.rotateImage(direction);
            this.startX = this.currentX;
        }
    }

    onDragEnd() {
        this.isDragging = false;
        this.mainImage.style.cursor = 'grab';
    }

    rotateImage(direction) {
        const totalImages = this.productData.images.length;
        let newIndex = this.currentImageIndex + direction;

        if (newIndex >= totalImages) newIndex = 0;
        if (newIndex < 0) newIndex = totalImages - 1;

        this.showImage(newIndex);
    }

    toggleAutoRotate() {
        if (this.isAutoRotating) {
            this.stopAutoRotate();
        } else {
            this.startAutoRotate();
        }
    }

    startAutoRotate() {
        this.isAutoRotating = true;
        this.autoRotateBtn.classList.add('active');
        this.autoRotateInterval = setInterval(() => {
            this.rotateImage(1);
        }, 500); // Rotate every 500ms
    }

    stopAutoRotate() {
        this.isAutoRotating = false;
        this.autoRotateBtn?.classList.remove('active');
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    toggleFullscreen() {
        const viewerMain = this.container.querySelector('.viewer-360-main');

        if (!document.fullscreenElement) {
            viewerMain.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    resetView() {
        this.showImage(0);
        this.stopAutoRotate();
    }

    onKeyPress(e) {
        if (!this.imagesLoaded) return;

        switch (e.key) {
            case 'ArrowLeft':
                this.rotateImage(-1);
                this.stopAutoRotate();
                break;
            case 'ArrowRight':
                this.rotateImage(1);
                this.stopAutoRotate();
                break;
            case 'Home':
                this.resetView();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoRotate();
                break;
        }
    }

    showFallbackImage() {
        this.container.innerHTML = `
            <div class="viewer-360-fallback">
                <img src="../../../Media/HSFan.png" alt="${this.productModel}" class="fallback-image">
                <p>360° view not available for this product</p>
            </div>
        `;
    }

    destroy() {
        this.stopAutoRotate();
        this.preloadedImages = [];
        this.container.innerHTML = '';
    }
}

// Auto-initialize viewers on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if there's a viewer container on the page
    const viewerContainer = document.querySelector('[data-360-viewer]');
    if (viewerContainer) {
        const productModel = viewerContainer.dataset['360Viewer'];
        new Product360Viewer('[data-360-viewer]', productModel);
    }
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Product360Viewer;
}