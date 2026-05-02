// ===== CONFETTI ANIMATION =====
function initConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
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

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initConfetti();
});
