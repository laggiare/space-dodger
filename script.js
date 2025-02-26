console.log("Game loaded");

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart');

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;
console.log("Canvas size:", canvas.width, canvas.height);

let gameRunning = false;
let score = 0;
let ship = { x: canvas.width / 2, y: canvas.height - 40, width: 30, height: 20, speed: 5 };
let asteroids = [];
let lastTime = 0;
let moveX = null;

canvas.addEventListener('touchstart', startMove);
canvas.addEventListener('touchmove', updateMove);
canvas.addEventListener('touchend', stopMove);
canvas.addEventListener('mousedown', startMove);
canvas.addEventListener('mousemove', updateMove);
canvas.addEventListener('mouseup', stopMove);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') ship.x -= ship.speed;
    if (e.key === 'ArrowRight') ship.x += ship.speed;
    keepShipInBounds();
});

startScreen.addEventListener('click', (e) => {
    console.log("Start screen clicked at:", e.clientX, e.clientY);
    startGame();
});
restartBtn.addEventListener('click', startGame);

function startMove(e) {
    e.preventDefault();
    moveX = (e.touches ? e.touches[0].clientX : e.clientX) - canvas.offsetLeft;
}

function updateMove(e) {
    e.preventDefault();
    if (moveX !== null) {
        const newX = (e.touches ? e.touches[0].clientX : e.clientX) - canvas.offsetLeft;
        ship.x += (newX - moveX);
        moveX = newX;
        keepShipInBounds();
    }
}

function stopMove() {
    moveX = null;
}

function keepShipInBounds() {
    if (ship.x < 0) ship.x = 0;
    if (ship.x + ship.width > canvas.width) ship.x = canvas.width - ship.width;
}

function spawnAsteroid() {
    const size = 20 + Math.random() * 20;
    asteroids.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        size: size,
        speed: 2 + Math.random() * 2
    });
}

function update(time) { // 'time' is now passed by requestAnimationFrame
    if (!gameRunning) return;
    console.log("Updating...", asteroids.length);

    const delta = time - lastTime;
    lastTime = time;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y);
    ctx.lineTo(ship.x + ship.width / 2, ship.y - ship.height);
    ctx.lineTo(ship.x + ship.width, ship.y);
    ctx.closePath();
    ctx.fill();

    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(asteroid.x + asteroid.size / 2, asteroid.y + asteroid.size / 2, asteroid.size / 2, 0, Math.PI * 2);
        ctx.fill();

        if (
            ship.x < asteroid.x + asteroid.size &&
            ship.x + ship.width > asteroid.x &&
            ship.y - ship.height < asteroid.y + asteroid.size &&
            ship.y > asteroid.y
        ) {
            endGame();
            return;
        }

        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
            score += 5;
        }
    });

    score += delta / 1000;
    scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
    if (Math.random() < 0.02) spawnAsteroid();

    requestAnimationFrame(update); // Switch back to requestAnimationFrame
}

function startGame() {
    console.log("Game starting - gameRunning:", gameRunning);
    if (gameRunning) return;
    gameRunning = true;
    score = 0;
    asteroids = [];
    ship.x = canvas.width / 2;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    console.log("Starting animation loop");
    lastTime = performance.now();
    requestAnimationFrame(update); // Start with requestAnimationFrame
}

function endGame() {
    gameRunning = false;
    finalScore.textContent = `Score: ${Math.floor(score)}`;
    gameOverScreen.style.display = 'flex';
}

startScreen.style.display = 'flex';