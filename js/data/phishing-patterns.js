window.PhishingPatterns = {
    DOMAIN_TYPOSQUATTING: {
        name: 'Domain Typosquatting',
        description: 'Domain uses character substitution (e.g., 1 for l, 0 for o)',
        severity: 'high',
        commonTargets: ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'netflix'],
        commonSubstitutions: {
            'l': ['1', 'i'],
            'o': ['0'],
            'm': ['rn'],
            'w': ['vv'],
            'e': ['3'],
            'a': ['4']
        }
    },

    DOMAIN_WRONG_TLD: {
        name: 'Wrong Top-Level Domain',
        description: 'Uses incorrect TLD (.corn instead of .com, .net instead of .com)',
        severity: 'medium',
        examples: ['.corn', '.org instead of .com', '.info', '.biz']
    },

    DOMAIN_EXTRA_WORDS: {
        name: 'Extra Words in Domain',
        description: 'Adds extra words like -security, -verify, -account',
        severity: 'high',
        patterns: ['-security', '-verify', '-account', '-support', '-service', '-update']
    },

    URGENCY_LANGUAGE: {
        name: 'Urgent/Threatening Language',
        description: 'Uses urgent or threatening language to pressure action',
        severity: 'medium',
        keywords: [
            'urgent', 'immediate action', 'account suspended', 'verify now',
            'within 24 hours', 'unusual activity', 'expires today', 'act now',
            'limited time', 'suspended', 'locked', 'restricted', 'expires'
        ]
    },

    GENERIC_GREETING: {
        name: 'Generic Greeting',
        description: 'Uses generic greeting instead of your name',
        severity: 'low',
        patterns: ['dear customer', 'dear user', 'dear member', 'valued customer', 'dear account holder']
    },

    POOR_GRAMMAR: {
        name: 'Poor Grammar/Spelling',
        description: 'Contains obvious spelling or grammar errors',
        severity: 'low',
        examples: ['recieve', 'your account have been', 'we has detected']
    },

    URL_MISMATCH: {
        name: 'URL Mismatch',
        description: 'Display text shows different URL than actual link destination',
        severity: 'critical',
        explanation: 'Hover over links to see where they actually go'
    },

    SPF_FAILURE: {
        name: 'SPF Authentication Failure',
        description: 'Email failed Sender Policy Framework check',
        severity: 'high',
        explanation: 'Server is not authorized to send email for this domain'
    },

    DKIM_FAILURE: {
        name: 'DKIM Authentication Failure',
        description: 'Email failed DomainKeys Identified Mail check',
        severity: 'high',
        explanation: 'Email signature verification failed'
    },

    SUSPICIOUS_ATTACHMENT: {
        name: 'Suspicious Attachment',
        description: 'Executable or double extension file attached',
        severity: 'high',
        dangerousExtensions: ['.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.js', '.vbs', '.jar'],
        doubleExtensionPattern: /\.(pdf|doc|jpg|png|txt)\.(exe|scr|bat|js|vbs)/i
    },

    REQUESTS_CREDENTIALS: {
        name: 'Requests Personal Information',
        description: 'Asks for password, SSN, credit card, or other sensitive data',
        severity: 'critical',
        keywords: [
            'password', 'social security', 'ssn', 'credit card', 'card number',
            'pin', 'account number', 'routing number', 'cvv', 'security code'
        ]
    },

    UNEXPECTED_SENDER: {
        name: 'Unexpected Sender',
        description: 'Email from sender you don\'t normally communicate with',
        severity: 'medium'
    },

    REQUESTS_WIRE_TRANSFER: {
        name: 'Requests Wire Transfer',
        description: 'Asks to send money via wire transfer or gift cards',
        severity: 'critical',
        keywords: ['wire transfer', 'gift card', 'bitcoin', 'cryptocurrency', 'western union']
    },

    EXECUTIVE_IMPERSONATION: {
        name: 'Executive Impersonation',
        description: 'Pretends to be CEO or high-level executive',
        severity: 'critical',
        keywords: ['ceo', 'cfo', 'president', 'executive', 'confidential']
    },

    MISMATCHED_REPLY_TO: {
        name: 'Mismatched Reply-To Address',
        description: 'Reply-to address differs from sender address',
        severity: 'medium'
    },

    SHORT_DOMAIN_AGE: {
        name: 'Recently Registered Domain',
        description: 'Domain was registered very recently',
        severity: 'medium'
    },

    SUSPICIOUS_IP: {
        name: 'Suspicious Origin IP',
        description: 'Email originated from unexpected geographic location',
        severity: 'low'
    }
};

window.getPhishingPattern = (key) => {
    return window.PhishingPatterns[key] || null;
};

window.getPatternsBySeverity = (severity) => {
    return Object.entries(window.PhishingPatterns)
        .filter(([key, pattern]) => pattern.severity === severity)
        .map(([key, pattern]) => ({ key, ...pattern }));
};
