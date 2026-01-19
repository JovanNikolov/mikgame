window.LevelManager = (function() {
    'use strict';

    let currentLevelConfig = null;
    let emailQueue = [];
    let currentEmailIndex = 0;

    function initializeLevel(levelNumber) {
        currentLevelConfig = getLevelConfig(levelNumber);

        if (!currentLevelConfig) {
            console.error(`Level ${levelNumber} not found`);
            return false;
        }

        emailQueue = EmailGenerator.generateEmailsForLevel(currentLevelConfig);
        currentEmailIndex = 0;

        GameState.setEmailsRequired(currentLevelConfig.emailCount);
        GameState.startLevel(levelNumber);

        return true;
    }

    function getNextEmail() {
        if (currentEmailIndex >= emailQueue.length) {
            return null;
        }

        const email = emailQueue[currentEmailIndex];
        currentEmailIndex++;

        return email;
    }

    function hasMoreEmails() {
        return currentEmailIndex < emailQueue.length;
    }

    function getCurrentLevelConfig() {
        return currentLevelConfig;
    }

    function isLevelComplete() {
        return GameState.getEmailsInspected() >= currentLevelConfig.emailCount;
    }

    function didPassLevel() {
        const accuracy = GameState.getLevelAccuracy();
        const requiredAccuracy = (currentLevelConfig.passingScore / currentLevelConfig.emailCount) * 100;
        return accuracy >= requiredAccuracy && GameState.getStrikes() < GameState.getMaxStrikes();
    }

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

    function advanceToNextLevel() {
        const nextLevelNum = currentLevelConfig.levelNumber + 1;

        if (isLastLevel(currentLevelConfig.levelNumber)) {
            GameState.setGameStatus('victory');
            return false;
        }

        return initializeLevel(nextLevelNum);
    }

    function retryLevel() {
        return initializeLevel(currentLevelConfig.levelNumber);
    }

    function getLevelProgress() {
        return {
            current: GameState.getEmailsInspected(),
            total: currentLevelConfig.emailCount,
            percentage: Math.round((GameState.getEmailsInspected() / currentLevelConfig.emailCount) * 100)
        };
    }

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
