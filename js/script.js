// --- INTRO OVERLAY & LOADING SIMULATION ---
document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('introOverlay');
    const introProgressBar = document.getElementById('introProgressBar');
    const introProgressText = document.getElementById('introProgressText');
    const introProgressBg = document.getElementById('introProgressBg');
    const introEnterBtn = document.getElementById('introEnterBtn');

    if (introOverlay && introProgressBar && introEnterBtn) {
        let progress = 0;
        const interval = setInterval(() => {
            // Simulate loading progress
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                // Hide progress bar & display start button
                setTimeout(() => {
                    if (introProgressBg) introProgressBg.style.display = 'none';
                    introEnterBtn.style.display = 'inline-flex';
                }, 300);
            }
            introProgressBar.style.width = `${progress}%`;
            introProgressText.innerText = `Loading ${progress}%`;
        }, 120);

        // Enter Button Event Handler
        introEnterBtn.addEventListener('click', () => {
            // Fade out overlay
            introOverlay.classList.add('fade-out');

            // Remove overlay from DOM after animation completes
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 1000);

            // Play background music if paused
            if (!isPlaying) {
                toggleMusic();
            }
        });
    }
});

// --- MUSIC PLAYER CONTROL ---
const bgAudio = document.getElementById('bgAudio');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgAudio.pause();
        musicIcon.className = 'bi bi-disc';
        musicText.innerText = 'Putar Musik';
        musicBtn.style.borderColor = 'rgba(217, 56, 86, 0.2)';
    } else {
        bgAudio.play().then(() => {
            musicIcon.className = 'bi bi-disc-fill spin';
            musicText.innerText = 'Musik Depan';
            musicBtn.style.borderColor = 'rgba(217, 56, 86, 0.8)';
        }).catch(e => {
            console.log("Audio play error:", e);
        });
    }
    isPlaying = !isPlaying;
}

// --- TREE CANVAS ANIMATION ---
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let hearts = [];
let fallingHearts = [];

function resizeCanvas() {
    if (!canvas) return;
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
    initTree();
}

// Color palette for tree heart leaves
const colors = [
    '#f43f5e', '#ec4899', '#d93856', '#e11d48',
    '#fb7185', '#f472b6', '#fbbf24', '#f59e0b',
    '#e15b7f', '#ff85a1', '#ffb3c6', '#fcbf49'
];

function drawHeart(ctx, x, y, size, color, angle = 0, opacity = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();

    // Draw smooth heart path
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);

    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function initTree() {
    hearts = [];
    // Determine center coordinates of heart tree canopy
    const isMobile = width < 768;
    const centerX = isMobile ? width * 0.5 : width * 0.68;
    const centerY = isMobile ? height * 0.35 : height * 0.38;
    const scale = isMobile ? Math.min(width, height) * 0.22 : Math.min(width, height) * 0.32;

    // Generate heart leaves forming a big heart shape canopy
    const totalHearts = isMobile ? 550 : 900;
    for (let i = 0; i < totalHearts; i++) {
        // Heart polar formula for leaf distribution
        let t = Math.random() * Math.PI * 2;
        // Rejection sampling for uniform density inside heart
        let r = Math.sqrt(Math.random());

        // Heart parametric equation
        let hx = 16 * Math.pow(Math.sin(t), 3);
        let hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

        let leafX = centerX + (hx / 16) * scale * r + (Math.random() - 0.5) * 15;
        let leafY = centerY + (hy / 16) * scale * r + (Math.random() - 0.5) * 15;

        let size = Math.random() * (isMobile ? 12 : 16) + 8;
        let color = colors[Math.floor(Math.random() * colors.length)];
        let angle = (Math.random() - 0.5) * 0.8;
        let swaySpeed = 0.001 + Math.random() * 0.002;
        let swayOffset = Math.random() * Math.PI * 2;

        hearts.push({
            x: leafX,
            y: leafY,
            baseX: leafX,
            baseY: leafY,
            size: size,
            color: color,
            angle: angle,
            swaySpeed: swaySpeed,
            swayOffset: swayOffset
        });
    }
}

// Draw Tree Trunk and Branches
function drawTrunk() {
    const isMobile = width < 768;
    const trunkBaseX = isMobile ? width * 0.5 : width * 0.68;
    const trunkBaseY = height;
    const trunkTopX = trunkBaseX;
    const trunkTopY = isMobile ? height * 0.38 : height * 0.42;

    ctx.save();
    ctx.strokeStyle = '#522323';
    ctx.fillStyle = '#522323';
    ctx.lineCap = 'round';

    // Main Trunk
    ctx.beginPath();
    ctx.moveTo(trunkBaseX - 18, trunkBaseY);
    ctx.quadraticCurveTo(trunkBaseX - 5, (trunkBaseY + trunkTopY) / 2, trunkTopX - 6, trunkTopY);
    ctx.lineTo(trunkTopX + 6, trunkTopY);
    ctx.quadraticCurveTo(trunkBaseX + 5, (trunkBaseY + trunkTopY) / 2, trunkBaseX + 18, trunkBaseY);
    ctx.closePath();
    ctx.fill();

    // Main Branch splits
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(trunkTopX, trunkTopY + 20);
    ctx.quadraticCurveTo(trunkTopX - 40, trunkTopY - 40, trunkTopX - 80, trunkTopY - 70);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(trunkTopX, trunkTopY + 20);
    ctx.quadraticCurveTo(trunkTopX + 40, trunkTopY - 40, trunkTopX + 80, trunkTopY - 70);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(trunkTopX, trunkTopY + 10);
    ctx.quadraticCurveTo(trunkTopX - 10, trunkTopY - 50, trunkTopX - 30, trunkTopY - 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(trunkTopX, trunkTopY + 10);
    ctx.quadraticCurveTo(trunkTopX + 10, trunkTopY - 50, trunkTopX + 30, trunkTopY - 90);
    ctx.stroke();

    ctx.restore();
}

let time = 0;
function animate() {
    ctx.clearRect(0, 0, width, height);
    time++;

    // 1. Draw Trunk
    drawTrunk();

    // 2. Draw Heart Canopy Leaves
    for (let i = 0; i < hearts.length; i++) {
        let h = hearts[i];
        let sway = Math.sin(time * h.swaySpeed * 10 + h.swayOffset) * 3;
        drawHeart(ctx, h.baseX + sway, h.baseY + sway * 0.5, h.size, h.color, h.angle + sway * 0.02);
    }

    // 3. Spawn and Draw Falling Heart Petals
    if (Math.random() < 0.25) {
        const isMobile = width < 768;
        const centerX = isMobile ? width * 0.5 : width * 0.68;
        const centerY = isMobile ? height * 0.35 : height * 0.38;
        fallingHearts.push({
            x: centerX + (Math.random() - 0.5) * (isMobile ? 180 : 320),
            y: centerY + (Math.random() - 0.5) * 100,
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 1.5 + 0.8,
            speedX: (Math.random() - 0.5) * 1,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.05,
            opacity: 1
        });
    }

    for (let i = fallingHearts.length - 1; i >= 0; i--) {
        let fh = fallingHearts[i];
        fh.y += fh.speedY;
        fh.x += fh.speedX + Math.sin(time * 0.05 + i) * 0.5;
        fh.rotation += fh.rotSpeed;
        if (fh.y > height - 50) {
            fh.opacity -= 0.02;
        }

        if (fh.opacity <= 0 || fh.y > height) {
            fallingHearts.splice(i, 1);
        } else {
            drawHeart(ctx, fh.x, fh.y, fh.size, fh.color, fh.rotation, fh.opacity);
        }
    }

    requestAnimationFrame(animate);
}

// Initializer
window.addEventListener('resize', resizeCanvas);
if (canvas) {
    resizeCanvas();
    animate();
}

// --- SURPRISE / CONFETTI EFFECT ---
function triggerSurprise() {
    // Burst 80 falling hearts from top
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            fallingHearts.push({
                x: Math.random() * width,
                y: -20,
                size: Math.random() * 14 + 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 2,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.08,
                opacity: 1
            });
        }, i * 30);
    }

    // Auto play music if paused
    if (!isPlaying) {
        toggleMusic();
    }
}
