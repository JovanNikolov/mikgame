// Level Configuration - Progressive Difficulty

const LevelConfig = {
    1: {
        levelNumber: 1,
        name: 'Orientation Day',
        emailCount: 8,
        phishingRatio: 0.5, // 50% phishing, 50% legitimate
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'urgency_language', 'generic_greeting', 'url_mismatch'],
        difficulty: 1, // Easy - obvious indicators
        timeLimit: null, // No time pressure
        passingScore: 6, // Need 6/8 correct (75%)
        scorePerCorrect: 50,
        description: 'Welcome! Start with some basic phishing detection. Look for obvious red flags.',
        hint: 'Check sender email addresses carefully and hover over links to see where they go.'
    },

    2: {
        levelNumber: 2,
        name: 'Getting Started',
        emailCount: 10,
        phishingRatio: 0.6, // 60% phishing
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'urgency_language', 'url_mismatch', 'suspicious_attachment'],
        difficulty: 1,
        timeLimit: null,
        passingScore: 8, // Need 8/10 correct (80%)
        scorePerCorrect: 75,
        description: 'More emails to review. Watch out for suspicious attachments!',
        hint: 'Double-check file extensions on attachments. Beware of .exe and double extensions.'
    },

    3: {
        levelNumber: 3,
        name: 'Security Analyst',
        emailCount: 12,
        phishingRatio: 0.65,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'suspicious_attachment', 'requests_credentials'],
        difficulty: 2, // Medium - mixed difficulty
        timeLimit: null,
        passingScore: 10, // Need 10/12 correct (83%)
        scorePerCorrect: 100,
        description: 'Time to use the header analysis tools. SPF and DKIM failures are red flags!',
        hint: 'Check the Header Analysis panel for authentication failures.'
    },

    4: {
        levelNumber: 4,
        name: 'Under Pressure',
        emailCount: 12,
        phishingRatio: 0.7,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'executive_impersonation'],
        difficulty: 2,
        timeLimit: 360, // 6 minutes
        passingScore: 10,
        scorePerCorrect: 125,
        description: 'You now have a time limit! Work quickly but carefully.',
        hint: 'Beware of emails claiming to be from executives asking for urgent actions.'
    },

    5: {
        levelNumber: 5,
        name: 'Advanced Threats',
        emailCount: 15,
        phishingRatio: 0.7,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'dkim_failure', 'executive_impersonation', 'requests_credentials'],
        difficulty: 3, // Hard - subtle indicators
        timeLimit: 420, // 7 minutes
        passingScore: 13, // Need 13/15 correct (87%)
        scorePerCorrect: 150,
        description: 'These phishing attempts are more sophisticated. Pay attention to details!',
        hint: 'Look for subtle domain differences like rn instead of m, or wrong TLDs like .corn.'
    },

    6: {
        levelNumber: 6,
        name: 'Expert Mode',
        emailCount: 15,
        phishingRatio: 0.75,
        maxStrikes: 2, // Only 2 strikes allowed!
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'dkim_failure', 'executive_impersonation', 'requests_wire_transfer'],
        difficulty: 3,
        timeLimit: 360, // 6 minutes - less time!
        passingScore: 14, // Need 14/15 correct (93%)
        scorePerCorrect: 200,
        description: 'Expert level! Only 2 strikes allowed. Attackers are using advanced techniques.',
        hint: 'Even emails with passing SPF can be phishing. Check everything carefully.'
    },

    7: {
        levelNumber: 7,
        name: 'Master Inspector',
        emailCount: 18,
        phishingRatio: 0.8,
        maxStrikes: 2,
        techniques: ['all'],
        difficulty: 3,
        timeLimit: 480, // 8 minutes
        passingScore: 16, // Need 16/18 correct (89%)
        scorePerCorrect: 250,
        description: 'Final challenge! All phishing techniques are in play.',
        hint: 'Trust your training. Look for multiple indicators before making a decision.'
    }
};

// Helper functions
const getLevelConfig = (levelNumber) => {
    return LevelConfig[levelNumber] || null;
};

const getTotalLevels = () => {
    return Object.keys(LevelConfig).length;
};

const getNextLevel = (currentLevel) => {
    const nextLevel = currentLevel + 1;
    return LevelConfig[nextLevel] || null;
};

const isLastLevel = (levelNumber) => {
    return levelNumber >= getTotalLevels();
};
