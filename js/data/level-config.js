window.LevelConfig = {
    1: {
        levelNumber: 1,
        name: 'Ден на Ориентација',
        emailCount: 8,
        phishingRatio: 0.5,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'urgency_language', 'generic_greeting', 'url_mismatch'],
        difficulty: 1,
        timeLimit: null,
        passingScore: 6,
        scorePerCorrect: 50,
        description: 'Добредојдовте! Почнете со основна детекција на фишинг. Барајте очигледни знаци за опасност.',
        hint: 'Проверете ги внимателно е-адресите на испраќачите и поставете го покажувачот врз линковите за да видите каде водат.'
    },

    2: {
        levelNumber: 2,
        name: 'Почетник',
        emailCount: 10,
        phishingRatio: 0.6,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'urgency_language', 'url_mismatch', 'suspicious_attachment'],
        difficulty: 1,
        timeLimit: null,
        passingScore: 8,
        scorePerCorrect: 75,
        description: 'Повеќе е-пораки за преглед. Внимавајте на сомнителни прилози!',
        hint: 'Двојно проверете ги екстензиите на фајловите на прилозите. Чувајте се од .exe и двојни екстензии.'
    },

    3: {
        levelNumber: 3,
        name: 'Безбедносен Аналитичар',
        emailCount: 12,
        phishingRatio: 0.65,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'suspicious_attachment', 'requests_credentials'],
        difficulty: 2,
        timeLimit: null,
        passingScore: 10,
        scorePerCorrect: 100,
        description: 'Време е да ги користите алатките за анализа на заглавија. SPF и DKIM неуспесите се знаци за опасност!',
        hint: 'Проверете го панелот за Анализа на Заглавија за неуспеси во автентикација.'
    },

    4: {
        levelNumber: 4,
        name: 'Под Притисок',
        emailCount: 12,
        phishingRatio: 0.7,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'executive_impersonation'],
        difficulty: 2,
        timeLimit: 360,
        passingScore: 10,
        scorePerCorrect: 125,
        description: 'Сега имате временско ограничување! Работете брзо но внимателно.',
        hint: 'Чувајте се од е-пораки што тврдат дека се од раководители и бараат итни акции.'
    },

    5: {
        levelNumber: 5,
        name: 'Напредни Закани',
        emailCount: 15,
        phishingRatio: 0.7,
        maxStrikes: 3,
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'dkim_failure', 'executive_impersonation', 'requests_credentials'],
        difficulty: 3,
        timeLimit: 420,
        passingScore: 13,
        scorePerCorrect: 150,
        description: 'Овие фишинг обиди се пософистицирани. Обрнете внимание на деталите!',
        hint: 'Барајте суптилни разлики во домените како rn наместо m, или погрешни TLD-ови како .corn.'
    },

    6: {
        levelNumber: 6,
        name: 'Експертски Режим',
        emailCount: 15,
        phishingRatio: 0.75,
        maxStrikes: 2,
        techniques: ['domain_typosquatting', 'url_mismatch', 'spf_failure', 'dkim_failure', 'executive_impersonation', 'requests_wire_transfer'],
        difficulty: 3,
        timeLimit: 360,
        passingScore: 14,
        scorePerCorrect: 200,
        description: 'Експертско ниво! Дозволени се само 2 грешки. Нападачите користат напредни техники.',
        hint: 'Дури и е-пораки со поминат SPF можат да бидат фишинг. Проверете го сето внимателно.'
    },

    7: {
        levelNumber: 7,
        name: 'Мајстор Инспектор',
        emailCount: 18,
        phishingRatio: 0.8,
        maxStrikes: 2,
        techniques: ['all'],
        difficulty: 3,
        timeLimit: 480,
        passingScore: 16,
        scorePerCorrect: 250,
        description: 'Финален предизвик! Сите фишинг техники се во игра.',
        hint: 'Верувајте на вашата обука. Барајте повеќе индикатори пред да донесете одлука.'
    }
};

window.getLevelConfig = (levelNumber) => {
    return window.LevelConfig[levelNumber] || null;
};

window.getTotalLevels = () => {
    return Object.keys(window.LevelConfig).length;
};

window.getNextLevel = (currentLevel) => {
    const nextLevel = currentLevel + 1;
    return window.LevelConfig[nextLevel] || null;
};

window.isLastLevel = (levelNumber) => {
    return levelNumber >= window.getTotalLevels();
};
