import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing state with localStorage persistence
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value
 * @returns {[any, Function, Function, Function]} - [value, setValue, removeValue, clearStorage]
 */
const useLocalStorage = (key, initialValue) => {
  // Get stored value from localStorage or use initial value
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue());

  // Initialize on mount
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  /**
   * Set a new value to localStorage and update state
   * @param {any} value - The value to store
   */
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  /**
   * Remove the value from localStorage and reset to initial value
   */
  const removeValue = useCallback(() => {
    try {
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      // Reset state to initial value
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Clear all localStorage items (optional)
   */
  const clearStorage = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [initialValue]);

  /**
   * Get all localStorage keys with a specific prefix
   * @param {string} prefix - The prefix to filter keys
   * @returns {Array} - Array of keys
   */
  const getKeysWithPrefix = useCallback((prefix) => {
    try {
      if (typeof window !== 'undefined') {
        return Object.keys(window.localStorage).filter(key => 
          key.startsWith(prefix)
        );
      }
      return [];
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }, []);

  /**
   * Check if a key exists in localStorage
   * @param {string} checkKey - The key to check
   * @returns {boolean} - Whether the key exists
   */
  const hasKey = useCallback((checkKey) => {
    try {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(checkKey) !== null;
      }
      return false;
    } catch (error) {
      console.error('Error checking localStorage key:', error);
      return false;
    }
  }, []);

  /**
   * Get multiple items by keys
   * @param {Array} keys - Array of keys to retrieve
   * @returns {Object} - Object with key-value pairs
   */
  const getMultiple = useCallback((keys) => {
    try {
      if (typeof window !== 'undefined') {
        return keys.reduce((acc, key) => {
          try {
            const value = window.localStorage.getItem(key);
            if (value !== null) {
              acc[key] = JSON.parse(value);
            }
          } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
          }
          return acc;
        }, {});
      }
      return {};
    } catch (error) {
      console.error('Error getting multiple localStorage items:', error);
      return {};
    }
  }, []);

  /**
   * Set multiple items at once
   * @param {Object} items - Object with key-value pairs to store
   */
  const setMultiple = useCallback((items) => {
    try {
      if (typeof window !== 'undefined') {
        Object.entries(items).forEach(([itemKey, value]) => {
          window.localStorage.setItem(itemKey, JSON.stringify(value));
        });
      }
      
      // Update the current key if it's in the items
      if (items[key] !== undefined) {
        setStoredValue(items[key]);
      }
    } catch (error) {
      console.error('Error setting multiple localStorage items:', error);
    }
  }, [key]);

  /**
   * Subscribe to localStorage changes (cross-tab/window)
   * @param {Function} callback - Function to call when storage changes
   * @returns {Function} - Cleanup function to remove listener
   */
  const subscribe = useCallback((callback) => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        callback(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    
    return () => {};
  }, [key]);

  /**
   * Get the raw string value from localStorage (without parsing)
   * @returns {string|null} - The raw string value
   */
  const getRawValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error(`Error getting raw localStorage value for key "${key}":`, error);
      return null;
    }
  }, [key]);

  /**
   * Set a raw string value to localStorage (without stringifying)
   * @param {string} value - The string value to store
   */
  const setRawValue = useCallback((value) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
        setStoredValue(value);
      }
    } catch (error) {
      console.error(`Error setting raw localStorage value for key "${key}":`, error);
    }
  }, [key]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearStorage,
    getKeysWithPrefix,
    hasKey,
    getMultiple,
    setMultiple,
    subscribe,
    getRawValue,
    setRawValue,
  };
};

/**
 * Hook for storing string values (no JSON parsing)
 */
export const useLocalStorageString = (key, initialValue = '') => {
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    setStoredValue(readValue);
  }, [readValue]);

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, valueToStore);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for storing boolean values
 */
export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, [setValue]);

  return {
    value: Boolean(value),
    setValue,
    toggle,
    removeValue,
  };
};

/**
 * Hook for storing number values
 */
export const useLocalStorageNumber = (key, initialValue = 0) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const increment = useCallback((amount = 1) => {
    setValue(prev => {
      const num = Number(prev);
      return isNaN(num) ? amount : num + amount;
    });
  }, [setValue]);

  const decrement = useCallback((amount = 1) => {
    setValue(prev => {
      const num = Number(prev);
      return isNaN(num) ? -amount : num - amount;
    });
  }, [setValue]);

  return {
    value: Number(value) || initialValue,
    setValue,
    increment,
    decrement,
    removeValue,
  };
};

/**
 * Hook for storing array values
 */
export const useLocalStorageArray = (key, initialValue = []) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const push = useCallback((item) => {
    setValue(prev => [...prev, item]);
  }, [setValue]);

  const remove = useCallback((index) => {
    setValue(prev => prev.filter((_, i) => i !== index));
  }, [setValue]);

  const update = useCallback((index, item) => {
    setValue(prev => prev.map((val, i) => i === index ? item : val));
  }, [setValue]);

  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);

  return {
    value: Array.isArray(value) ? value : initialValue,
    setValue,
    push,
    remove,
    update,
    clear,
    removeValue,
  };
};

/**
 * Hook for storing object values
 */
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const updateField = useCallback((field, fieldValue) => {
    setValue(prev => ({
      ...prev,
      [field]: fieldValue
    }));
  }, [setValue]);

  const removeField = useCallback((field) => {
    setValue(prev => {
      const newValue = { ...prev };
      delete newValue[field];
      return newValue;
    });
  }, [setValue]);

  const merge = useCallback((object) => {
    setValue(prev => ({
      ...prev,
      ...object
    }));
  }, [setValue]);

  return {
    value: typeof value === 'object' && value !== null ? value : initialValue,
    setValue,
    updateField,
    removeField,
    merge,
    removeValue,
  };
};

export default useLocalStorage;