window.GameState = (function() {
    'use strict';

    let state = {
        currentLevel: 1,
        score: 0,
        strikes: 0,
        maxStrikes: 3,
        emailsInspected: 0,
        emailsRequiredPerLevel: 10,
        correctDecisions: 0,
        incorrectDecisions: 0,
        gameStatus: 'menu',
        currentEmail: null,
        levelStartTime: null,
        levelScoreStart: 0
    };

    const listeners = [];

    function notifyListeners() {
        listeners.forEach(listener => listener(state));
    }

    function saveToLocalStorage() {
        try {
            localStorage.setItem('phishing-inspector-save', JSON.stringify({
                currentLevel: state.currentLevel,
                score: state.score,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    function loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('phishing-inspector-save');
            if (saved) {
                const data = JSON.parse(saved);
                if (Date.now() - data.timestamp < 86400000) {
                    return data;
                }
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
        return null;
    }

    return {
        getState() {
            return { ...state };
        },

        getCurrentLevel() {
            return state.currentLevel;
        },

        getScore() {
            return state.score;
        },

        getStrikes() {
            return state.strikes;
        },

        getMaxStrikes() {
            return state.maxStrikes;
        },

        getEmailsInspected() {
            return state.emailsInspected;
        },

        getEmailsRequired() {
            return state.emailsRequiredPerLevel;
        },

        getGameStatus() {
            return state.gameStatus;
        },

        getCurrentEmail() {
            return state.currentEmail;
        },

        getCorrectDecisions() {
            return state.correctDecisions;
        },

        getIncorrectDecisions() {
            return state.incorrectDecisions;
        },

        getLevelAccuracy() {
            const total = state.correctDecisions + state.incorrectDecisions;
            if (total === 0) return 100;
            return Math.round((state.correctDecisions / total) * 100);
        },

        getLevelScore() {
            return state.score - state.levelScoreStart;
        },

        setCurrentEmail(email) {
            state.currentEmail = email;
            notifyListeners();
        },

        addScore(points) {
            state.score += points;
            notifyListeners();
        },

        addStrike() {
            state.strikes++;
            notifyListeners();

            if (state.strikes >= state.maxStrikes) {
                this.setGameStatus('gameOver');
            }
        },

        incrementEmailsInspected() {
            state.emailsInspected++;
            notifyListeners();

            if (state.emailsInspected >= state.emailsRequiredPerLevel) {
                this.setGameStatus('levelComplete');
            }
        },

        recordDecision(isCorrect) {
            if (isCorrect) {
                state.correctDecisions++;
            } else {
                state.incorrectDecisions++;
            }
            notifyListeners();
        },

        setGameStatus(status) {
            state.gameStatus = status;
            notifyListeners();
        },

        setEmailsRequired(count) {
            state.emailsRequiredPerLevel = count;
            notifyListeners();
        },

        startLevel(levelNumber) {
            state.currentLevel = levelNumber;
            state.emailsInspected = 0;
            state.correctDecisions = 0;
            state.incorrectDecisions = 0;
            state.gameStatus = 'playing';
            state.levelStartTime = Date.now();
            state.levelScoreStart = state.score;
            notifyListeners();
        },

        nextLevel() {
            this.startLevel(state.currentLevel + 1);
        },

        startNewGame() {
            state = {
                currentLevel: 1,
                score: 0,
                strikes: 0,
                maxStrikes: 3,
                emailsInspected: 0,
                emailsRequiredPerLevel: 10,
                correctDecisions: 0,
                incorrectDecisions: 0,
                gameStatus: 'playing',
                currentEmail: null,
                levelStartTime: Date.now(),
                levelScoreStart: 0
            };
            notifyListeners();
        },

        resetGame() {
            this.startNewGame();
        },

        saveGame() {
            saveToLocalStorage();
        },

        loadGame() {
            const saved = loadFromLocalStorage();
            if (saved) {
                state.currentLevel = saved.currentLevel;
                state.score = saved.score;
                notifyListeners();
                return true;
            }
            return false;
        },

        clearSave() {
            try {
                localStorage.removeItem('phishing-inspector-save');
            } catch (e) {
                console.warn('Could not clear localStorage:', e);
            }
        },

        addListener(callback) {
            listeners.push(callback);
        },

        removeListener(callback) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        },

        debugState() {
            console.table(state);
        }
    };
})();
