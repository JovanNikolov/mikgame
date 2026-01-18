// Level Manager - Handles level progression and email queue

const LevelManager = (function() {
    'use strict';

    let currentLevelConfig = null;
    let emailQueue = [];
    let currentEmailIndex = 0;

    // Initialize level
    function initializeLevel(levelNumber) {
        currentLevelConfig = getLevelConfig(levelNumber);

        if (!currentLevelConfig) {
            console.error(`Level ${levelNumber} not found`);
            return false;
        }

        // Generate all emails for this level
        emailQueue = EmailGenerator.generateEmailsForLevel(currentLevelConfig);
        currentEmailIndex = 0;

        // Update game state
        GameState.setEmailsRequired(currentLevelConfig.emailCount);
        GameState.startLevel(levelNumber);

        return true;
    }

    // Get next email in queue
    function getNextEmail() {
        if (currentEmailIndex >= emailQueue.length) {
            return null;
        }

        const email = emailQueue[currentEmailIndex];
        currentEmailIndex++;

        return email;
    }

    // Check if there are more emails
    function hasMoreEmails() {
        return currentEmailIndex < emailQueue.length;
    }

    // Get current level config
    function getCurrentLevelConfig() {
        return currentLevelConfig;
    }

    // Check if level is complete
    function isLevelComplete() {
        return GameState.getEmailsInspected() >= currentLevelConfig.emailCount;
    }

    // Check if player passed the level
    function didPassLevel() {
        const accuracy = GameState.getLevelAccuracy();
        const requiredAccuracy = (currentLevelConfig.passingScore / currentLevelConfig.emailCount) * 100;
        return accuracy >= requiredAccuracy && GameState.getStrikes() < GameState.getMaxStrikes();
    }

    // Get level summary
    function getLevelSummary() {
        return {
            level: currentLevelConfig.levelNumber,
            name: currentLevelConfig.name,
            emailsInspected: GameState.getEmailsInspected(),
            correctDecisions: GameState.getCorrectDecisions(),
            incorrectDecisions: GameState.getIncorrectDecisions(),
            accuracy: GameState.getLevelAccuracy(),
            scoreEarned: GameState.getLevelScore(),
            strikes: GameState.getStrikes(),
            passed: didPassLevel()
        };
    }

    // Move to next level
    function advanceToNextLevel() {
        const nextLevelNum = currentLevelConfig.levelNumber + 1;

        if (isLastLevel(currentLevelConfig.levelNumber)) {
            GameState.setGameStatus('victory');
            return false;
        }

        return initializeLevel(nextLevelNum);
    }

    // Retry current level
    function retryLevel() {
        return initializeLevel(currentLevelConfig.levelNumber);
    }

    // Get progress for current level
    function getLevelProgress() {
        return {
            current: GameState.getEmailsInspected(),
            total: currentLevelConfig.emailCount,
            percentage: Math.round((GameState.getEmailsInspected() / currentLevelConfig.emailCount) * 100)
        };
    }

    // Public API
    return {
        initializeLevel,
        getNextEmail,
        hasMoreEmails,
        getCurrentLevelConfig,
        isLevelComplete,
        didPassLevel,
        getLevelSummary,
        advanceToNextLevel,
        retryLevel,
        getLevelProgress
    };
})();
