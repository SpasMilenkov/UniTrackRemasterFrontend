export default {
  welcome: 'Welcome',
  errors: {
    emailVerificationFailed: 'Email Verification Failed',
    passwordResetFailed: 'Password Reset Failed',
    defaultError: 'An unexpected error occurred. Please try again.',
    failedToLoadData: 'Failed to load data',
    failedToLoadAcademicYears: 'Failed to load academic years',
    failedToLoadSemesters: 'Failed to load semesters',
    failedToLoadClasses: 'Failed to load classes',
    failedToLoadSubjects: 'Failed to load subjects',
    failedToLoadStudents: 'Failed to load students',
    unknownError: 'An unknown error occurred',
    validation: 'Validation Error',
    missingData: 'Required data is missing',
  },
  navigation: {
    home: 'Home',
    analytics: 'Analytics',
    support: 'Support',
    login: 'Login',
    register: 'Register',
    institutions: 'Institutions',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
  },
  indexPage: {
    title: 'UniTrack',
    subtitle: 'Revolutionizing education management with powerful analytics and insights',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    scrollDown: 'Scroll Down',
    videoBackground: 'UniTrack platform background video',
    featuresTitle: 'Powerful Features',
    featuresSubtitle: 'Everything you need to manage your educational institution effectively',
    viewDemo: 'View Demo',
    
    features: [
      {
        title: 'Grade Tracking',
        description: 'Monitor academic performance with detailed insights and comparisons',
        subFeatures: [
          'Real-time grade updates',
          'Performance analytics',
          'Custom grading scales',
          'Progress reports'
        ]
      },
      {
        title: 'Attendance Management',
        description: 'Track and analyze attendance patterns for better academic planning',
        subFeatures: [
          'Automated tracking',
          'Absence notifications',
          'Attendance reports',
          'Pattern analysis'
        ]
      },
      {
        title: 'School Analytics',
        description: 'Comprehensive analytics and insights for educational institutions',
        subFeatures: [
          'Performance metrics',
          'Trend analysis',
          'Custom dashboards',
          'Data visualization'
        ]
      },
      {
        title: 'Multi-Institution Support',
        description: 'Seamlessly manage multiple schools and universities',
        subFeatures: [
          'Centralized management',
          'Role-based access',
          'Cross-campus insights',
          'Unified reporting'
        ]
      }
    ],

    cta: {
      title: 'Ready to Get Started?',
      description: 'Join thousands of educational institutions already using UniTrack to improve their management.'
    },

    roadmap: {
      title: 'Development Roadmap',
      subtitle: 'Follow our journey as we build the future of education management',
      roadmapSteps: [
        {
          title: 'Q2 2025',
          description: 'Mobile App Launch',
          icon: 'ph:rocket-launch-bold',
          heading: 'Mobile-First Approach',
          details: 'Launch Android app with offline capabilities, real-time sync, and push notifications for important updates.',
          status: 'In Progress',
          keyFeatures: [
            'Native applications',
            'Offline mode',
            'Push notifications',
            'Real-time sync'
          ]
        },
        {
          title: 'Q3 2025',
          description: 'Smart Analytics',
          icon: 'ph:brain-bold',
          heading: 'AI-Powered Analytics',
          details: 'Implement machine learning algorithms to provide predictive analytics, personalized learning paths, and early academic performance warnings.',
          status: 'Planning',
          keyFeatures: [
            'Machine learning algorithms',
            'Predictive analytics',
            'Learning pathways',
            'Early warnings'
          ]
        },
        {
          title: 'Q4 2025',
          description: 'Parent Portal',
          icon: 'ph:users-bold',
          heading: 'Enhanced Parent Engagement',
          details: 'Dedicated parent portal with real-time updates, direct communication channels, and comprehensive progress tracking.',
          status: 'Upcoming',
          keyFeatures: [
            'Real-time updates',
            'Direct messaging',
            'Progress tracking',
            'Mobile access'
          ]
        },
        {
          title: 'Q1 2026',
          description: 'Global Expansion',
          icon: 'ph:globe-bold',
          heading: 'Global Education Network',
          details: 'Multi-language support, region-specific compliance features, and integration with international education standards.',
          status: 'Planned',
          keyFeatures: [
            'Multi-language support',
            'Compliance features',
            'International integration',
            'Global standards'
          ]
        }
      ]
    },

    contacts: {
      title: 'Get in Touch',
      subtitle: 'Have questions about UniTrack? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
      cards: [
        {
          icon: 'ph:headset-bold',
          title: 'Support',
          description: '24/7 support for all your technical needs',
          buttonText: 'Contact Support'
        },
        {
          icon: 'ph:currency-circle-dollar-bold',
          title: 'Sales',
          description: 'Learn about pricing and enterprise solutions',
          buttonText: 'Talk to Sales'
        },
        {
          icon: 'ph:handshake-bold',
          title: 'Partnerships',
          description: 'Explore collaboration opportunities',
          buttonText: 'Become a Partner'
        }
      ]
    }
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
          label: 'Type',
          placeholder: 'Enter university type',
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
    welcomeMessage: 'Join UniTrack Today',
    welcomeDescription:
      'Create an account to access our comprehensive education management platform.',
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
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    teacher: 'Teacher',
    institution: 'Institution',
    yes: 'Yes',
    no: 'No',
    notes: 'Notes',
    showing: 'Showing',
    of: 'of',
  },
  dashboard: {
    teacher: {
      title: 'Teacher Dashboard',
      selectClassPrompt: 'Please select a class to begin',
      selectSubjectPrompt: 'Please select a subject to continue',
      noStudentsFound: 'No students found in this class',
    },
    welcome: 'Welcome',
    selectAcademicYear: 'Select Academic Year',
    selectSemester: 'Select Semester',
    selectClass: 'Select Class',
    selectSubject: 'Select Subject',
    tabs: {
      students: 'Students',
      attendance: 'Attendance',
      marks: 'Marks',
      comments: 'Comments',
    },
    stats: {
      students: 'Students',
      subjects: 'Subjects',
      classes: 'Classes',
      todaysClasses: "Today's Classes",
    },
  },
  student: {
    name: 'Name',
    grade: 'Grade',
    absencesCount: 'Absences',
    averageMark: 'Average Mark',
    lastComment: 'Last Comment',
    noComments: 'No comments yet',
    addComment: 'Add Comment',
    addMark: 'Add Mark',
    recordAbsence: 'Record Absence',
    history: 'History',
  },
  marks: {
    management: 'Marks Management',
    addCategory: 'Add Category',
    createCategory: 'Create Mark Category',
    categoryName: 'Category Name',
    weight: 'Weight (%)',
    color: 'Color',
    scale: 'Grade Scale',
    gradeScale: 'Grade Scale',
    value: 'Value',
    description: 'Description',
    date: 'Date',
    comment: 'Comment',
    addComment: 'Add a comment...',
    noCategories: 'No mark categories yet',
    selectCategory: 'Select Category',
    selectDate: 'Select Date',
    descriptionPlaceholder: 'Description (e.g. Test Chapter 1)',
    commentPlaceholder: 'Add a comment about this mark...',
    save: 'Save Marks',
    saveSuccess: 'Marks Saved',
    saveSuccessMessage: 'Student marks have been saved successfully',
    saveError: 'Failed to Save Marks',
    loadError: 'Failed to Load Marks',
    loadCategoriesError: 'Failed to Load Categories',
    saveCategoryError: 'Failed to Add Category',
    categoryAdded: 'Category Added',
    confirmRemoveCategory:
      'Are you sure you want to remove this category? All marks in this category will be lost.',
    studentHistoryTitle: 'Mark History',
    categoryNotFound: 'Mark category not found',
    pass: 'Pass',
    fail: 'Fail',
    history: 'View History',
    types: {
      general: 'General',
      behavior: 'Behavior',
      academic: 'Academic',
      positive: 'Positive',
      improvement: 'Improvement',
      attendance: 'Attendance',
    },
  },
  comments: {
    management: 'Comments Management',
    add: 'Add Comment',
    batchAdd: 'Batch Add Comment',
    editComment: 'Edit Comment',
    addComment: 'Add Comment',
    commentType: 'Comment Type',
    selectType: 'Select Type',
    content: 'Content',
    contentPlaceholder: 'Enter your comment here...',
    visibilityLabel: 'Visibility',
    selectStudents: 'Select Students',
    date: 'Date',
    noComments: 'No comments yet',
    confirmDelete: 'Are you sure you want to delete this comment?',
    contentRequired: 'Comment content is required',
    noStudentsSelected: 'Please select at least one student',
    saveSuccess: 'Comment Saved',
    saveSuccessMessage: 'Comment has been saved successfully',
    saveError: 'Failed to Save Comment',
    loadError: 'Failed to Load Comments',
    types: {
      general: 'General',
      behavior: 'Behavior',
      academic: 'Academic',
      positive: 'Positive',
      improvement: 'Improvement',
      attendance: 'Attendance',
    },
    visibility: {
      teacher: 'Teachers Only',
      student: 'Student & Teachers',
      parent: 'Parents & Teachers',
      all: 'All (Public)',
    },
  },
  attendance: {
    save: 'Save Attendance',
    selectDate: 'Please select a date',
    studentList: 'Student List',
    markAllPresent: 'Mark All Present',
    import: 'Import',
    status: 'Status',
    statuses: {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',
    },
    note: 'Note',
    addNote: 'Add a note...',
    totalStudents: 'Total Students',
    present: 'Present',
    absent: 'Absent',
    attendance: 'Attendance',
    saveSuccess: 'Attendance Saved',
    saveSuccessMessage: 'Attendance records have been saved successfully',
    saveError: 'Failed to Save Attendance',
    loadError: 'Failed to Load Attendance',
    importTitle: 'Import Attendance',
    importNotImplemented: 'Attendance import feature is not yet implemented',
    date: 'Date',
    type: 'Type',
    lesson: 'Lesson',
    reason: 'Reason',
    excused: 'Excused',
    excusedNote:
      "This absence is excused and won't affect attendance statistics",
    unexcusedNote:
      'This absence is not excused and will affect attendance statistics',
    notesPlaceholder: 'Add any details about this absence...',
    notification: 'Notification',
    notifyParent: 'Notify parent about this absence',
    absenceHistory: 'Absence History',
    duration: 'Duration',
    selectReason: 'Select Reason',
    selectType: 'Select Type',
    modes: {
      manual: 'Manual Entry',
      qr: 'QR Code Scan',
    },
    types: {
      full: 'Full Day',
      late: 'Late',
      lesson: 'Specific Lesson',
    },
    reasons: {
      illness: 'Illness',
      family: 'Family Reasons',
      medical: 'Medical Appointment',
      transport: 'Transportation Issues',
      school: 'School Activity',
      other: 'Other',
    },
  },
  actions: {
    refresh: 'Refresh',
    quickActions: 'Quick Actions',
    title: 'Actions',
    filter: 'Filter',
    export: 'Export',
    mark: 'Mark',
    comment: 'Comment',
    absence: 'Absence',
    takeAttendance: 'Take Attendance',
    addMarks: 'Add Marks',
    scheduleEvent: 'Schedule Event',
    viewTimetable: 'View Timetable',
  },
  validation: {
    required: 'This field is required',
    weightRange: 'Weight must be between 1 and 100',
    error: 'Validation Error',
    checkFields: 'Please check all required fields',
  },
  success: {
    attendanceSaved: 'Attendance has been saved successfully',
    marksSaved: 'Marks have been saved successfully',
    commentsSaved: 'Comments have been saved successfully',
  },
  filters: {
    all: 'All Students',
    withAbsences: 'With Absences',
    withComments: 'With Comments',
    withLowMarks: 'With Low Marks',
  },
  settings: {
    title: 'Account Management',
    tryAgain: 'Try again',
    profileImage: {
      modalTitle: 'Update Profile Picture',
      previewAlt: 'Profile preview',
      currentAlt: 'Current profile',
      selectButton: 'Select Image',
      uploadButton: 'Upload',
      cancelButton: 'Cancel',
      uploadSuccess: 'Profile picture updated successfully',
      uploadError: 'Failed to upload profile picture',
    },
    menu: {
      profile: 'Profile',
      security: 'Security',
      appearance: 'Appearance',
      privacy: 'Privacy',
    },
    appearance: {
      title: 'Appearance',
      subtitle: 'Customize how UniTrack looks for you',
      themeSection: 'Theme',
      accentColorSection: 'Accent Color',
      accentColorDescription:
        'Changing the accent color will update the primary and secondary colors used throughout the interface.',
      themes: {
        dark: 'Dark',
        light: 'Light',
        system: 'System',
      },
      colors: {
        green: 'Green',
        blue: 'Blue',
        purple: 'Purple',
        pink: 'Pink',
        red: 'Red',
        amber: 'Amber',
        teal: 'Teal',
      },
      notifications: {
        themeChanged: 'Theme set to {theme}',
        accentColorChanged: 'Accent color set to {color}',
      },
    },
    profile: {
      title: 'Profile',
      subtitle: 'Your public profile information visible to other users',
      profilePicture: 'Profile Picture',
      changeImage: 'Change',
      personalInfo: {
        firstName: 'First Name',
        firstNamePlaceholder: 'First Name',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Last Name',
        displayName: 'Display Name',
        displayNamePlaceholder: 'Display Name',
        displayNameHelp: 'This is how others will see you in the system',
        email: 'Email',
        emailPlaceholder: 'Email',
        phone: 'Phone',
        phonePlaceholder: 'Phone Number',
      },
      buttons: {
        editProfile: 'Edit Profile',
        saveChanges: 'Save Changes',
        cancel: 'Cancel',
      },
    },
    organization: {
      title: 'Organization',
      subtitle: 'Information about your institution and role',
      institutionLabel: 'Institution',
      roleLabel: 'Role',
      positionLabel: 'Position',
      departmentLabel: 'Department',
      departmentPlaceholder: 'Department',
      gradeLabel: 'Grade/Class',
      permissionsLabel: 'Permissions',
      roles: {
        user: 'User',
        admin: 'Administrator',
        student: 'Student',
        teacher: 'Teacher',
        parent: 'Parent',
      },
      permissions: {
        manage_users: 'Manage Users',
        view_reports: 'View Reports',
        edit_content: 'Edit Content',
        manage_grades: 'Manage Grades',
        manage_courses: 'Manage Courses',
        manage_faculty: 'Manage Faculty',
        manage_students: 'Manage Students',
        manage_settings: 'Manage Settings',
        manage_billing: 'Manage Billing',
        full_access: 'Full Access',
      },
      buttons: {
        editInfo: 'Edit Organization Info',
        saveChanges: 'Save Changes',
        cancel: 'Cancel',
      },
    },
    security: {
      title: 'Security',
      subtitle: 'Manage your password and account security settings',
      password: {
        title: 'Change Password',
        currentPassword: 'Current Password',
        currentPasswordPlaceholder: 'Enter your current password',
        newPassword: 'New Password',
        newPasswordPlaceholder: 'Enter your new password',
        confirmPassword: 'Confirm New Password',
        confirmPasswordPlaceholder: 'Confirm your new password',
        updateButton: 'Update Password',
      },
      twoFactor: {
        title: 'Two-Factor Authentication',
        description:
          'Add an extra layer of security to your account by enabling two-factor authentication.',
        enableButton: 'Enable Two-Factor Authentication',
      },
    },
    privacy: {
      title: 'Privacy',
      subtitle: 'Manage your data and privacy settings',
      saveButton: 'Save Privacy Settings',
      dataUsage: {
        title: 'Data Usage',
        analytics: {
          title: 'Analytics and Improvements',
          description:
            'Allow anonymous data collection to help us improve the platform',
        },
      },
      communications: {
        title: 'Communications',
        emailUpdates: {
          title: 'Email Updates',
          description: 'Receive important notifications and updates via email',
        },
        marketingEmails: {
          title: 'Marketing Emails',
          description: 'Receive promotional content and newsletters',
        },
      },
      profileVisibility: {
        title: 'Profile Visibility',
        description: 'Who can see your profile information',
      },
    },
  },
  footer: {
    companyInfo: {
      description:
        'Empowering educational institutions with next-generation analytics and management tools.',
      subscribeSuccess: 'Successfully subscribed to our newsletter!',
      subscribeError: 'An error occurred while subscribing. Please try again.',
    },
    platform: {
      title: 'Platform',
      features: 'Features',
      getStarted: 'Get Started',
      demo: 'Demo',
    },
    resources: {
      title: 'Resources',
      documentation: 'Documentation',
      api: 'API',
      status: 'Status',
    },
    support: {
      followUs: 'Follow Us',
      linkedin: 'LinkedIn Profile',
      github: 'GitHub Profile',
    },
    bottomBar: {
      copyright: '© {year} UniTrack. All rights reserved.',
      privacy: 'Privacy Policy',
      selectLanguage: 'Select Language',
      toggleTheme: 'Toggle Theme',
    },
  },
  institutionCard: {
    defaultDescription:
      'A {category} institution dedicated to academic excellence and student success.',
    features: {
      programs: '{count} Programs',
      students: '{count} Students',
      departments: '{count} Departments',
      acceptanceRate: '{rate}% Acceptance',
      websiteAvailable: 'Website Available',
      established: 'Est. {year}',
      contactAvailable: 'Contact Available',
    },
    actions: {
      exploreSchool: 'Explore School',
      exploreUniversity: 'Explore University',
      share: 'Share {type}',
      contact: 'Contact institution',
    },
    share: {
      defaultText: 'Learn about {name}',
      urlCopied: 'URL copied to clipboard',
      copyFailed: 'Failed to copy URL',
    },
  },
  semesterSelector: {
    defaultLabel: 'Academic Semester',
    placeholder: 'Select semester',
    noSemestersAvailable: 'No semesters available',
    useCurrentSemester: 'Use Current Semester',
    currentSemesterTag: 'Current Semester',
    autoSelectInfo: 'Automatically using current semester: {semesterName}',
    info: {
      semester: 'Semester',
      academicYear: 'Academic Year',
      startDate: 'Start Date',
      endDate: 'End Date',
    },
  },
  invitationModal: {
    titles: {
      default: 'Accept Invitation',
      withType: 'Accept {type} Invitation',
    },
    buttons: {
      accept: 'Accept Invitation',
      cancel: 'Cancel',
    },
    confirmationText:
      "You're about to accept an invitation to join <strong>{institutionName}</strong>",
    roleDetails: {
      title: 'Role Details',
      position: 'Position',
      type: 'Type',
      gradeClass: 'Grade/Class',
      additionalInfo: 'Additional Information',
    },
    notice: {
      title: 'What happens next?',
      general: {
        systemAccess: "You'll gain access to the institution's systems",
        accountLinked: 'Your account will be linked to this role',
        redirectDashboard: "You'll be redirected to your new dashboard",
      },
      student: {
        access:
          'You can access your grades, assignments, and class information',
      },
      teacher: {
        access: 'You can manage your classes, students, and course materials',
      },
      admin: {
        access: "You'll have administrative access to manage the institution",
      },
    },
  },
  declineModal: {
    titles: {
      default: 'Decline Invitation',
      withType: 'Decline {type} Invitation',
    },
    buttons: {
      decline: 'Decline Invitation',
      cancel: 'Cancel',
    },
    confirmationText:
      "You're about to decline the invitation from <strong>{institutionName}</strong>",
    invitationDetails: {
      title: 'Invitation Details',
      position: 'Position',
      type: 'Type',
      gradeClass: 'Grade/Class',
    },
    form: {
      reasonLabel: 'Reason for declining (optional)',
      reasonPlaceholder:
        "Please let us know why you're declining this invitation...",
      reasonHelp: 'This information helps improve our invitation process',
    },
    warning: {
      title: 'Please note',
      cannotUndo: 'This action cannot be undone',
      adminNotified: 'The institution administrator will be notified',
      futureInvitation: 'You may receive another invitation in the future',
      otherMeans:
        'You can still apply to join this institution through other means',
    },
  },
  invitationDetailsModal: {
    titles: {
      default: 'Invitation Details',
      withType: '{type} Invitation Details',
    },
    header: {
      positionType: '{type} Position',
    },
    sections: {
      institutionDetails: 'Institution Details',
      roleInformation: 'Role Information',
      timeline: 'Timeline',
      nextSteps: 'Next Steps',
    },
    labels: {
      institutionName: 'Institution Name',
      institutionId: 'Institution ID',
      positionTitle: 'Position Title',
      profileType: 'Profile Type',
      gradeClassAssignment: 'Grade/Class Assignment',
      additionalInformation: 'Additional Information',
    },
    timeline: {
      invitationSent: 'Invitation Sent',
      currentStatus: 'Current Status',
    },
    nextSteps: {
      reviewDetails: 'Review the invitation details carefully',
      acceptInvitation:
        'Accept the invitation to gain access to the institution',
      contactInstitution: 'Contact the institution if you have any questions',
      declineWarning:
        "Decline if you're not interested (this action cannot be undone)",
    },
    buttons: {
      close: 'Close',
      decline: 'Decline',
      accept: 'Accept',
    },
    statusDescriptions: {
      pending: 'Waiting for your response',
      active: 'Invitation has been accepted',
      rejected: 'Invitation was declined',
      inactive: 'Profile is currently inactive',
      suspended: 'Profile has been suspended',
    },
  },
    institutions: {
    header: {
      title: 'My Institutions'
    },
    search: {
      placeholder: 'Search institutions...'
    },
    views: {
      list: 'List',
      grid: 'Grid'
    },
    states: {
      empty: {
        title: 'No Institutions Found',
        description: 'Get started by adding your first institution'
      }
    },
    actions: {
      dashboard: 'Dashboard',
      goToDashboard: 'Go to Dashboard'
    },
    tabs: {
      details: 'Details',
      gallery: 'Gallery'
    },
    details: {
      description: 'Description',
      type: 'Type',
      motto: 'Motto',
      established: 'Established',
      contact: 'Contact',
      location: 'Location',
      accreditations: 'Accreditations',
      visitWebsite: 'Visit Website'
    },
    types: {
      PublicSchool: 'Public School',
      PrivateSchool: 'Private School',
      CharterSchool: 'Charter School',
      InternationalSchool: 'International School',
      PublicUniversity: 'Public University',
      PrivateUniversity: 'Private University',
      CommunityCollege: 'Community College',
      TechnicalCollege: 'Technical College',
      LiberalArtsCollege: 'Liberal Arts College',
      PrimarySchool: 'Primary School',
      SecondarySchool: 'Secondary School',
      HighSchool: 'High School',
      VocationalSchool: 'Vocational School',
      SpecialEducationSchool: 'Special Education',
      LanguageSchool: 'Language School',
      Other: 'Other'
    },
    accreditations: {
      Regional: 'Regional',
      National: 'National',
      International: 'International',
      Professional: 'Professional',
      Specialized: 'Specialized',
      Religious: 'Religious',
      Distance: 'Distance Learning',
      Online: 'Online',
      Hybrid: 'Hybrid',
      Programmatic: 'Programmatic',
      Institutional: 'Institutional',
      Other: 'Other'
    },
    errors: {
      noUserId: 'No user ID available',
      fetchFailed: 'Failed to fetch institutions'
    }
  },
    absenceForm: {
    header: {
      recordTitle: 'Record Absence',
      editTitle: 'Edit Absence',
      subtitle: 'Track student attendance with semester context and detailed absence documentation',
      indicator: 'Attendance Record'
    },
    sections: {
      semesterContext: 'Semester Context',
      studentSubjectDetails: 'Student & Subject Details',
      attendanceDetails: 'Attendance Details',
      dateRangeNotice: 'Date Range Notice',
      attendanceStatusGuide: 'Attendance Status Guide'
    },
    labels: {
      academicSemester: 'Academic Semester',
      student: 'Student',
      subjectOptional: 'Subject (Optional)',
      teacher: 'Teacher',
      absenceDate: 'Absence Date',
      attendanceStatus: 'Attendance Status',
      excusedAbsence: 'Excused Absence',
      reasonForAbsence: 'Reason for Absence'
    },
    placeholders: {
      currentSemester: 'Current semester',
      selectStudent: 'Select student',
      selectSubject: 'Select subject (optional)',
      teacherAssignment: 'Teacher assignment',
      selectAbsenceDate: 'Select absence date',
      selectAttendanceStatus: 'Select attendance status',
      enterReason: 'Enter reason for absence (optional)'
    },
    helpText: {
      autoSelectedSemester: 'Automatically selected current semester',
      selectStudent: 'Select the student for this attendance record',
      selectSubject: 'Link absence to a specific subject (leave empty for general absence)',
      autoAssignedTeacher: 'Automatically assigned to current teacher',
      absenceDate: 'Date when the student was absent',
      attendanceStatus: 'Choose the appropriate attendance status',
      excusedAbsence: 'Mark whether this absence is officially excused',
      reasonForAbsence: 'Optional: Provide additional context or documentation for the absence'
    },
    statusOptions: {
      absent: 'Absent',
      late: 'Late arrival',
      leftEarly: 'Left Early',
      sick: 'Sick Leave',
      emergency: 'Emergency'
    },
    statusGuide: {
      absent: {
        label: 'Absent',
        description: 'Student was not present for the entire period/day'
      },
      late: {
        label: 'Late',
        description: 'Student arrived after the official start time'
      },
      excused: {
        label: 'Excused',
        description: 'Absence with valid documentation and approval'
      }
    },
    excusedStatus: {
      excusedTitle: 'Excused Absence',
      excusedDescription: 'This absence has a valid reason and documentation',
      unexcusedTitle: 'Unexcused Absence',
      unexcusedDescription: 'This absence is unexcused and may affect academic standing'
    },
    warnings: {
      unexcusedAbsencesWarning: 'Consistent unexcused absences may affect the student\'s academic standing and progression.',
      dateBeforeSemester: {
        title: 'Date Before Semester',
        message: 'The selected date is before the semester start date ({date}).'
      },
      dateAfterSemester: {
        title: 'Date After Semester',
        message: 'The selected date is after the semester end date ({date}).'
      }
    },
    actions: {
      cancel: 'Cancel',
      recordAbsence: 'Record Absence',
      updateAbsence: 'Update Absence',
      clearValidation: 'Clear Validation'
    },
    emptyStates: {
      noStudents: 'No students available',
      noSubjects: 'No subjects available'
    },
    validation: {
      studentRequired: 'Student is required',
      statusRequired: 'Status is required',
      dateRequired: 'Date is required'
    },
    notifications: {
      validationError: {
        title: 'Validation Error',
        content: 'Please check the form for errors',
        fallback: 'Please check your form inputs'
      }
    },
    defaultValues: {
      currentTeacher: 'Current Teacher'
    },
    debug: {
      title: 'Debug Info',
      date: 'Date',
      status: 'Status',
      isExcused: 'Is Excused',
      reason: 'Reason',
      studentId: 'Student ID',
      subjectId: 'Subject ID',
      semesterId: 'Semester ID',
      teacherId: 'Teacher ID',
      validationErrors: 'Validation Errors',
      semesterOptions: 'Semester Options',
      selectedSemester: 'Selected Semester',
      propsSemesterId: 'Props Semester ID',
      propsSemesterOptionsLength: 'Props Semester Options Length',
      validationClearTest: 'Validation Clear Test',
      clean: 'CLEAN',
      hasErrors: 'HAS ERRORS'
    }
  }
};
