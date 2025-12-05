// Track current video index
let currentVideoIndex = 0;
let videoItems = [];
const feedContainer = document.querySelector('.feed-container');
const progressFill = document.querySelector('.progress-fill');
let isScrolling = false;

// Track completed lessons
let completedLessons = new Set();
let totalLessons = 0;

// Load and render feed from localStorage
function loadAndRenderFeed() {
    const savedData = localStorage.getItem('feedData');
    let feedData = savedData ? JSON.parse(savedData) : null;
    
    // If no saved data, keep the existing HTML structure
    if (!feedData) {
        initializeExistingFeed();
        return;
    }
    
    // Count total video lessons
    totalLessons = feedData.filter(item => item.type === 'video').length;
    
    // Generate HTML for feed
    const feedHTML = feedData.map((item, index) => {
        if (item.type === 'intro') {
            return generateIntroScreen(item);
        } else if (item.type === 'video') {
            return generateVideoScreen(item);
        } else if (item.type === 'explanation') {
            return generateExplanationScreen(item);
        } else if (item.type === 'congratulations') {
            return generateCongratulationsScreen(item);
        }
        return '';
    }).join('');
    
    feedContainer.innerHTML = feedHTML;
    initializeExistingFeed();
}

// Generate intro screen HTML
function generateIntroScreen(item) {
    return `
        <div class="info-item intro-screen">
            <div class="info-content">
                <div class="lesson-badge">${item.badge || ''}</div>
                <h1>${item.title || ''}</h1>
                <p class="intro-description">${item.description || ''}</p>
                <div class="video-stats">
                    ${(item.stats || []).map(stat => `<span class="stat">${stat}</span>`).join('')}
                </div>
                <div class="what-you-need">
                    <h3>What You'll Need:</h3>
                    <ul>
                        ${(item.items || []).map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Generate video screen HTML
function generateVideoScreen(item) {
    return `
        <div class="video-item" data-lesson="${item.lessonNumber}">
            <div class="video-wrapper">
                <iframe 
                    class="video-player"
                    src="https://www.youtube.com/embed/${item.youtubeId}?enablejsapi=1&controls=1&modestbranding=1&rel=0"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
            <div class="action-buttons">
                <button class="action-btn completed-btn" data-lesson="${item.lessonNumber}">✓ Mark Complete</button>
            </div>
        </div>
    `;
}

// Generate explanation screen HTML
function generateExplanationScreen(item) {
    return `
        <div class="info-item explanation-screen">
            <div class="info-content">
                <h2>${item.title || ''}</h2>
                <p class="explanation-text">${item.description || ''}</p>
                <div class="tips-box">
                    <h3>Key Takeaways:</h3>
                    <ul>
                        ${(item.items || []).map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
                ${item.nextLesson ? `<p class="next-lesson">${item.nextLesson}</p>` : ''}
            </div>
        </div>
    `;
}

// Generate congratulations screen HTML
function generateCongratulationsScreen(item) {
    return `
        <div class="info-item congratulations-screen">
            <div class="info-content">
                <div class="congrats-icon">🎉</div>
                <h1>${item.title || ''}</h1>
                <p class="congrats-message">${item.message || ''}</p>
                <div class="achievement-box">
                    <h3>✨ What You've Accomplished:</h3>
                    <ul>
                        ${(item.achievements || []).map(a => `<li>${a}</li>`).join('')}
                    </ul>
                    <div class="total-time">
                        <strong>${item.totalTime || ''}</strong>
                    </div>
                </div>
                <p class="motivational-text">${item.motivationalText || ''}</p>
                <div class="action-buttons-center">
                    <a href="index.html" class="action-btn primary-btn">← Back to Home</a>
                    <button class="action-btn secondary-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">↻ Restart Course</button>
                </div>
            </div>
        </div>
    `;
}

// Initialize feed interactions
function initializeExistingFeed() {
    videoItems = document.querySelectorAll('.video-item');
    
    // Mark videos as loaded when iframe loads
    videoItems.forEach((item) => {
        const iframe = item.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', () => {
                item.classList.add('loaded');
            });
        }
        
        // Add click handlers to complete buttons
        const completeBtn = item.querySelector('.completed-btn');
        const lessonNumber = item.dataset.lesson;
        
        if (completeBtn && lessonNumber) {
            completeBtn.addEventListener('click', () => {
                if (completedLessons.has(lessonNumber)) {
                    completedLessons.delete(lessonNumber);
                    completeBtn.textContent = '✓ Mark Complete';
                    completeBtn.style.background = 'rgba(16, 185, 129, 0.95)';
                } else {
                    completedLessons.add(lessonNumber);
                    completeBtn.textContent = '✓ Completed!';
                    completeBtn.style.background = 'rgba(5, 150, 105, 1)';
                }
                updateProgress();
            });
        }
    });
    
    // If no total lessons set, count them
    if (totalLessons === 0) {
        totalLessons = videoItems.length;
    }
}

// Update progress bar
function updateProgress() {
    const progress = (completedLessons.size / totalLessons) * 100;
    progressFill.style.width = `${progress}%`;
}

// Load feed on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderFeed();
});

// Hide scroll indicator after first scroll
feedContainer.addEventListener('scroll', () => {
    feedContainer.classList.add('scrolled');
}, { once: true });

// Detect which video is in view and track analytics (optional)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(videoItems).indexOf(entry.target);
            currentVideoIndex = index;
            
            // Optional: Add analytics or auto-play logic here
            console.log(`Video ${index + 1} is now in view`);
        }
    });
}, observerOptions);

videoItems.forEach(item => {
    observer.observe(item);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && currentVideoIndex < videoItems.length - 1) {
        scrollToVideo(currentVideoIndex + 1);
    } else if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        scrollToVideo(currentVideoIndex - 1);
    }
});

function scrollToVideo(index) {
    videoItems[index].scrollIntoView({ behavior: 'smooth' });
}

// Prevent horizontal scrolling
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // If horizontal swipe is larger than vertical, prevent it
    if (Math.abs(diffX) > Math.abs(diffY)) {
        e.preventDefault();
    }
}, { passive: false });
