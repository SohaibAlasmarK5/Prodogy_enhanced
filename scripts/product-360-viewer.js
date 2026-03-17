/**
 * 360° Product Viewer for Prodigy HS Series Fans
 * Supports drag-to-rotate, thumbnail navigation, and auto-rotation
 */

// Product Image Database - All images in Media/ folders

const PRODUCT_IMAGES = {
    'HS-100P': {
        basePath: '../../../Media/HS-100P/',
        images: [
            '4XSB1820.JPG',
            '4XSB1822.JPG',
            '4XSB1823.JPG',
            '4XSB1824.JPG',
            '4XSB1825.JPG',
            '4XSB1826.JPG',
            '4XSB1827.JPG',
            '4XSB1828.JPG',
            '4XSB1829.JPG',
            '4XSB1830.JPG',
            '4XSB1831.JPG',
            '100P.JPG'
        ],
        fallback: '../../../Media/HS_100P_125P.jpg'
    },
    'HS-125P': {
        basePath: '../../../Media/HS-125P/',
        images: [
            '4XSB1893.JPG',
            '4XSB1894.JPG',
            '4XSB1895.JPG',
            '4XSB1896.JPG',
            '4XSB1897.JPG',
            '4XSB1898.JPG',
            '4XSB1899.JPG',
            '4XSB1901.JPG',
            '4XSB1902.JPG',
            '4XSB1903.JPG',
            '4XSB1904.JPG',
            '4XSB1905.JPG',
            '4XSB1906.JPG',
            '4XSB3239.JPG'
        ],
        fallback: '../../../Media/HS_100P_125P.jpg'
    },
    'HS-150P': {
        basePath: '../../../Media/HS-150P/',
        images: [
            '4XSB1849.JPG',
            '150P.jpg',
            'DSC_5098-1.jpg',
            'DSC_5105-1.jpg',
            'DSC_5107-1.jpg',
            'DSC_5112-1.jpg',
            'DSC_5114-1.jpg',
            'DSC_5116-1.jpg',
            'DSC_5119-1.jpg',
            'DSC_5121-1.jpg'
        ],
        fallback: '../../../Media/HS_150P.jpg'
    },
    'HS-200P': {
        basePath: '../../../Media/HS-200P/',
        images: [
            '4XSB1678.JPG',
            '4XSB1679.JPG',
            '4XSB1680.JPG',
            '4XSB1684.JPG',
            '4XSB1686.JPG',
            '4XSB1687.JPG',
            '4XSB1689.JPG',
            '4XSB1690.JPG',
            '4XSB1691.JPG',
            '4XSB1694.JPG',
            '4XSB1695.JPG',
            '4XSB1696.JPG',
            '4XSB1697.JPG',
            '200P.JPG'
        ],
        fallback: '../../../Media/HS_200P.jpg'
    },
    'HS-250P': {
        basePath: '../../../Media/HS-250P/',
        images: [
            'Q84A1881.JPG',
            '250P.JPG',
            'Q84A1883.JPG',
            'Q84A1884.JPG',
            'Q84A1885.JPG',
            'Q84A1889.JPG',
            'Q84A1892.JPG',
            'Q84A1893.JPG',
            'Q84A1894.JPG',
            'Q84A1895.JPG',
            'Q84A1896.JPG',
            'Q84A1898.JPG'
        ],
        fallback: '../../../Media/HS_250P_315P.jpg'
    },
    'HS-315P': {
        basePath: '../../../Media/HS-315P/',
        images: [
            '4XSB1677.JPG',
            '4XSB1680.JPG',
            '4XSB1681.JPG',
            'Q84A1658.JPG',
            'Q84A1660.JPG',
            'Q84A1661.JPG',
            'Q84A1663.JPG',
            'Q84A1664.JPG',
            'Q84A1665.JPG',
            'Q84A1671.JPG',
            'Q84A1672.JPG',
            'Q84A1673.JPG'
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
        return this.productData.images.map((image, index) => `
            <div class="viewer-360-thumbnail ${index === 0 ? 'active' : ''}" 
                 data-index="${index}"
                 title="View ${index + 1}">
                <img src="${this.productData.basePath}${image}" 
                     alt="View ${index + 1}"
                     onerror="this.src='${this.productData.fallback}'">
            </div>
        `).join('');
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
        const totalImages = this.productData.images.length;

        this.productData.images.forEach((imageName, index) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.onImagesLoaded();
                }
            };
            img.onerror = () => {
                // Use fallback on error
                console.warn(`Failed to load: ${imageName}, using fallback`);
                img.src = this.productData.fallback;
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.onImagesLoaded();
                }
            };
            img.src = this.productData.basePath + imageName;
            this.preloadedImages[index] = img;
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
        this.mainImage.src = this.preloadedImages[index].src;

        // Update active thumbnail
        this.thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Scroll thumbnail into view
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