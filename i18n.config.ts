export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
    alwaysRedirect: true,
    fallbackLocale: 'en',
    cookieExpires: 365,
  },
  messages: {
    en: {
      welcome: 'Welcome',
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
          schoolInfo: {
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
        initialForm: {
          titles: {
            main: 'Initial Data',
            contact: 'Contact Information',
            geographic: 'Geographic Data',
          },
          descriptions: {
            contact:
              'Give us your contact information so we can initiate the integration of your institution on our platform.',
            geographic: 'Give us the geographical data of your institution.',
          },
          fields: {
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
        },
        schoolForm: {
          title: 'School Information',
          fields: {
            name: {
              label: 'School name',
              placeholder: 'Enter school name',
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
          submit: 'Submit',
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
        title: 'Login',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        forgotPassword: 'Forgotten password?',
        loginButton: 'Login',
      },
      registrationPage: {
        title: 'Registration',
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
          copyright: '©; {year} UniTrack. All rights reserved.',
          privacyPolicy: 'Privacy Policy',
          termsOfService: 'Terms of Service',
          cookiePolicy: 'Cookie Policy',
        },
      },
    },
    bg: {
      welcome: 'Добре дошли',
      navigation: {
        home: 'Начало',
        analytics: 'Анализи',
        support: 'Поддръжка',
        login: 'Вход',
        register: 'Регистрация',
      },
      indexPage: {
        title: 'UniTrack',
        subtitle:
          'Революция в управлението на образованието с мощни анализи и прозрения',
        getStarted: 'Започнете сега',
        featuresTitle: 'Мощни функции',
        featuresSubtitle:
          'Всичко необходимо за ефективно управление на вашата образователна институция',
        features: [
          {
            title: 'Проследяване на оценки',
            description:
              'Наблюдавайте академичното представяне с подробни прозрения и сравнения',
            badge: 'Най-популярно',
            subFeatures: [
              'Актуализации на оценки в реално време',
              'Анализ на представянето',
              'Персонализирани скали за оценяване',
              'Отчети за напредъка',
            ],
          },
          {
            title: 'Управление на присъствие',
            description:
              'Проследяване и анализ на моделите на присъствие за по-добро академично планиране',
            subFeatures: [
              'Автоматизирано проследяване',
              'Известия за отсъствие',
              'Отчети за присъствие',
              'Анализ на моделите',
            ],
          },
          {
            title: 'Училищни анализи',
            description:
              'Цялостни анализи и прозрения за образователните институции',
            badge: 'Ново',
            subFeatures: [
              'Метрики на представянето',
              'Анализ на тенденциите',
              'Персонализирани табла за управление',
              'Визуализация на данни',
            ],
          },
          {
            title: 'Поддръжка на няколко институции',
            description: 'Лесно управление на множество училища и университети',
            subFeatures: [
              'Централизирано управление',
              'Достъп на базата на роли',
              'Прозрения за различни кампуси',
              'Унифицирани отчети',
            ],
          },
        ],
        roadmap: {
          title: 'План за развитие',
          subtitle:
            'Следвайте нашето пътуване, докато изграждаме бъдещето на управлението на образованието',
          roadmapSteps: [
            {
              title: 'Q2 2025',
              description: 'Пускане на мобилно приложение',
              icon: 'ph:rocket-launch-bold',
              heading: 'Мобилен подход',
              details:
                'Пуснете Android приложение с възможности за офлайн работа, синхронизация в реално време и известия за важни актуализации.',
              status: 'В процес',
              keyFeatures: [
                'Нативни приложения',
                'Офлайн режим',
                'Известия',
                'Синхронизация в реално време',
              ],
            },
            {
              title: 'Q3 2025',
              description: 'Интелигентни анализи',
              icon: 'ph:brain-bold',
              heading: 'Анализи с изкуствен интелект',
              details:
                'Внедряване на алгоритми за машинно обучение за предоставяне на предсказуеми анализи, персонализирани учебни пътеки и ранни предупреждения за академично представяне.',
              status: 'Планиране',
              keyFeatures: [
                'Алгоритми за машинно обучение',
                'Предсказуеми анализи',
                'Учебни пътеки',
                'Ранни предупреждения',
              ],
            },
            {
              title: 'Q4 2025',
              description: 'Портал за родители',
              icon: 'ph:users-bold',
              heading: 'Подобрено ангажиране на родителите',
              details:
                'Посветен портал за родители с актуализации в реално време, директни канали за комуникация и цялостно проследяване на напредъка.',
              status: 'Предстоящо',
              keyFeatures: [
                'Актуализации в реално време',
                'Директни съобщения',
                'Проследяване на напредъка',
                'Мобилен достъп',
              ],
            },
            {
              title: 'Q1 2026',
              description: 'Международно разширяване',
              icon: 'ph:globe-bold',
              heading: 'Глобална образователна мрежа',
              details:
                'Поддръжка на няколко езика, функции за съответствие със специфични региони и интеграция с международни образователни стандарти.',
              status: 'Планирано',
              keyFeatures: [
                'Многоезичност',
                'Съответствие',
                'Интеграция',
                'Глобални стандарти',
              ],
            },
          ],
        },
        contacts: {
          title: 'Свържете се с нас',
          subtitle:
            'Имате въпроси за UniTrack? Ще се радваме да ни отговорите. Изпратете ни съобщение и ние ще ви отговорим възможно най-скоро.',
          cards: [
            {
              icon: 'ph:headset-bold',
              title: 'Поддръжка',
              description: '24/7 поддръжка за всички ваши технически нужди',
              buttonText: 'Свържете се с поддръжката',
            },
            {
              icon: 'ph:currency-circle-dollar-bold',
              title: 'Продажби',
              description:
                'Научете за ценообразуването и корпоративните решения',
              buttonText: 'Говорете с продажбите',
            },
            {
              icon: 'ph:handshake-bold',
              title: 'Партньорства',
              description: 'Проучете възможностите за сътрудничество',
              buttonText: 'Станете наш партньор',
            },
          ],
        },
      },
      errorPage: {
        title: 'Упс! Нещо се обърка',
        pageNotFoundMessage:
          'Съжаляваме, но страницата, която се опитахте да достъпите, не съществува.',
        errorMessage:
          'Съжаляваме, но при обработката на заявката ви възникна грешка.',
        errorText: 'Грешка: ',
        buttonText: 'Върнете се към началната страница',
      },
      getStartedPage: {
        title: 'Започнете да работите с UniTrack',
        description:
          'Изберете своя път, за да започнете пътуването си с платформата за управление на образованието на UniTrack',
        cards: {
          joinCard: {
            title: 'Присъединете се към вашата институция',
            description:
              'Вече сте студент или преподавател в институция, която използва UniTrack? Започнете своето образователно пътуване, като получите достъп до портала на вашата институция.',
            features: {
              records: 'Достъп до вашите академични записи',
              progress: 'Проследяване на напредъка ви в реално време',
              communication: 'Общувайте с преподавателите',
            },
            buttonText: 'Достъп до портала',
          },
          integrationCard: {
            title: 'Интегрирайте вашата институция',
            description:
              'Готови ли сте да трансформирате управлението на вашата образователна институция? Започнете процеса на интеграция, за да отключите пълния потенциал на UniTrack.',
            features: {
              streamline: 'Оптимизиране на административните процеси',
              dataManagement: 'Подобрено управление на данните',
              support: 'Общуване с преподавателите',
            },
            buttonText: 'Започнете интеграция',
          },
        },
      },
      institutionSelection: {
        headers: {
          institutionType: 'Изберете вашия тип институция',
          schoolOptions: 'Опции за интеграция на училището',
          institutionTypeDesc:
            'Изберете типа образователна институция, която искате да интегрирате с UniTrack',
          schoolOptionsDesc:
            'Започнете нова интеграционна заявка или проверете статуса на съществуваща',
        },
        backButton: 'Обратно към избор на институция',
        cards: {
          school: {
            title: 'Интеграция на училище K-12',
            description:
              'Трансформирайте административните процеси на вашето училище с цялостно решение, специално проектирано за управление на K-12 образование.',
            features: {
              curriculum: 'Управление на учебната програма по класове',
              communication:
                'Инструменти за комуникация между родители и учители',
              tracking: 'Проследяване на присъствие и поведение',
            },
            button: 'Започнете интеграция на училище',
          },
          university: {
            title: 'Интеграция на висше образование',
            description:
              'Издигнете управлението на образованието във вашия колеж или университет с нашата цялостна платформа, проектирана за институции за висше образование.',
            features: {
              credits: 'Управление на кредити за курсове',
              research: 'Поддръжка на изследователски програми',
              collaboration:
                'Инструменти за сътрудничество между преподаватели',
            },
            button: 'Започнете интеграция на ВУЗ',
          },
          newApplication: {
            title: 'Започнете нова заявка',
            description:
              'Започнете вашето пътешествие за трансформиране на административните процеси на вашето училище с цялостното интеграционно решение на UniTrack.',
            features: {
              setup: 'Настройка стъпка по стъпка',
              options: 'Персонализируеми опции за интеграция',
              support: '24/7 поддръжка по време на настройката',
            },
            button: 'Започнете процеса на интеграция',
          },
          checkStatus: {
            title: 'Проверете статуса на заявката',
            description:
              'Вече започнахте процеса на интеграция? Проследете статуса на вашата заявка и продължете оттам, където сте спрели.',
            features: {
              updates: 'Актуализации в реално време',
              timeline: 'Преглед на времевата линия на заявката',
              support: 'Директен достъп до поддръжка',
            },
            button: 'Проверете статуса на заявката',
          },
        },
      },
      onboarding: {
        title: 'Регистрация на училище',
        steps: {
          initialData: {
            title: 'Добавяне на начални данни',
            description:
              'Дайте ни вашата контактна информация, за да можем да потвърдим самоличността ви и да започнем интеграцията',
          },
          verification: {
            description:
              'Проверяваме подадените от вас данни, тази страница ще се актуализира автоматично и ако одобрим кандидатурата ви, ще преминете към следващия етап',
          },
          schoolInfo: {
            title: 'Добавяне на информация за училището',
            description:
              'Дайте ни информация за вашето училище като образователна институция, за да можем да генерираме уникалната ви училищна страница в нашата платформа',
          },
          finalize: {
            description:
              'Завършете проекта за настройване на вашата интеграция за нашата платформа',
          },
          approval: {
            title: 'Одобрение',
          },
        },
        initialForm: {
          titles: {
            main: 'Начални данни',
            contact: 'Информация за контакт',
            geographic: 'Географски данни',
          },
          descriptions: {
            contact:
              'Дайте ни вашата контактна информация, за да можем да започнем интеграцията на вашата институция в нашата платформа.',
            geographic: 'Дайте ни географските данни на вашата институция.',
          },
          fields: {
            firstName: {
              label: 'Име',
              placeholder: 'Име',
            },
            lastName: {
              label: 'Фамилия',
              placeholder: 'Фамилия',
            },
            email: {
              label: 'Имейл',
              placeholder: 'Имейл',
            },
            phone: {
              label: 'Телефонен номер',
              placeholder: 'Телефон',
            },
            schoolName: {
              label: 'Име на училището',
              placeholder: 'Име на училището',
            },
            country: {
              label: 'Държава',
              placeholder: 'Държава',
            },
            city: {
              label: 'Град',
              placeholder: 'Град',
            },
            postcode: {
              label: 'Пощенски код',
              placeholder: 'Пощенски код',
            },
            street: {
              label: 'Улица',
              placeholder: 'Улица',
            },
          },
          submit: 'Изпрати',
        },
        success: {
          title: 'Всичко е готово!',
          message: 'Насладете се на нашата платформа',
          button: 'Завърши',
        },
        finalStep: {
          title: 'Последна стъпка',
          // Add Bulgarian translations for finalStep
        },
        approval: {
          status: {
            pending: 'в процес',
            approved: 'одобрен',
            rejected: 'отхвърлен',
          },
          messages: {
            pending: 'Вашата заявка се разглежда',
            approved: 'Добре дошли на борда!',
            rejected: 'За съжаление, вашата заявка не беше одобрена',
          },
          buttons: {
            continue: 'Продължи',
            applyAgain: 'Кандидатствай отново',
          },
        },
        schoolForm: {
          title: 'Информация за училището',
          fields: {
            name: {
              label: 'Име на училището',
              placeholder: 'Въведете име на училището',
            },
            pictures: {
              label: 'Снимки',
              uploadText: 'Натиснете за качване',
            },
            founded: {
              label: 'Основано на',
            },
            type: {
              label: 'Тип',
              placeholder: 'Въведете тип на училището',
            },
            description: {
              label: 'Описание',
              placeholder: 'Въведете описание на училището',
            },
            programs: {
              label: 'Програми',
              placeholder: 'Изберете или добавете програми',
            },
          },
          submit: 'Изпрати',
        },
      },
      userBanner: {
        welcomeMessage: 'Добре дошли обратно, {name}',
        profileLinked: 'Профилът е свързан',
        profileNotLinked: 'Профилът не е свързан',
        viewInstitutions: 'Вижте свързани институции',
        noInstitutions: 'Няма свързани институции',
      },
      quickActions: {
        academicTools: {
          title: 'Учебни инструменти',
          description:
            'Достъп до калкулатори за оценки, тракери за присъствие и планери за обучение',
          buttonText: 'Достъп до инструменти',
        },
        institutionManager: {
          title: 'Управител на институции',
          description:
            'Управлявайте връзките и разрешенията на вашата институция',
          buttonText: 'Управление на институции',
        },
        performanceAnalytics: {
          title: 'Анализи на представянето',
          description:
            'Преглед на подробни данни за вашето академично представяне',
          buttonText: 'Преглед на анализи',
        },
        calendar: {
          title: 'Календар',
          description: 'Проследяване на важни дати, задания и графици',
          buttonText: 'Отворете календара',
        },
        documentCenter: {
          title: 'Център за документи',
          description: 'Достъп и управление на вашите академични документи',
          buttonText: 'Преглед на документи',
        },
        settings: {
          title: 'Настройки',
          description:
            'Персонализирайте своя профил и предпочитания за приложение',
          buttonText: 'Отворете настройките',
        },
      },
      activityList: {
        title: 'Скорошна активност',
        actionButton: 'Виж всички',
        emptyState: {
          message: 'Няма скорошна активност',
          description:
            'Когато извършвате действия, те ще се появяват тук. Проверете отново по-късно, за да видите историята на действията си.',
        },
      },
      soon: {
        title: 'Тази страница в момента е в процес на разработка',
        message:
          'Съдържанието е на път към вас, стараем се с максимални усилия, за да го предоставим възможно най-бързо. Докато чакате, можете да слушате да слушате това.',
      },
      loginPage: {
        title: 'Вход',
        emailLabel: 'Електронна поща',
        emailPlaceholder: 'Въведете вашата електронна поща',
        passwordLabel: 'Парола',
        forgotPassword: 'Забравена парола?',
        passwordPlaceholder: 'Въведете вашата парола',
        loginButton: 'Вход',
      },
      registrationPage: {
        title: 'Регистрация',
        personalInfo: 'Лична информация',
        firstNameLabel: 'Име',
        firstNamePlaceholder: 'Въведете вашето име',
        lastNameLabel: 'Фамилия',
        lastNamePlaceholder: 'Въведете вашата фамилия',
        contactInfo: 'Информация за контакт',
        emailLabel: 'Електронна поща',
        emailPlaceholder: 'Въведете вашата електронна поща',
        passwordLabel: 'Парола',
        passwordPlaceholder: 'Въведете вашата парола',
        phoneNumberLabel: 'Телефонен номер',
        phoneNumberPlaceholder: 'Въведете вашия телефонен номер',
        confirmPasswordLabel: 'Потвъждение на паролата',
        confirmPasswordPlaceholder: 'Потвърдете вашата парола',
        orgInfo: 'Информация за организацията',
        orgNameLabel: 'Име на организацията',
        orgNamePlaceholder: 'Изберете вашата организация',
        orgRoleLabel: 'Роля в организацията',
        orgRolePlaceholder: 'Изберете вашата роля в организацията',
        registerButton: 'Регистрация',
        validation: {
          firstName: {
            required: 'Името е задължително',
          },
          lastName: {
            required: 'Фамилията е задължителна',
          },
          email: {
            required: 'Имейлът е задължителен',
            invalid: 'Невалиден имейл формат',
          },
          phoneNumber: {
            invalid: 'Невалиден телефонен номер',
          },
          password: {
            tooShort: 'Паролата трябва да бъде поне 10 символа',
            requirements:
              'Паролата трябва да съдържа поне една главна буква, една малка буква, една цифра и един специален символ',
          },
          confirmPassword: {
            mismatch: 'Паролите не съвпадат',
          },
        },
      },
      footer: {
        companyInfo: {
          description:
            'Подпомагане на образователните институции с инструменти за анализ и управление от ново поколение.',
        },
        quickLinks: {
          title: 'Бързи връзки',
          features: 'Функции',
          roadmap: 'План',
          documentation: 'Документация',
        },
        contact: {
          title: 'Контакт',
          email: "{'contact@unitrack.edu'}",
          phone: '+1 (555) 123-4567',
        },
        social: {
          title: 'Последвайте ни',
        },
        bottomBar: {
          copyright: '©; {year} UniTrack. Всички права запазени.',
          privacyPolicy: 'Политика за поверителност',
          termsOfService: 'Условия за ползване',
          cookiePolicy: 'Политика за бисквитки',
        },
      },
    },
  },
}));
