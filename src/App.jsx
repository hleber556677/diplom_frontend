import { useEffect, useMemo, useState } from "react";
import homeIcon from "./assets/sidebar-icons/home.png";
import profileIcon from "./assets/sidebar-icons/profile.png";
import leaderboardIcon from "./assets/sidebar-icons/leader-bord.png";
import achievementsIcon from "./assets/sidebar-icons/achievment.png";
import shopIcon from "./assets/sidebar-icons/shop.png";
import tasksIcon from "./assets/sidebar-icons/tasks.png";
import adminIcon from "./assets/sidebar-icons/admin.png";
import authBannerImage from "./assets/sidebar-icons/fon.png";
import module1HeroCat from "./assets/module1/module-1-part-1/hero-cat.png";
import module1Comic from "./assets/module1/module-1-part-1/comix.png";
import module1Start from "./assets/module1/module-1-part-1/start.png";
import module1Part2Comic from "./assets/module1/module-1-part-2/comix-2.png";
import module1Part3Comic from "./assets/module1/module-1-part-3/comix3.png";
import module1FrontbarHero from "./assets/module1/frontbar-hero1.png";

const API_URL = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "access_token";
const MIN_PASSWORD_LENGTH = 8;
const BRAND_NAME = "ЦифроГрад";
const SAFETY_MODULE_SLUG = "safe-internet";
const USER_AVATAR_STORAGE_KEY = "user_avatar_map";
const USER_ACHIEVEMENT_DATES_KEY = "user_achievement_dates";
const USER_AVATAR_MODULES = import.meta.glob("./assets/user-icons/*.png", {
  eager: true,
  import: "default",
});
const USER_AVATAR_OPTIONS = Object.entries(USER_AVATAR_MODULES)
  .map(([path, src]) => {
    const fileName = path.split("/").pop()?.replace(".png", "") || "avatar";
    return {
      id: fileName,
      label: fileName.replace(/-/g, " "),
      src,
    };
  })
  .sort((left, right) => left.label.localeCompare(right.label));
const ACHIEVEMENT_IMAGE_MODULES = import.meta.glob("./assets/achievments-logo/*.png", {
  eager: true,
  import: "default",
});
const ACHIEVEMENT_IMAGES = Object.fromEntries(
  Object.entries(ACHIEVEMENT_IMAGE_MODULES).map(([path, src]) => [
    path.split("/").pop()?.replace(".png", "") || "",
    src,
  ]),
);
const MODULE_IMAGE_MODULES = import.meta.glob("./assets/modules/*.png", {
  eager: true,
  import: "default",
});
const MODULE_IMAGES = Object.fromEntries(
  Object.entries(MODULE_IMAGE_MODULES).map(([path, src]) => [
    path.split("/").pop()?.replace(".png", "") || "",
    src,
  ]),
);
const ACHIEVEMENT_CARD_DEFS = [
  {
    code: "module_1_guard",
    imageKey: "module1",
    accent: "blue",
    title: "Первый дозор",
    description: "Ты завершил первый модуль и стал настоящим помощником цифрового города.",
    rewardPoints: 100,
    modulesRequired: 1,
    dateLabel: "12 мая 2024",
  },
  {
    code: "module_2_detective",
    imageKey: "module2",
    accent: "green",
    title: "Детектив поиска",
    description: "Ты завершил второй модуль и научился лучше ориентироваться в цифровых заданиях.",
    rewardPoints: 200,
    modulesRequired: 2,
    dateLabel: "15 мая 2024",
  },
  {
    code: "module_3_guardian",
    imageKey: "module3",
    accent: "purple",
    title: "Хранитель уважения",
    description: "Ты завершил третий модуль и стал увереннее в цифровом общении и правилах сети.",
    rewardPoints: 300,
    modulesRequired: 3,
    dateLabel: "18 мая 2024",
  },
  {
    code: "module_4_defender",
    imageKey: "module4",
    accent: "gold",
    title: "Защитник цифрового города",
    description: "Ты прошёл все четыре модуля и стал настоящим защитником ЦифроГрада.",
    rewardPoints: 400,
    modulesRequired: 4,
    dateLabel: "22 мая 2024",
  },
];

const ENHANCED_MODULES = {
  [SAFETY_MODULE_SLUG]: {
    parts: [
      {
        title: "Опасности в интернете",
        id: 1,
        introTitle: "В интернете не всё безопасно!",
        introText: "Иногда в интернете приходят странные сообщения.",
        introBullets: [
          "просят пароль",
          "обещают приз",
          "присылают подозрительные файлы",
        ],
        introFooter: "Важно уметь понять: опасно это или безопасно.",
        warmupTitle: "Нажми на опасный предмет",
        warmupItems: ["🎁 «Вы выиграли приз»", "📩 «Сообщение от учителя»", "📎 «Неизвестный файл»"],
        warmupCorrect: 2,
        warmupSuccess: "Верно! Это может быть опасно.",
        gameTitle: "Опасно или безопасно",
        gameDescription:
          "Посмотри на ситуацию и реши, можно ли ей доверять. За каждое верное решение ты получаешь очко внимательности.",
        gameType: "danger-safe",
        scenarios: [
          {
            sender: "Незнакомец_2024",
            message: "Привет! Ты не против, если я скину тебе файл? Он очень смешной",
            attachment: "funny_video.exe",
            correct: "danger",
            explanation: "Файлы с окончанием .exe могут быть вирусами. Не открывай их от незнакомцев!",
          },
          {
            sender: "Одноклассник Артём",
            message: "Ты домашку по математике сделал? Скинь, пожалуйста",
            correct: "safe",
            explanation: "Это сообщение безопасно. Не нужно его отмечать.",
          },
          {
            sender: "Подруга мамы",
            message: "Привет, я подруга твоей мамы. Она просила передать тебе ссылку, перейди обязательно",
            link: "bonus-priz-now.ru",
            correct: "danger",
            explanation: "Незнакомцы могут притворяться знакомыми. Если мама хочет что-то сказать — она скажет сама.",
          },
          {
            sender: "Друг Петя",
            message: "Идёшь гулять в пять?",
            correct: "safe",
            explanation: "Это сообщение безопасно. Не нужно его отмечать.",
          },
          {
            sender: "Игрок_Pro77",
            message: "Слушай, у меня проблема. Можешь одолжить свой аккаунт на час? Очень надо",
            correct: "danger",
            explanation: "Аккаунт — это твои личные данные. Никому его не давай, даже если очень просят.",
          },
        ],
      },
      {
        id: 2,
        title: "Надёжный пароль",
        introTitle: "Пароль — это ключ от твоего аккаунта",
        introText: "Хороший пароль должен:",
        introBullets: [
          "быть длинным",
          "содержать буквы",
          "содержать цифры",
          "содержать символы",
        ],
        warmupTitle: "Какой пароль лучше?",
        warmupItems: ["12345", "кот", "K0t!"],
        warmupCorrect: 2,
        warmupSuccess: "Правильно! Этот пароль сложнее угадать.",
        warmupFooter: "Переход к игре: Создай самый сильный пароль!",
        warmupButtonLabel: "Собрать пароль",
        gameTitle: "Собери пароль",
        gameDescription:
          "Введи пароль и проверь, насколько он надёжный. Чем лучше правило выполнено, тем сильнее защита аккаунта.",
        gameType: "password-builder",
      },
      {
        id: 3,
        title: "Антивирус и обновления",
        introTitle: "Защити своё устройство",
        introText: "Чтобы устройство было безопасным:",
        introBullets: [
          "устанавливай обновления",
          "используй антивирус",
          "не открывай подозрительные файлы",
        ],
        warmupTitle: "Что нужно сделать?",
        warmupQuestion: "Появилось обновление системы",
        warmupItems: ["Установить", "Удалить", "Игнорировать"],
        warmupCorrect: 0,
        warmupSuccess: "Верно! Обновления делают устройство безопаснее.",
        warmupFooter: "Переход к игре: Останови угрозы и защити компьютер!",
        warmupButtonLabel: "Начать защиту",
        gameTitle: "Защити компьютер",
        gameDescription:
          "Перетащи файлы в правильный ящик и реши, какие можно открыть, а какие лучше проверить.",
        gameType: "computer-defense",
        scenarios: [
          {
            name: "урок_5_математика.pdf",
            icon: "📄",
            target: "safe",
            explanation: "Документы и картинки обычно безопасны. Но если файл пришёл от незнакомца — лучше проверить антивирусом.",
          },
          {
            name: "фото_лето.jpg",
            icon: "🖼️",
            target: "safe",
            explanation: "Документы и картинки обычно безопасны. Но если файл пришёл от незнакомца — лучше проверить антивирусом.",
          },
          {
            name: "игра_бесплатно.exe",
            icon: "⚙️",
            target: "suspicious",
            explanation: "Файлы с расширением .exe — это программы. Не запускай их, если ты не уверен в источнике. Это могут быть вирусы.",
          },
          {
            name: "скидка_50%.scr",
            icon: "⚠️",
            target: "suspicious",
            explanation: ".scr — обычно файлы заставок, но вирусы часто маскируются под них. Всегда проверяй антивирусом.",
          },
          {
            name: "расписание.docx",
            icon: "📝",
            target: "safe",
            explanation: "Документы и картинки обычно безопасны. Но если файл пришёл от незнакомца — лучше проверить антивирусом.",
          },
          {
            name: "установка_чита.msi",
            icon: "⚙️",
            target: "suspicious",
            explanation: ".msi — установщики программ. Устанавливай только то, что скачал с официального сайта.",
          },
          {
            name: "реферат_по_биологии.doc",
            icon: "📝",
            target: "safe",
            explanation: "Документы и картинки обычно безопасны. Но если файл пришёл от незнакомца — лучше проверить антивирусом.",
          },
          {
            name: "поздравление_с_днем_рождения.exe",
            icon: "⚠️",
            target: "suspicious",
            explanation: "Файлы с расширением .exe — это программы. Не запускай их, если ты не уверен в источнике. Это могут быть вирусы.",
          },
        ],
      },
    ],
    finalTest: [
      {
        question: "Можно ли открывать файл от незнакомого человека?",
        options: ["Да, если файл выглядит красиво", "Нет, сначала нужно проверить отправителя", "Да, если открыть быстро"],
        correctIndex: 1,
      },
      {
        question: "Какой пароль самый надёжный?",
        options: ["masha2015", "123456", "A!кот123"],
        correctIndex: 2,
      },
      {
        question: "Зачем нужен антивирус?",
        options: ["Чтобы украшать экран", "Чтобы искать и останавливать вредные программы", "Чтобы удалять учебные файлы"],
        correctIndex: 1,
      },
      {
        question: "Нужно ли обновлять программы?",
        options: ["Да, обновления помогают закрывать уязвимости", "Нет, обновления всегда мешают", "Только если хочется сменить цвет"],
        correctIndex: 0,
      },
      {
        question: "Что делать с подозрительной ссылкой?",
        options: ["Сразу открыть", "Переслать друзьям", "Не открывать и сообщить взрослому или учителю"],
        correctIndex: 2,
      },
    ],
  },
};

const emptyAuthForm = {
  email: "",
  display_name: "",
  password: "",
};


function getPath() {
  return window.location.pathname || "/";
}


function parseRoute(pathname) {
  const moduleGameMatch = pathname.match(/^\/modules\/([^/]+)\/parts\/(\d+)\/game$/);
  if (moduleGameMatch) {
    return {
      page: "module_game",
      slug: moduleGameMatch[1],
      part: Number(moduleGameMatch[2]),
    };
  }

  const modulePartMatch = pathname.match(/^\/modules\/([^/]+)\/parts\/(\d+)$/);
  if (modulePartMatch) {
    return {
      page: "module_part",
      slug: modulePartMatch[1],
      part: Number(modulePartMatch[2]),
    };
  }

  if (pathname.startsWith("/modules/") && pathname.endsWith("/test")) {
    return {
      page: "module_test",
      slug: pathname.replace("/modules/", "").replace("/test", ""),
      part: null,
    };
  }

  if (pathname.startsWith("/modules/")) {
    return { page: "module", slug: pathname.replace("/modules/", ""), part: null };
  }

  if (pathname === "/profile") {
    return { page: "profile", slug: "", part: null };
  }

  if (pathname === "/leaderboard") {
    return { page: "leaderboard", slug: "", part: null };
  }

  if (pathname === "/achievements") {
    return { page: "achievements", slug: "", part: null };
  }

  if (pathname === "/shop") {
    return { page: "shop", slug: "", part: null };
  }

  if (pathname === "/tasks") {
    return { page: "tasks", slug: "", part: null };
  }

  if (pathname === "/admin") {
    return { page: "admin", slug: "", part: null };
  }

  return { page: "academy", slug: "", part: null };
}

function getTodayLabel() {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}


export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [route, setRoute] = useState(() => parseRoute(getPath()));
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [modules, setModules] = useState([]);
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userAvatarMap, setUserAvatarMap] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_AVATAR_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [achievementDateMap, setAchievementDateMap] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_ACHIEVEMENT_DATES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [adminForm, setAdminForm] = useState(emptyAuthForm);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [moduleStarted, setModuleStarted] = useState(false);
  const [currentLessonStep, setCurrentLessonStep] = useState(0);
  const [dangerAnswers, setDangerAnswers] = useState({});
  const [dangerMisses, setDangerMisses] = useState({});
  const [dangerFeedback, setDangerFeedback] = useState({
    tone: "neutral",
    text: "Нажимай только на опасные сообщения и объясняй себе, почему они подозрительны.",
  });
  const [dangerToast, setDangerToast] = useState("");
  const [dangerWarning, setDangerWarning] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [defenseAnswers, setDefenseAnswers] = useState({});
  const [defenseFeedback, setDefenseFeedback] = useState({
    tone: "neutral",
    text: "Разложи файлы по двум ящикам и следи за их расширениями.",
  });
  const [defenseToast, setDefenseToast] = useState("");
  const [draggedDefenseIndex, setDraggedDefenseIndex] = useState(null);
  const [activeDropzone, setActiveDropzone] = useState("");
  const [finalTestAnswers, setFinalTestAnswers] = useState({});
  const [finalQuestionIndex, setFinalQuestionIndex] = useState(0);
  const [partWarmups, setPartWarmups] = useState({});
  const [achievementNotice, setAchievementNotice] = useState(null);

  const isRegisterMode = authMode === "register";
  const achievementMap = useMemo(
    () => new Map((profile?.achievements || []).map((achievement) => [achievement.code, achievement])),
    [profile?.achievements],
  );
  const unlockedAchievements = useMemo(
    () => (profile?.achievements || []).filter((achievement) => achievement.unlocked),
    [profile?.achievements],
  );

  useEffect(() => {
    if (!profile?.email || !unlockedAchievements.length) {
      return;
    }

    const userDates = achievementDateMap[profile.email] || {};
    let changed = false;
    const nextUserDates = { ...userDates };

    unlockedAchievements.forEach((achievement) => {
      if (!nextUserDates[achievement.code]) {
        nextUserDates[achievement.code] = getTodayLabel();
        changed = true;
      }
    });

    if (!changed) {
      return;
    }

    const nextMap = {
      ...achievementDateMap,
      [profile.email]: nextUserDates,
    };
    setAchievementDateMap(nextMap);
    localStorage.setItem(USER_ACHIEVEMENT_DATES_KEY, JSON.stringify(nextMap));
  }, [achievementDateMap, profile?.email, unlockedAchievements]);
  const isPasswordTooShort =
    isRegisterMode &&
    authForm.password.length > 0 &&
    authForm.password.length < MIN_PASSWORD_LENGTH;

  const selectedModule = useMemo(
    () => modules.find((module) => module.slug === route.slug) || null,
    [modules, route.slug],
  );
  const firstName = profile?.display_name?.split(" ")[0] || "друг";
  const selectedAvatarId = profile?.email ? userAvatarMap[profile.email] : "";
  const selectedAvatar =
    USER_AVATAR_OPTIONS.find((avatar) => avatar.id === selectedAvatarId) || null;
  const enhancedModule = selectedModule ? ENHANCED_MODULES[selectedModule.slug] || null : null;
  const currentEnhancedPart =
    enhancedModule && route.part
      ? enhancedModule.parts.find((part) => part.id === route.part) || null
      : null;

  useEffect(() => {
    function handlePopState() {
      setRoute(parseRoute(getPath()));
      setSelectedAnswer(null);
      setChallengeResult(null);
      setDashboardError("");
      setModuleStarted(false);
      setCurrentLessonStep(0);
      setDangerAnswers({});
      setDangerMisses({});
      setDangerFeedback({
        tone: "neutral",
        text: "Нажимай только на опасные сообщения и объясняй себе, почему они подозрительны.",
      });
      setDangerToast("");
      setDangerWarning("");
      setPasswordInput("");
      setDefenseAnswers({});
      setDefenseFeedback({
        tone: "neutral",
        text: "Разложи файлы по двум ящикам и следи за их расширениями.",
      });
      setDefenseToast("");
      setDraggedDefenseIndex(null);
      setActiveDropzone("");
      setFinalTestAnswers({});
      setFinalQuestionIndex(0);
      setPartWarmups({});
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(pathname) {
    window.history.pushState({}, "", pathname);
    setRoute(parseRoute(pathname));
    setSelectedAnswer(null);
    setChallengeResult(null);
    setDashboardError("");
    setModuleStarted(false);
    setCurrentLessonStep(0);
    setDangerAnswers({});
    setDangerMisses({});
    setDangerFeedback({
      tone: "neutral",
      text: "Нажимай только на опасные сообщения и объясняй себе, почему они подозрительны.",
    });
    setDangerToast("");
    setDangerWarning("");
    setPasswordInput("");
    setDefenseAnswers({});
    setDefenseFeedback({
      tone: "neutral",
      text: "Разложи файлы по двум ящикам и следи за их расширениями.",
    });
    setDefenseToast("");
    setDraggedDefenseIndex(null);
    setActiveDropzone("");
    setFinalTestAnswers({});
    setFinalQuestionIndex(0);
    setPartWarmups({});
  }

  async function apiFetch(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      throw new Error("Сессия завершилась. Войди снова.");
    }

    return response;
  }

  function getApiErrorMessage(data, fallbackMessage) {
    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data?.detail)) {
      const passwordError = data.detail.find((item) => item.loc?.includes("password"));
      if (passwordError) {
        return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`;
      }

      const nameError = data.detail.find((item) => item.loc?.includes("display_name"));
      if (nameError) {
        return "Имя ученика должно содержать минимум 2 символа.";
      }
    }

    return fallbackMessage;
  }

  async function loadDashboard() {
    if (!token) {
      setModules([]);
      setProfile(null);
      setLeaderboard([]);
      return;
    }

    setDashboardLoading(true);
    setDashboardError("");

    try {
      const [modulesResponse, profileResponse, leaderboardResponse] = await Promise.all([
        apiFetch("/academy/modules"),
        apiFetch("/academy/profile"),
        apiFetch("/academy/leaderboard"),
      ]);

      const [modulesData, profileData, leaderboardData] = await Promise.all([
        modulesResponse.json(),
        profileResponse.json(),
        leaderboardResponse.json(),
      ]);

      setModules(modulesData);
      setProfile(profileData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      setDashboardError(error.message);
    } finally {
      setDashboardLoading(false);
    }
  }

  async function loadAdminData() {
    if (!token || !profile?.is_admin) {
      setAdminUsers([]);
      return;
    }

    setAdminLoading(true);
    setAdminError("");

    try {
      const response = await apiFetch("/academy/admin/users-progress");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Не удалось загрузить данные админки"));
      }
      setAdminUsers(data);
    } catch (error) {
      setAdminError(error.message);
    } finally {
      setAdminLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [token]);

  useEffect(() => {
    localStorage.setItem(USER_AVATAR_STORAGE_KEY, JSON.stringify(userAvatarMap));
  }, [userAvatarMap]);

  useEffect(() => {
    if (route.page === "admin" && profile?.is_admin) {
      loadAdminData();
    }
  }, [route.page, profile?.is_admin]);

  useEffect(() => {
    if (
      (route.page === "module" ||
        route.page === "module_part" ||
        route.page === "module_game" ||
        route.page === "module_test") &&
      route.slug &&
      !selectedModule &&
      modules.length > 0
    ) {
      navigateTo("/academy");
    }
  }, [route.page, route.slug, selectedModule, modules]);

  useEffect(() => {
    if (!dangerToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setDangerToast("");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [dangerToast]);

  useEffect(() => {
    if (!achievementNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAchievementNotice(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [achievementNotice]);

  useEffect(() => {
    if (!defenseToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setDefenseToast("");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [defenseToast]);

  useEffect(() => {
    if (!selectedModule) {
      setModuleStarted(false);
      setCurrentLessonStep(0);
      return;
    }

    if (route.page === "module_test") {
      setModuleStarted(true);
      setCurrentLessonStep(selectedModule.lesson_steps.length - 1);
      return;
    }

    setModuleStarted(Boolean(selectedModule.progress?.completed));
    setCurrentLessonStep(0);
  }, [selectedModule, route.page]);

  function handleAuthChange(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  function handleAdminFormChange(event) {
    const { name, value } = event.target;
    setAdminForm((current) => ({ ...current, [name]: value }));
  }

  function handleAvatarSelect(avatarId) {
    if (!profile?.email) {
      return;
    }

    setUserAvatarMap((current) => ({
      ...current,
      [profile.email]: avatarId,
    }));
    setAvatarPickerOpen(false);
  }

  function getAvatarByEmail(email) {
    const avatarId = userAvatarMap[email];
    return USER_AVATAR_OPTIONS.find((avatar) => avatar.id === avatarId) || null;
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthError("");
    setAuthMessage("");
    setAuthForm(emptyAuthForm);
    setAvatarPickerOpen(false);
    setChallengeResult(null);
    setSelectedAnswer(null);
    navigateTo("/academy");
  }

  async function handleRegister(event) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");

    if (authForm.password.length < MIN_PASSWORD_LENGTH) {
      setAuthError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`);
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authForm),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(getApiErrorMessage(data, "Не удалось зарегистрироваться"));
      }

      setAuthMode("login");
      setAuthMessage("Регистрация прошла успешно. Теперь войди и начни свое путешествие по ЦифроГраду.");
      setAuthForm(emptyAuthForm);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(getApiErrorMessage(data, "Не удалось войти"));
      }

      const data = await response.json();
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      setAuthForm(emptyAuthForm);
      navigateTo("/academy");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleAdminCreateUser(event) {
    event.preventDefault();
    setAdminError("");
    setAdminMessage("");

    try {
      const response = await apiFetch("/auth/admin/users", {
        method: "POST",
        body: JSON.stringify(adminForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Не удалось создать пользователя"));
      }

      setAdminMessage(`Пользователь ${data.display_name} создан.`);
      setAdminForm(emptyAuthForm);
      await loadAdminData();
    } catch (error) {
      setAdminError(error.message);
    }
  }

  async function handleAdminDeleteUser(userId, displayName) {
    const confirmed = window.confirm(`Удалить пользователя ${displayName}?`);
    if (!confirmed) {
      return;
    }

    setAdminError("");
    setAdminMessage("");

    try {
      const response = await apiFetch(`/academy/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(getApiErrorMessage(data, "Не удалось удалить пользователя"));
      }

      setAdminMessage(`Пользователь ${displayName} удалён.`);
      await loadAdminData();
    } catch (error) {
      setAdminError(error.message);
    }
  }

  async function handleSubmitChallenge() {
    if (!selectedModule) {
      return;
    }

    if (selectedAnswer === null) {
      setDashboardError("Выбери ответ перед отправкой теста.");
      return;
    }

    setDashboardError("");

    try {
      const response = await apiFetch(`/academy/modules/${selectedModule.slug}/submit`, {
        method: "POST",
        body: JSON.stringify({ selected_index: selectedAnswer }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Не удалось сохранить результат"));
      }

      setChallengeResult(data);
      if (data.unlocked_achievements?.length) {
        const todayLabel = getTodayLabel();
        if (authForm.email || profile?.email) {
          const currentEmail = profile?.email || authForm.email;
          const userDates = achievementDateMap[currentEmail] || {};
          const nextUserDates = { ...userDates };
          data.unlocked_achievements.forEach((item) => {
            nextUserDates[item.code] = todayLabel;
          });
          const nextMap = {
            ...achievementDateMap,
            [currentEmail]: nextUserDates,
          };
          setAchievementDateMap(nextMap);
          localStorage.setItem(USER_ACHIEVEMENT_DATES_KEY, JSON.stringify(nextMap));
        }
        setAchievementNotice({
          date: todayLabel,
          items: data.unlocked_achievements,
        });
      }
      await loadDashboard();
    } catch (error) {
      setDashboardError(error.message);
    }
  }

  function handleStartModule() {
    setModuleStarted(true);
    setCurrentLessonStep(0);
  }

  function handleAdvanceLessonStep() {
    if (!selectedModule) {
      return;
    }

    if (currentLessonStep >= selectedModule.lesson_steps.length - 1) {
      navigateTo(`/modules/${selectedModule.slug}/test`);
      return;
    }

    setCurrentLessonStep((current) => Math.min(current + 1, selectedModule.lesson_steps.length - 1));
  }

  function getAnswerClassName(index) {
    if (!challengeResult) {
      return selectedAnswer === index ? "answer-card active" : "answer-card";
    }

    if (index === selectedModule?.minigame.correct_index) {
      return "answer-card answer-correct";
    }

    if (index === selectedAnswer && !challengeResult.correct) {
      return "answer-card answer-wrong";
    }

    return selectedAnswer === index ? "answer-card active" : "answer-card";
  }

  function getEnhancedPartStatus(partId) {
    if (route.page === "module_test") {
      return "done";
    }
    if (!route.part) {
      return "pending";
    }
    if (partId < route.part) {
      return "done";
    }
    if (partId === route.part) {
      return "current";
    }
    return "pending";
  }

  function handleWarmupAnswer(partId, answerIndex) {
    setPartWarmups((current) => ({
      ...current,
      [partId]: answerIndex,
    }));
  }

  function getPasswordStrength() {
    const password = passwordInput.trim();
    const hasLetters = /[A-Za-zА-Яа-я]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecial = /[!@#$%]/.test(password);
    const onlyDigits = /^\d+$/.test(password);
    const onlyLetters = /^[A-Za-zА-Яа-я]+$/.test(password);

    if (!password) {
      return { label: "Введи пароль, чтобы проверить силу", tone: "empty", fill: 0 };
    }

    if (password.length >= 8 && hasLetters && hasDigits && hasSpecial) {
      return { label: "Отлично 🛡", tone: "strong", fill: 100 };
    }

    if (password.length >= 6 && password.length <= 7 && hasLetters && hasDigits) {
      return { label: "Хорошо 👍", tone: "medium", fill: 66 };
    }

    if (password.length < 6 || onlyDigits || onlyLetters) {
      return { label: "Слабый 👎", tone: "weak", fill: 33 };
    }

    return { label: "Слабый 👎", tone: "weak", fill: 33 };
  }

  function handleDangerChoice(scenario, index, choice) {
    if (dangerAnswers[index]) {
      setDangerToast("Это сообщение уже отмечено.");
      return;
    }

    setDangerWarning("");

    if (choice === scenario.correct) {
      setDangerAnswers((current) => ({
        ...current,
        [index]: choice,
      }));
      setDangerMisses((current) => {
        const next = { ...current };
        delete next[index];
        return next;
      });
      setDangerFeedback({
        tone: choice === "danger" ? "success" : "neutral",
        text: scenario.explanation,
      });
      setDangerToast(choice === "danger" ? "Верно! Ты нашёл опасное сообщение." : "Верно! Это безопасное сообщение.");
      return;
    }

    setDangerMisses((current) => ({
      ...current,
      [index]: true,
    }));
    setDangerFeedback({
      tone: "warning",
      text: `Неверно. Попробуй ещё раз. ${scenario.explanation}`,
    });
    setDangerWarning(
      choice === "danger"
        ? "Неверно: это сообщение не выглядит опасным. Попробуй ещё раз."
        : "Неверно: здесь есть признак опасности. Попробуй ещё раз."
    );
  }

  function handleDangerNext(nextPath, dangerScore, totalScenarios) {
    if (dangerScore < totalScenarios) {
      setDangerWarning("Сначала правильно разбери все сообщения.");
      return;
    }

    setDangerWarning("");
    navigateTo(nextPath);
  }

  function sortDefenseFile(fileIndex, targetBucket) {
    if (!currentEnhancedPart?.scenarios?.[fileIndex]) {
      return;
    }

    const file = currentEnhancedPart.scenarios[fileIndex];
    if (defenseAnswers[fileIndex]) {
      setDefenseToast("Этот файл уже отсортирован.");
      return;
    }

    setActiveDropzone("");
    setDraggedDefenseIndex(null);

    if (file.target === targetBucket) {
      setDefenseAnswers((current) => ({
        ...current,
        [fileIndex]: targetBucket,
      }));
      setDefenseFeedback({
        tone: "success",
        text: file.explanation,
      });
      return;
    }

    setDefenseFeedback({
      tone: "error",
      text:
        targetBucket === "safe"
          ? "Этот файл выглядит подозрительно. Его лучше не открывать сразу."
          : "Этот файл можно открыть. Попробуй ещё раз и выбери другой ящик.",
    });
    setDefenseToast(
      targetBucket === "safe"
        ? "Этот файл подозрительный. Попробуй ещё раз."
        : "Этот файл безопасен. Попробуй ещё раз.",
    );
  }

  async function handleFinishEnhancedTest() {
    if (!selectedModule || !enhancedModule) {
      return;
    }

    const score = enhancedModule.finalTest.reduce(
      (sum, question, index) => sum + (finalTestAnswers[index] === question.correctIndex ? 1 : 0),
      0,
    );

    if (selectedModule.slug === SAFETY_MODULE_SLUG && score < enhancedModule.finalTest.length) {
      setChallengeResult({
        correct: false,
        explanation: `У тебя ${score} правильных ответов из ${enhancedModule.finalTest.length}. Попробуй ещё раз, ты молодец!`,
      });
      return;
    }

    setDashboardError("");

    try {
      const response = await apiFetch(`/academy/modules/${selectedModule.slug}/submit`, {
        method: "POST",
        body: JSON.stringify({ selected_index: selectedModule.minigame.correct_index }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Не удалось сохранить результат"));
      }

      setChallengeResult({
        ...data,
        explanation: `Отличная работа! У тебя ${score} правильных ответов из ${enhancedModule.finalTest.length}.`,
      });
      if (data.unlocked_achievements?.length) {
        const todayLabel = getTodayLabel();
        if (profile?.email) {
          const userDates = achievementDateMap[profile.email] || {};
          const nextUserDates = { ...userDates };
          data.unlocked_achievements.forEach((item) => {
            nextUserDates[item.code] = todayLabel;
          });
          const nextMap = {
            ...achievementDateMap,
            [profile.email]: nextUserDates,
          };
          setAchievementDateMap(nextMap);
          localStorage.setItem(USER_ACHIEVEMENT_DATES_KEY, JSON.stringify(nextMap));
        }
        setAchievementNotice({
          date: todayLabel,
          items: data.unlocked_achievements,
        });
      }
      await loadDashboard();
    } catch (error) {
      setDashboardError(error.message);
    }
  }

  function renderAuthScreen() {
    return (
      <section className="auth-layout">
        <div className="panel auth-panel">
          <div className="switcher">
            <button
              className={authMode === "login" ? "switch-button active" : "switch-button"}
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
                setAuthMessage("");
              }}
            >
              Войти
            </button>
            <button
              className={authMode === "register" ? "switch-button active" : "switch-button"}
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
                setAuthMessage("");
              }}
            >
              Регистрация
            </button>
          </div>

          <form className="form" onSubmit={authMode === "login" ? handleLogin : handleRegister}>
            {isRegisterMode ? (
              <label>
                <span>Имя ученика</span>
                <input
                  name="display_name"
                  value={authForm.display_name}
                  onChange={handleAuthChange}
                  placeholder="Например, Миша"
                />
              </label>
            ) : null}

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="hero@example.com"
              />
            </label>

            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder={`Минимум ${MIN_PASSWORD_LENGTH} символов`}
              />
              {isRegisterMode ? (
                <small className={isPasswordTooShort ? "field-hint field-hint-error" : "field-hint"}>
                  Для безопасности пароль должен содержать минимум {MIN_PASSWORD_LENGTH} символов.
                </small>
              ) : null}
            </label>

            <button className="primary-button" disabled={authLoading} type="submit">
              {authLoading
                ? "Подожди..."
                : isRegisterMode
                  ? "Создать профиль"
                  : "Войти в платформу"}
            </button>
          </form>

          {authMessage ? <p className="success">{authMessage}</p> : null}
          {authError ? <p className="error">{authError}</p> : null}
        </div>
      </section>
    );
  }

  function renderTopPanel() {
    return (
      <section className="overview-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Профиль ученика</p>
            <h2>{profile?.display_name}</h2>
          </div>
          <button className="ghost-button" type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Уровень</span>
            <strong>{profile?.level_title}</strong>
          </div>
          <div className="stat-card">
            <span>Очки</span>
            <strong>{profile?.total_points ?? 0}</strong>
          </div>
          <div className="stat-card">
            <span>Пройдено тем</span>
            <strong>
              {profile?.completed_modules ?? 0}/{profile?.total_modules ?? 0}
            </strong>
          </div>
        </div>
      </section>
    );
  }

  function renderTopbar() {
    return (
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-building brand-building-blue" />
            <span className="brand-building brand-building-green" />
            <span className="brand-building brand-building-yellow" />
            <span className="brand-building brand-building-purple" />
          </div>
          <div className="brand-block">
            <div className="brand-text">{BRAND_NAME}</div>
            <div className="brand-subtitle">учимся. создаём. понимаем цифровой мир</div>
          </div>
        </div>

        <div className="topbar-user">
          <button className="topbar-user-card" type="button" onClick={() => navigateTo("/profile")}>
            <div className="sidebar-avatar topbar-avatar">
              {selectedAvatar ? (
                <img className="user-avatar-image" src={selectedAvatar.src} alt="" aria-hidden="true" />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="topbar-user-copy">
              <strong>{profile?.display_name}</strong>
              <span>{profile?.total_points ?? 0} очков</span>
            </div>
          </button>
          <button className="topbar-logout" type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>
    );
  }

  function renderSidebar() {
    const menuItems = [
      {
        label: "Главная",
        path: "/academy",
        active: route.page === "academy",
        iconSrc: homeIcon,
      },
      {
        label: "Профиль",
        path: "/profile",
        active: route.page === "profile",
        iconSrc: profileIcon,
      },
      {
        label: "Таблица лидеров",
        path: "/leaderboard",
        active: route.page === "leaderboard",
        iconSrc: leaderboardIcon,
      },
      {
        label: "Достижения",
        path: "/achievements",
        active: route.page === "achievements",
        iconSrc: achievementsIcon,
      },
      {
        label: "Магазин",
        path: "/shop",
        active: route.page === "shop",
        iconSrc: shopIcon,
      },
      {
        label: "Задания",
        path: "/tasks",
        active:
          route.page === "tasks" ||
          route.page === "module" ||
          route.page === "module_part" ||
          route.page === "module_game" ||
          route.page === "module_test",
        iconSrc: tasksIcon,
      },
    ];

    if (profile?.is_admin) {
      menuItems.push({
        label: "Админка",
        path: "/admin",
        active: route.page === "admin",
        iconSrc: adminIcon,
      });
    }

    return (
      <aside className="sidebar-panel" aria-label="Отделы академии">
        <nav className="side-nav">
          {menuItems.map((item) => (
            <button
              className={item.active ? "side-nav-button active" : "side-nav-button"}
              key={item.path}
              type="button"
              onClick={() => navigateTo(item.path)}
            >
              <img className="side-nav-icon-image" src={item.iconSrc} alt="" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" aria-hidden="true" />

      </aside>
    );
  }

  function renderAcademyHome() {
    const availableCoursesImage = ACHIEVEMENT_IMAGES["start-graduate"];
    const completedCoursesImage = ACHIEVEMENT_IMAGES["start-achievment"];
    const routeLeftImage = ACHIEVEMENT_IMAGES["hero-left"];
    const routeRightImage = ACHIEVEMENT_IMAGES["hero-right"];

    return (
      <section className="academy-home dashboard-home">
        <article className="panel city-banner">
          <div className="city-banner-copy">
            <p className="eyebrow">Добро пожаловать</p>
            <h2>Выбери курс и отправляйся исследовать цифровой мир вместе с ЦифроГрадом</h2>
            <p>
              Короткие модули, понятные примеры и игровые задания помогают детям уверенно,
              безопасно и с интересом осваивать цифровую грамотность.
            </p>
            <div className="city-badges">
              <span className="city-badge city-badge-safety">Безопасность</span>
              <span className="city-badge city-badge-create">Создание</span>
              <span className="city-badge city-badge-chat">Общение</span>
            </div>
          </div>
          <div className="city-visual" aria-hidden="true">
            <div className="city-sun" />
            <div className="city-cloud city-cloud-a" />
            <div className="city-cloud city-cloud-b" />
            <div className="city-buildings">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </article>

        <div className="home-grid home-grid-stats">
          <article className="panel metric-card">
            {availableCoursesImage ? (
              <img className="metric-card-image" src={availableCoursesImage} alt="" aria-hidden="true" />
            ) : null}
            <div className="metric-card-copy">
              <strong>{modules.length}</strong>
              <span>Курсов доступно</span>
            </div>
          </article>
          <article className="panel metric-card">
            {completedCoursesImage ? (
              <img className="metric-card-image" src={completedCoursesImage} alt="" aria-hidden="true" />
            ) : null}
            <div className="metric-card-copy">
              <strong>{profile?.completed_modules ?? 0}</strong>
              <span>Курсов пройдено</span>
            </div>
          </article>
        </div>

        <article className="panel exchange-banner">
          <div className="exchange-art exchange-art-left" aria-hidden="true">
            {routeLeftImage ? <img src={routeLeftImage} alt="" /> : null}
          </div>
          <div className="exchange-content">
            <strong>Маршрут по ЦифроГраду</strong>
            <p>
              Начни с базовых правил безопасности, потом перейди к общению, поиску информации
              и творческим цифровым проектам.
            </p>
            <button className="exchange-button" type="button" onClick={() => navigateTo("/tasks")}>
              Смотреть курсы
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="exchange-art exchange-art-right" aria-hidden="true">
            {routeRightImage ? <img src={routeRightImage} alt="" /> : null}
          </div>
        </article>
      </section>
    );
  }

  function renderTasksPage() {
    return (
      <section className="academy-home dashboard-home">
        <article className="panel module-tasks-panel">
          <div className="module-tasks-heading">
            <div>
              <h3>Задания</h3>
              <p>Выполняй задания, набирай очки и открывай новые модули</p>
            </div>
            <span className="module-tasks-count">
              <span aria-hidden="true">★</span>
              {modules.length} задания
            </span>
          </div>

          <div className="module-gallery compact-gallery">
            {modules.map((module, index) => (
            <article className="module-portal" key={module.slug}>
              <div className="module-portal-image-wrap" aria-hidden="true">
                <img
                  className="module-portal-image"
                  src={MODULE_IMAGES[String(index + 1)]}
                  alt=""
                />
              </div>

              <div className="module-portal-content">
                <div className="module-topline">
                  <p className="module-zone">{module.city_zone}</p>
                  <span className="module-state">
                    {module.progress?.completed ? "Готово" : "В процессе"}
                  </span>
                </div>
                <h3>{module.title}</h3>
                <p>{module.summary}</p>
                <div className="module-meta">
                  <span className="module-points">
                    <span aria-hidden="true">★</span>
                    {module.reward_points} очков
                  </span>
                  <span className={module.progress?.completed ? "module-progress done" : "module-progress"}>
                    <span aria-hidden="true">{module.progress?.completed ? "✓" : "!"}</span>
                    {module.progress?.completed ? "Пройдено" : "Новая миссия"}
                  </span>
                </div>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => navigateTo(`/modules/${module.slug}`)}
                >
                  Открыть модуль
                </button>
              </div>
            </article>
            ))}
          </div>

          <div className="module-tasks-footer">
            <span aria-hidden="true">♜</span>
            <p>Проходи задания и получай очки — они помогут тебе стать экспертом цифрового мира!</p>
            <span aria-hidden="true">✦</span>
          </div>
        </article>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="profile-page">
        <article className="panel profile-hero">
          <div className="profile-hero-main">
            <div className="profile-avatar-stack">
              <div className="profile-avatar-large">
                {selectedAvatar ? (
                  <img className="user-avatar-image large" src={selectedAvatar.src} alt="" aria-hidden="true" />
                ) : (
                  firstName.charAt(0).toUpperCase()
                )}
              </div>
              <button
                className="ghost-button avatar-trigger"
                type="button"
                onClick={() => setAvatarPickerOpen((current) => !current)}
              >
                Выбрать аватарку
              </button>
              {avatarPickerOpen ? (
                <div className="avatar-picker-popover">
                  <div className="avatar-picker-grid compact">
                    {USER_AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar.id}
                        className={selectedAvatarId === avatar.id ? "avatar-option active" : "avatar-option"}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar.id)}
                      >
                        <img className="avatar-option-image" src={avatar.src} alt={avatar.label} />
                        <span>{avatar.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div>
              <p className="eyebrow">Личный кабинет</p>
              <h2>{profile?.display_name}</h2>
              <p className="profile-copy">
                Здесь собраны твои успехи, уровень, баллы и достижения в ЦифроГраде.
              </p>
            </div>
          </div>
          <div className="profile-level-badge">
            <span>Твой уровень</span>
            <strong>{profile?.level_title}</strong>
          </div>
        </article>

        <div className="profile-stats-grid">
          <article className="panel metric-card">
            <strong>{profile?.total_points ?? 0}</strong>
            <span>Баллов</span>
          </article>
          <article className="panel metric-card">
            <strong>{profile?.completed_modules ?? 0}</strong>
            <span>Курсов завершено</span>
          </article>
          <article className="panel metric-card">
            <strong>{profile?.total_modules ?? modules.length}</strong>
            <span>Всего курсов</span>
          </article>
        </div>

        <article className="panel profile-progress">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Прогресс</p>
              <h2>Как ты продвигаешься</h2>
            </div>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.max(
                  8,
                  ((profile?.completed_modules ?? 0) / Math.max(profile?.total_modules ?? modules.length, 1)) *
                    100,
                )}%`,
              }}
            />
          </div>
          <p className="muted">
            Ты прошёл {profile?.completed_modules ?? 0} из {profile?.total_modules ?? modules.length} курсов.
          </p>
        </article>

      </section>
    );
  }

  function renderModulePage() {
    if (!selectedModule) {
      return <p className="muted">Модуль не найден.</p>;
    }

    if (enhancedModule) {
      return (
        <section className="module-page safety-part-page">
          <article className="panel module-overview-card module-overview-card-illustrated">
            <img className="module-overview-image" src={module1Start} alt={selectedModule.title} />
            <button
              className="primary-button module-overview-start-button"
              type="button"
              onClick={() => navigateTo(`/modules/${selectedModule.slug}/parts/1`)}
            >
              Начать модуль
            </button>
          </article>
        </section>
      );
    }

    const step = selectedModule.lesson_steps[currentLessonStep];

    return (
      <section className="module-page">
        <div className="panel module-page-head">
          <button className="ghost-button" type="button" onClick={() => navigateTo("/academy")}>
            Назад к заданиям
          </button>

          <div className="module-page-title">
            <p className="eyebrow">{selectedModule.city_zone}</p>
            <h2>{selectedModule.title}</h2>
            <p className="hero-text">{selectedModule.objective}</p>
          </div>

          <div className="pill">
            {selectedModule.progress?.earned_points ?? 0}/{selectedModule.reward_points} очков
          </div>
        </div>

        {dashboardError ? <p className="inline-note">{dashboardError}</p> : null}

        {!moduleStarted ? (
          <article className="panel module-start-card">
            <div className="module-start-visual" aria-hidden="true">
              <div className="start-badge">Старт</div>
              <div className="start-orb start-orb-blue" />
              <div className="start-orb start-orb-green" />
              <div className="start-orb start-orb-yellow" />
            </div>
            <div className="module-start-copy">
              <p className="eyebrow">Начало прохождения</p>
              <h3>{selectedModule.title}</h3>
              <p>{selectedModule.summary}</p>
              <div className="story-strip">
                {selectedModule.story_frames.map((frame) => (
                  <article className="story-card" key={frame.title}>
                    <h3>{frame.title}</h3>
                    <p>{frame.text}</p>
                  </article>
                ))}
              </div>
              <button className="primary-button" type="button" onClick={handleStartModule}>
                Начать прохождение
              </button>
            </div>
          </article>
        ) : (
          <article className="panel step-screen">
            <div className="step-screen-head">
              <div className={`step-illustration step-illustration-${currentLessonStep % 4}`} aria-hidden="true">
                <span>
                  {currentLessonStep % 4 === 0 ? "🛡️" : currentLessonStep % 4 === 1 ? "💬" : currentLessonStep % 4 === 2 ? "💡" : "💻"}
                </span>
              </div>
              <div>
                <p className="eyebrow">Шаг {currentLessonStep + 1}</p>
                <h3>{step.title}</h3>
              </div>
            </div>
            <p className="step-screen-copy">{step.text}</p>
            <div className="step-progress-row">
              {selectedModule.lesson_steps.map((lessonStep, index) => (
                <span
                  key={lessonStep.title}
                  className={index === currentLessonStep ? "step-progress-dot active" : "step-progress-dot"}
                />
              ))}
            </div>
            <button className="primary-button" type="button" onClick={handleAdvanceLessonStep}>
              {currentLessonStep === selectedModule.lesson_steps.length - 1
                ? "Перейти к тесту"
                : "Продолжить"}
            </button>
          </article>
        )}
      </section>
    );
  }

  function renderEnhancedModuleNav() {
    if (!enhancedModule || !selectedModule) {
      return null;
    }

    return (
      <div className="module-parts-nav">
        {enhancedModule.parts.map((part) => {
          const status = getEnhancedPartStatus(part.id);
          const className =
            status === "current"
              ? "module-part-chip module-part-chip-current"
              : status === "done"
                ? "module-part-chip module-part-chip-done"
                : "module-part-chip";

          return (
            <button
              key={part.id}
              className={className}
              type="button"
              onClick={() => navigateTo(`/modules/${selectedModule.slug}/parts/${part.id}`)}
            >
              {part.title}
            </button>
          );
        })}
      </div>
    );
  }

  function getSafetyPartLearnText(part) {
    if (part.id === 1) {
      return "как замечать опасные сообщения, ссылки и файлы";
    }

    if (part.id === 2) {
      return "как создавать надёжные пароли и защищать свои данные";
    }

    return "как обновления и антивирус помогают защищать устройство";
  }

  function renderSafetyPartHero(part) {
    return (
      <article className="panel safety-part-hero password-part-hero hero-card password-hero-card">
        <div className="password-hero-inner">
          <div className="safety-part-hero-copy hero-content">
            <button className="ghost-button back-button" type="button" onClick={() => navigateTo(`/modules/${selectedModule.slug}`)}>
              К обзору модуля
            </button>
            <p className="eyebrow">Часть {part.id}</p>
            <h2>{part.title}</h2>
            <p className="hero-text">{part.introTitle}</p>
            <div className="password-learn-card">
              <span className="password-learn-icon" aria-hidden="true">🔒</span>
              <div>
                <strong>Ты узнаешь:</strong>
                <p>{getSafetyPartLearnText(part)}</p>
              </div>
            </div>
          </div>

          <div className="safety-part-hero-art hero-visual" aria-hidden="true">
            <span className="visual-bg" />
            <span className="decor decor-lock">🔒</span>
            <span className="decor decor-sparkle">✨</span>
            <span className="decor decor-star">⭐</span>
            <img className="hero-mascot" src={module1FrontbarHero} alt="" />
          </div>
        </div>
      </article>
    );
  }

  function renderEnhancedModulePartPage() {
    if (!selectedModule || !enhancedModule || !currentEnhancedPart) {
      return <p className="muted">Часть модуля не найдена.</p>;
    }

    const warmupAnswer = partWarmups[currentEnhancedPart.id];
    const warmupCorrect = warmupAnswer === currentEnhancedPart.warmupCorrect;

    if (selectedModule.slug === SAFETY_MODULE_SLUG && currentEnhancedPart.id === 1) {
      const warmupVisuals = [
        { icon: "🎁", label: "«Вы выиграли приз»" },
        { icon: "✉️", label: "«Сообщение от учителя»" },
        { icon: "📎", label: "«Неизвестный файл»" },
      ];

      return (
        <section className="module-page password-part-page">
          {renderEnhancedModuleNav()}

          {renderSafetyPartHero(currentEnhancedPart)}

          <article className="panel safety-comic-panel">
            <div className="safety-comic-head">
              <h3>{currentEnhancedPart.introTitle}</h3>
              <p>Иногда в интернете происходят странные вещи. Давай посмотрим на примере:</p>
            </div>

            <div className="safety-comic-grid single">
              <div className="safety-comic-card single">
                <img src={module1Comic} alt="Комикс про опасности в интернете" />
              </div>
            </div>
          </article>

          <article className="panel safety-warmup-panel">
            <h3>{currentEnhancedPart.warmupTitle}</h3>

            <div className="safety-warmup-grid">
              {warmupVisuals.map((item, index) => (
                <button
                  key={item.label}
                  className={warmupAnswer === index ? "safety-warmup-card active" : "safety-warmup-card"}
                  type="button"
                  onClick={() => handleWarmupAnswer(currentEnhancedPart.id, index)}
                >
                  <span className="safety-warmup-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {warmupAnswer !== undefined ? (
              <div className={warmupCorrect ? "safety-feedback success" : "safety-feedback error"}>
                <div>
                  <strong>
                    {warmupCorrect
                      ? currentEnhancedPart.warmupSuccess
                      : "Почти. Подумай ещё раз и выбери более безопасный вариант."}
                  </strong>
                  {warmupCorrect && currentEnhancedPart.warmupFooter ? <p>{currentEnhancedPart.warmupFooter}</p> : null}
                </div>
                <img className="safety-feedback-robot" src={module1HeroCat} alt="" aria-hidden="true" />
              </div>
            ) : null}

            <button
              className="primary-button safety-next-button"
              type="button"
              onClick={() => navigateTo(`/modules/${selectedModule.slug}/parts/${currentEnhancedPart.id}/game`)}
              disabled={!warmupCorrect}
            >
              {currentEnhancedPart.warmupButtonLabel || "Перейти к мини-игре"}
            </button>
          </article>
        </section>
      );
    }

    if (selectedModule.slug === SAFETY_MODULE_SLUG && currentEnhancedPart.id === 2) {
      return (
        <section className="module-page password-part-page">
          {renderEnhancedModuleNav()}

          {renderSafetyPartHero(currentEnhancedPart)}

          <article className="panel safety-comic-panel">
            <div className="safety-comic-grid single">
              <div className="safety-comic-card single">
                <img src={module1Part2Comic} alt="Комикс про надёжный пароль" />
              </div>
            </div>
          </article>

          <article className="panel password-warmup-card">
            <div className="password-warmup-head">
              <h3>{currentEnhancedPart.warmupTitle}</h3>
              <div className="password-warmup-decor" aria-hidden="true">
                <span className="password-warmup-screen" />
                <span className="password-warmup-shield" />
              </div>
            </div>

            <div className="password-choice-list">
              {currentEnhancedPart.warmupItems.map((item, index) => (
                <button
                  key={item}
                  className={warmupAnswer === index ? "password-choice active" : "password-choice"}
                  type="button"
                  onClick={() => handleWarmupAnswer(currentEnhancedPart.id, index)}
                >
                  <span className="password-choice-radio" aria-hidden="true" />
                  <span>{item}</span>
                </button>
              ))}
            </div>

            <div className={warmupCorrect ? "password-hint-box success" : "password-hint-box"}>
              <strong>{warmupCorrect ? currentEnhancedPart.warmupSuccess : "Подсказка"}</strong>
              <p>
                {warmupCorrect
                  ? currentEnhancedPart.warmupFooter
                  : "Лучший пароль — длинный и содержит буквы, цифры и символы."}
              </p>
            </div>

            <button
              className="primary-button password-part-next-button"
              type="button"
              onClick={() => navigateTo(`/modules/${selectedModule.slug}/parts/${currentEnhancedPart.id}/game`)}
              disabled={!warmupCorrect}
            >
              {currentEnhancedPart.warmupButtonLabel || "Перейти к мини-игре"}
            </button>
          </article>
        </section>
      );
    }

    return (
      <section className="module-page password-part-page">
        {renderEnhancedModuleNav()}

        {selectedModule.slug === SAFETY_MODULE_SLUG ? renderSafetyPartHero(currentEnhancedPart) : (
          <div className="panel module-page-head">
            <button className="ghost-button" type="button" onClick={() => navigateTo(`/modules/${selectedModule.slug}`)}>
              К обзору модуля
            </button>

            <div className="module-page-title">
              <p className="eyebrow">Часть {currentEnhancedPart.id}</p>
              <h2>{currentEnhancedPart.title}</h2>
              <p className="hero-text">{currentEnhancedPart.introTitle}</p>
            </div>

            <div className="pill">{currentEnhancedPart.introBullets.length} темы</div>
          </div>
        )}

        {selectedModule.slug === SAFETY_MODULE_SLUG && currentEnhancedPart.id === 3 ? (
          <article className="panel safety-comic-panel">
            <div className="safety-comic-grid single">
              <div className="safety-comic-card single">
                <img src={module1Part3Comic} alt="Комикс про антивирус и обновления" />
              </div>
            </div>
          </article>
        ) : (
          <article className="panel enhanced-info-card">
            <div className="enhanced-info-copy">
              <h3>{currentEnhancedPart.introTitle}</h3>
              <p>{currentEnhancedPart.introText}</p>
              <ul className="enhanced-bullet-list">
                {currentEnhancedPart.introBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {currentEnhancedPart.introFooter ? (
                <p className="enhanced-info-footer">{currentEnhancedPart.introFooter}</p>
              ) : null}
            </div>
          </article>
        )}

        <article className="panel warmup-card">
          <h3>{currentEnhancedPart.warmupTitle}</h3>
          {currentEnhancedPart.warmupQuestion ? (
            <p className="warmup-question">{currentEnhancedPart.warmupQuestion}</p>
          ) : null}

          <div className="warmup-options">
            {currentEnhancedPart.warmupItems.map((item, index) => (
              <button
                key={item}
                className={warmupAnswer === index ? "warmup-option active" : "warmup-option"}
                type="button"
                onClick={() => handleWarmupAnswer(currentEnhancedPart.id, index)}
              >
                {item}
              </button>
            ))}
          </div>

          {warmupAnswer !== undefined ? (
            <div className={warmupCorrect ? "result-box success-box" : "result-box error-box"}>
              <strong>
                {warmupCorrect
                  ? currentEnhancedPart.warmupSuccess
                  : "Почти. Подумай ещё раз и выбери более безопасный вариант."}
              </strong>
              {warmupCorrect && currentEnhancedPart.warmupFooter ? <p>{currentEnhancedPart.warmupFooter}</p> : null}
            </div>
          ) : null}

          <button
            className="primary-button"
            type="button"
            onClick={() => navigateTo(`/modules/${selectedModule.slug}/parts/${currentEnhancedPart.id}/game`)}
            disabled={!warmupCorrect}
          >
            {currentEnhancedPart.warmupButtonLabel || "Перейти к мини-игре"}
          </button>
        </article>
      </section>
    );
  }

  function renderEnhancedModuleGamePage() {
    if (!selectedModule || !enhancedModule || !currentEnhancedPart) {
      return <p className="muted">Мини-игра не найдена.</p>;
    }

    const isDangerGame = currentEnhancedPart.gameType === "danger-safe";
    const isPasswordGame = currentEnhancedPart.gameType === "password-builder";
    const isDefenseGame = currentEnhancedPart.gameType === "computer-defense";
    const passwordStrength = getPasswordStrength();
    const dangerTotal = currentEnhancedPart.scenarios
      ? currentEnhancedPart.scenarios.filter((scenario) => scenario.correct === "danger").length
      : 0;

    const dangerScore = currentEnhancedPart.scenarios
      ? currentEnhancedPart.scenarios.reduce(
          (sum, scenario, index) => sum + (dangerAnswers[index] === scenario.correct ? 1 : 0),
          0,
        )
      : 0;
    const dangerTotalScenarios = currentEnhancedPart.scenarios ? currentEnhancedPart.scenarios.length : 0;
    const dangerFoundCount = currentEnhancedPart.scenarios
      ? currentEnhancedPart.scenarios.reduce(
          (sum, scenario, index) => sum + (scenario.correct === "danger" && dangerAnswers[index] === "danger" ? 1 : 0),
          0,
        )
      : 0;
    const dangerProgress = dangerTotal ? Math.round((dangerFoundCount / dangerTotal) * 100) : 0;

    const defenseScore = currentEnhancedPart.scenarios
      ? currentEnhancedPart.scenarios.reduce(
          (sum, scenario, index) => sum + (defenseAnswers[index] === scenario.target ? 1 : 0),
          0,
        )
      : 0;
    const safeFiles = currentEnhancedPart.scenarios
      ? currentEnhancedPart.scenarios.filter((_, index) => defenseAnswers[index] === "safe")
      : [];
    const suspiciousFiles = currentEnhancedPart.scenarios
      ? currentEnhancedPart.scenarios.filter((_, index) => defenseAnswers[index] === "suspicious")
      : [];

    const nextPath =
      currentEnhancedPart.id === enhancedModule.parts.length
        ? `/modules/${selectedModule.slug}/test`
        : `/modules/${selectedModule.slug}/parts/${currentEnhancedPart.id + 1}`;

    const canProceed =
      (isDangerGame && dangerFoundCount >= dangerTotal) ||
      (isPasswordGame && passwordStrength.tone === "strong") ||
      (isDefenseGame &&
        currentEnhancedPart.scenarios &&
        Object.keys(defenseAnswers).length >= currentEnhancedPart.scenarios.length);

    return (
      <section className="module-page">
        {renderEnhancedModuleNav()}

        {selectedModule.slug === SAFETY_MODULE_SLUG ? (
          <article className="panel safety-part-hero password-part-hero hero-card password-hero-card safety-game-hero">
            <div className="password-hero-inner">
              <div className="safety-part-hero-copy hero-content safety-game-hero-copy">
                <button
                  className="ghost-button back-button"
                  type="button"
                  onClick={() => navigateTo(`/modules/${selectedModule.slug}/parts/${currentEnhancedPart.id}`)}
                >
                  К части
                </button>
                <p className="eyebrow">
                  <span className="gamepad-icon" aria-hidden="true" />
                  Мини-игра
                </p>
                <h2>{currentEnhancedPart.gameTitle}</h2>
                <p className="hero-text">{currentEnhancedPart.gameDescription}</p>
                <div className="password-learn-card">
                  <span className="password-learn-icon" aria-hidden="true">🎮</span>
                  <div>
                    <strong>Задача:</strong>
                    <p>выполни задание и перейди к следующей части</p>
                  </div>
                </div>
              </div>

              <div className="safety-part-hero-art hero-visual safety-game-hero-art" aria-hidden="true">
                <img className="hero-mascot" src={module1FrontbarHero} alt="" />
              </div>
            </div>
          </article>
        ) : (
          <div className="panel module-page-head">
            <button
              className="ghost-button"
              type="button"
              onClick={() => navigateTo(`/modules/${selectedModule.slug}/parts/${currentEnhancedPart.id}`)}
            >
              Назад к части
            </button>

            <div className="module-page-title">
              <p className="eyebrow">Мини-игра</p>
              <h2>{currentEnhancedPart.gameTitle}</h2>
              <p className="hero-text">{currentEnhancedPart.gameDescription}</p>
            </div>

            <div className="pill">Часть {currentEnhancedPart.id}</div>
          </div>
        )}

        <article className="panel mini-game-card">
          {isDangerGame ? (
            <>
              <div className="danger-counter-row">
                <div className="danger-counter">
                  <strong>За каждое верное решение ты получаешь очко внимательности.</strong>
                  <div className="danger-progress">
                    <div className="danger-progress-track" aria-hidden="true">
                      <div className="danger-progress-fill" style={{ width: `${dangerProgress}%` }} />
                    </div>
                    <span>Прогресс прохождения: {dangerFoundCount} из {dangerTotal}</span>
                  </div>
                </div>
                {dangerFoundCount >= dangerTotal ? (
                  <div className="danger-success-banner">Найдено опасных сообщений: {dangerFoundCount} из {dangerTotal}</div>
                ) : null}
              </div>

              <div className="danger-card-grid">
                {currentEnhancedPart.scenarios.map((scenario, index) => (
                  <article
                    key={`${scenario.sender}-${scenario.message}`}
                    className={
                      dangerAnswers[index] === "danger"
                        ? "danger-card danger-card-marked"
                        : dangerAnswers[index] === "safe"
                          ? "danger-card danger-card-confirmed-safe"
                          : dangerMisses[index]
                            ? "danger-card danger-card-missed"
                            : "danger-card"
                    }
                  >
                    <div className="danger-card-head">
                      <span className="danger-avatar" aria-hidden="true">👤</span>
                      <strong>{scenario.sender}</strong>
                    </div>
                    <p className="danger-card-message">«{scenario.message}»</p>
                    {scenario.attachment ? <span className="danger-card-meta">📎 {scenario.attachment}</span> : null}
                    {scenario.link ? <span className="danger-card-meta">🔗 {scenario.link}</span> : null}
                    <div className="mini-game-actions">
                      <button
                        className={dangerAnswers[index] === "danger" ? "mini-choice danger active" : "mini-choice danger"}
                        type="button"
                        onClick={() => handleDangerChoice(scenario, index, "danger")}
                        disabled={Boolean(dangerAnswers[index])}
                      >
                        Опасно
                      </button>
                      <button
                        className={dangerAnswers[index] === "safe" ? "mini-choice safe active" : "mini-choice safe"}
                        type="button"
                        onClick={() => handleDangerChoice(scenario, index, "safe")}
                        disabled={Boolean(dangerAnswers[index])}
                      >
                        Безопасно
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className={`danger-feedback danger-feedback-${dangerFeedback.tone}`}>
                <strong>Почему так?</strong>
                <p>{dangerFeedback.text}</p>
              </div>

              {dangerToast ? <div className="danger-toast">{dangerToast}</div> : null}
              {dangerWarning ? <div className="danger-warning">{dangerWarning}</div> : null}

              {dangerFoundCount >= dangerTotal ? (
                <div className="danger-trophy-banner">
                  <span className="danger-trophy-icon" aria-hidden="true">🏆</span>
                  <div>
                    <strong>Ты молодец!</strong>
                    <p>Все сообщения разобраны верно. Ты отлично умеешь замечать опасности.</p>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {isPasswordGame ? (
            <>
              <div className="password-builder">
                <label className="password-input-wrap">
                  <span>Придумай пароль</span>
                  <input
                    className="password-input"
                    type="text"
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    placeholder="Например: K0t!2024"
                  />
                </label>
              </div>

              <div className={`password-preview password-preview-${passwordStrength.tone}`}>
                <strong>{passwordStrength.label}</strong>
                <div className="password-strength-track" aria-hidden="true">
                  <div
                    className={`password-strength-fill password-strength-fill-${passwordStrength.tone}`}
                    style={{ width: `${passwordStrength.fill}%` }}
                  />
                </div>
              </div>
            </>
          ) : null}

          {isDefenseGame ? (
            <>
              <div className="danger-counter defense-counter">
                <strong>Отсортировано правильно: {defenseScore} из {currentEnhancedPart.scenarios.length}</strong>
              </div>

              <div className="defense-file-grid">
                {currentEnhancedPart.scenarios.map((scenario, index) =>
                  defenseAnswers[index] ? null : (
                    <button
                      key={scenario.name}
                      className="defense-file-card"
                      type="button"
                      draggable
                      onDragStart={() => setDraggedDefenseIndex(index)}
                      onDragEnd={() => {
                        setDraggedDefenseIndex(null);
                        setActiveDropzone("");
                      }}
                    >
                      <span className="defense-file-icon" aria-hidden="true">{scenario.icon}</span>
                      <span className="defense-file-name">{scenario.name}</span>
                    </button>
                  ),
                )}
              </div>

              <div className="defense-bins">
                <div
                  className={
                    activeDropzone === "safe"
                      ? "defense-bin defense-bin-safe defense-bin-active"
                      : "defense-bin defense-bin-safe"
                  }
                  onDragOver={(event) => {
                    event.preventDefault();
                    setActiveDropzone("safe");
                  }}
                  onDragLeave={() => setActiveDropzone("")}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (draggedDefenseIndex !== null) {
                      sortDefenseFile(draggedDefenseIndex, "safe");
                    }
                  }}
                >
                  <strong>МОЖНО ОТКРЫТЬ</strong>
                  <span>безопасные файлы</span>
                  <div className="defense-bin-files">
                    {safeFiles.map((file) => (
                      <div className="defense-bin-file defense-bin-file-safe" key={file.name}>
                        <span aria-hidden="true">{file.icon}</span>
                        <small>{file.name}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={
                    activeDropzone === "suspicious"
                      ? "defense-bin defense-bin-danger defense-bin-active"
                      : "defense-bin defense-bin-danger"
                  }
                  onDragOver={(event) => {
                    event.preventDefault();
                    setActiveDropzone("suspicious");
                  }}
                  onDragLeave={() => setActiveDropzone("")}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (draggedDefenseIndex !== null) {
                      sortDefenseFile(draggedDefenseIndex, "suspicious");
                    }
                  }}
                >
                  <strong>ПОДОЗРИТЕЛЬНО</strong>
                  <span>файлы для проверки</span>
                  <div className="defense-bin-files">
                    {suspiciousFiles.map((file) => (
                      <div className="defense-bin-file defense-bin-file-danger" key={file.name}>
                        <span aria-hidden="true">{file.icon}</span>
                        <small>{file.name}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`danger-feedback danger-feedback-${defenseFeedback.tone}`}>
                <strong>Подсказка</strong>
                <p>{defenseFeedback.text}</p>
              </div>

              {defenseToast ? <div className="danger-warning">{defenseToast}</div> : null}

              {defenseScore === currentEnhancedPart.scenarios.length ? (
                <div className="danger-success-banner">Уровень пройден! {defenseScore} из {currentEnhancedPart.scenarios.length} — отлично!</div>
              ) : null}
            </>
          ) : null}

          <button
            className="primary-button"
            type="button"
            onClick={() => (isDangerGame ? handleDangerNext(nextPath, dangerFoundCount, dangerTotal) : navigateTo(nextPath))}
            disabled={!canProceed}
          >
            {currentEnhancedPart.id === enhancedModule.parts.length ? "Перейти к итоговому тесту" : "Перейти к следующей части"}
          </button>
        </article>
      </section>
    );
  }

  function renderModuleTestPage() {
    if (!selectedModule) {
      return <p className="muted">Модуль не найден.</p>;
    }

    if (enhancedModule) {
      const questions = enhancedModule.finalTest;
      const currentQuestion = questions[finalQuestionIndex];
      const allAnswered = questions.every((_, index) => finalTestAnswers[index] !== undefined);

      return (
        <section className="module-page">
          <article className="panel safety-part-hero password-part-hero hero-card password-hero-card safety-game-hero">
            <div className="password-hero-inner">
              <div className="safety-part-hero-copy hero-content safety-game-hero-copy">
                <button
                  className="ghost-button back-button"
                  type="button"
                  onClick={() => navigateTo(`/modules/${selectedModule.slug}`)}
                >
                  К модулю
                </button>
                <p className="eyebrow">
                  <span className="gamepad-icon" aria-hidden="true" />
                  Финальная проверка
                </p>
                <h2>{selectedModule.title}</h2>
                <p className="hero-text">Ответь на вопросы и заверши модуль.</p>
                <div className="password-learn-card">
                  <span className="password-learn-icon final-test-learn-icon" aria-hidden="true" />
                  <div>
                    <strong>Задача:</strong>
                    <p>выбери верные ответы и закрепи знания</p>
                  </div>
                </div>
              </div>

              <div className="safety-part-hero-art hero-visual safety-game-hero-art" aria-hidden="true">
                <img className="hero-mascot" src={module1FrontbarHero} alt="" />
              </div>
            </div>
          </article>

          {renderEnhancedModuleNav()}
          {dashboardError ? <p className="inline-note">{dashboardError}</p> : null}

          <article className="panel final-test-card">
            <div className="final-test-head">
              <span className="final-test-index">Вопрос {finalQuestionIndex + 1}</span>
              <div className="step-progress-row">
                {questions.map((question, index) => (
                  <span
                    key={question.question}
                    className={index === finalQuestionIndex ? "step-progress-dot active" : "step-progress-dot"}
                  />
                ))}
              </div>
            </div>

            <h3>{currentQuestion.question}</h3>

            <div className="final-test-options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={finalTestAnswers[finalQuestionIndex] === index ? "final-test-option active" : "final-test-option"}
                  onClick={() =>
                    setFinalTestAnswers((current) => ({
                      ...current,
                      [finalQuestionIndex]: index,
                    }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="final-test-actions">
              <button
                className="ghost-button"
                type="button"
                onClick={() => setFinalQuestionIndex((current) => Math.max(current - 1, 0))}
                disabled={finalQuestionIndex === 0}
              >
                Назад
              </button>
              {finalQuestionIndex < questions.length - 1 ? (
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setFinalQuestionIndex((current) => Math.min(current + 1, questions.length - 1))}
                  disabled={finalTestAnswers[finalQuestionIndex] === undefined}
                >
                  Следующий вопрос
                </button>
              ) : !allAnswered ? (
                <button className="primary-button" type="button" disabled>
                  Ответь на все вопросы
                </button>
              ) : (
                <button className="primary-button" type="button" onClick={handleFinishEnhancedTest}>
                  Завершить модуль
                </button>
              )}
            </div>

            {challengeResult ? (
              <div className={challengeResult.correct ? "result-box success-box" : "result-box error-box"}>
                <strong>
                  {challengeResult.correct
                    ? `Модуль завершён! +${challengeResult.earned_points} очков`
                    : "Тест пока не пройден"}
                </strong>
                <p>{challengeResult.explanation}</p>
              </div>
            ) : null}
          </article>
        </section>
      );
    }

    return (
      <section className="module-page">
        <div className="panel module-page-head">
          <button className="ghost-button" type="button" onClick={() => navigateTo(`/modules/${selectedModule.slug}`)}>
            Назад к уроку
          </button>

          <div className="module-page-title">
            <p className="eyebrow">Финальная проверка</p>
            <h2>{selectedModule.title}</h2>
            <p className="hero-text">Ответь на вопрос и заверши прохождение модуля.</p>
          </div>

          <div className="pill">{selectedModule.reward_points} очков</div>
        </div>

        {dashboardError ? <p className="inline-note">{dashboardError}</p> : null}

        <div className="challenge-box challenge-box-standalone">
          <p className="eyebrow light">Тест</p>
          <h3>{selectedModule.minigame.prompt}</h3>

          <div className="answer-list">
            {selectedModule.minigame.options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={getAnswerClassName(index)}
                onClick={() => setSelectedAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>

          <button className="primary-button" type="button" onClick={handleSubmitChallenge}>
            Проверить ответ
          </button>

          {challengeResult ? (
            <div className={challengeResult.correct ? "result-box success-box" : "result-box error-box"}>
              <strong>
                {challengeResult.correct
                  ? `Верно! +${challengeResult.earned_points} очков`
                  : "Ответ неправильный"}
              </strong>
              <p>{challengeResult.explanation}</p>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  function renderLeaderboard() {
    const podiumOrder = [2, 1, 3];
    const podiumEntries = podiumOrder
      .map((place) => leaderboard.find((entry) => entry.place === place))
      .filter(Boolean);
    const otherEntries = leaderboard.filter((entry) => entry.place > 3);

    return (
      <section className="panel leaderboard-panel">
        <div className="leaderboard-hero">
          <div className="leaderboard-title-wrap">
            <div className="leaderboard-trophy" aria-hidden="true">🏆</div>
            <div>
              <p className="eyebrow">Рейтинг академии</p>
              <h2>Таблица лидеров</h2>
            </div>
          </div>
          <div className="leaderboard-filter">Все время</div>
        </div>

        <div className="leaderboard-podium">
          {podiumEntries.map((entry) => {
            const avatar = getAvatarByEmail(entry.email);
            return (
              <article
                className={entry.place === 1 ? "leaderboard-podium-card first" : "leaderboard-podium-card"}
                key={`${entry.place}-${entry.email}`}
              >
                <div className={`leaderboard-place-badge place-${entry.place}`}>{entry.place}</div>
                {entry.place === 1 ? <div className="leaderboard-crown" aria-hidden="true">👑</div> : null}
                <div className="leaderboard-avatar-ring">
                  {avatar ? (
                    <img className="leaderboard-avatar" src={avatar.src} alt="" aria-hidden="true" />
                  ) : (
                    <div className="leaderboard-avatar-fallback">{entry.display_name.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <h3>{entry.display_name}</h3>
                <span className="leaderboard-level-pill">{entry.level_title}</span>
                <strong className="leaderboard-score">{entry.total_points} очков</strong>
              </article>
            );
          })}
        </div>

        <div className="leaderboard-rest">
          {otherEntries.map((entry) => {
            const avatar = getAvatarByEmail(entry.email);
            return (
              <article className="leaderboard-row" key={`${entry.place}-${entry.email}`}>
                <strong className="leaderboard-rank">#{entry.place}</strong>
                <div className="leaderboard-row-user">
                  <div className="leaderboard-row-avatar">
                    {avatar ? (
                      <img className="leaderboard-avatar" src={avatar.src} alt="" aria-hidden="true" />
                    ) : (
                      <div className="leaderboard-avatar-fallback small">{entry.display_name.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <span>{entry.display_name}</span>
                </div>
                <span className="leaderboard-level-pill">{entry.level_title}</span>
                <strong className="leaderboard-score">{entry.total_points} очков</strong>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  function renderAchievements() {
    const completedModules = profile?.completed_modules ?? 0;
    const visibleAchievements = ACHIEVEMENT_CARD_DEFS.filter((definition) => {
      const achievement = achievementMap.get(definition.code);
      return achievement?.unlocked;
    });
    const userAchievementDates = profile?.email ? achievementDateMap[profile.email] || {} : {};

    return (
      <section className="panel achievements-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Коллекция наград</p>
            <h2>Достижения</h2>
          </div>
        </div>

        <div className="achievement-showcase-list">
          {visibleAchievements.map((definition) => {
            const achievement = achievementMap.get(definition.code);
            const unlocked = achievement?.unlocked ?? false;
            const imageSrc = ACHIEVEMENT_IMAGES[definition.imageKey];
            const receivedDate = userAchievementDates[definition.code] || definition.dateLabel;

            return (
              <article
                className={
                  unlocked
                    ? `achievement-showcase-card achievement-showcase-card-${definition.accent}`
                    : "achievement-showcase-card achievement-showcase-card-locked"
                }
                key={definition.code}
              >
                <div className="achievement-showcase-visual">
                  {imageSrc ? <img className="achievement-showcase-image" src={imageSrc} alt={definition.title} /> : null}
                </div>

                <div className="achievement-showcase-main">
                  <div className="achievement-showcase-copy">
                    <p className="eyebrow">Достижение</p>

                    <div className="achievement-showcase-title-row">
                      <h3>{achievement?.title || definition.title}</h3>
                      <span className="achievement-module-pill">
                        {definition.modulesRequired} модуль
                      </span>
                    </div>

                    <p>{achievement?.description || definition.description}</p>
                    <div className="achievement-received-row">
                      <span>{unlocked ? `Получено ${receivedDate}` : "Получено после завершения модуля"}</span>
                    </div>
                  </div>

                  <div className="achievement-showcase-side">
                    <div className="achievement-progress-box">
                      <strong>Прогресс</strong>
                      <div className="achievement-progress-steps">
                        {[1, 2, 3, 4].map((step) => (
                          <span
                            className={
                              completedModules >= step
                                ? `achievement-progress-step achievement-progress-step-${definition.accent} active`
                                : "achievement-progress-step"
                            }
                            key={`${definition.code}-${step}`}
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                      <p>
                        Пройдено модулей: <strong>{completedModules} из 4</strong>
                      </p>
                    </div>

                    <div className="achievement-reward-box">
                      <strong>Награда</strong>
                      <div className="achievement-reward-value">
                        <span className="achievement-coin" aria-hidden="true">⭐</span>
                        <div>
                          <b>+{achievement?.reward_points || definition.rewardPoints}</b>
                          <span>баллов</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          {!visibleAchievements.length ? <p className="muted">Пока достижений нет. Пройди первый модуль, чтобы открыть награду.</p> : null}
        </div>
      </section>
    );
  }

  function renderShop() {
    return (
      <section className="panel shop-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Витрина академии</p>
            <h2>Магазин ЦифроГрада</h2>
          </div>
          <div className="pill">{profile?.total_points ?? 0} очков</div>
        </div>

        <div className="shop-grid">
          <article className="shop-card">
            <h3>Тема профиля</h3>
            <p>Скоро здесь появятся новые темы, значки и полезные цифровые награды.</p>
            <button className="ghost-button" type="button" disabled>
              Скоро
            </button>
          </article>
          <article className="shop-card">
            <h3>Набор исследователя</h3>
            <p>Открывай предметы и коллекции за успехи в заданиях по цифровой грамотности.</p>
            <button className="ghost-button" type="button" disabled>
              Скоро
            </button>
          </article>
        </div>
      </section>
    );
  }

  function renderAdminPage() {
    if (!profile?.is_admin) {
      return (
        <section className="panel admin-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Доступ ограничен</p>
              <h2>Админка</h2>
            </div>
          </div>
          <p className="muted">Эта страница доступна только администраторам.</p>
        </section>
      );
    }

    return (
      <section className="admin-page">
        <article className="panel admin-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Управление платформой</p>
              <h2>Админка</h2>
            </div>
          </div>

          <div className="admin-grid">
            <form className="admin-form" onSubmit={handleAdminCreateUser}>
              <h3>Создать нового пользователя</h3>
              <label>
                <span>Имя ученика</span>
                <input
                  name="display_name"
                  value={adminForm.display_name}
                  onChange={handleAdminFormChange}
                  placeholder="Например, Лена"
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={adminForm.email}
                  onChange={handleAdminFormChange}
                  placeholder="student@example.com"
                />
              </label>
              <label>
                <span>Пароль</span>
                <input
                  name="password"
                  type="password"
                  value={adminForm.password}
                  onChange={handleAdminFormChange}
                  placeholder="Минимум 8 символов"
                />
              </label>
              <button className="primary-button" type="submit">
                Создать пользователя
              </button>
              {adminMessage ? <p className="success">{adminMessage}</p> : null}
              {adminError ? <p className="error">{adminError}</p> : null}
            </form>

            <div className="admin-summary">
              <div className="metric-card panel">
                <strong>{adminUsers.length}</strong>
                <span>Всего пользователей</span>
              </div>
              <div className="metric-card panel">
                <strong>{adminUsers.reduce((sum, user) => sum + user.completed_modules, 0)}</strong>
                <span>Всего пройденных курсов</span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel admin-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Общий прогресс</p>
              <h2>Все пользователи</h2>
            </div>
          </div>

          {adminLoading ? <p className="muted">Загружаю список пользователей...</p> : null}

          {!adminLoading ? (
            <div className="admin-user-list">
              {adminUsers.map((user) => {
                const progressMap = new Map(user.progress.map((item) => [item.module_slug, item]));
                return (
                  <article className="admin-user-card" key={user.id}>
                    <div className="admin-user-head">
                      <div>
                        <h3>{user.display_name}</h3>
                        <p>{user.email}</p>
                      </div>
                      <div className="admin-user-actions">
                        <div className="admin-user-badges">
                          <span className="pill">{user.level_title}</span>
                          <span className="pill">{user.total_points} очков</span>
                          <span className="pill">{user.completed_modules}/{user.total_modules} курсов</span>
                        </div>
                        {!user.is_admin ? (
                          <button
                            className="ghost-button admin-delete-button"
                            type="button"
                            onClick={() => handleAdminDeleteUser(user.id, user.display_name)}
                          >
                            Удалить
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="admin-progress-grid">
                      {modules.map((module) => {
                        const progress = progressMap.get(module.slug);
                        return (
                          <div className="admin-progress-item" key={`${user.id}-${module.slug}`}>
                            <strong>{module.title}</strong>
                            <span>{progress?.completed ? "Пройден" : "Не пройден"}</span>
                            <small>
                              Попыток: {progress?.attempts ?? 0} | Очков: {progress?.earned_points ?? 0}
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}

              {!adminUsers.length ? <p className="muted">Пользователей пока нет.</p> : null}
            </div>
          ) : null}
        </article>
      </section>
    );
  }

  function renderDashboard() {
    const isWideDashboardPage =
      route.page === "academy" ||
      route.page === "tasks" ||
      route.page === "achievements" ||
      route.page === "module" ||
      route.page === "module_part" ||
      route.page === "module_game" ||
      route.page === "module_test";

    return (
      <div className="app-shell">
        {renderTopbar()}
        <div className="dashboard">
          {renderSidebar()}
          <main className={isWideDashboardPage ? "dashboard-content dashboard-content-wide" : "dashboard-content"}>
            {achievementNotice ? (
              <div className="achievement-toast-stack">
                {achievementNotice.items.map((item) => (
                  <div className="achievement-toast" key={item.code}>
                    <span className="achievement-toast-icon" aria-hidden="true">🏆</span>
                    <div className="achievement-toast-copy">
                      <strong>Получено достижение</strong>
                      <h3>{item.title}</h3>
                      <p>
                        +{item.reward_points} баллов • {achievementNotice.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {route.page === "academy" ? renderAcademyHome() : null}
            {route.page === "tasks" ? renderTasksPage() : null}
            {route.page === "module" ? renderModulePage() : null}
            {route.page === "module_part" ? renderEnhancedModulePartPage() : null}
            {route.page === "module_game" ? renderEnhancedModuleGamePage() : null}
            {route.page === "module_test" ? renderModuleTestPage() : null}
            {route.page === "profile" ? renderProfile() : null}
            {route.page === "leaderboard" ? renderLeaderboard() : null}
            {route.page === "achievements" ? renderAchievements() : null}
            {route.page === "shop" ? renderShop() : null}
            {route.page === "admin" ? renderAdminPage() : null}
          </main>
        </div>
      </div>
    );
  }

  function renderAuthedLayout() {
    return (
      <>
        {dashboardLoading ? <p className="muted loading-note">Загрузка ЦифроГрада...</p> : null}
        {!dashboardLoading ? renderDashboard() : null}
      </>
    );
  }

  return (
    <div className="page">
      {!token ? (
        <div className="shell">
          <section className="hero">
            <img className="hero-banner-image" src={authBannerImage} alt={BRAND_NAME} />
          </section>

          {renderAuthScreen()}
        </div>
      ) : (
        renderAuthedLayout()
      )}
    </div>
  );
}
