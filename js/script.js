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

// --- TREE CANVAS ANIMATION & GROWING CONTROLLER ---
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let hearts = [];
let fallingHearts = [];

// Animation Progress State
// growthProgress: 0.0 -> 1.0 (0=invisible, 0.3=trunk growing, 0.6=branches, 1.0=leaves full bloom)
let isGrowing = false;
let growthProgress = 0;

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
    const isMobile = width < 768;
    const centerX = isMobile ? width * 0.5 : width * 0.68;
    const centerY = isMobile ? height * 0.35 : height * 0.38;
    const scale = isMobile ? Math.min(width, height) * 0.22 : Math.min(width, height) * 0.32;

    const totalHearts = isMobile ? 550 : 900;
    for (let i = 0; i < totalHearts; i++) {
        let t = Math.random() * Math.PI * 2;
        let r = Math.sqrt(Math.random());

        let hx = 16 * Math.pow(Math.sin(t), 3);
        let hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

        let leafX = centerX + (hx / 16) * scale * r + (Math.random() - 0.5) * 15;
        let leafY = centerY + (hy / 16) * scale * r + (Math.random() - 0.5) * 15;

        let size = Math.random() * (isMobile ? 12 : 16) + 8;
        let color = colors[Math.floor(Math.random() * colors.length)];
        let angle = (Math.random() - 0.5) * 0.8;
        let swaySpeed = 0.001 + Math.random() * 0.002;
        let swayOffset = Math.random() * Math.PI * 2;

        // Leaf bloom delay offset based on distance from trunk split
        let bloomThreshold = 0.3 + (Math.random() * 0.65);

        hearts.push({
            x: leafX,
            y: leafY,
            baseX: leafX,
            baseY: leafY,
            size: size,
            color: color,
            angle: angle,
            swaySpeed: swaySpeed,
            swayOffset: swayOffset,
            bloomThreshold: bloomThreshold
        });
    }
}

// Draw Growing Tree Trunk and Branches
function drawTrunk(progress) {
    if (progress <= 0) return;

    const isMobile = width < 768;
    const trunkBaseX = isMobile ? width * 0.5 : width * 0.68;
    const trunkBaseY = height;
    const trunkTopX = trunkBaseX;
    const fullTrunkTopY = isMobile ? height * 0.38 : height * 0.42;

    // Progress for trunk growth (0 to 0.4)
    const trunkProgress = Math.min(1, progress / 0.4);
    const currentTrunkTopY = trunkBaseY - (trunkBaseY - fullTrunkTopY) * trunkProgress;

    ctx.save();
    ctx.strokeStyle = '#522323';
    ctx.fillStyle = '#522323';
    ctx.lineCap = 'round';

    // Main Trunk
    ctx.beginPath();
    ctx.moveTo(trunkBaseX - 18 * trunkProgress, trunkBaseY);
    ctx.quadraticCurveTo(
        trunkBaseX - 5,
        (trunkBaseY + currentTrunkTopY) / 2,
        trunkTopX - 6 * trunkProgress,
        currentTrunkTopY
    );
    ctx.lineTo(trunkTopX + 6 * trunkProgress, currentTrunkTopY);
    ctx.quadraticCurveTo(
        trunkBaseX + 5,
        (trunkBaseY + currentTrunkTopY) / 2,
        trunkBaseX + 18 * trunkProgress,
        trunkBaseY
    );
    ctx.closePath();
    ctx.fill();

    // Branch splits progress (0.3 to 0.7)
    if (progress > 0.3) {
        const branchProgress = Math.min(1, (progress - 0.3) / 0.4);
        ctx.lineWidth = 10 * branchProgress;

        // Left main branch
        ctx.beginPath();
        ctx.moveTo(trunkTopX, currentTrunkTopY + 20);
        ctx.quadraticCurveTo(
            trunkTopX - 40 * branchProgress,
            currentTrunkTopY - 40 * branchProgress,
            trunkTopX - 80 * branchProgress,
            currentTrunkTopY - 70 * branchProgress
        );
        ctx.stroke();

        // Right main branch
        ctx.beginPath();
        ctx.moveTo(trunkTopX, currentTrunkTopY + 20);
        ctx.quadraticCurveTo(
            trunkTopX + 40 * branchProgress,
            currentTrunkTopY - 40 * branchProgress,
            trunkTopX + 80 * branchProgress,
            currentTrunkTopY - 70 * branchProgress
        );
        ctx.stroke();

        // Sub branches
        ctx.beginPath();
        ctx.moveTo(trunkTopX, currentTrunkTopY + 10);
        ctx.quadraticCurveTo(
            trunkTopX - 10 * branchProgress,
            currentTrunkTopY - 50 * branchProgress,
            trunkTopX - 30 * branchProgress,
            currentTrunkTopY - 90 * branchProgress
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(trunkTopX, currentTrunkTopY + 10);
        ctx.quadraticCurveTo(
            trunkTopX + 10 * branchProgress,
            currentTrunkTopY - 50 * branchProgress,
            trunkTopX + 30 * branchProgress,
            currentTrunkTopY - 90 * branchProgress
        );
        ctx.stroke();
    }

    ctx.restore();
}

let time = 0;
function animate() {
    ctx.clearRect(0, 0, width, height);
    time++;

    if (isGrowing && growthProgress < 1) {
        growthProgress += 0.006; // Tree growth speed
        if (growthProgress >= 1) {
            growthProgress = 1;
            // Reveal Hero Greeting Card when tree full bloom
            const heroCard = document.getElementById('heroCardContainer');
            if (heroCard) {
                heroCard.style.opacity = '1';
                heroCard.style.transform = 'translateY(-50%) scale(1)';
            }
        }
    }

    // 1. Draw Trunk & Branches
    drawTrunk(growthProgress);

    // 2. Draw Heart Canopy Leaves if bloom started
    if (growthProgress > 0.25) {
        for (let i = 0; i < hearts.length; i++) {
            let h = hearts[i];
            if (growthProgress >= h.bloomThreshold) {
                // Leaf scale factor from 0 to 1 as it blooms
                let leafScale = Math.min(1, (growthProgress - h.bloomThreshold) / 0.25);
                let sway = Math.sin(time * h.swaySpeed * 10 + h.swayOffset) * 3;
                drawHeart(
                    ctx,
                    h.baseX + sway,
                    h.baseY + sway * 0.5,
                    h.size * leafScale,
                    h.color,
                    h.angle + sway * 0.02,
                    leafScale
                );
            }
        }
    }

    // 3. Spawn and Draw Falling Heart Petals when fully grown
    if (growthProgress >= 0.8 && Math.random() < 0.25) {
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

// START INTRO ANIMATION & TREE GROWTH SEQUENCE
function startTreeGrowth() {
    const overlay = document.getElementById('introOverlay');
    if (overlay) {
        overlay.classList.add('fade-out');
    }

    // Start background music automatically on user interaction
    if (!isPlaying) {
        toggleMusic();
    }

    // Start progressive tree growth sequence
    isGrowing = true;
}

// Initializer
window.addEventListener('resize', resizeCanvas);
if (canvas) {
    resizeCanvas();
    animate();
}

// --- SURPRISE / CONFETTI EFFECT ---
function triggerSurprise() {
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

    if (!isPlaying) {
        toggleMusic();
    }
}
