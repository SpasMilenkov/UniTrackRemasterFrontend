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
    },
  },
}));
