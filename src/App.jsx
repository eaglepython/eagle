import { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import WeeklyReview from './components/WeeklyReview';
import CareerTracker from './components/CareerTracker';
import TradingJournal from './components/TradingJournal';
import HealthTracker from './components/HealthTracker';
import FinanceTracker from './components/FinanceTracker';
import GoalsManager from './components/GoalsManager';
import ReminderManager from './components/ReminderManager';
import ResourceRecommendations from './components/ResourceRecommendations';
import LiveUpdatesComponent from './components/LiveUpdatesComponent';
import NotificationContainer from './components/NotificationContainer';
import Header from './components/Header';
import Navigation from './components/Navigation';

// Complete default data structure
const DEFAULT_USER_DATA = {
  dailyScores: [],
  weeklyReviews: [],
  goals: [
    { id: 1, name: 'Daily Score 8.0', target: 8, category: 'discipline', priority: 'CRITICAL' },
    { id: 2, name: 'Job Applications (15/week)', target: 15, category: 'career', priority: 'CRITICAL' },
    { id: 3, name: 'Tier 1 Applications (5/week)', target: 5, category: 'career', priority: 'HIGH' },
    { id: 4, name: 'Trading Win Rate (55%)', target: 55, category: 'trading', priority: 'CRITICAL' },
    { id: 5, name: 'Monthly P&L ($5K)', target: 5000, category: 'trading', priority: 'HIGH' },
    { id: 6, name: 'AUM ($500K)', target: 500000, category: 'trading', priority: 'CRITICAL' },
    { id: 7, name: 'Workouts/Week (6)', target: 6, category: 'health', priority: 'HIGH' },
    { id: 8, name: 'Body Fat (12%)', target: 12, category: 'health', priority: 'MEDIUM' },
    { id: 9, name: 'Savings Rate (30%)', target: 30, category: 'finance', priority: 'HIGH' },
    { id: 10, name: 'Net Worth ($2M)', target: 2000000, category: 'finance', priority: 'CRITICAL' }
  ],
  habits: [],
  tradingJournal: [],
  jobApplications: [],
  workouts: [],
  careerData: {
    applications: [],
    interviews: [],
    offers: [],
    rejections: []
  },
  healthData: {
    workouts: [],
    bodyFat: null,
    weight: null,
    measurements: {}
  },
  financialData: {
    netWorth: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    expenses: [],
    investments: []
  },
  interactions: [] // For RAG tracking
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('lifeTrackerData');
    return saved ? JSON.parse(saved) : DEFAULT_USER_DATA;
  });
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('lifeTrackerData', JSON.stringify(userData));
  }, [userData]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for scheduled reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const reminders = [
        { time: '05:00', message: '⏰ Time to wake up! Start your day strong.', id: 'wake' },
        { time: '05:15', message: '🎯 Deep Work Session #1 - Most Important Task', id: 'dw1' },
        { time: '06:00', message: '💪 Exercise Time - Get that body moving!', id: 'exercise1' },
        { time: '08:00', message: '📊 Trading Session - Execute your strategy', id: 'trading' },
        { time: '12:00', message: '🥗 Lunch & Walk - Recharge your energy', id: 'lunch' },
        { time: '16:00', message: '📈 Trading Review - Journal your trades', id: 'trading-review' },
        { time: '20:00', message: '📚 Learning Time - Invest in yourself', id: 'learning' },
        { time: '21:30', message: '📝 Daily Review - Reflect and plan tomorrow', id: 'review' },
        { time: '22:00', message: '😴 Sleep Prep - Wind down for quality rest', id: 'sleep' }
      ];

      reminders.forEach(reminder => {
        const [rHour, rMinute] = reminder.time.split(':').map(Number);
        if (hour === rHour && minute === rMinute) {
          addNotification(reminder.message, 'info');
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const views = {
    dashboard: <Dashboard userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    daily: <DailyTracker userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    weekly: <WeeklyReview userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    career: <CareerTracker userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    trading: <TradingJournal userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    health: <HealthTracker userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    finance: <FinanceTracker userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    goals: <GoalsManager userData={userData} setUserData={setUserData} addNotification={addNotification} />,
    reminders: <ReminderManager userData={userData} addNotification={addNotification} />,
    resources: <ResourceRecommendations userData={userData} addNotification={addNotification} />,
    live: <LiveUpdatesComponent userData={userData} addNotification={addNotification} />
  };

  return (
    <ErrorBoundary>
      <div className="w-full h-screen overflow-y-auto overflow-x-hidden flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <Header currentTime={currentTime} />
        <Navigation currentView={currentView} setCurrentView={setCurrentView} views={views} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          {views[currentView]}
        </div>
        <NotificationContainer notifications={notifications} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
