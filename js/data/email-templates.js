// Email Templates - Legitimate and Phishing

const EmailTemplates = {
    legitimate: [
        {
            id: 'legit_meeting',
            category: 'work_update',
            from: { name: 'Sarah Johnson', domain: 'company.com' },
            subjects: [
                'Team Meeting Tomorrow at 2pm',
                'Quick sync - Project Update',
                'Weekly Team Standup'
            ],
            bodyTemplates: [
                `Hi {{name}},

Just a reminder that we have our team meeting tomorrow at 2pm in Conference Room B.

Agenda:
- Q1 progress review
- New project assignments
- Team feedback session

See you there!

Sarah`,
                `Hello {{name}},

Can we schedule a quick 15-minute sync to discuss the current project status? I have a few questions about the timeline.

Let me know what works for you.

Thanks,
Sarah`
            ],
            hasLinks: false,
            hasAttachments: false
        },
        {
            id: 'legit_hr',
            category: 'hr_notice',
            from: { name: 'HR Department', domain: 'company.com' },
            subjects: [
                'Benefits Enrollment Period',
                'Updated Company Policies',
                'Holiday Schedule 2026'
            ],
            bodyTemplates: [
                `Dear Team Members,

This is a reminder that the benefits enrollment period begins next Monday, January 20th and ends on February 15th.

You can review and update your benefits selections through the HR portal at https://hr.company.com

If you have any questions, please contact the HR team.

Best regards,
HR Department`,
                `Dear Employees,

Please find attached the updated company policies for 2026. The changes go into effect on February 1st.

Key updates include:
- Remote work policy
- Travel reimbursement procedures
- PTO accrual changes

Please review the attached document carefully.

HR Department`
            ],
            hasLinks: true,
            legitimateLinks: ['https://hr.company.com', 'https://company.com/policies'],
            hasAttachments: true,
            attachments: [
                { name: 'Company_Policies_2026.pdf', size: '245 KB', type: 'application/pdf' }
            ]
        },
        {
            id: 'legit_it',
            category: 'it_notice',
            from: { name: 'IT Support', domain: 'company.com' },
            subjects: [
                'Scheduled Maintenance - Sunday Night',
                'Security Update Reminder',
                'New Software Deployment'
            ],
            bodyTemplates: [
                `Hello,

This is a reminder that we will be performing scheduled system maintenance this Sunday night from 10pm to 2am.

During this time, email and internal systems may be temporarily unavailable.

Please save your work before 10pm and plan accordingly.

Thank you for your patience.

IT Support Team`,
                `Hi Everyone,

Please remember to install the latest security updates on your workstations by end of week.

You can check for updates in your system settings or contact IT Support if you need assistance.

Thanks,
IT Support`
            ],
            hasLinks: false,
            hasAttachments: false
        },
        {
            id: 'legit_newsletter',
            category: 'newsletter',
            from: { name: 'Company Newsletter', domain: 'company.com' },
            subjects: [
                'Weekly Company Update',
                'This Week in Tech - Company News',
                'Employee Spotlight & Updates'
            ],
            bodyTemplates: [
                `Hello Team,

Here are this week's highlights:

📢 Announcements:
- New cafeteria menu starting Monday
- Employee appreciation event on Friday

🎉 Celebrations:
- Congratulations to the Sales team for meeting Q1 goals!

🔗 Resources:
Visit the company intranet for more details: https://intranet.company.com

Have a great week!`
            ],
            hasLinks: true,
            legitimateLinks: ['https://intranet.company.com'],
            hasAttachments: false
        },
        {
            id: 'legit_vendor',
            category: 'vendor',
            from: { name: 'Microsoft 365', domain: 'microsoft.com' },
            subjects: [
                'Your Monthly Service Summary',
                'New Features in Microsoft 365'
            ],
            bodyTemplates: [
                `Hello,

Your Microsoft 365 subscription is active and running smoothly.

This month's highlights:
- 99.9% uptime
- New collaboration features in Teams
- Updated security features

Visit the Microsoft 365 admin center for more details: https://admin.microsoft.com

Thank you for choosing Microsoft 365.`
            ],
            hasLinks: true,
            legitimateLinks: ['https://admin.microsoft.com'],
            hasAttachments: false
        }
    ],

    phishing: [
        {
            id: 'phish_paypal_urgent',
            category: 'account_verification',
            targetBrand: 'PayPal',
            difficulty: 1, // Easy - obvious typo
            techniques: ['domain_typosquatting', 'urgency_language', 'url_mismatch', 'generic_greeting'],
            from: { name: 'PayPal Security', domain: 'paypa1.com' }, // 1 instead of l
            subjects: [
                'URGENT: Verify Your Account NOW',
                'Your Account Will Be Suspended',
                'Immediate Action Required - Account Security'
            ],
            bodyTemplates: [
                `Dear valued customer,

We detected unusual activity on your PayPal account. Your account will be suspended within 24 hours unless you verify your information immediately.

Click here to verify your account: {{malicious_link}}

Failure to verify will result in permanent account closure.

PayPal Security Team`
            ],
            maliciousLinks: [
                { display: 'https://www.paypal.com/verify', actual: 'https://paypa1-secure.com/login' }
            ],
            headers: {
                spfResult: 'fail',
                dkimResult: 'none',
                returnPath: 'bounce@paypa1.com'
            }
        },
        {
            id: 'phish_bank_alert',
            category: 'security_alert',
            targetBrand: 'Generic Bank',
            difficulty: 1,
            techniques: ['urgency_language', 'requests_credentials', 'suspicious_attachment'],
            from: { name: 'Security Alert', domain: 'bank-security.net' },
            subjects: [
                'Unusual Activity Detected',
                'Security Alert: Login from New Device',
                'FRAUD ALERT - Verify Transaction'
            ],
            bodyTemplates: [
                `Dear Customer,

We have detected a suspicious transaction on your account for $2,450.99.

If this was not you, please download and complete the attached verification form immediately.

Attach your ID and submit within 24 hours to prevent account suspension.

Security Team`
            ],
            hasAttachments: true,
            attachments: [
                { name: 'verification_form.pdf.exe', size: '2.4 MB', type: 'application/x-msdownload', suspicious: true }
            ],
            headers: {
                spfResult: 'none',
                dkimResult: 'none',
                returnPath: 'no-reply@bank-security.net'
            }
        },
        {
            id: 'phish_amazon',
            category: 'order_confirmation',
            targetBrand: 'Amazon',
            difficulty: 2, // Medium - subtle domain
            techniques: ['domain_typosquatting', 'url_mismatch', 'fake_invoice'],
            from: { name: 'Amazon Order Confirmation', domain: 'amazon.corn' }, // corn instead of com
            subjects: [
                'Your Order Confirmation #847592',
                'Order Shipped - Tracking Information',
                'Problem with Your Recent Order'
            ],
            bodyTemplates: [
                `Hello,

Thank you for your order! Your purchase has been confirmed.

Order Details:
- iPhone 15 Pro Max (x2) - $2,199.98
- Shipping Address: Unknown Location

If you did not place this order, please cancel it here: {{malicious_link}}

Order Number: #847592
Expected Delivery: 3-5 business days

Amazon Customer Service`
            ],
            maliciousLinks: [
                { display: 'https://www.amazon.com/cancel-order', actual: 'https://amazon-orders.corn/cancel' }
            ],
            headers: {
                spfResult: 'fail',
                dkimResult: 'fail',
                returnPath: 'orders@amazon.corn'
            }
        },
        {
            id: 'phish_microsoft',
            category: 'password_reset',
            targetBrand: 'Microsoft',
            difficulty: 2,
            techniques: ['url_mismatch', 'urgency_language', 'requests_credentials'],
            from: { name: 'Microsoft Account Team', domain: 'microsoft.com' },
            subjects: [
                'Password Reset Request',
                'Your Account Password Expires Today',
                'Verify Your Microsoft Account'
            ],
            bodyTemplates: [
                `Dear Microsoft User,

Your password will expire in 2 hours. To continue using your account, please reset your password immediately.

Reset your password: {{malicious_link}}

If you do not reset your password, your account will be locked and all data will be deleted.

Microsoft Account Team`
            ],
            maliciousLinks: [
                { display: 'https://account.microsoft.com/reset', actual: 'https://rnicr0s0ft-account.com/reset' }
            ],
            headers: {
                spfResult: 'pass', // Spoofed to look legitimate
                dkimResult: 'none',
                returnPath: 'no-reply@microsoft-account.services'
            }
        },
        {
            id: 'phish_google',
            category: 'security_alert',
            targetBrand: 'Google',
            difficulty: 3, // Hard - subtle indicators
            techniques: ['url_mismatch', 'social_engineering'],
            from: { name: 'Google Security', domain: 'google.com' },
            subjects: [
                'Security Alert: New sign-in from Chrome',
                'Review recent activity on your Google Account'
            ],
            bodyTemplates: [
                `Hi,

We noticed a new sign-in to your Google Account from a Chrome browser.

Device: Chrome on Windows
Location: New York, NY
Time: January 18, 2026, 2:30 PM EST

If this was you, you can ignore this email. If not, please review your account activity:

Review Activity: {{malicious_link}}

Best regards,
The Google Account team`
            ],
            maliciousLinks: [
                { display: 'https://myaccount.google.com/security', actual: 'https://myaccount-go0gle.com/security' }
            ],
            headers: {
                spfResult: 'pass',
                dkimResult: 'pass', // Sophisticated - passes some checks
                returnPath: 'no-reply@accounts.google.com',
                receivedFrom: '185.243.11.54' // Suspicious IP
            }
        },
        {
            id: 'phish_internal_ceo',
            category: 'ceo_fraud',
            targetBrand: 'Internal',
            difficulty: 3,
            techniques: ['executive_impersonation', 'urgency_language', 'requests_action'],
            from: { name: 'Robert Chen (CEO)', domain: 'company-mail.com' }, // Similar but wrong domain
            subjects: [
                'URGENT: Wire Transfer Needed',
                'Quick Favor - Time Sensitive',
                'RE: Confidential Acquisition'
            ],
            bodyTemplates: [
                `{{name}},

I'm in a meeting and need you to process an urgent wire transfer for a confidential acquisition we're finalizing.

Amount: $45,000
Account details will be sent separately.

This is time-sensitive and confidential. Do not discuss with anyone.

Please confirm you can handle this ASAP.

Robert Chen
CEO, Company Inc.`
            ],
            hasLinks: false,
            hasAttachments: false,
            headers: {
                spfResult: 'fail',
                dkimResult: 'none',
                returnPath: 'robert.chen@company-mail.com'
            }
        },
        {
            id: 'phish_shipping',
            category: 'delivery_notice',
            targetBrand: 'DHL',
            difficulty: 2,
            techniques: ['url_mismatch', 'suspicious_attachment', 'urgency_language'],
            from: { name: 'DHL Delivery Service', domain: 'dhl-delivery.info' },
            subjects: [
                'Package Delivery Failed - Action Required',
                'Your Package is Waiting - Confirm Address',
                'DHL Shipment #DHL8493021'
            ],
            bodyTemplates: [
                `Dear Customer,

We attempted to deliver your package but no one was available to receive it.

Package tracking: #DHL8493021
Delivery attempt: January 18, 2026

Please download the attached shipping label and reschedule delivery: {{malicious_link}}

Your package will be returned to sender if not claimed within 48 hours.

DHL Customer Service`
            ],
            maliciousLinks: [
                { display: 'https://www.dhl.com/tracking', actual: 'https://dhl-packagetrack.info/login' }
            ],
            hasAttachments: true,
            attachments: [
                { name: 'DHL_Label.pdf.js', size: '1.2 MB', type: 'application/javascript', suspicious: true }
            ],
            headers: {
                spfResult: 'none',
                dkimResult: 'none',
                returnPath: 'deliveries@dhl-delivery.info'
            }
        }
    ]
};
