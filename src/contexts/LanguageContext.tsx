import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'HI' | 'TA' | 'ES';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'Dashboard': { EN: 'Dashboard', HI: 'डैशबोर्ड', TA: 'டாஷ்போர்டு', ES: 'Panel' },
  'Study Plans': { EN: 'Study Plans', HI: 'अध्ययन योजना', TA: 'ஆய்வுத் திட்டங்கள்', ES: 'Planes' },
  'Subjects': { EN: 'Subjects', HI: 'विषय', TA: 'பாடங்கள்', ES: 'Materias' },
  'Flashcards': { EN: 'Flashcards', HI: 'फ्लैशकार्ड', TA: 'மின்னட்டை', ES: 'Tarjetas' },
  'Gamify': { EN: 'Gamify', HI: 'गेमिफाई', TA: 'கேமிஃபை', ES: 'Jugar' },
  'Paper Gen': { EN: 'Paper Gen', HI: 'पेपर जनरेटर', TA: 'வினாத்தாள்', ES: 'Papeles' },
  'Doubts': { EN: 'Doubts', HI: 'शंकाएं', TA: 'சந்தேகங்கள்', ES: 'Dudas' },
  'Progress': { EN: 'Progress', HI: 'प्रगति', TA: 'முன்னேற்றம்', ES: 'Progreso' },
  'Logout': { EN: 'Logout', HI: 'लॉगआउट', TA: 'வெளியேறு', ES: 'Cerrar sesión' },
  'Search resources...': { EN: 'Search resources...', HI: 'संसाधन खोजें...', TA: 'தேடல்...', ES: 'Buscar...' },

  // Dashboard / General
  'Welcome back,': { EN: 'Welcome back,', HI: 'आपका स्वागत है,', TA: 'மீண்டும் வருக,', ES: 'Bienvenido de nuevo,' },
  'Your next best lesson is ready.': { EN: 'Your next best lesson is ready.', HI: 'आपका अगला पाठ तैयार है।', TA: 'உங்கள் அடுத்த பாடம் தயார்.', ES: 'Tu lección está lista.' },
  'Learning Hub': { EN: 'Learning Hub', HI: 'लर्निंग हब', TA: 'கற்றல் மையம்', ES: 'Centro de Aprendizaje' },
  'Explore courses': { EN: 'Explore courses', HI: 'कोर्स देखें', TA: 'பாடங்களை ஆராயுங்கள்', ES: 'Explorar cursos' },
  'Start practice': { EN: 'Start practice', HI: 'अभ्यास शुरू करें', TA: 'பயிற்சி தொடங்கவும்', ES: 'Iniciar práctica' },
  'Streak': { EN: 'Streak', HI: 'लगातार', TA: 'தொடர்ச்சி', ES: 'Racha' },
  'Topics': { EN: 'Topics', HI: 'विषय', TA: 'தலைப்புகள்', ES: 'Temas' },
  'Accuracy': { EN: 'Accuracy', HI: 'सटीकता', TA: 'துல்லியம்', ES: 'Precisión' },
  'My Courses': { EN: 'My Courses', HI: 'मेरे कोर्स', TA: 'என் பாடங்கள்', ES: 'Mis Cursos' },
  'Continue learning': { EN: 'Continue learning', HI: 'सीखना जारी रखें', TA: 'கற்றலைத் தொடரவும்', ES: 'Seguir aprendiendo' },

  // Subjects
  'Mathematics': { EN: 'Mathematics', HI: 'गणित', TA: 'கணிதம்', ES: 'Matemáticas' },
  'Science': { EN: 'Science', HI: 'विज्ञान', TA: 'அறிவியல்', ES: 'Ciencia' },
  'Social Science': { EN: 'Social Science', HI: 'सामाजिक विज्ञान', TA: 'சமூக அறிவியல்', ES: 'Ciencias Sociales' },
  'English': { EN: 'English', HI: 'अंग्रेजी', TA: 'ஆங்கிலம்', ES: 'Inglés' },

  // Analytics
  'Intelligence Hub': { EN: 'Intelligence Hub', HI: 'इंटेलिजेंस हब', TA: 'நுண்ணறிவு மையம்', ES: 'Centro de Inteligencia' },
  'Your Progress.': { EN: 'Your Progress.', HI: 'आपकी प्रगति।', TA: 'உங்கள் முன்னேற்றம்.', ES: 'Tu Progreso.' },
  'Mastery Level': { EN: 'Mastery Level', HI: 'महारत स्तर', TA: 'தேர்ச்சி நிலை', ES: 'Nivel de Maestría' },
  'Study Streak': { EN: 'Study Streak', HI: 'अध्ययन स्ट्रीक', TA: 'படிப்புத் தொடர்ச்சி', ES: 'Racha de Estudio' },
  'Total XP': { EN: 'Total XP', HI: 'कुल XP', TA: 'மொத்த XP', ES: 'XP Total' },
  'Time Spent': { EN: 'Time Spent', HI: 'व्यतीत समय', TA: 'செலவழித்த நேரம்', ES: 'Tiempo Dedicado' },
  'Subject Mastery': { EN: 'Subject Mastery', HI: 'विषय महारत', TA: 'பாடத் தேர்ச்சி', ES: 'Maestría de Materia' },
  'Achievements': { EN: 'Achievements', HI: 'उपलब्धियां', TA: 'சாதனைகள்', ES: 'Logros' },
  'Days': { EN: 'Days', HI: 'दिन', TA: 'நாட்கள்', ES: 'Días' },

  // Doubts
  'Doubt Center': { EN: 'Doubt Center', HI: 'शंका केंद्र', TA: 'சந்தேகம் மையம்', ES: 'Centro de Dudas' },
  'Ask mentor': { EN: 'Ask mentor', HI: 'मेंटर से पूछें', TA: 'வழிகாட்டியிடம் கேளுங்கள்', ES: 'Preguntar a mentor' },
  'Explanation': { EN: 'Explanation', HI: 'व्याख्या', TA: 'விளக்கம்', ES: 'Explicación' },

  // Flashcards
  'Flip card': { EN: 'Flip card', HI: 'कार्ड पलटें', TA: 'கார்டைத் திருப்பு', ES: 'Voltear tarjeta' },
  'Answer': { EN: 'Answer', HI: 'उत्तर', TA: 'பதில்', ES: 'Respuesta' },
  'Prompt': { EN: 'Prompt', HI: 'संकेत', TA: 'கேள்வி', ES: 'Pregunta' },
  'Next': { EN: 'Next', HI: 'अगला', TA: 'அடுத்து', ES: 'Siguiente' },
  'Previous': { EN: 'Previous', HI: 'पिछला', TA: 'முந்தைய', ES: 'Anterior' },

  // Study Plans
  'Your Journey': { EN: 'Your Journey', HI: 'आपकी यात्रा', TA: 'உங்கள் பயணம்', ES: 'Tu Viaje' },
  'Study Plans.': { EN: 'Study Plans.', HI: 'अध्ययन योजनाएं।', TA: 'ஆய்வுத் திட்டங்கள்.', ES: 'Planes de Estudio.' },
  'Daily Goals': { EN: 'Daily Goals', HI: 'दैनिक लक्ष्य', TA: 'தினசரி இலக்குகள்', ES: 'Objetivos Diarios' },
  'Weekly Milestones': { EN: 'Weekly Milestones', HI: 'साप्ताहिक मील के पत्थर', TA: 'வாராந்திர மைல்கற்கள்', ES: 'Hitos Semanales' },

  // Auth
  'Log in': { EN: 'Log in', HI: 'लॉग इन', TA: 'உள்நுழை', ES: 'Iniciar sesión' },
  'Start free': { EN: 'Start free', HI: 'मुफ्त शुरू करें', TA: 'இலவசமாகத் தொடங்கு', ES: 'Empezar gratis' },
  'Create Account.': { EN: 'Create Account.', HI: 'खाता बनाएं।', TA: 'கணக்கை உருவாக்கு.', ES: 'Crear Cuenta.' },
  'Full Name': { EN: 'Full Name', HI: 'पूरा नाम', TA: 'முழு பெயர்', ES: 'Nombre Completo' },
  'Academic Email': { EN: 'Academic Email', HI: 'अकादमिक ईमेल', TA: 'மின்னஞ்சல்', ES: 'Correo Académico' },
  'Secure Password': { EN: 'Secure Password', HI: 'सुरक्षित पासवर्ड', TA: 'கடவுச்சொல்', ES: 'Contraseña Segura' },

  // Gamify
  'Select Subject': { EN: 'Select Subject', HI: 'विषय चुनें', TA: 'பாடத்தைத் தேர்ந்தெடுக்கவும்', ES: 'Seleccionar Materia' },
  'Select Chapter': { EN: 'Select Chapter', HI: 'अध्याय चुनें', TA: 'அத்தியாயத்தைத் தேர்ந்தெடுக்கவும்', ES: 'Seleccionar Capítulo' },
  'Start Level': { EN: 'Start Level', HI: 'स्तर शुरू करें', TA: 'நிலையைத் தொடங்கவும்', ES: 'Iniciar Nivel' },
  'Level': { EN: 'Level', HI: 'स्तर', TA: 'நிலை', ES: 'Nivel' },
  'Score': { EN: 'Score', HI: 'स्कोर', TA: 'மதிப்பெண்', ES: 'Puntuación' },
  'Question': { EN: 'Question', HI: 'प्रश्न', TA: 'கேள்வி', ES: 'Pregunta' },
  'Questions': { EN: 'Questions', HI: 'प्रश्नों', TA: 'கேள்விகள்', ES: 'Preguntas' },
  'Correct Answer': { EN: 'Correct Answer', HI: 'सही उत्तर', TA: 'சரியான பதில்', ES: 'Respuesta Correcta' },
  'Next Question': { EN: 'Next Question', HI: 'अगला प्रश्न', TA: 'अடுத்த கேள்வி', ES: 'Siguiente Pregunta' },
  'Finish Quiz': { EN: 'Finish Quiz', HI: 'क्विज़ समाप्त करें', TA: 'முடிவு செய்', ES: 'Finalizar' },
  'Quiz Complete!': { EN: 'Quiz Complete!', HI: 'क्विज़ पूरा हुआ!', TA: 'வினாடி வினா முடிந்தது!', ES: '¡Prueba Completada!' },
  'Your Marks:': { EN: 'Your Marks:', HI: 'आपके अंक:', TA: 'உங்கள் மதிப்பெண்கள்:', ES: 'Tus Marcas:' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
