document.addEventListener("DOMContentLoaded", function() {
    // --- 1. 滾動動畫載入 ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // --- 2. Lightbox 邏輯 ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentGallery = [];
    let currentIdx = 0;

    function registerLightboxImages(selector, isDiagram = false) {
        const items = document.querySelectorAll(selector);
        items.forEach((item, index) => {
            let img, caption;
            if (isDiagram) {
                img = item;
                caption = item.getAttribute('data-caption') || '';
            } else {
                img = item.querySelector('img');
                const p = item.querySelector('p');
                caption = p ? p.textContent : (img ? img.alt : '');
            }

            if (img) {
                item.addEventListener('click', () => {
                    currentGallery = [];
                    const groupItems = document.querySelectorAll(selector);
                    groupItems.forEach(gi => {
                        let gImg = isDiagram ? gi : gi.querySelector('img');
                        let gCaption = isDiagram ? gi.getAttribute('data-caption') : (gi.querySelector('p') ? gi.querySelector('p').textContent : gImg.alt);
                        currentGallery.push({ src: gImg.src, caption: gCaption });
                    });
                    currentIdx = index;
                    openLightbox();
                });
            }
        });
    }

    registerLightboxImages('.portfolio-item');
    registerLightboxImages('.phone-mockup');
    registerLightboxImages('.diagram-img', true);

    function openLightbox() {
        if (currentGallery.length > 0) {
            lightboxImg.src = currentGallery[currentIdx].src;
            lightboxCaption.textContent = currentGallery[currentIdx].caption;
        }
        lightbox.style.display = 'flex';
    }

    function closeLightbox() { lightbox.style.display = 'none'; }
    
    function nextImage() {
        if (currentGallery.length > 0) {
            currentIdx = (currentIdx + 1) % currentGallery.length;
            openLightbox();
        }
    }

    function prevImage() {
        if (currentGallery.length > 0) {
            currentIdx = (currentIdx - 1 + currentGallery.length) % currentGallery.length;
            openLightbox();
        }
    }

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });

    // --- 3. 選單滾動監控 (Scrollspy) ---
    const backToTopBtn = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.sticky-nav a');
    const sections = Array.from(document.querySelectorAll('main.content-area .card[id]')).filter(section => {
        return Array.from(navLinks).some(link => link.getAttribute('href') === `#${section.id}`);
    });

    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + (window.innerHeight / 3); 

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (scrollPosition >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20) {
            current = sections[sections.length - 1].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                const nav = document.querySelector('.sticky-nav');
                if (nav.scrollWidth > nav.clientWidth) {
                    link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { backToTopBtn.classList.add('show'); } 
        else { backToTopBtn.classList.remove('show'); }
        updateActiveNav();
    });

    updateActiveNav();
    backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // --- 4. 主選單左右滑動與箭頭顯示邏輯 ---
    const navMenu = document.querySelector('.sticky-nav');
    const leftArrowBtn = document.querySelector('.left-arrow');
    const rightArrowBtn = document.querySelector('.right-arrow');

    function checkNavScroll() {
        // 檢查選單內容的實際寬度是否大於容器的顯示寬度
        if (navMenu.scrollWidth > navMenu.clientWidth) {
            leftArrowBtn.style.display = 'flex';
            rightArrowBtn.style.display = 'flex';
        } else {
            leftArrowBtn.style.display = 'none';
            rightArrowBtn.style.display = 'none';
        }
    }

    // 監聽視窗尺寸改變，即時更新按鈕顯示狀態
    window.addEventListener('resize', checkNavScroll);

    // 頁面載入時執行一次初始檢查
    checkNavScroll();

    // 點擊左箭頭：向左滑動 250px
    leftArrowBtn.addEventListener('click', () => {
        navMenu.scrollBy({ left: -250, behavior: 'smooth' });
    });

    // 點擊右箭頭：向右滑動 250px
    rightArrowBtn.addEventListener('click', () => {
        navMenu.scrollBy({ left: 250, behavior: 'smooth' });
    });
});