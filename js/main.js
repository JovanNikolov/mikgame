(function() {
    'use strict';

    let currentEmail = null;

    function init() {
        console.log('Phishing Inspector - Initializing...');

        UIController.init();

        setupEventListeners();

        const elements = UIController.getElements();
        UIController.showScreen(elements.startScreen);

        console.log('Game initialized successfully!');
    }

    function setupEventListeners() {
        const elements = UIController.getElements();

        elements.btnStartGame.addEventListener('click', startGame);

        elements.btnApprove.addEventListener('click', () => handleDecision('approve'));
        elements.btnReject.addEventListener('click', () => handleDecision('reject'));

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

        elements.btnContinue.addEventListener('click', () => {
            UIController.hideFeedback();
            checkGameStatus();
        });

        elements.btnNextLevel.addEventListener('click', () => {
            LevelManager.advanceToNextLevel();
            startLevel();
        });

        elements.btnRetry.addEventListener('click', () => {
            GameState.resetGame();
            startGame();
        });

        elements.btnPlayAgain.addEventListener('click', () => {
            GameState.resetGame();
            startGame();
        });
    }

    function startGame() {
        console.log('Starting new game...');

        GameState.startNewGame();

        startLevel();
    }

    function startLevel() {
        const levelNum = GameState.getCurrentLevel();
        console.log(`Starting level ${levelNum}...`);

        const success = LevelManager.initializeLevel(levelNum);

        if (!success) {
            console.error('Failed to initialize level');
            return;
        }

        const elements = UIController.getElements();
        UIController.showScreen(elements.gameScreen);

        UIController.updateGameStats();

        loadNextEmail();
    }

    function loadNextEmail() {
        const email = LevelManager.getNextEmail();

        if (!email) {
            console.error('No more emails available');
            return;
        }

        currentEmail = email;
        GameState.setCurrentEmail(email);

        UIController.renderEmail(email);

        console.log('Email loaded:', email.id, '(Phishing:', email.isPhishing + ')');
    }

    function handleDecision(decision) {
        if (!currentEmail) {
            console.error('No current email');
            return;
        }

        console.log(`Player decision: ${decision}`);

        const elements = UIController.getElements();
        elements.btnApprove.disabled = true;
        elements.btnReject.disabled = true;

        const result = PhishingRules.evaluateDecision(currentEmail, decision);

        GameState.recordDecision(result.correct);
        GameState.incrementEmailsInspected();

        if (result.correct) {
            const levelConfig = LevelManager.getCurrentLevelConfig();
            const points = levelConfig.scorePerCorrect || 50;
            GameState.addScore(points);
        } else {
            GameState.addStrike();
        }

        UIController.showFeedback(result, result.explanation, currentEmail.phishingIndicators);

        console.log('Result:', result.correct ? 'Correct' : 'Incorrect');
        console.log('Score:', GameState.getScore(), 'Strikes:', GameState.getStrikes());
    }

    function checkGameStatus() {
        const status = GameState.getGameStatus();

        if (status === 'gameOver') {
            UIController.showGameOver('Премногу неточни одлуки! Направивте 3 грешки.');
            return;
        }

        if (status === 'levelComplete') {
            handleLevelComplete();
            return;
        }

        if (status === 'victory') {
            UIController.showVictory();
            return;
        }

        if (LevelManager.hasMoreEmails()) {
            loadNextEmail();
        } else {
            handleLevelComplete();
        }
    }

    function handleLevelComplete() {
        const summary = LevelManager.getLevelSummary();

        console.log('Level Complete:', summary);

        if (summary.passed) {
            UIController.showLevelComplete(summary);

            if (isLastLevel(GameState.getCurrentLevel())) {
                setTimeout(() => {
                    UIController.showVictory();
                }, 100);
            }
        } else {
            UIController.showGameOver(`Не го достигнавте потребниот резултат за Ниво ${summary.level}. Беа ви потребни ${LevelManager.getCurrentLevelConfig().passingScore} точни одлуки.`);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
