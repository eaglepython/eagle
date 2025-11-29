import { useState, useEffect } from 'react';
import { RAGEvaluationEngine } from '../utils/RAGEvaluationEngine';
import { DailyTrackerAgent } from '../utils/DailyTrackerAgent';
import { CareerTrackerAgent } from '../utils/CareerTrackerAgent';
import { TradingJournalAgent } from '../utils/TradingJournalAgent';
import { HealthTrackerAgent } from '../utils/HealthTrackerAgent';
import { FinanceTrackerAgent } from '../utils/FinanceTrackerAgent';
import { PsychologyCoachAgent } from '../utils/PsychologyCoachAgent';
import { MasterIntegrationAgent } from '../utils/MasterIntegrationAgent';
import { PerformanceMonitorAgent } from '../utils/PerformanceMonitorAgent';
import { AdaptivePerformanceOptimizer } from '../utils/AdaptivePerformanceOptimizer';
import { PersonalAICoach } from '../utils/PersonalAICoach';
import { GoalAchievementPredictorAgent } from '../utils/GoalAchievementPredictorAgent';

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

/**
 * Hook: Get Psychology Coach Agent analysis
 * @param {Object} userData - User data
 * @returns {Object} { coaching, isLoading }
 */
export function usePsychologyCoach(userData) {
  const [coaching, setCoaching] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const coach = new PsychologyCoachAgent(userData);
      setCoaching(coach.getMasterPsychologyCoaching());
    } catch (error) {
      console.error('Psychology Coach Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { coaching, isLoading };
}

/**
 * Hook: Get Master Integration Agent analysis
 * @param {Object} userData - User data
 * @param {Array} interactions - User interactions
 * @returns {Object} { analysis, isLoading }
 */
export function useMasterIntegration(userData, interactions = []) {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const master = new MasterIntegrationAgent(userData, interactions);
      setAnalysis(master.getMasterAnalysis());
    } catch (error) {
      console.error('Master Integration Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData, interactions]);

  return { analysis, isLoading };
}

/**
 * Hook: Get Adaptive Performance Optimizer analysis
 * @param {Object} userData - User data
 * @returns {Object} { schedule, energy, stress, focus, forecast, realTime, isLoading }
 */
export function useAdaptivePerformance(userData) {
  const [schedule, setSchedule] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [stress, setStress] = useState(null);
  const [focus, setFocus] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [realTime, setRealTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const optimizer = new AdaptivePerformanceOptimizer(userData);
      setSchedule(optimizer.getOptimalSchedule());
      setEnergy(optimizer.getEnergyPrediction());
      setStress(optimizer.getStressTriggerAnalysis());
      setFocus(optimizer.getFocusCapacityPrediction());
      setForecast(optimizer.getPerformanceForecast());
      setRealTime(optimizer.getRealTimeRecommendations());
    } catch (error) {
      console.error('Adaptive Performance Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { schedule, energy, stress, focus, forecast, realTime, isLoading };
}

/**
 * Hook: Get Personal AI Coach real-time coaching
 * @param {Object} userData - User data
 * @returns {Object} { nextAction, motivation, challenge, tip, dayPrediction, progress, isLoading }
 */
export function usePersonalAICoach(userData) {
  const [nextAction, setNextAction] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [tip, setTip] = useState(null);
  const [dayPrediction, setDayPrediction] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const coach = new PersonalAICoach(userData);
      setNextAction(coach.getNextAction());
      setMotivation(coach.getMotivationalMessage());
      setChallenge(coach.getAccountabilityChallenge());
      setTip(coach.getPersonalizedTip());
      setDayPrediction(coach.getDayPrediction());
      setProgress(coach.getProgressReport());
    } catch (error) {
      console.error('Personal AI Coach Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { nextAction, motivation, challenge, tip, dayPrediction, progress, isLoading };
}

/**
 * Hook: Get Performance Monitor metrics
 * @param {Object} userData - User data
 * @returns {Object} { dashboard, isLoading }
 */
export function usePerformanceMonitor(userData) {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const monitor = new PerformanceMonitorAgent(userData);
      setDashboard(monitor.getPerformanceDashboard());
    } catch (error) {
      console.error('Performance Monitor Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { dashboard, isLoading };
}

/**
 * Hook: Get 2026 Goal Achievement Predictions
 * @param {Object} userData - User data
 * @returns {Object} { predictions, isLoading }
 */
export function useGoalPredictions(userData) {
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const predictor = new GoalAchievementPredictorAgent(userData);
      setPredictions(predictor.get2026Predictions());
    } catch (error) {
      console.error('Goal Predictions Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return { predictions, isLoading };
}
