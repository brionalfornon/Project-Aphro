// --- SETUP VARIABLES ---
const texts = [
    document.getElementById('text1'), document.getElementById('text2'),
    document.getElementById('text3'), document.getElementById('text4')
];
const introContainer = document.getElementById('intro-container');
const questionContainer = document.getElementById('question-container');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const subtext = document.getElementById('subtext');

// Variables for the gallery & finale
const bigHeart = document.getElementById('bigHeart');
const scrollWrapper = document.getElementById('scroll-wrapper');
const imageTrack = document.getElementById('image-track');
const tbcText = document.getElementById('tbc-text');
const darkOverlay = document.getElementById('dark-overlay');
const bgMusic = document.getElementById('bg-music'); 

let hoverCount = 0; const maxHovers = 20;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- FLOATING HEARTS BACKGROUND LOGIC ---
const heartContainer = document.createElement('div');
heartContainer.id = 'heart-background';
document.body.prepend(heartContainer);
const heartColors = ['#ffb7ce', '#ff9eaa', '#ff7fac', '#ff4d6d', '#ff0a54', '#fce4ec', '#f06292'];

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];
    const isOutlined = Math.random() > 0.7; 
    let svgContent = isOutlined 
        ? `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="${randomColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
        : `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="${randomColor}" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    
    heart.innerHTML = svgContent;
    const svgElement = heart.querySelector('svg');
    svgElement.style.transform = `scale(${(Math.random() * 0.4) + 0.8}, ${(Math.random() * 0.4) + 0.8})`;
    heart.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 30 + 15 + 'px';
    heart.style.width = size; heart.style.height = size;
    heart.style.animationDuration = Math.random() * 7 + 8 + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.3; 
    heartContainer.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 15000);
}
setInterval(createHeart, 300);

// --- INTRO SEQUENCE LOGIC ---
async function runIntro() {
    for (let i = 0; i < texts.length; i++) {
        texts[i].classList.add('visible'); await sleep(2500);                 
        texts[i].classList.remove('visible'); await sleep(1500);                 
    }
    introContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    questionContainer.classList.add('fade-in-scene');
}
window.onload = runIntro;

// --- RUNAWAY BUTTON LOGIC ---
function showFinalScreen() {
    bgMusic.play();

    questionContainer.classList.add('hidden');
    scrollWrapper.classList.remove('hidden');
    scrollWrapper.classList.add('fade-in-scene');
}

function makeButtonRunAway(e) {
    if (e && e.type === 'touchstart') e.preventDefault(); 

    if (hoverCount === 0) {
        const rect = noBtn.getBoundingClientRect();
        noBtn.style.left = rect.left + 'px'; noBtn.style.top = rect.top + 'px';
        noBtn.style.position = 'fixed'; noBtn.style.margin = '0'; noBtn.offsetHeight; 
    }

    if (hoverCount < maxHovers) {
        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;
        noBtn.style.left = Math.max(10, Math.floor(Math.random() * maxX)) + 'px';
        noBtn.style.top = Math.max(10, Math.floor(Math.random() * maxY)) + 'px';
        hoverCount++;
    } else if (hoverCount === maxHovers) {
        const yesRect = yesBtn.getBoundingClientRect();
        noBtn.style.left = (yesRect.right + 20) + 'px';
        noBtn.style.top = yesRect.top + 'px';
        noBtn.innerText = 'Yes'; subtext.style.display = 'block'; hoverCount++; 
        setTimeout(() => { noBtn.style.position = 'static'; }, 400);
        noBtn.addEventListener('click', showFinalScreen);
        noBtn.addEventListener('touchstart', showFinalScreen);
    }
}
noBtn.addEventListener('mouseenter', makeButtonRunAway);
noBtn.addEventListener('touchstart', makeButtonRunAway, { passive: false });
yesBtn.addEventListener('click', showFinalScreen);

// --- FINALE: IMAGE GALLERY & FADE OUT LOGIC ---
function triggerGallery() {
    darkOverlay.style.opacity = '1';

    for (let i = 1; i <= 14; i++) {
        const img = document.createElement('img');
        img.src = `images/${i}.jpg`; 
        img.alt = `Memory ${i}`;
        img.classList.add('gallery-image');
        imageTrack.appendChild(img);
    }

    scrollWrapper.classList.add('scroll-active');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.getElementById('image-track').style.opacity = '0';
                document.getElementById('final-container').style.opacity = '0';

                // Fade everything to black
                setTimeout(() => {
                    document.getElementById('scroll-wrapper').style.opacity = '0'; 
                    document.getElementById('heart-background').style.opacity = '0'; 
                    document.getElementById('dark-overlay').style.opacity = '0'; 
                    document.body.style.backgroundColor = '#000000';

                    // NEW: Wait 3 seconds for the screen to turn fully black, then fade in the final text
                    setTimeout(() => {
                        const finalScreen = document.getElementById('absolute-final-screen');
                        finalScreen.classList.remove('hidden');
                        
                        // A tiny delay ensures the browser registers the element before fading it in
                        setTimeout(() => {
                            finalScreen.style.opacity = '1';
                        }, 50);
                    }, 3000); 

                }, 4000);
                
                observer.disconnect(); 
            }
        });
    }, { rootMargin: "-40% 0px -40% 0px" });

    observer.observe(tbcText);
}

// --- CLICK REACTION FOR THE HEART ---
function handleHeartClick(e) {
    if (e) e.preventDefault();
    
    bigHeart.removeEventListener('click', handleHeartClick);
    bigHeart.removeEventListener('touchstart', handleHeartClick);

    bigHeart.classList.add('heart-clicked');

    const rect = bigHeart.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const burst = document.createElement('div');
        burst.classList.add('burst-heart');
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 60; 
        const tx = Math.cos(angle) * distance + 'px';
        const ty = Math.sin(angle) * distance + 'px';
        
        burst.style.setProperty('--tx', tx);
        burst.style.setProperty('--ty', ty);
        
        burst.style.left = centerX + 'px';
        burst.style.top = centerY + 'px';
        
        document.body.appendChild(burst);
        
        setTimeout(() => burst.remove(), 800);
    }

    setTimeout(() => {
        triggerGallery();
    }, 600);
}

bigHeart.addEventListener('click', handleHeartClick);
bigHeart.addEventListener('touchstart', handleHeartClick, { passive: false });