/**
 * Custom React hooks for EDU SPARK
 */

import { useEffect, useState, type RefObject } from 'react';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook to track learning session time
 */
export function useSessionTimer() {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return sessionTime;
}

/**
 * Hook to handle API calls with loading and error states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err as Error);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { execute, status, data, error };
}

/**
 * Hook for debounced values
 */
export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for local storage with sync
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage: ${key}`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Hook to detect when element becomes visible (intersection observer)
 */
export function useInView(ref: RefObject<HTMLElement>, options = {}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

/**
 * Hook for device detection
 */
export function useDevice() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDevice('mobile');
      else if (width < 1024) setDevice('tablet');
      else setDevice('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
}

/**
 * Hook for network status
 */
export function useOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { addNotification } = useNotification();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification('You are back online!', 'success', 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification('You are offline. Some features may be unavailable.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  return isOnline;
}

/**
 * Hook for previous value
 */
export function usePrevious<T>(value: T) {
  const [prev, setPrev] = useState<T>();

  useEffect(() => {
    setPrev(value);
  }, [value]);

  return prev;
}

/**
 * Hook for tracking if component is mounted
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
