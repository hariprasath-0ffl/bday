// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== TEAM MESSAGES =====
function initMessages() {
    const contactCards = $$('.contact-card');
    const modal = $('#messageModal');
    const closeModalBtn = $('#closeModal');
    
    contactCards.forEach((card) => {
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
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
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

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initMessages();
});
