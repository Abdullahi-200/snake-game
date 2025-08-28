// Game variables
const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

// Get the new button and arrow elements
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const endBtn = document.getElementById('end-btn');
const upArrow = document.getElementById('up-arrow');
const downArrow = document.getElementById('down-arrow');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }]; // Initial snake position
let food = {};
let direction = 'right';
let score = 0;
let isGameOver = true; // Set to true initially so the game doesn't start on load
let isPaused = false;
let gameInterval;
const gameSpeed = 200; // milliseconds

// --- Game Initialization ---
function createGrid() {
    // Clear any existing grid before creating a new one
    board.innerHTML = ''; 
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
    }
}

function generateFood() {
    // Generate food at a new, random position
    do {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (checkCollision(food, true)); // Ensure food doesn't spawn on the snake
}

// --- Game Logic ---
function draw() {
    // Clear the board of all snake/food classes
    const cells = board.querySelectorAll('.cell');
    cells.forEach(cell => cell.className = 'cell');

    // Draw the snake by adding the 'snake' class to the correct cells
    snake.forEach(segment => {
        const cell = cells[segment.y * gridSize + segment.x];
        cell.classList.add('snake');
    });

    // Draw the food
    const foodCell = cells[food.y * gridSize + food.x];
    foodCell.classList.add('food');
}

function update() {
    if (isGameOver || isPaused) return; // Stop the game loop if game is over or paused

    // Move the snake by creating a new head based on the current direction
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Check for collisions (with walls or its own body)
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || checkCollision(head)) {
        endGame();
        return;
    }

    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        generateFood(); // Generate new food
    } else {
        snake.pop(); // Remove the last segment if no food is eaten
    }

    // Redraw the entire board
    draw();
}

function checkCollision(target, isFoodCheck = false) {
    // Check if the target coordinates collide with the snake's body
    return snake.some((segment, index) => {
        // If it's a food check, we check all segments.
        // If it's a self-collision check, we ignore the head (index 0).
        if (!isFoodCheck && index === 0) {
            return false;
        }
        return segment.x === target.x && segment.y === target.y;
    });
}

function startGame() {
    if (!isGameOver) return; // Prevent starting a game that's already running
    
    // Reset game state
    isGameOver = false;
    isPaused = false;
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    snake = [{ x: 10, y: 10 }];
    direction = 'right';

    createGrid();
    generateFood();
    draw();

    // Start the game loop
    gameInterval = setInterval(update, gameSpeed);
    pauseBtn.textContent = 'Pause';
}

function pauseGame() {
    if (isGameOver) return; // Cannot pause if the game is over

    if (isPaused) {
        // Resume the game
        isPaused = false;
        gameInterval = setInterval(update, gameSpeed);
        pauseBtn.textContent = 'Pause';
    } else {
        // Pause the game
        isPaused = true;
        clearInterval(gameInterval);
        pauseBtn.textContent = 'Resume';
    }
}

function endGame() {
    isGameOver = true;
    isPaused = true;
    clearInterval(gameInterval);
    // You can use a modal or a div to display a message instead of alert()
    alert('Game Over! Your final score is ' + score);
}

// --- Event Listeners ---
// Keyboard controls
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Button controls
if (startBtn) startBtn.addEventListener('click', startGame);
if (pauseBtn) pauseBtn.addEventListener('click', pauseGame);
if (endBtn) endBtn.addEventListener('click', endGame);

// Clickable arrow controls
if (upArrow) upArrow.addEventListener('click', () => { if (direction !== 'down') direction = 'up'; });
if (downArrow) downArrow.addEventListener('click', () => { if (direction !== 'up') direction = 'down'; });
if (leftArrow) leftArrow.addEventListener('click', () => { if (direction !== 'right') direction = 'left'; });
if (rightArrow) rightArrow.addEventListener('click', () => { if (direction !== 'left') direction = 'right'; });

// Start the game initially on page load
// You might want to remove this and just rely on the Start button
createGrid();
