// Email Generator - Creates emails from templates

const EmailGenerator = (function() {
    'use strict';

    let emailIdCounter = 0;

    // Helper to get random element from array
    function randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Helper to shuffle array
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Generate legitimate email
    function generateLegitimateEmail(levelConfig) {
        const template = randomChoice(EmailTemplates.legitimate);
        const subject = randomChoice(template.subjects);
        const bodyTemplate = randomChoice(template.bodyTemplates);

        // Replace template variables
        const body = bodyTemplate.replace(/\{\{name\}\}/g, 'John');

        // Build email object
        const email = {
            id: `email_${++emailIdCounter}`,
            isPhishing: false,
            difficulty: levelConfig.difficulty,
            from: {
                displayName: template.from.name,
                address: `${template.from.name.toLowerCase().replace(/\s/g, '.')}@${template.from.domain}`
            },
            to: {
                displayName: 'You',
                address: 'you@company.com'
            },
            subject: subject,
            date: new Date().toISOString(),
            body: body,
            links: [],
            attachments: [],
            headers: {
                receivedFrom: '172.16.0.1',
                spfResult: 'pass',
                dkimResult: 'pass',
                returnPath: `noreply@${template.from.domain}`
            },
            phishingIndicators: [],
            explanation: 'This is a legitimate email from a trusted source. It has proper authentication and no suspicious indicators.'
        };

        // Add links if template has them
        if (template.hasLinks && template.legitimateLinks) {
            email.links = template.legitimateLinks.map(url => ({
                displayText: url,
                actualUrl: url,
                isMatch: true
            }));
        }

        // Add attachments if template has them
        if (template.hasAttachments && template.attachments) {
            email.attachments = template.attachments.map(att => ({
                name: att.name,
                size: att.size,
                type: att.type,
                suspicious: false
            }));
        }

        return email;
    }

    // Generate phishing email
    function generatePhishingEmail(levelConfig) {
        // Filter templates by difficulty and allowed techniques
        const availableTemplates = EmailTemplates.phishing.filter(template => {
            return template.difficulty <= levelConfig.difficulty;
        });

        if (availableTemplates.length === 0) {
            console.warn('No phishing templates available for this level');
            return null;
        }

        const template = randomChoice(availableTemplates);
        const subject = randomChoice(template.subjects);
        const bodyTemplate = randomChoice(template.bodyTemplates);

        // Replace template variables
        let body = bodyTemplate.replace(/\{\{name\}\}/g, 'you');

        // Build email object
        const email = {
            id: `email_${++emailIdCounter}`,
            isPhishing: true,
            difficulty: template.difficulty,
            from: {
                displayName: template.from.name,
                address: `${template.from.name.toLowerCase().replace(/\s/g, '.')}@${template.from.domain}`
            },
            to: {
                displayName: 'You',
                address: 'you@company.com'
            },
            subject: subject,
            date: new Date().toISOString(),
            body: body,
            links: [],
            attachments: [],
            headers: template.headers || {
                receivedFrom: '185.243.11.54',
                spfResult: 'fail',
                dkimResult: 'none',
                returnPath: `bounce@${template.from.domain}`
            },
            phishingIndicators: [],
            explanation: ''
        };

        // Add malicious links
        if (template.maliciousLinks) {
            email.links = template.maliciousLinks.map(link => ({
                displayText: link.display,
                actualUrl: link.actual,
                isMatch: link.display === link.actual
            }));

            // Replace {{malicious_link}} in body
            if (email.links.length > 0) {
                body = body.replace(/\{\{malicious_link\}\}/g, email.links[0].displayText);
                email.body = body;
            }
        }

        // Add attachments
        if (template.hasAttachments && template.attachments) {
            email.attachments = template.attachments.map(att => ({
                name: att.name,
                size: att.size,
                type: att.type,
                suspicious: att.suspicious || false
            }));
        }

        // Analyze email to get phishing indicators
        const indicators = PhishingRules.analyzeEmail(email);
        email.phishingIndicators = indicators;

        // Generate explanation
        email.explanation = generatePhishingExplanation(email, indicators);

        return email;
    }

    // Generate explanation for phishing email
    function generatePhishingExplanation(email, indicators) {
        if (indicators.length === 0) {
            return 'This was a phishing attempt with sophisticated techniques.';
        }

        const criticalIndicators = indicators.filter(i => i.severity === 'critical');
        const highIndicators = indicators.filter(i => i.severity === 'high');

        let explanation = 'This was a phishing attempt. ';

        if (criticalIndicators.length > 0) {
            explanation += `Critical red flags: ${criticalIndicators.map(i => i.description).join(', ')}. `;
        } else if (highIndicators.length > 0) {
            explanation += `Major red flags: ${highIndicators.map(i => i.description).join(', ')}. `;
        }

        explanation += `Always verify sender identity and be cautious of ${email.from.displayName} emails asking for urgent action.`;

        return explanation;
    }

    // Generate a batch of emails for a level
    function generateEmailsForLevel(levelConfig) {
        const emails = [];
        const emailCount = levelConfig.emailCount;
        const phishingCount = Math.round(emailCount * levelConfig.phishingRatio);
        const legitimateCount = emailCount - phishingCount;

        // Generate phishing emails
        for (let i = 0; i < phishingCount; i++) {
            const email = generatePhishingEmail(levelConfig);
            if (email) emails.push(email);
        }

        // Generate legitimate emails
        for (let i = 0; i < legitimateCount; i++) {
            emails.push(generateLegitimateEmail(levelConfig));
        }

        // Shuffle emails so phishing and legitimate are mixed
        return shuffleArray(emails);
    }

    // Generate single email (for testing or one-at-a-time gameplay)
    function generateSingleEmail(levelConfig, forcePhishing = null) {
        const shouldBePhishing = forcePhishing !== null
            ? forcePhishing
            : Math.random() < levelConfig.phishingRatio;

        return shouldBePhishing
            ? generatePhishingEmail(levelConfig)
            : generateLegitimateEmail(levelConfig);
    }

    // Public API
    return {
        generateEmailsForLevel,
        generateSingleEmail,
        generatePhishingEmail,
        generateLegitimateEmail
    };
})();
