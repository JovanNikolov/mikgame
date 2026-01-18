// Main Game Controller - Orchestrates game flow

(function() {
    'use strict';

    let currentEmail = null;

    // Initialize game
    function init() {
        console.log('Phishing Inspector - Initializing...');

        // Initialize UI
        UIController.init();

        // Set up event listeners
        setupEventListeners();

        // Show start screen
        const elements = UIController.getElements();
        UIController.showScreen(elements.startScreen);

        console.log('Game initialized successfully!');
    }

    // Set up all event listeners
    function setupEventListeners() {
        const elements = UIController.getElements();

        // Start game
        elements.btnStartGame.addEventListener('click', startGame);

        // Decision buttons
        elements.btnApprove.addEventListener('click', () => handleDecision('approve'));
        elements.btnReject.addEventListener('click', () => handleDecision('reject'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (GameState.getGameStatus() !== 'playing') return;

            if (e.key === 'a' || e.key === 'A') {
                if (!elements.btnApprove.disabled) {
                    handleDecision('approve');
                }
            } else if (e.key === 'r' || e.key === 'R') {
                if (!elements.btnReject.disabled) {
                    handleDecision('reject');
                }
            }
        });

        // Continue after feedback
        elements.btnContinue.addEventListener('click', () => {
            UIController.hideFeedback();
            checkGameStatus();
        });

        // Next level
        elements.btnNextLevel.addEventListener('click', () => {
            LevelManager.advanceToNextLevel();
            startLevel();
        });

        // Retry
        elements.btnRetry.addEventListener('click', () => {
            GameState.resetGame();
            startGame();
        });

        // Play again
        elements.btnPlayAgain.addEventListener('click', () => {
            GameState.resetGame();
            startGame();
        });
    }

    // Start game
    function startGame() {
        console.log('Starting new game...');

        // Reset game state
        GameState.startNewGame();

        // Start level 1
        startLevel();
    }

    // Start a level
    function startLevel() {
        const levelNum = GameState.getCurrentLevel();
        console.log(`Starting level ${levelNum}...`);

        // Initialize level
        const success = LevelManager.initializeLevel(levelNum);

        if (!success) {
            console.error('Failed to initialize level');
            return;
        }

        // Show game screen
        const elements = UIController.getElements();
        UIController.showScreen(elements.gameScreen);

        // Update UI
        UIController.updateGameStats();

        // Load first email
        loadNextEmail();
    }

    // Load next email
    function loadNextEmail() {
        const email = LevelManager.getNextEmail();

        if (!email) {
            console.error('No more emails available');
            return;
        }

        currentEmail = email;
        GameState.setCurrentEmail(email);

        // Render email
        UIController.renderEmail(email);

        console.log('Email loaded:', email.id, '(Phishing:', email.isPhishing + ')');
    }

    // Handle player decision
    function handleDecision(decision) {
        if (!currentEmail) {
            console.error('No current email');
            return;
        }

        console.log(`Player decision: ${decision}`);

        // Disable buttons during processing
        const elements = UIController.getElements();
        elements.btnApprove.disabled = true;
        elements.btnReject.disabled = true;

        // Evaluate decision
        const result = PhishingRules.evaluateDecision(currentEmail, decision);

        // Update game state
        GameState.recordDecision(result.correct);
        GameState.incrementEmailsInspected();

        // Award points or add strike
        if (result.correct) {
            const levelConfig = LevelManager.getCurrentLevelConfig();
            const points = levelConfig.scorePerCorrect || 50;
            GameState.addScore(points);
        } else {
            GameState.addStrike();
        }

        // Show feedback
        UIController.showFeedback(result, result.explanation, currentEmail.phishingIndicators);

        console.log('Result:', result.correct ? 'Correct' : 'Incorrect');
        console.log('Score:', GameState.getScore(), 'Strikes:', GameState.getStrikes());
    }

    // Check game status after feedback
    function checkGameStatus() {
        const status = GameState.getGameStatus();

        if (status === 'gameOver') {
            // Game over - too many strikes
            UIController.showGameOver('Премногу неточни одлуки! Направивте 3 грешки.');
            return;
        }

        if (status === 'levelComplete') {
            // Level complete
            handleLevelComplete();
            return;
        }

        if (status === 'victory') {
            // Victory - all levels complete
            UIController.showVictory();
            return;
        }

        // Continue with next email
        if (LevelManager.hasMoreEmails()) {
            loadNextEmail();
        } else {
            // No more emails, level complete
            handleLevelComplete();
        }
    }

    // Handle level completion
    function handleLevelComplete() {
        const summary = LevelManager.getLevelSummary();

        console.log('Level Complete:', summary);

        if (summary.passed) {
            // Passed the level
            UIController.showLevelComplete(summary);

            // Check if it was the last level
            if (isLastLevel(GameState.getCurrentLevel())) {
                setTimeout(() => {
                    UIController.showVictory();
                }, 100);
            }
        } else {
            // Failed the level
            UIController.showGameOver(`Не го достигнавте потребниот резултат за Ниво ${summary.level}. Беа ви потребни ${LevelManager.getCurrentLevelConfig().passingScore} точни одлуки.`);
        }
    }

    // Start the game when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
