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
        orgRole: 'Organization Role',
        orgRolePlaceholder: 'Select your role in the organization',
        registerButton: 'Register',
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
        orgRole: 'Роля в организацията',
        orgRolePlaceholder: 'Изберете вашата роля в организацията',
        registerButton: 'Регистрация',
      },
    },
  },
}));
