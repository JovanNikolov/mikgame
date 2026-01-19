window.UIController = (function() {
    'use strict';

    const elements = {};

    function cacheElements() {
        elements.startScreen = document.getElementById('start-screen');
        elements.gameScreen = document.getElementById('game-screen');
        elements.levelCompleteScreen = document.getElementById('level-complete-screen');
        elements.gameOverScreen = document.getElementById('game-over-screen');
        elements.victoryScreen = document.getElementById('victory-screen');
        elements.feedbackOverlay = document.getElementById('feedback-overlay');

        elements.statLevel = document.getElementById('stat-level');
        elements.statScore = document.getElementById('stat-score');
        elements.statStrikes = document.getElementById('stat-strikes');
        elements.statProgress = document.getElementById('stat-progress');

        elements.emailFromName = document.getElementById('email-from-name');
        elements.emailFromAddress = document.getElementById('email-from-address');
        elements.emailToName = document.getElementById('email-to-name');
        elements.emailToAddress = document.getElementById('email-to-address');
        elements.emailSubject = document.getElementById('email-subject');
        elements.emailDate = document.getElementById('email-date');
        elements.emailBody = document.getElementById('email-body');
        elements.emailLinksSection = document.getElementById('email-links-section');
        elements.emailLinksContainer = document.getElementById('email-links-container');
        elements.emailAttachmentsSection = document.getElementById('email-attachments-section');
        elements.emailAttachmentsContainer = document.getElementById('email-attachments-container');

        elements.headerSpf = document.getElementById('header-spf');
        elements.headerDkim = document.getElementById('header-dkim');
        elements.headerReturnPath = document.getElementById('header-return-path');
        elements.headerReceived = document.getElementById('header-received');

        elements.linkInspectorContent = document.getElementById('link-inspector-content');

        elements.btnApprove = document.getElementById('btn-approve');
        elements.btnReject = document.getElementById('btn-reject');
        elements.btnStartGame = document.getElementById('btn-start-game');
        elements.btnContinue = document.getElementById('btn-continue');
        elements.btnNextLevel = document.getElementById('btn-next-level');
        elements.btnRetry = document.getElementById('btn-retry');
        elements.btnPlayAgain = document.getElementById('btn-play-again');

        elements.feedbackResult = document.getElementById('feedback-result');
        elements.feedbackExplanation = document.getElementById('feedback-explanation');
        elements.feedbackIndicators = document.getElementById('feedback-indicators');
    }

    function showScreen(screenElement) {
        [elements.startScreen, elements.gameScreen, elements.levelCompleteScreen,
         elements.gameOverScreen, elements.victoryScreen].forEach(screen => {
            screen.classList.add('hidden');
        });
        screenElement.classList.remove('hidden');
    }

    function updateGameStats() {
        const state = GameState.getState();
        elements.statLevel.textContent = state.currentLevel;
        elements.statScore.textContent = state.score;

        const strikeIndicator = elements.statStrikes.querySelector('.strike-indicator');
        const strikeSymbols = [];
        for (let i = 0; i < state.maxStrikes; i++) {
            strikeSymbols.push(i < state.strikes ? '⚠' : '○');
        }
        strikeIndicator.textContent = strikeSymbols.join('');

        elements.statProgress.textContent = `${state.emailsInspected}/${state.emailsRequiredPerLevel}`;
    }

    function renderEmail(email) {
        if (!email) {
            console.error('No email to render');
            return;
        }

        elements.emailFromName.textContent = email.from.displayName;
        elements.emailFromAddress.textContent = `<${email.from.address}>`;

        elements.emailToName.textContent = email.to.displayName;
        elements.emailToAddress.textContent = `<${email.to.address}>`;

        elements.emailSubject.textContent = email.subject;

        const date = new Date(email.date);
        elements.emailDate.textContent = date.toLocaleString();

        elements.emailBody.textContent = email.body;

        if (email.links && email.links.length > 0) {
            elements.emailLinksSection.classList.remove('hidden');
            renderLinks(email.links);
        } else {
            elements.emailLinksSection.classList.add('hidden');
        }

        if (email.attachments && email.attachments.length > 0) {
            elements.emailAttachmentsSection.classList.remove('hidden');
            renderAttachments(email.attachments);
        } else {
            elements.emailAttachmentsSection.classList.add('hidden');
        }

        renderHeaders(email.headers);

        elements.btnApprove.disabled = false;
        elements.btnReject.disabled = false;
    }

    function renderLinks(links) {
        elements.emailLinksContainer.innerHTML = '';

        links.forEach((link, index) => {
            const linkDiv = document.createElement('div');
            linkDiv.className = 'link-item' + (!link.isMatch ? ' link-mismatch' : '');
            linkDiv.innerHTML = `
                <span class="link-display">${link.displayText}</span>
                <span class="link-arrow">→</span>
                <span class="link-actual">${link.actualUrl}</span>
            `;

            linkDiv.addEventListener('mouseenter', () => {
                showLinkInspection(link);
            });

            elements.emailLinksContainer.appendChild(linkDiv);
        });
    }

    function renderAttachments(attachments) {
        elements.emailAttachmentsContainer.innerHTML = '';

        attachments.forEach(attachment => {
            const attDiv = document.createElement('div');
            let className = 'attachment-item';

            const dangerousExtensions = ['.exe', '.scr', '.bat', '.js', '.vbs'];
            const isDangerous = dangerousExtensions.some(ext => attachment.name.toLowerCase().endsWith(ext));
            const hasDoubleExtension = /\.(pdf|doc|jpg)\.(exe|scr|bat|js)/i.test(attachment.name);

            if (isDangerous || hasDoubleExtension) {
                className += ' dangerous';
            } else if (attachment.suspicious) {
                className += ' suspicious';
            }

            attDiv.className = className;
            attDiv.innerHTML = `
                <div class="attachment-icon">📎</div>
                <div class="attachment-info">
                    <span class="attachment-name">${attachment.name}</span>
                    <span class="attachment-size">${attachment.size}</span>
                    ${(isDangerous || hasDoubleExtension) ? '<div class="attachment-warning">⚠ Потенцијално опасен тип на фајл</div>' : ''}
                </div>
            `;

            elements.emailAttachmentsContainer.appendChild(attDiv);
        });
    }

    function renderHeaders(headers) {
        elements.headerSpf.textContent = headers.spfResult.toUpperCase();
        elements.headerSpf.className = 'header-value';
        if (headers.spfResult === 'pass') elements.headerSpf.classList.add('status-pass');
        else if (headers.spfResult === 'fail') elements.headerSpf.classList.add('status-fail');
        else elements.headerSpf.classList.add('status-none');

        elements.headerDkim.textContent = headers.dkimResult.toUpperCase();
        elements.headerDkim.className = 'header-value';
        if (headers.dkimResult === 'pass') elements.headerDkim.classList.add('status-pass');
        else if (headers.dkimResult === 'fail') elements.headerDkim.classList.add('status-fail');
        else elements.headerDkim.classList.add('status-none');

        elements.headerReturnPath.textContent = headers.returnPath;

        elements.headerReceived.textContent = headers.receivedFrom || 'Unknown';
    }

    function showLinkInspection(link) {
        const isMatch = link.displayText === link.actualUrl;
        elements.linkInspectorContent.innerHTML = `
            <div class="link-inspection-result">
                <div class="link-inspection-label">Прикажан Текст:</div>
                <div class="link-inspection-value">${link.displayText}</div>
                <div class="link-inspection-label">Вистински URL:</div>
                <div class="link-inspection-value">${link.actualUrl}</div>
                <div class="link-match-status ${isMatch ? 'match' : 'mismatch'}">
                    ${isMatch ? '✓ URL-ите се Совпаѓаат' : '⚠ НЕСОВПАЃАЊЕ НА URL!'}
                </div>
            </div>
        `;
    }

    function showFeedback(result, explanation, indicators) {
        elements.feedbackResult.textContent = result.correct ? 'Точно!' : 'Неточно';
        elements.feedbackResult.className = 'feedback-result ' + (result.correct ? 'correct' : 'incorrect');

        elements.feedbackExplanation.textContent = explanation || result.explanation || '';

        if (indicators && indicators.length > 0) {
            let indicatorsHTML = '<h4>Пронајдени Фишинг Индикатори:</h4><ul class="indicator-list">';
            indicators.forEach(indicator => {
                indicatorsHTML += `
                    <li class="indicator-item severity-${indicator.severity}">
                        <strong>${indicator.type}:</strong> ${indicator.description}
                    </li>
                `;
            });
            indicatorsHTML += '</ul>';
            elements.feedbackIndicators.innerHTML = indicatorsHTML;
        } else {
            elements.feedbackIndicators.innerHTML = '';
        }

        elements.feedbackOverlay.classList.remove('hidden');
    }

    function hideFeedback() {
        elements.feedbackOverlay.classList.add('hidden');
    }

    function showLevelComplete(summary) {
        document.getElementById('level-accuracy').textContent = `${summary.accuracy}%`;
        document.getElementById('level-correct').textContent = `${summary.correctDecisions}/${summary.emailsInspected}`;
        document.getElementById('level-score-earned').textContent = summary.scoreEarned;

        showScreen(elements.levelCompleteScreen);
    }

    function showGameOver(reason) {
        document.getElementById('game-over-message').textContent = reason || 'You accumulated too many mistakes.';
        document.getElementById('final-score').textContent = GameState.getScore();
        document.getElementById('final-level').textContent = GameState.getCurrentLevel();

        showScreen(elements.gameOverScreen);
    }

    function showVictory() {
        const totalCorrect = GameState.getCorrectDecisions();
        const totalDecisions = totalCorrect + GameState.getIncorrectDecisions();
        const accuracy = Math.round((totalCorrect / totalDecisions) * 100);

        document.getElementById('victory-score').textContent = GameState.getScore();
        document.getElementById('victory-accuracy').textContent = `${accuracy}%`;

        showScreen(elements.victoryScreen);
    }

    function init() {
        cacheElements();
        updateGameStats();

        GameState.addListener(updateGameStats);
    }

    return {
        init,
        showScreen,
        updateGameStats,
        renderEmail,
        showFeedback,
        hideFeedback,
        showLevelComplete,
        showGameOver,
        showVictory,
        getElements: () => elements
    };
})();
