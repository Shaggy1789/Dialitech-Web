export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    period: '/month',
    description: 'Essential tools for small clinics starting with dialysis patient management.',
    featured: false,
    features: [
      'Up to 20 patients',
      'Basic patient profiles',
      'Session scheduling',
      'Email notifications',
      'Standard reports',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: '/month',
    description: 'Complete solution for growing practices with advanced monitoring needs.',
    featured: true,
    features: [
      'Up to 100 patients',
      'Advanced patient profiles',
      'Real-time vital monitoring',
      'Multi-channel alerts',
      'Analytics & reports',
      'Priority support',
      'Team collaboration',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: '/month',
    description: 'Full-scale platform for hospitals and large dialysis networks.',
    featured: false,
    features: [
      'Unlimited patients',
      'Custom patient fields',
      'Advanced monitoring suite',
      'Critical alert system',
      'Custom reports & BI',
      'Dedicated support manager',
      'White-label options',
      'SSO & SAML',
      'On-premise deployment',
      'SLA guarantee',
    ],
  },
];

export const faqs = [
  {
    question: 'What is DiaMonitor and how does it work?',
    answer: 'DiaMonitor is a comprehensive platform for managing and monitoring hemodialysis patients. It provides real-time vital sign tracking, session scheduling, alert management, and detailed analytics — all from a single dashboard accessible on any device.',
  },
  {
    question: 'Is my patient data secure?',
    answer: 'Yes. DiaMonitor is HIPAA-compliant and uses end-to-end encryption for all patient data. We follow industry best practices for security, including regular audits, role-based access control, and secure data centers with 99.9% uptime.',
  },
  {
    question: 'Can I try DiaMonitor before purchasing?',
    answer: 'Yes. We offer a 14-day free trial of our Professional plan with full access to all features. No credit card is required to get started.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'All plans include email support with a 24-hour response time. Professional and Enterprise plans include priority support with faster response times. Enterprise customers also receive a dedicated support manager.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will be applied at the start of the next billing cycle. Your data is always preserved.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes. All plans are available with a 20% discount when billed annually. Contact our sales team for more information about customized enterprise pricing.',
  },
];
