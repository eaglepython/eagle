import { useState, useEffect } from 'react';
import { RAGEvaluationEngine } from '../utils/RAGEvaluationEngine';
import { DailyTrackerAgent } from '../utils/DailyTrackerAgent';
import { CareerTrackerAgent } from '../utils/CareerTrackerAgent';
import { TradingJournalAgent } from '../utils/TradingJournalAgent';
import { HealthTrackerAgent } from '../utils/HealthTrackerAgent';
import { FinanceTrackerAgent } from '../utils/FinanceTrackerAgent';

/**
 * Hook: Get RAG evaluation and recommendations
 * @param {Object} userData - User data
 * @returns {Object} { evaluation, recommendations, isLoading }
 */
export function useRAGEvaluation(userData) {
  const [evaluation, setEvaluation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const engine = new RAGEvaluationEngine(userData, []);
      setEvaluation(engine.generateAdaptiveEvaluation());
      setRecommendations(engine.getGoalAlignedRecommendations());
    } catch (error) {
      console.error('RAG Evaluation Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { evaluation, recommendations, isLoading };
}

/**
 * Hook: Get Daily Tracker Agent analysis
 * @param {Object} userData - User data
 * @returns {Object} { analysis, recommendations, isLoading }
 */
export function useDailyTrackerAgent(userData) {
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const agent = new DailyTrackerAgent(userData);
      setAnalysis(agent.analyzeCategoryDetails());
      setRecommendations(agent.generateCategoryRecommendations());
    } catch (error) {
      console.error('Daily Tracker Agent Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { analysis, recommendations, isLoading };
}

/**
 * Hook: Get Career Tracker Agent analysis
 * @param {Object} userData - User data
 * @returns {Object} { analysis, recommendations, isLoading }
 */
export function useCareerTrackerAgent(userData) {
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const agent = new CareerTrackerAgent(userData);
      setAnalysis(agent.analyzeTierPerformance());
      setRecommendations(agent.generateTierRecommendations());
    } catch (error) {
      console.error('Career Tracker Agent Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { analysis, recommendations, isLoading };
}

/**
 * Hook: Get Trading Journal Agent analysis
 * @param {Object} userData - User data
 * @returns {Object} { patterns, recommendations, isLoading }
 */
export function useTradingJournalAgent(userData) {
  const [patterns, setPatterns] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const agent = new TradingJournalAgent(userData);
      setPatterns(agent.analyzeTradingPatterns());
      setRecommendations(agent.generateTradingRecommendations());
    } catch (error) {
      console.error('Trading Journal Agent Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { patterns, recommendations, isLoading };
}

/**
 * Hook: Get Health Tracker Agent analysis
 * @param {Object} userData - User data
 * @returns {Object} { patterns, recommendations, isLoading }
 */
export function useHealthTrackerAgent(userData) {
  const [patterns, setPatterns] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const agent = new HealthTrackerAgent(userData);
      setPatterns(agent.analyzeWorkoutPatterns());
      setRecommendations(agent.generateFitnessRecommendations());
    } catch (error) {
      console.error('Health Tracker Agent Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { patterns, recommendations, isLoading };
}

/**
 * Hook: Get Finance Tracker Agent analysis
 * @param {Object} userData - User data
 * @returns {Object} { analysis, recommendations, isLoading }
 */
export function useFinanceTrackerAgent(userData) {
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const agent = new FinanceTrackerAgent(userData);
      setAnalysis(agent.analyzeFinancialHealth());
      setRecommendations(agent.generateFinancialRecommendations());
    } catch (error) {
      console.error('Finance Tracker Agent Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { analysis, recommendations, isLoading };
}

/**
 * Hook: Debounce localStorage updates
 * @param {Object} data - Data to save
 * @param {number} delay - Debounce delay in ms (default: 500)
 */
export function useLocalStorageDebounce(data, key = 'lifeTrackerData', delay = 500) {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('LocalStorage Error:', error);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, key, delay]);
}

/**
 * Hook: Persist state to localStorage with debounce
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {[*, function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('LocalStorage Read Error:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('LocalStorage Write Error:', error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook: Track interaction for RAG
 * @param {string} type - Interaction type (daily_score, trade, application, etc)
 * @param {Object} data - Interaction data
 * @returns {function} - Track function
 */
export function useInteractionTracking() {
  const trackInteraction = (type, data) => {
    try {
      const interaction = {
        type,
        timestamp: new Date().toISOString(),
        data
      };

      // Store in localStorage for persistence
      const interactions = JSON.parse(
        localStorage.getItem('interactions') || '[]'
      );
      interactions.push(interaction);
      localStorage.setItem('interactions', JSON.stringify(interactions));

      return true;
    } catch (error) {
      console.error('Tracking Error:', error);
      return false;
    }
  };

  return { trackInteraction };
}
