class WhackAMoleGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.isGameActive = false;
        this.gameInterval = null;
        this.moleInterval = null;
        this.currentMole = null;
        this.difficulty = 'easy';
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.difficultySelect = document.getElementById('difficulty');
        this.gameBoard = document.getElementById('gameBoard');
        this.holes = document.querySelectorAll('.hole');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.finalScoreElement = document.getElementById('finalScore');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });

        this.holes.forEach(hole => {
            hole.addEventListener('click', () => this.hitMole(hole));
        });
    }

    getDifficultySettings() {
        const settings = {
            easy: { moleSpeed: 2000, moleLifetime: 1800 },
            medium: { moleSpeed: 1200, moleLifetime: 1000 },
            hard: { moleSpeed: 800, moleLifetime: 600 }
        };
        return settings[this.difficulty];
    }

    startGame() {
        if (this.isGameActive) return;
        
        this.isGameActive = true;
        this.score = 0;
        this.timeLeft = 30;
        this.updateDisplay();
        
        this.startBtn.textContent = 'Game Active...';
        this.startBtn.disabled = true;
        
        // Start game timer
        this.gameInterval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Start mole spawning
        this.spawnMole();
    }

    spawnMole() {
        if (!this.isGameActive) return;
        
        const { moleSpeed, moleLifetime } = this.getDifficultySettings();
        
        // Remove current mole
        if (this.currentMole) {
            this.currentMole.classList.remove('mole');
        }
        
        // Spawn new mole
        const randomHole = Math.floor(Math.random() * this.holes.length);
        this.currentMole = this.holes[randomHole];
        this.currentMole.classList.add('mole');
        
        // Remove mole after lifetime
        setTimeout(() => {
            if (this.currentMole && this.currentMole.classList.contains('mole')) {
                this.currentMole.classList.remove('mole');
            }
        }, moleLifetime);
        
        // Schedule next mole
        this.moleInterval = setTimeout(() => {
            this.spawnMole();
        }, moleSpeed);
    }

    hitMole(hole) {
        if (!this.isGameActive || !hole.classList.contains('mole')) return;
        
        hole.classList.remove('mole');
        hole.classList.add('hit');
        
        // Remove hit animation after it completes
        setTimeout(() => {
            hole.classList.remove('hit');
        }, 400);
        
        this.score += 10;
        this.updateDisplay();
        
        // Clear current mole
        this.currentMole = null;
    }

    endGame() {
        this.isGameActive = false;
        clearInterval(this.gameInterval);
        clearTimeout(this.moleInterval);
        
        // Remove any active moles
        this.holes.forEach(hole => {
            hole.classList.remove('mole', 'hit');
        });
        
        this.startBtn.textContent = 'Start Game';
        this.startBtn.disabled = false;
        
        // Show game over modal
        this.showGameOverModal();
    }

    showGameOverModal() {
        this.finalScoreElement.textContent = this.score;
        this.gameOverModal.classList.add('show');
    }

    resetGame() {
        this.isGameActive = false;
        clearInterval(this.gameInterval);
        clearTimeout(this.moleInterval);
        
        this.score = 0;
        this.timeLeft = 30;
        this.currentMole = null;
        
        this.holes.forEach(hole => {
            hole.classList.remove('mole', 'hit');
        });
        
        this.startBtn.textContent = 'Start Game';
        this.startBtn.disabled = false;
        this.updateDisplay();
        
        this.gameOverModal.classList.remove('show');
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.timeElement.textContent = `${this.timeLeft}s`;
    }
}

function closeModal() {
    document.getElementById('gameOverModal').classList.remove('show');
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WhackAMoleGame();
});