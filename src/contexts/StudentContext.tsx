import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { localStorage_safe } from '../utils/helpers';

export interface PerformanceMetrics {
  topicsCompleted: number;
  testsAttempted: number;
  averageScore: number;
  totalLearningMinutes: number;
  streak: number;
  lastActiveDate: Date;
}

export interface StudentInfo {
  name: string;
  email?: string;
  grade: string;
  board: string;
  dob?: string;
  institution?: string;
  interests: string[];
  joinedDate?: Date;
  preferences?: {
    theme?: 'dark' | 'light';
    notifications?: boolean;
    language?: string;
  };
}

interface StudentContextType {
  studentInfo: StudentInfo | null;
  setStudentInfo: (info: StudentInfo) => void;
  login: (info: StudentInfo) => void;
  activeTopic: string | null;
  activeSubject: string | null;
  setActiveTopic: (topic: string, subject: string) => void;
  logout: () => void;
  performance: PerformanceMetrics;
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void;
  recordTopicCompletion: (topic: string) => void;
  recordTestAttempt: (score: number) => void;
  updateLearningTime: (minutes: number) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const defaultPerformance: PerformanceMetrics = {
  topicsCompleted: 0,
  testsAttempted: 0,
  averageScore: 0,
  totalLearningMinutes: 0,
  streak: 0,
  lastActiveDate: new Date()
};

export function StudentProvider({ children }: { children: ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [activeTopic, setActiveTopicState] = useState<string | null>(null);
  const [activeSubject, setActiveSubjectState] = useState<string | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics>(defaultPerformance);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage_safe.getItem('student_info');
    if (stored) {
      try {
        setStudentInfo(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load student info from localStorage');
      }
    }
    
    const storedPerf = localStorage_safe.getItem('student_performance');
    if (storedPerf) {
      try {
        setPerformance(JSON.parse(storedPerf));
      } catch (e) {
        console.error('Failed to load performance data from localStorage');
      }
    }
  }, []);

  const setActiveTopic = (topic: string, subject: string) => {
    setActiveTopicState(topic);
    setActiveSubjectState(subject);
  };

  const login = (info: StudentInfo) => {
    const infoWithDate = {
      ...info,
      joinedDate: info.joinedDate || new Date()
    };
    setStudentInfo(infoWithDate);
    localStorage_safe.setItem('student_info', JSON.stringify(infoWithDate));
  };

  const logout = () => {
    setStudentInfo(null);
    setActiveTopicState(null);
    setActiveSubjectState(null);
    localStorage_safe.removeItem('student_info');
  };

  const updatePerformance = (metrics: Partial<PerformanceMetrics>) => {
    const updated = { ...performance, ...metrics };
    setPerformance(updated);
    localStorage_safe.setItem('student_performance', JSON.stringify(updated));
  };

  const recordTopicCompletion = (topic: string) => {
    updatePerformance({
      topicsCompleted: performance.topicsCompleted + 1,
      lastActiveDate: new Date()
    });
  };

  const recordTestAttempt = (score: number) => {
    const newTotal = performance.testsAttempted + 1;
    const newAverage = (performance.averageScore * performance.testsAttempted + score) / newTotal;
    updatePerformance({
      testsAttempted: newTotal,
      averageScore: Math.round(newAverage),
      lastActiveDate: new Date()
    });
  };

  const updateLearningTime = (minutes: number) => {
    updatePerformance({
      totalLearningMinutes: performance.totalLearningMinutes + minutes,
      lastActiveDate: new Date()
    });
  };

  return (
    <StudentContext.Provider value={{ 
      studentInfo, 
      setStudentInfo, 
      login, 
      activeTopic, 
      activeSubject, 
      setActiveTopic, 
      logout,
      performance,
      updatePerformance,
      recordTopicCompletion,
      recordTestAttempt,
      updateLearningTime
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
