// Phishing Detection Rules and Logic

const PhishingRules = (function() {
    'use strict';

    // Check if domain contains typosquatting
    function checkDomainTyposquatting(domain) {
        const indicators = [];
        const commonTargets = PhishingPatterns.DOMAIN_TYPOSQUATTING.commonTargets;

        const lowerDomain = domain.toLowerCase();

        // Check for character substitutions
        for (const target of commonTargets) {
            if (lowerDomain.includes(target.replace('l', '1')) ||
                lowerDomain.includes(target.replace('l', 'i')) ||
                lowerDomain.includes(target.replace('o', '0')) ||
                lowerDomain.includes(target.replace('m', 'rn'))) {
                indicators.push({
                    type: 'DOMAIN_TYPOSQUATTING',
                    element: 'from.domain',
                    severity: 'high',
                    description: `Domain may be impersonating ${target}`
                });
            }
        }

        // Check for wrong TLD
        if (lowerDomain.endsWith('.corn') || lowerDomain.endsWith('.cm')) {
            indicators.push({
                type: 'DOMAIN_WRONG_TLD',
                element: 'from.domain',
                severity: 'medium',
                description: 'Suspicious top-level domain'
            });
        }

        // Check for extra words
        const suspiciousWords = PhishingPatterns.DOMAIN_EXTRA_WORDS.patterns;
        for (const word of suspiciousWords) {
            if (lowerDomain.includes(word)) {
                indicators.push({
                    type: 'DOMAIN_EXTRA_WORDS',
                    element: 'from.domain',
                    severity: 'high',
                    description: `Domain contains suspicious word: ${word}`
                });
            }
        }

        return indicators;
    }

    // Check for urgent/threatening language
    function checkUrgencyLanguage(subject, body) {
        const indicators = [];
        const keywords = PhishingPatterns.URGENCY_LANGUAGE.keywords;
        const text = (subject + ' ' + body).toLowerCase();

        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                indicators.push({
                    type: 'URGENCY_LANGUAGE',
                    element: 'subject/body',
                    severity: 'medium',
                    description: `Contains urgent language: "${keyword}"`
                });
                break; // Only report once
            }
        }

        return indicators;
    }

    // Check for generic greetings
    function checkGenericGreeting(body) {
        const indicators = [];
        const patterns = PhishingPatterns.GENERIC_GREETING.patterns;
        const lowerBody = body.toLowerCase();

        for (const pattern of patterns) {
            if (lowerBody.includes(pattern)) {
                indicators.push({
                    type: 'GENERIC_GREETING',
                    element: 'body',
                    severity: 'low',
                    description: `Uses generic greeting: "${pattern}"`
                });
                break;
            }
        }

        return indicators;
    }

    // Check for URL mismatches
    function checkUrlMismatches(links) {
        const indicators = [];

        if (!links || links.length === 0) return indicators;

        for (const link of links) {
            if (!link.isMatch && link.displayText !== link.actualUrl) {
                indicators.push({
                    type: 'URL_MISMATCH',
                    element: 'links',
                    severity: 'critical',
                    description: `Link shows "${link.displayText}" but goes to "${link.actualUrl}"`
                });
            }
        }

        return indicators;
    }

    // Check SPF/DKIM authentication
    function checkAuthentication(headers) {
        const indicators = [];

        if (headers.spfResult === 'fail') {
            indicators.push({
                type: 'SPF_FAILURE',
                element: 'headers',
                severity: 'high',
                description: 'Email failed SPF authentication'
            });
        }

        if (headers.dkimResult === 'fail') {
            indicators.push({
                type: 'DKIM_FAILURE',
                element: 'headers',
                severity: 'high',
                description: 'Email failed DKIM authentication'
            });
        }

        if (headers.spfResult === 'none' || headers.dkimResult === 'none') {
            indicators.push({
                type: 'NO_AUTHENTICATION',
                element: 'headers',
                severity: 'medium',
                description: 'Email has no authentication'
            });
        }

        return indicators;
    }

    // Check for suspicious attachments
    function checkSuspiciousAttachments(attachments) {
        const indicators = [];

        if (!attachments || attachments.length === 0) return indicators;

        const dangerousExtensions = PhishingPatterns.SUSPICIOUS_ATTACHMENT.dangerousExtensions;
        const doubleExtPattern = PhishingPatterns.SUSPICIOUS_ATTACHMENT.doubleExtensionPattern;

        for (const attachment of attachments) {
            const name = attachment.name.toLowerCase();

            // Check for dangerous extensions
            for (const ext of dangerousExtensions) {
                if (name.endsWith(ext)) {
                    indicators.push({
                        type: 'SUSPICIOUS_ATTACHMENT',
                        element: 'attachments',
                        severity: 'high',
                        description: `Dangerous file extension: ${ext}`
                    });
                    break;
                }
            }

            // Check for double extensions
            if (doubleExtPattern.test(name)) {
                indicators.push({
                    type: 'SUSPICIOUS_ATTACHMENT',
                    element: 'attachments',
                    severity: 'high',
                    description: `Double file extension detected: ${attachment.name}`
                });
            }
        }

        return indicators;
    }

    // Check if email requests credentials
    function checkRequestsCredentials(body) {
        const indicators = [];
        const keywords = PhishingPatterns.REQUESTS_CREDENTIALS.keywords;
        const lowerBody = body.toLowerCase();

        for (const keyword of keywords) {
            if (lowerBody.includes(keyword)) {
                indicators.push({
                    type: 'REQUESTS_CREDENTIALS',
                    element: 'body',
                    severity: 'critical',
                    description: `Requests sensitive information: "${keyword}"`
                });
                break;
            }
        }

        return indicators;
    }

    // Check for executive impersonation
    function checkExecutiveImpersonation(from, body) {
        const indicators = [];
        const keywords = PhishingPatterns.EXECUTIVE_IMPERSONATION.keywords;
        const text = (from.displayName + ' ' + body).toLowerCase();

        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                indicators.push({
                    type: 'EXECUTIVE_IMPERSONATION',
                    element: 'from/body',
                    severity: 'critical',
                    description: `Possible executive impersonation`
                });
                break;
            }
        }

        return indicators;
    }

    // Main analysis function
    function analyzeEmail(email) {
        let indicators = [];

        // Domain checks
        indicators = indicators.concat(checkDomainTyposquatting(email.from.address.split('@')[1]));

        // Content checks
        indicators = indicators.concat(checkUrgencyLanguage(email.subject, email.body));
        indicators = indicators.concat(checkGenericGreeting(email.body));

        // Technical checks
        indicators = indicators.concat(checkUrlMismatches(email.links));
        indicators = indicators.concat(checkAuthentication(email.headers));
        indicators = indicators.concat(checkSuspiciousAttachments(email.attachments));

        // Behavioral checks
        indicators = indicators.concat(checkRequestsCredentials(email.body));
        indicators = indicators.concat(checkExecutiveImpersonation(email.from, email.body));

        return indicators;
    }

    // Evaluate player decision
    function evaluateDecision(email, decision) {
        // decision: 'approve' or 'reject'
        // approve = legitimate, reject = phishing

        const isCorrect = (decision === 'approve' && !email.isPhishing) ||
                          (decision === 'reject' && email.isPhishing);

        return {
            correct: isCorrect,
            wasPhishing: email.isPhishing,
            playerSaid: decision === 'reject' ? 'phishing' : 'legitimate',
            actuallyWas: email.isPhishing ? 'phishing' : 'legitimate',
            indicators: email.phishingIndicators || [],
            explanation: email.explanation
        };
    }

    // Calculate risk score (0-100, higher = more suspicious)
    function calculateRiskScore(indicators) {
        const severityPoints = {
            'critical': 30,
            'high': 20,
            'medium': 10,
            'low': 5
        };

        let score = 0;
        for (const indicator of indicators) {
            score += severityPoints[indicator.severity] || 0;
        }

        return Math.min(score, 100); // Cap at 100
    }

    // Public API
    return {
        analyzeEmail,
        evaluateDecision,
        calculateRiskScore,
        checkDomainTyposquatting,
        checkUrlMismatches,
        checkSuspiciousAttachments
    };
})();
