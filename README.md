# Phishing Inspector

A cybersecurity-themed browser game inspired by Papers, Please. Players take on the role of a security analyst who must inspect emails and identify phishing attempts to protect their organization.

## Game Concept

Review incoming emails and decide whether to APPROVE (legitimate) or REJECT (phishing). Use inspection tools to analyze email headers, links, and attachments. Three strikes and you're out!

## How to Play

1. Open `index.html` in a web browser
2. Click "Start Game" to begin
3. Review each email carefully:
   - Check the sender's email address for typos
   - Examine the subject line for urgent/threatening language
   - Use the Header Analysis panel to check SPF/DKIM authentication
   - Hover over links to see where they actually go
   - Inspect attachments for suspicious file types
4. Press **A** or click **APPROVE** if the email is legitimate
5. Press **R** or click **REJECT** if the email is phishing
6. Complete all emails in a level to advance

## Phishing Indicators to Watch For

### Critical (Must Reject)
- **URL Mismatch**: Link text shows one URL but goes to another
- **Requests Credentials**: Asks for password, SSN, credit card
- **Executive Impersonation**: Pretends to be CEO asking for wire transfers

### High Priority
- **Domain Typosquatting**: paypa1.com instead of paypal.com
- **SPF/DKIM Failure**: Email failed authentication checks
- **Suspicious Attachments**: .exe files or double extensions (.pdf.exe)

### Medium Priority
- **Urgent Language**: "Immediate action required", "Account suspended"
- **Wrong Domain**: Similar but incorrect domains

### Low Priority
- **Generic Greetings**: "Dear customer" instead of your name
- **Poor Grammar**: Obvious spelling or grammar errors

## Game Features

- **7 Progressive Levels**: Increasing difficulty with more subtle phishing techniques
- **Realistic Phishing Examples**: Based on real-world attack patterns
- **Educational Feedback**: Learn what indicators you missed after each decision
- **Keyboard Shortcuts**: A for Approve, R for Reject
- **Score Tracking**: Earn points for correct decisions
- **Papers, Please Aesthetic**: Muted colors and document-style interface

## Level Progression

1. **Orientation Day** - 8 emails, obvious indicators
2. **Getting Started** - 10 emails, basic techniques
3. **Security Analyst** - 12 emails, header analysis required
4. **Under Pressure** - 12 emails with time limit
5. **Advanced Threats** - 15 emails, subtle indicators
6. **Expert Mode** - 15 emails, only 2 strikes allowed
7. **Master Inspector** - 18 emails, all techniques

## Tech Stack

- Vanilla JavaScript (no frameworks)
- HTML5
- CSS3
- No build tools required - just open and play!

## File Structure

```
mikgame/
├── index.html
├── css/
│   ├── main.css
│   ├── email-viewer.css
│   ├── inspector-tools.css
│   └── ui-components.css
├── js/
│   ├── main.js
│   ├── game-state.js
│   ├── email-generator.js
│   ├── phishing-rules.js
│   ├── level-manager.js
│   ├── ui-controller.js
│   └── data/
│       ├── email-templates.js
│       ├── phishing-patterns.js
│       └── level-config.js
└── README.md
```

## Development

The game uses a modular architecture with IIFE pattern:

- **game-state.js**: Centralized state management
- **email-generator.js**: Creates emails from templates
- **phishing-rules.js**: Detection logic and validation
- **level-manager.js**: Level progression and email queue
- **ui-controller.js**: All DOM manipulation
- **main.js**: Game orchestration and event handling

## Credits

Inspired by Lucas Pope's "Papers, Please"

Built with vanilla JavaScript for simplicity and educational purposes.

## License

Free to use and modify for educational purposes.
