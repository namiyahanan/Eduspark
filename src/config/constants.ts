/**
 * Configuration and environment utilities
 */

export const CONFIG = {
  // App Settings
  APP_NAME: 'EDU SPARK',
  VERSION: '1.0.0',
  
  // Branding
  PRIMARY_COLOR: '#16A34A',
  SECONDARY_COLOR: '#EC4899',
  
  // API Settings
  API_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Feature Flags
  FEATURES: {
    AI_LESSONS: true,
    GAMIFICATION: true,
    ANALYTICS: true,
    QUESTION_PAPERS: true,
    PRACTICE_QUESTIONS: true,
    NOTIFICATIONS: true
  },
  
  // Limits
  LIMITS: {
    MAX_TOPICS_PER_PAGE: 20,
    MAX_QUESTIONS_PER_QUIZ: 100,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
  },
  
  // Grades/Classes
  GRADES: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  
  // Boards
  BOARDS: ['CBSE', 'ICSE', 'State Board'],
  
  // Subjects by Grade
  SUBJECTS_BY_GRADE: {
    'Class 10': ['Mathematics', 'Science', 'English', 'Social Science'],
    'Class 12': ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    default: ['Mathematics', 'Science', 'English', 'Social Science']
  },
  
  // Difficulty Levels
  DIFFICULTY_LEVELS: ['easy', 'medium', 'hard'],
  
  // Learning Modes
  LEARNING_MODES: ['Lesson', 'Practice', 'Test', 'Gamified', 'Paper Generation'],
  
  // Storage Keys
  STORAGE_KEYS: {
    STUDENT_INFO: 'student_info',
    STUDENT_PERFORMANCE: 'student_performance',
    USER_PREFERENCES: 'user_preferences',
    CACHE_LESSONS: 'cache_lessons',
    ACHIEVEMENTS: 'achievements'
  }
};

export const getSubjectsForGrade = (grade: string): string[] => {
  return CONFIG.SUBJECTS_BY_GRADE[grade as keyof typeof CONFIG.SUBJECTS_BY_GRADE] 
    || CONFIG.SUBJECTS_BY_GRADE.default;
};

export const isDevelopment = () => {
  return (import.meta as any).env.MODE === 'development';
};

export const isProduction = () => {
  return (import.meta as any).env.MODE === 'production';
};

export const getEnv = (key: string, defaultValue?: string): string => {
  return (import.meta as any).env[`VITE_${key}`] || defaultValue || '';
};
