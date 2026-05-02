// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== SECTION NAVIGATION =====
let currentSection = 0;
const sections = ['welcome', 'card-section', 'slideshow', 'messages', 'closing'];

function showSection(index) {
    $$('.section').forEach(section => section.classList.remove('active'));
    $(`#${sections[index]}`).classList.add('active');
    currentSection = index;
}

// ===== SECTION 1: WELCOME SCREEN =====
function initWelcome() {
    // Create floating petals
    const petalsContainer = $('.petals-container');
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 5 + 10) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petalsContainer.appendChild(petal);
    }

    // Open surprise button
    $('#openSurpriseBtn').addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Transition to card section
        setTimeout(() => showSection(1), 300);
    });
}

// ===== SECTION 2: GREETING CARD =====
function initCard() {
    const card = $('#greetingCard');
    const continueBtn = $('#continueToSlideshow');
    const floatingHearts = $('.floating-hearts');
    
    // Auto-flip card after section becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && mutation.target.id === 'card-section') {
                setTimeout(() => {
                    card.classList.add('flipped');
                    
                    // Create floating hearts
                    setTimeout(() => {
                        floatingHearts.classList.add('active');
                        for (let i = 0; i < 15; i++) {
                            const heart = document.createElement('div');
                            heart.className = 'heart';
                            heart.textContent = ['💖', '💕', '✨', '⭐'][Math.floor(Math.random() * 4)];
                            heart.style.left = Math.random() * 100 + '%';
                            heart.style.animationDelay = Math.random() * 0.5 + 's';
                            floatingHearts.appendChild(heart);
                        }
                    }, 600);
                    
                    // Show continue button
                    setTimeout(() => {
                        continueBtn.classList.add('visible');
                    }, 2000);
                }, 500);
            }
        });
    });
    
    observer.observe($('#card-section'), { attributes: true, attributeFilter: ['class'] });
    
    // Manual card flip on click
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
    
    // Continue button
    continueBtn.addEventListener('click', () => {
        showSection(2);
        startSlideshow();
    });
}

// ===== SECTION 3: SLIDESHOW =====
let slideshowInterval;
let currentSlide = 0;
const slides = $$('.slide');
const totalSlides = slides.length;

function initSlideshow() {
    // Create dots
    const dotsContainer = $('.slide-dots');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Arrow controls
    $('#prevSlide').addEventListener('click', () => {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        resetAutoplay();
    });
    
    $('#nextSlide').addEventListener('click', () => {
        goToSlide((currentSlide + 1) % totalSlides);
        resetAutoplay();
    });
    
    // Music toggle
    const musicToggle = $('#musicToggle');
    const bgMusic = $('#bgMusic');
    
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = '🔊';
        } else {
            bgMusic.pause();
            musicToggle.textContent = '🔇';
        }
    });
    
    // Continue button
    $('#continueToMessages').addEventListener('click', () => {
        stopSlideshow();
        bgMusic.pause();
        window.location.href = 'messages.html';
    });
}

function startSlideshow() {
    currentSlide = 0;
    goToSlide(0);
    slideshowInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 3500);
    
    // Show continue button after last slide
    setTimeout(() => {
        $('#continueToMessages').classList.add('visible');
    }, totalSlides * 3500);
}

function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    
    // Reset zoom animation
    const img = slides[index].querySelector('img');
    img.style.animation = 'none';
    setTimeout(() => {
        img.style.animation = 'zoomIn 3.5s ease-out forwards';
    }, 10);
    
    // Update dots
    const dots = $$('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    
    currentSlide = index;
}

function resetAutoplay() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 3500);
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
}

// ===== SECTION 4: TEAM MESSAGES =====
function initMessages() {
    const contactCards = $$('.contact-card');
    const modal = $('#messageModal');
    const closeModalBtn = $('#closeModal');
    
    contactCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const name = card.dataset.name;
            const message = card.dataset.message;
            const avatar = card.querySelector('.contact-avatar');
            const avatarStyle = avatar.style.background;
            const avatarText = avatar.textContent;
            
            // Populate modal
            $('#modalName').textContent = name;
            $('#modalMessage').textContent = message;
            $('#modalAvatar').textContent = avatarText;
            $('#modalAvatar').style.background = avatarStyle;
            
            // Show modal
            modal.classList.add('active');
            
            // Create confetti
            createModalConfetti();
        });
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Continue button
    $('#continueToClosing').addEventListener('click', () => {
        showSection(4);
        initClosing();
    });
}

function animateContactCards() {
    const cards = $$('.contact-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 150);
    });
    
    setTimeout(() => {
        $('#continueToClosing').classList.add('visible');
    }, cards.length * 150 + 500);
}

function closeModal() {
    $('#messageModal').classList.remove('active');
    $('.modal-confetti').innerHTML = '';
}

function createModalConfetti() {
    const container = $('.modal-confetti');
    const colors = ['#F9A8B8', '#C2185B', '#F4C542', '#FFE4E8'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2500);
    }
}

// ===== SECTION 5: CLOSING =====
function initClosing() {
    const confettiContainer = $('.confetti-container');
    const colors = ['#F9A8B8', '#C2185B', '#F4C542', '#FFE4E8', '#FFF8F9'];
    
    // Create continuous confetti
    setInterval(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 3) + 's';
        confetti.style.animationDelay = '0s';
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 6000);
    }, 200);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (currentSection === 2) { // Slideshow section
        if (e.key === 'ArrowLeft') {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            goToSlide((currentSlide + 1) % totalSlides);
            resetAutoplay();
        }
    }
    
    if (e.key === 'Escape' && $('#messageModal').classList.contains('active')) {
        closeModal();
    }
});

// ===== ADD RIPPLE ANIMATION TO CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initWelcome();
    initCard();
    initSlideshow();
    initMessages();
    
    // Show welcome section
    showSection(0);
});

// ===== LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger load
                imageObserver.unobserve(img);
            }
        });
    });
    
    $$('.slide img').forEach(img => imageObserver.observe(img));
}
