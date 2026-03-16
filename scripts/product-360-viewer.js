/**
 * Product 360° Viewer
 * Interactive product image viewer with drag, swipe, and auto-rotate functionality
 */

class Product360Viewer {
    constructor(container, options = {}) {
        this.container = container;
        this.images = options.images || [];
        this.labels = options.labels || [];
        this.currentIndex = 0;
        this.isLoading = true;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.loadedImages = 0;
        this.autoRotate = options.autoRotate || false;
        this.autoRotateInterval = null;
        this.autoRotateSpeed = options.autoRotateSpeed || 150; // ms per frame
        
        this.init();
    }
    
    init() {
        if (this.images.length === 0) {
            console.warn('No images provided for 360 viewer');
            return;
        }
        
        this.render();
        this.preloadImages();
        this.attachEvents();
        
        // Hide hint after 5 seconds
        setTimeout(() => {
            const hint = this.container.querySelector('.viewer-hint');
            if (hint) hint.classList.add('hidden');
        }, 5000);
    }
    
    render() {
        const html = `
            <div class="viewer-main-container">
                <div class="viewer-loading">
                    <div class="viewer-spinner"></div>
                    <span data-en="Loading 360° View..." data-ar="جاري تحميل العرض 360°...">Loading 360° View...</span>
                </div>
                
                <div class="viewer-image-container">
                    ${this.images.map((img, index) => `
                        <img 
                            src="${img}" 
                            alt="Product view ${index + 1}" 
                            class="viewer-image ${index === 0 ? 'active' : ''}"
                            data-index="${index}"
                        >
                    `).join('')}
                </div>
                
                <button class="viewer-nav prev" aria-label="Previous view">
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <button class="viewer-nav next" aria-label="Next view">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <div class="viewer-angle-indicator">
                    <span data-en="View" data-ar="عرض">View</span>: <strong>${this.currentIndex + 1}/${this.images.length}</strong>
                </div>
                
                <div class="viewer-hint">
                    <i class="fas fa-hand-pointer"></i>
                    <span data-en="Drag to rotate • Click arrows" data-ar="اسحب للدوران • انقر الأسهم">Drag to rotate • Click arrows</span>
                </div>
                
                ${this.images.length > 1 ? `
                    <button class="viewer-autorotate-btn" aria-label="Toggle auto-rotate">
                        <i class="fas fa-sync-alt"></i>
                        <span data-en="Auto" data-ar="تلقائي">Auto</span>
                    </button>
                ` : ''}
            </div>
            
            ${this.images.length > 1 ? `
                <div class="viewer-thumbnails">
                    ${this.images.map((img, index) => `
                        <div class="viewer-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${img}" alt="Thumbnail ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${this.labels.length > 0 ? `
                <div class="viewer-label-container">
                    ${this.labels.map((label, index) => `
                        <button class="viewer-label ${index === 0 ? 'active' : ''}" data-index="${index}">
                            ${label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        this.container.innerHTML = html;
    }
    
    preloadImages() {
        const imgElements = this.container.querySelectorAll('.viewer-image');
        
        imgElements.forEach(img => {
            if (img.complete) {
                this.loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    this.loadedImages++;
                    if (this.loadedImages === this.images.length) {
                        this.hideLoading();
                    }
                });
                
                img.addEventListener('error', () => {
                    console.error('Failed to load image:', img.src);
                    this.loadedImages++;
                    if (this.loadedImages === this.images.length) {
                        this.hideLoading();
                    }
                });
            }
        });
        
        if (this.loadedImages === this.images.length) {
            this.hideLoading();
        }
    }
    
    hideLoading() {
        const loading = this.container.querySelector('.viewer-loading');
        if (loading) loading.classList.add('hidden');
        this.isLoading = false;
    }
    
    attachEvents() {
        const mainContainer = this.container.querySelector('.viewer-main-container');
        const prevBtn = this.container.querySelector('.viewer-nav.prev');
        const nextBtn = this.container.querySelector('.viewer-nav.next');
        const thumbnails = this.container.querySelectorAll('.viewer-thumbnail');
        const labels = this.container.querySelectorAll('.viewer-label');
        const autoRotateBtn = this.container.querySelector('.viewer-autorotate-btn');
        
        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        
        // Mouse drag
        mainContainer.addEventListener('mousedown', (e) => this.startDrag(e));
        mainContainer.addEventListener('mousemove', (e) => this.drag(e));
        mainContainer.addEventListener('mouseup', () => this.endDrag());
        mainContainer.addEventListener('mouseleave', () => this.endDrag());
        
        // Touch drag
        mainContainer.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        mainContainer.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
        mainContainer.addEventListener('touchend', () => this.endDrag());
        
        // Thumbnails
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.goToIndex(index);
            });
        });
        
        // Labels
        labels.forEach(label => {
            label.addEventListener('click', () => {
                const index = parseInt(label.dataset.index);
                this.goToIndex(index);
            });
        });
        
        // Auto-rotate toggle
        if (autoRotateBtn) {
            autoRotateBtn.addEventListener('click', () => this.toggleAutoRotate());
            if (this.autoRotate) {
                this.startAutoRotate();
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }
    
    startDrag(e) {
        if (this.isLoading) return;
        this.isDragging = true;
        this.startX = e.clientX || e.pageX;
        this.stopAutoRotate();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.clientX || e.pageX;
        const diff = this.currentX - this.startX;
        const sensitivity = 30; // pixels needed to change frame
        
        if (Math.abs(diff) > sensitivity) {
            if (diff > 0) {
                this.prev();
            } else {
                this.next();
            }
            this.startX = this.currentX;
        }
    }
    
    endDrag() {
        this.isDragging = false;
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateView();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateView();
    }
    
    goToIndex(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentIndex = index;
            this.updateView();
            this.stopAutoRotate();
        }
    }
    
    updateView() {
        // Update images
        const images = this.container.querySelectorAll('.viewer-image');
        images.forEach((img, index) => {
            img.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update thumbnails
        const thumbnails = this.container.querySelectorAll('.viewer-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update labels
        const labels = this.container.querySelectorAll('.viewer-label');
        labels.forEach((label, index) => {
            label.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update angle indicator
        const indicator = this.container.querySelector('.viewer-angle-indicator strong');
        if (indicator) {
            indicator.textContent = `${this.currentIndex + 1}/${this.images.length}`;
        }
    }
    
    toggleAutoRotate() {
        if (this.autoRotateInterval) {
            this.stopAutoRotate();
        } else {
            this.startAutoRotate();
        }
    }
    
    startAutoRotate() {
        const btn = this.container.querySelector('.viewer-autorotate-btn');
        if (btn) btn.classList.add('active');
        
        this.autoRotateInterval = setInterval(() => {
            this.next();
        }, this.autoRotateSpeed);
    }
    
    stopAutoRotate() {
        const btn = this.container.querySelector('.viewer-autorotate-btn');
        if (btn) btn.classList.remove('active');
        
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoRotate();
        this.container.innerHTML = '';
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Product360Viewer;
}
