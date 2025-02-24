import type { InstitutionType } from "~/enums/institution-type.enum";

export default {
  welcome: 'Welcome',
  errors: {
    emailVerificationFailed: 'Email Verification Failed',
    passwordResetFailed: 'Password Reset Failed',
    defaultError: 'An unexpected error occurred. Please try again.',
  },
  navigation: {
    home: 'Home',
    analytics: 'Analytics',
    support: 'Support',
    login: 'Login',
    register: 'Register',
  },
  indexPage: {
    title: 'UniTrack',
    subtitle:
      'Revolutionizing education management with powerful analytics and insights',
    getStarted: 'Get Started',
    featuresTitle: 'Powerful Features',
    featuresSubtitle:
      'Everything you need to manage your educational institution effectively',
    features: [
      {
        title: 'Grade Tracking',
        description:
          'Monitor academic performance with detailed insights and comparisons',
        badge: 'Most Popular',
        subFeatures: [
          'Real-time grade updates',
          'Performance analytics',
          'Custom grading scales',
          'Progress reports',
        ],
      },
      {
        title: 'Attendance Management',
        description:
          'Track and analyze attendance patterns for better academic planning',
        subFeatures: [
          'Automated tracking',
          'Absence notifications',
          'Attendance reports',
          'Pattern analysis',
        ],
      },
      {
        title: 'School Analytics',
        description:
          'Comprehensive analytics and insights for educational institutions',
        badge: 'New',
        subFeatures: [
          'Performance metrics',
          'Trend analysis',
          'Custom dashboards',
          'Data visualization',
        ],
      },
      {
        title: 'Multi-Institution Support',
        description: 'Seamlessly manage multiple schools and universities',
        subFeatures: [
          'Centralized management',
          'Role-based access',
          'Cross-campus insights',
          'Unified reporting',
        ],
      },
    ],
    roadmap: {
      title: 'Our Roadmap',
      subtitle:
        'Follow our journey as we build the future of education management',
      roadmapSteps: [
        {
          title: 'Q2 2025',
          description: 'Mobile App Launch',
          icon: 'ph:rocket-launch-bold',
          heading: 'Mobile First Approach',
          details:
            'Launch Android app with offline capabilities, real-time synchronization, and push notifications for important updates.',
          status: 'In Progress',
          keyFeatures: [
            'Native Apps',
            'Offline Mode',
            'Push Notifications',
            'Real-time Sync',
          ],
        },
        {
          title: 'Q3 2025',
          description: 'AI-Powered Insights',
          icon: 'ph:brain-bold',
          heading: 'Intelligent Analytics',
          details:
            'Implement machine learning algorithms to provide predictive analytics, personalized learning paths, and early warning systems for academic performance.',
          status: 'Planning',
          keyFeatures: [
            'ML Algorithms',
            'Predictive Analytics',
            'Learning Paths',
            'Early Warnings',
          ],
        },
        {
          title: 'Q4 2025',
          description: 'Parent Portal',
          icon: 'ph:users-bold',
          heading: 'Enhanced Parent Engagement',
          details:
            'Dedicated portal for parents with real-time updates, direct communication channels, and comprehensive progress tracking.',
          status: 'Upcoming',
          keyFeatures: [
            'Real-time Updates',
            'Direct Messaging',
            'Progress Tracking',
            'Mobile Access',
          ],
        },
        {
          title: 'Q1 2026',
          description: 'International Expansion',
          icon: 'ph:globe-bold',
          heading: 'Global Education Network',
          details:
            'Multi-language support, region-specific compliance features, and integration with international education standards.',
          status: 'Planned',
          keyFeatures: [
            'Multi-language',
            'Compliance',
            'Integration',
            'Global Standards',
          ],
        },
      ],
    },

    contacts: {
      title: 'Get in Touch',
      subtitle:
        "Have questions about UniTrack? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      cards: [
        {
          icon: 'ph:headset-bold',
          title: 'Support',
          description: '24/7 support for all your technical needs',
          buttonText: 'Contact Support',
          link: '/support',
        },
        {
          icon: 'ph:currency-circle-dollar-bold',
          title: 'Sales',
          description: 'Learn about pricing and enterprise solutions',
          buttonText: 'Talk to Sales',
          link: '/sales',
        },
        {
          icon: 'ph:handshake-bold',
          title: 'Partnerships',
          description: 'Explore collaboration opportunities',
          buttonText: 'Partner with Us',
          link: '/partnerships',
        },
      ],
    },
  },
  errorPage: {
    title: 'Oops! Something went wrong',
    pageNotFoundMessage:
      "We're sorry, but the page you tried to access does not exist.",
    errorMessage:
      "We're sorry, but an error occurred while processing your request.",
    errorText: 'Error: ',
    buttonText: 'Go Back Home',
  },
  getStartedPage: {
    title: 'Get Started with UniTrack',
    description:
      "Choose your path to begin your journey with UniTrack's educational management platform",
    cards: {
      joinCard: {
        title: 'Join Your Institution',
        description:
          "Already a student or faculty member at an institution using UniTrack? Get started with your educational journey by accessing your 's portal.",
        features: {
          records: 'Access your academic records',
          progress: 'Track your progress in real-time',
          communication: 'Communicate with faculty',
        },
        buttonText: 'Access Portal',
      },
      integrationCard: {
        title: 'Integrate Your Institution',
        description:
          "Ready to transform your educational institution's management? Start the integration process to unlock the full potential of UniTrack.",
        features: {
          streamline: 'Streamline administrative processes',
          dataManagement: 'Enhanced data management',
          support: 'Communicate with faculty',
        },
        buttonText: 'Start Integration',
      },
    },
  },
  institutionSelection: {
    headers: {
      institutionType: 'Choose Your Institution Type',
      schoolOptions: 'School Integration Options',
      institutionTypeDesc:
        'Select the type of educational institution you want to integrate with UniTrack',
      schoolOptionsDesc:
        'Start a new integration application or check the status of an existing one',
    },
    backButton: 'Back to Institution Selection',
    cards: {
      school: {
        title: 'K-12 School Integration',
        description:
          "Transform your school's administrative processes with a comprehensive solution designed specifically for K-12 education management.",
        features: {
          curriculum: 'Grade-specific curriculum management',
          communication: 'Parent-teacher communication tools',
          tracking: 'Attendance and behavior tracking',
        },
        button: 'Start School Integration',
      },
      university: {
        title: 'Higher Education Integration',
        description:
          "Elevate your college or university's educational management with our comprehensive platform designed for higher education institutions.",
        features: {
          credits: 'Course credit management',
          research: 'Research program support',
          collaboration: 'Faculty collaboration tools',
        },
        button: 'Start Higher Ed Integration',
      },
      newApplication: {
        title: 'Start New Application',
        description:
          "Begin your journey to transform your school's administrative processes with UniTrack's comprehensive integration solution.",
        features: {
          setup: 'Step-by-step guided setup',
          options: 'Customizable integration options',
          support: '24/7 support during setup',
        },
        button: 'Start Integration Process',
      },
      checkStatus: {
        title: 'Check Application Status',
        description:
          'Already started your integration process? Track your application status and continue where you left off.',
        features: {
          updates: 'Real-time status updates',
          timeline: 'Application timeline view',
          support: 'Direct support access',
        },
        button: 'Check Application Status',
      },
    },
  },
  instructions: {
    title: 'Instructions for Application Process',
    steps: {
      initial: {
        title: 'Initial Application',
        description:
          "Start by filling out the initial application form with your institution's basic information, including contact details and institution type.",
        note: 'Make sure to provide accurate contact information as this will be used for all future communications.',
      },
      verification: {
        title: 'Email Verification',
        description:
          "After submitting the initial form, you'll receive a verification code via email. This code is crucial for tracking your application status.",
        note: 'Keep this verification code confidential - it should not be shared with anyone!',
      },
      review: {
        title: 'Application Review',
        description:
          'Our team will review your application carefully. During this phase, you can track the status of your application using your verification code.',
        note: 'The review process typically takes 2-3 business days.',
      },
      details: {
        title: 'Institution Details',
        description:
          "Once approved, you'll be prompted to provide comprehensive details about your educational institution through a detailed form.",
        note: "Have your institution's documentation ready for this step.",
      },
      setup: {
        title: 'Admin Account Setup',
        description:
          'Finally, an administrator account will be created for your institution. Login credentials will be sent to your registered email address.',
        note: "You'll receive separate emails with your username and password for security purposes.",
      },
    },
    navigation: {
      previous: 'Previous',
      next: 'Next',
    },
  },
  onboarding: {
    title: 'School onboarding',
    steps: {
      initialData: {
        title: 'Add initial data',
        description:
          'Give us your contact information so we can confirm your identity and begin your integration',
      },
      verification: {
        description:
          'We are verifying the data you submitted, this page will update automatically and if we approved your application you will be moved to the next stage',
      },
      institutionInfo: {
        title: 'Add school information',
        description:
          'Give us information about your school as an educational institution so that we can generate your unique school page on our platform',
      },
      finalize: {
        description:
          'Finish the project to setting up your integration for our platform',
      },
      approval: {
        title: 'Approval',
      },
    },
    validation: {
      firstName: {
        required: 'First name is required',
      },
      lastName: {
        required: 'Last name is required',
      },
      email: {
        required: 'Email is required',
        invalid: 'Please enter a valid email address',
      },
      phoneNumber: {
        invalid: 'Please enter a valid phone number',
      },
      institutionName: {
        required: 'Institution name is required',
      },
      institutionType: {
        required: 'Institution type is required',
      },
      country: {
        required: 'Country is required',
      },
      city: {
        required: 'City is required',
      },
      postcode: {
        required: 'Postal code is required',
      },
      street: {
        required: 'Street address is required',
      },
    },
    initialForm: {
      titles: {
        main: 'Institution Registration',
        contact: 'Contact Information',
        institution: 'Institution Details',
        geographic: 'Geographic Location',
      },
      subtitle: 'Register your educational institution',
      mapInstructions: 'Please select your location on the map',
      descriptions: {
        contact: 'Please provide your contact information.',
        institution: 'Tell us about your institution.',
        geographic: 'Specify the location of your institution.',
      },
      fields: {
        institutionName: {
          label: 'Institution Name',
          placeholder: 'Enter institution name',
        },
        institutionType: {
          label: 'Institution Type',
          placeholder: 'Select institution type',
          options: {
            publicSchool: 'Public School',
            privateSchool: 'Private School',
            charterSchool: 'Charter School',
            internationalSchool: 'International School',
            publicUniversity: 'Public University',
            privateUniversity: 'Private University',
            communityCollege: 'Community College',
            technicalCollege: 'Technical College',
            liberalArtsCollege: 'Liberal Arts College',
            primarySchool: 'Primary School',
            secondarySchool: 'Secondary School',
            highSchool: 'High School',
            vocationalSchool: 'Vocational School',
            specialEducationSchool: 'Special Education School',
            languageSchool: 'Language School',
            other: 'Other',
          },
        },
        firstName: {
          label: 'First name',
          placeholder: 'First name',
        },
        lastName: {
          label: 'Last name',
          placeholder: 'Last name',
        },
        email: {
          label: 'Email',
          placeholder: 'Email',
        },
        phone: {
          label: 'Phone number',
          placeholder: 'Phone',
        },
        schoolName: {
          label: 'School name',
          placeholder: 'School name',
        },
        country: {
          label: 'Country',
          placeholder: 'Country',
        },
        city: {
          label: 'City',
          placeholder: 'City',
        },
        postcode: {
          label: 'Postcode',
          placeholder: 'Postcode',
        },
        street: {
          label: 'Street',
          placeholder: 'Street',
        },
      },
      submit: 'Submit',
      validation: {
        institutionName: {
          required: 'Institution name is required',
        },
        institutionType: {
          required: 'Please select an institution type',
        },
      },
    },
    universityForm: {
      sections: {
        basicInfo: 'Basic Information',
        contact: 'Contact Information',
        academic: 'Academic Information',
        specialization: 'Specialization',
        media: 'Media',
      },
      fields: {
        name: {
          label: 'University Name',
          placeholder: 'Enter university name',
        },
        motto: {
          label: 'University Motto',
          placeholder: 'Enter motto',
        },
        description: {
          label: 'Description',
          placeholder: 'Describe your university',
        },
        email: {
          label: 'Email',
          placeholder: 'Enter university email',
        },
        phone: {
          label: 'Phone',
          placeholder: 'Enter university phone number',
        },
        website: {
          label: 'Website',
          placeholder: 'Enter university website',
        },
        established: {
          label: 'Established Date',
          placeholder: 'Select establishment date',
        },
        undergraduateCount: {
          label: 'Undergraduate Students',
          placeholder: 'Enter number of undergraduate students',
        },
        graduateCount: {
          label: 'Graduate Students',
          placeholder: 'Enter number of graduate students',
        },
        acceptanceRate: {
          label: 'Acceptance Rate (%)',
          placeholder: 'Enter acceptance rate',
        },
        researchFunding: {
          label: 'Research Funding',
          placeholder: 'Enter research funding amount',
        },
        hasStudentHousing: {
          label: 'Student Housing Available',
        },
        focusAreas: {
          label: 'Focus Areas',
          placeholder: 'Select focus areas',
        },
        departments: {
          label: 'Departments',
          placeholder: 'Add departments',
        },
        images: {
          label: 'Additional Images',
          uploadText: 'Click or drag to upload',
        },
        institutionType: {
          label: "Type",
          placeholder: "Enter university type"
        },
        logo: {
          label: 'University Logo',
          uploadText: 'Upload your logo',
        },
        accreditations: {
          label: 'Accreditations',
          placeholder: 'Select accreditations',
        },
      },
      validation: {
        name: {
          required: 'University name is required',
          min: 'Name must be at least 2 characters',
          max: 'Name must not exceed 200 characters',
        },
        motto: {
          required: 'Motto is required',
          max: 'Motto must not exceed 200 characters',
        },
        description: {
          required: 'Description is required',
          max: 'Description must not exceed 500 characters',
        },
        email: {
          required: 'Email is required',
          invalid: 'Please enter a valid email address',
        },
        phone: {
          required: 'Phone number is required',
          invalid: 'Please enter a valid phone number',
        },
        website: {
          required: 'Website is required',
          invalid: 'Please enter a valid website URL',
        },
        establishedDate: {
          required: 'Establishment date is required',
          future: 'Date cannot be in the future',
          invalid: 'Please enter a valid date',
          range: 'Date must be between 1800 and present',
        },
        undergraduateCount: {
          required: 'Undergraduate count is required',
          min: 'Must be 0 or greater',
          max: 'Must not exceed 100,000',
        },
        graduateCount: {
          required: 'Graduate count is required',
          min: 'Must be 0 or greater',
          max: 'Must not exceed 50,000',
        },
        acceptanceRate: {
          required: 'Acceptance rate is required',
          min: 'Must be 0 or greater',
          max: 'Must not exceed 100',
        },
        researchFunding: {
          required: 'Research funding is required',
          min: 'Must be 0 or greater',
        },
        hasStudentHousing: {
          required: 'Please specify if student housing is available',
        },
        focusAreas: {
          required: 'At least one focus area is required',
          min: 'Please select at least one focus area',
        },
        departments: {
          required: 'At least one department is required',
          min: 'Please add at least one department',
        },
        accreditations: {
          required: 'At least one accreditation is required',
          min: 'Please select at least one accreditation',
        },
      },
      focusAreas: {
        liberalArts: 'Liberal Arts',
        stem: 'STEM',
        business: 'Business',
        medical: 'Medical',
        law: 'Law',
        arts: 'Arts',
        technical: 'Technical',
        research: 'Research',
      },
      accreditations: {
        regional: 'Regional',
        national: 'National',
        programmatic: 'Programmatic',
        international: 'International',
        specialized: 'Specialized',
      },
      upload: {
        text: 'Click or drag files to upload',
      },
      submit: 'Submit',
      success: 'University created successfully',
      error: 'Failed to create university',
    },
    success: {
      title: 'You are all set!',
      message: 'Enjoy our platform',
      button: 'Finalize',
    },
    finalStep: {
      title: 'Final Step',
    },
    approval: {
      status: {
        pending: 'pending',
        approved: 'approved',
        rejected: 'rejected',
      },
      messages: {
        pending: 'Your application is being reviewed',
        approved: 'Welcome aboard!',
        rejected: 'Unfortunately, your application was not accepted',
      },
      buttons: {
        continue: 'Continue',
        applyAgain: 'Apply Again',
      },
    },
    schoolForm: {
      title: 'School Information',
      sections: {
        basicInfo: 'Essential information',
        details: 'Details',
      },
      submit: 'Submit',
      fields: {
        logo: {
          label: 'School logo',
          uploadText: 'Upload logo',
        },

        name: {
          label: 'School name',
          placeholder: 'Enter school name',
        },
        motto: {
          label: 'School motto',
          placeholder: 'Enter school motto',
        },
        website: {
          label: 'School website',
          placeholder: 'Enter school website',
        },
        pictures: {
          label: 'Pictures',
          uploadText: 'Click to Upload',
        },
        founded: {
          label: 'Founded at',
        },
        type: {
          label: 'Type',
          placeholder: 'Enter school type',
          options: {
            primarySchool: 'Primary School',
            secondarySchool: 'Secondary School',
            highSchool: 'High School',
            vocational: 'Vocational School',
            specialEducation: 'Special Education',
            languageSchool: 'Language School',
            other: 'Other',
          },
        },
        description: {
          label: 'Description',
          placeholder: 'Enter school description',
        },
        programs: {
          label: 'Programs',
          placeholder: 'Select or add programs',
        },
      },
    },
  },
  userBanner: {
    welcomeMessage: 'Welcome back, {name}',
    profileLinked: 'Profile Linked',
    profileNotLinked: 'Profile Not Linked',
    viewInstitutions: 'View Linked Institutions',
    noInstitutions: 'No Linked Institutions',
  },
  quickActions: {
    academicTools: {
      title: 'Academic Tools',
      description:
        'Access grade calculators, attendance trackers, and study planners',
      buttonText: 'Access Tools',
    },
    institutionManager: {
      title: 'Institution Manager',
      description: 'Manage your institutional connections and permissions',
      buttonText: 'Manage Institutions',
    },
    performanceAnalytics: {
      title: 'Performance Analytics',
      description: 'View detailed insights about your academic performance',
      buttonText: 'View Analytics',
    },
    calendar: {
      title: 'Calendar',
      description: 'Track important dates, assignments, and schedules',
      buttonText: 'Open Calendar',
    },
    documentCenter: {
      title: 'Document Center',
      description: 'Access and manage your academic documents',
      buttonText: 'View Documents',
    },
    settings: {
      title: 'Settings',
      description: 'Customize your profile and application preferences',
      buttonText: 'Open Settings',
    },
  },
  activityList: {
    title: 'Recent Activity',
    actionButton: 'View All',
    emptyState: {
      message: 'No Recent Activity',
      description:
        "When you perform actions, they'll appear here. Check back later to see your activity history.",
    },
  },
  soon: {
    title: 'This page is currently under construction',
    message:
      'The content is coming your way as we are working to the best of our ability to deliver it as fast as possible. While you wait you can listen to this instead.',
  },
  loginPage: {
    welcomeMessage: 'Welcome to UniTrack',
    welcomeDescription: "Let's make learning easier together",
    title: 'Login',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgotten password?',
    loginButton: 'Login',
    rememberMe: 'Remember me',
    noAccount: 'No account?',
    signUpLink: 'Sign up',
  },
  forgotPassword: {
    title: 'Reset Your Password',
    description:
      "Don't worry, we'll help you get back into your account safely.",
    trademark: '© 2024 Your Company. All rights reserved.',
    step1Title: 'Forgot Password',
    step2Title: 'Reset Password',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    newPasswordLabel: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm new password',
    continueButton: 'Continue',
    resetButton: 'Reset Password',
    backToLogin: 'Remember your password?',
    loginLink: 'Login here',
  },
  registrationPage: {
    selectAccountType: 'Select account type',
    selectAccountTypeDesc:
      "UniTrack's mission is to make learning easier and more engaging for everyone. We offer two account types: Organization accounts for members of institutions partnered with UniTrack, and Community accounts for individuals who want to explore UniTrack's community features.",
    communityAccount: 'Community Account',
    communityAccountDesc:
      'Choose this if your school or university is not yet using UniTrack',
    communityFeature1:
      'Gain access to our tooling for creating copy-paste ready charts for your school projects ',
    communityFeature2: 'Access to the school Index',
    communityFeature3: 'Access to all public materials',
    organizationAccount: 'Integrated Account',
    organizationAccountDesc:
      'Choose this if your school or university has already integrated UniTrack',
    orgFeature1: 'All features the community account has access to',
    orgFeature2:
      'Advanced statistics and help based on your individual performance',
    orgFeature3:
      "Materials that are visible only to your educational institution's members",
    selectButton: 'Get Started',
    title: 'Registration',
    subtitle: 'Get started with UniTrack',
    backButton: 'Go back',
    personalInfo: 'Personal Information',
    firstNameLabel: 'First Name',
    firstNamePlaceholder: 'Enter your first name',
    lastNameLabel: 'Last Name',
    lastNamePlaceholder: 'Enter your last name',
    contactInfo: 'Contact Information',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    phoneNumberLabel: 'Phone Number',
    phoneNumberPlaceholder: 'Enter your phone number',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    orgInfo: 'Organization Information',
    orgNameLabel: 'Organization',
    orgNamePlaceholder: 'Select yor organization',
    orgRoleLabel: 'Organization Role',
    orgRolePlaceholder: 'Select your role in the organization',
    registerButton: 'Register',
    validation: {
      firstName: {
        required: 'First name is required',
      },
      lastName: {
        required: 'Last name is required',
      },
      email: {
        required: 'Email is required',
        invalid: 'Invalid email format',
      },
      phoneNumber: {
        invalid: 'Invalid phone number',
      },
      password: {
        tooShort: 'Password must be at least 10 characters long',
        requirements:
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      },
      confirmPassword: {
        mismatch: 'Passwords do not match',
      },
    },
  },
  emailConfirmed: {
    title: 'Email Confirmed Successfully',
    description:
      'Your email has been successfully verified. You can now log in to your account.',
    loginButton: 'Go to Login',
    needHelp: 'Need help? ',
    contactSupport: 'Contact Support',
  },
  institutions: {
    linkedInstitutions: 'Linked Institutions',
    linkNew: 'Link New Institution',
    linkFirst: 'Link Your First Institution',
    noInstitutions: "You haven't linked any institutions yet",
    viewDetails: 'View Details',
    unlink: 'Unlink',
    status: {
      active: 'Active',
      pending: 'Pending',
    },
    unlinkConfirmTitle: 'Unlink Institution',
    unlinkConfirmMessage:
      'Are you sure you want to unlink this institution? This action cannot be undone.',
    unlinkSuccess: 'Institution has been successfully unlinked',
    unlinkError: 'Failed to unlink institution. Please try again.',
  },
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  footer: {
    companyInfo: {
      description:
        'Empowering educational institutions with next-generation analytics and management tools.',
    },
    quickLinks: {
      title: 'Quick Links',
      features: 'Features',
      roadmap: 'Roadmap',
      documentation: 'Documentation',
    },
    contact: {
      title: 'Contact',
      email: "{'contact@unitrack.edu'}",
      phone: '+1 (555) 123-4567',
    },
    social: {
      title: 'Follow Us',
    },
    bottomBar: {
      copyright: '© {year} UniTrack. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
    },
  },
};
