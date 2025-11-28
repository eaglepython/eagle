import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { MetricIcons } from './IconSystem';
import { RecommendationEngine } from '../utils/RecommendationEngine';
import { InteractionTracker } from '../utils/InteractionTracker';
import { IntelligentAgent, AdaptiveCoach, PerformanceInsights } from './IntelligentAgent';
import AdaptiveEvaluation from './AdaptiveEvaluation';
import IntelligentChatbox from './IntelligentChatbox';
import QuickActionRecommendations from './QuickActionRecommendations';
import QuickActionAgent from '../utils/QuickActionAgent';
import PsychologyCoachPanel from './PsychologyCoachPanel';

function WeeklyChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    try {
      const ctx = canvasRef.current.getContext('2d');
      
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      const scores = last7Days.map(date => {
        const score = data.find(s => s.date === date);
        return score ? score.totalScore : 0;
      });

      const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
          datasets: [{
            label: 'Daily Score',
            data: scores,
            borderColor: 'rgb(220, 38, 38)',
            backgroundColor: 'rgba(139, 0, 0, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: scores.map(s => s >= 8 ? 'rgb(34, 197, 94)' : 'rgb(220, 38, 38)'),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          animation: false,
          animations: {
            tension: {
              duration: 0
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#e2e8f0',
                font: { size: 14 },
                padding: 15
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#fff',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(139, 0, 0, 0.5)',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: function(context) {
                  return `Score: ${context.parsed.y.toFixed(1)}/10`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              ticks: { 
                color: '#cbd5e1',
                callback: function(value) {
                  return value + '/10';
                }
              },
              grid: { color: 'rgba(139, 0, 0, 0.2)' },
              border: { display: false }
            },
            x: {
              ticks: { color: '#cbd5e1' },
              grid: { color: 'rgba(139, 0, 0, 0.2)', drawBorder: false },
              border: { display: false }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error rendering 7-day chart:', error);
    }

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (e) {
          console.error('Error destroying chart:', e);
        }
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 md:h-80 bg-slate-900/50 rounded-lg border border-red-900/30">
        <div className="text-center text-slate-400">
          <div className="text-2xl md:text-3xl mb-2">📊</div>
          <div className="text-xs md:text-base">Log your daily scores to see trends</div>
          <div className="text-xs text-slate-500 mt-1">Need 2+ days to display chart</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: 'auto',
      minHeight: '200px',
      overflow: 'hidden'
    }}>
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '400px' }}></canvas>
    </div>
  );
}

function CareerPipelineChart({ applications }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !applications || applications.length === 0) return;

    try {
      const ctx = canvasRef.current.getContext('2d');
      
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const statuses = {
        'Applied': applications.filter(a => a.status === 'Applied').length,
        'Phone': applications.filter(a => a.status === 'Phone Screen').length,
        'Interview': applications.filter(a => a.status === 'Interview').length,
        'Offer': applications.filter(a => a.status === 'Offer').length
      };

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Applied', 'Phone Screen', 'Interview', 'Offer'],
          datasets: [{
            label: 'Applications',
            data: Object.values(statuses),
            backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(250, 204, 21, 0.7)', 'rgba(139, 0, 0, 0.9)'],
            borderColor: ['rgb(59, 130, 246)', 'rgb(34, 197, 94)', 'rgb(250, 204, 21)', 'rgb(220, 38, 38)'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          indexAxis: 'y',
          animation: false,
          animations: {
            tension: {
              duration: 0
            }
          },
          plugins: {
            legend: { labels: { color: '#e2e8f0' } },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(139, 0, 0, 0.5)',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              ticks: { color: '#cbd5e1' },
              grid: { color: 'rgba(139, 0, 0, 0.2)' }
            },
            y: {
              ticks: { color: '#cbd5e1' },
              grid: { color: 'rgba(139, 0, 0, 0.2)' }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error rendering career chart:', error);
    }

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (e) {
          console.error('Error destroying career chart:', e);
        }
      }
    };
  }, [applications]);

  if (!applications || applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 md:h-48 bg-slate-900/50 rounded-lg border border-red-900/30">
        <div className="text-center text-slate-400">
          <div className="text-2xl md:text-3xl mb-2">💼</div>
          <div className="text-xs md:text-base">Log your job applications to see pipeline</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto', minHeight: '150px', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '300px' }}></canvas>
    </div>
  );
}

function TradingPnLChart({ trades }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !trades || trades.length === 0) return;

    try {
      const ctx = canvasRef.current.getContext('2d');
      
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const last10Trades = trades.slice(-10);
      const cumulativePnL = [];
      let cumulative = 0;
      last10Trades.forEach(trade => {
        cumulative += trade.pnl || 0;
        cumulativePnL.push(cumulative);
      });

      const finalPnL = cumulativePnL[cumulativePnL.length - 1] || 0;

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: last10Trades.map((_, i) => `T${i + 1}`),
          datasets: [{
            label: 'Cumulative P&L',
            data: cumulativePnL,
            borderColor: finalPnL >= 0 ? 'rgb(34, 197, 94)' : 'rgb(220, 38, 38)',
            backgroundColor: finalPnL >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: cumulativePnL.map(p => p >= 0 ? 'rgb(34, 197, 94)' : 'rgb(220, 38, 38)'),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          animation: false,
          animations: {
            tension: {
              duration: 0
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { labels: { color: '#e2e8f0' } },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(139, 0, 0, 0.5)',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return `P&L: $${context.parsed.y.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            y: {
              ticks: { 
                color: '#cbd5e1',
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              grid: { color: 'rgba(139, 0, 0, 0.2)' }
            },
            x: {
              ticks: { color: '#cbd5e1' },
              grid: { color: 'rgba(139, 0, 0, 0.2)' }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error rendering P&L chart:', error);
    }

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (e) {
          console.error('Error destroying P&L chart:', e);
        }
      }
    };
  }, [trades]);

  if (!trades || trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 md:h-60 bg-slate-900/50 rounded-lg border border-red-900/30">
        <div className="text-center text-slate-400">
          <div className="text-2xl md:text-3xl mb-2">💹</div>
          <div className="text-xs md:text-base">Log your trades to see P&L chart</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto', minHeight: '150px', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '350px' }}></canvas>
    </div>
  );
}

function WorkoutTypeChart({ workouts }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !workouts || workouts.length === 0) return;

    try {
      const ctx = canvasRef.current.getContext('2d');
      
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const types = {};
      workouts.forEach(w => {
        types[w.type] = (types[w.type] || 0) + 1;
      });

      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(types),
          datasets: [{
            data: Object.values(types),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(139, 0, 0, 0.9)',
              'rgba(34, 197, 94, 0.7)',
              'rgba(250, 204, 21, 0.7)',
              'rgba(168, 85, 247, 0.7)',
              'rgba(14, 165, 233, 0.7)'
            ],
            borderColor: ['rgb(59, 130, 246)', 'rgb(220, 38, 38)', 'rgb(34, 197, 94)', 'rgb(250, 204, 21)', 'rgb(168, 85, 247)', 'rgb(14, 165, 233)'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.2,
          animation: false,
          animations: {
            tension: {
              duration: 0
            }
          },
          plugins: {
            legend: { 
              labels: { color: '#e2e8f0' },
              position: 'right'
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(139, 0, 0, 0.5)',
              borderWidth: 1
            }
          }
        }
      });
    } catch (error) {
      console.error('Error rendering workout chart:', error);
    }

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (e) {
          console.error('Error destroying workout chart:', e);
        }
      }
    };
  }, [workouts]);

  if (!workouts || workouts.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 bg-slate-900/50 rounded-lg border border-red-900/30">
        <div className="text-center text-slate-400">
          <div className="text-2xl mb-2">💪</div>
          <div>Log your workouts to see type distribution</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }}></canvas>
    </div>
  );
}

function DailyCategoryChart({ dailyScores }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !dailyScores || dailyScores.length === 0) return;

    try {
      const ctx = canvasRef.current.getContext('2d');
      
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const latestScore = dailyScores[dailyScores.length - 1];
      if (!latestScore || !latestScore.scores) return;

      const categoryNames = ['Morning', 'Deep Work', 'Exercise', 'Trading', 'Learning', 'Nutrition', 'Sleep', 'Social', 'MIT'];
      const scores = latestScore.scores || [0, 0, 0, 0, 0, 0, 0, 0, 0];

      chartRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: categoryNames,
          datasets: [{
            label: 'Today\'s Score',
            data: scores,
            borderColor: 'rgb(220, 38, 38)',
            backgroundColor: 'rgba(139, 0, 0, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: scores.map(s => s >= 8 ? 'rgb(34, 197, 94)' : 'rgb(220, 38, 38)'),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.1,
          animation: false,
          animations: {
            tension: {
              duration: 0
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 10,
              ticks: { 
                color: '#cbd5e1',
                callback: function(value) {
                  return value + '/10';
                }
              },
              grid: { color: 'rgba(139, 0, 0, 0.2)' }
            }
          },
          plugins: {
            legend: { labels: { color: '#e2e8f0' } },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(139, 0, 0, 0.5)',
              borderWidth: 1
            }
          }
        }
      });
    } catch (error) {
      console.error('Error rendering daily category chart:', error);
    }

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (e) {
          console.error('Error destroying daily category chart:', e);
        }
      }
    };
  }, [dailyScores]);

  if (!dailyScores || dailyScores.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 md:h-64 bg-slate-900/50 rounded-lg border border-red-900/30">
        <div className="text-center text-slate-400">
          <div className="text-2xl md:text-3xl mb-2">🎯</div>
          <div className="text-xs md:text-base">Log your daily categories to see breakdown</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto', minHeight: '140px', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '320px' }}></canvas>
    </div>
  );
}

function Dashboard({ userData, setUserData, addNotification, setCurrentView }) {
  const [agentRecommendations, setAgentRecommendations] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [nudges, setNudges] = useState([]);
  const [showActionRecommendations, setShowActionRecommendations] = useState(false);
  const [currentActionRecommendations, setCurrentActionRecommendations] = useState(null);

  // Quick Actions Handler - navigates to correct view based on action
  const handleQuickAction = (action) => {
    const quickActionAgent = new QuickActionAgent(userData);
    const recs = quickActionAgent.getRecommendations(action);
    
    if (recs) {
      setCurrentActionRecommendations(recs);
      setShowActionRecommendations(true);
    }

    const actionMap = {
      'Log today': () => setCurrentView('daily'),
      'Add app': () => setCurrentView('career'),
      'Log trade': () => setCurrentView('trading'),
      'Log workout': () => setCurrentView('health'),
      'Track hours': () => setCurrentView('resources'),
      'Reflect': () => setCurrentView('weekly')
    };

    if (actionMap[action]) {
      // Show recommendations first, then navigate after a short delay
      setTimeout(() => {
        actionMap[action]();
        addNotification(`📍 Smart recommendations shown for ${action}`, 'success');
      }, 500);
    }
  };

  // Close recommendations and navigate
  const handleRecommendationsDismiss = () => {
    setShowActionRecommendations(false);
    setCurrentActionRecommendations(null);
  };

  useEffect(() => {
    // Initialize recommendation engine
    const engine = new RecommendationEngine(userData);
    
    // Generate all AI insights
    setAgentRecommendations(engine.generateRecommendations());
    setPredictions(engine.predictGoalAchievement());
    setNudges(engine.generateNudges());
  }, [userData]);

  const today = new Date().toISOString().split('T')[0];
  const todayScore = userData.dailyScores.find(s => s.date === today);
  const thisWeek = userData.dailyScores.filter(s => {
    const scoreDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return scoreDate >= weekAgo;
  });

  const avgWeeklyScore = thisWeek.length > 0
    ? (thisWeek.reduce((sum, s) => sum + s.totalScore, 0) / thisWeek.length).toFixed(1)
    : 0;

  const jobAppsThisWeek = userData.jobApplications.filter(app => {
    const appDate = new Date(app.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return appDate >= weekAgo;
  }).length;

  const workoutsThisWeek = userData.workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  // Trading metrics
  const totalPnL = userData.tradingJournal.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winningTrades = userData.tradingJournal.filter(t => (t.pnl || 0) > 0).length;
  const losingTrades = userData.tradingJournal.filter(t => (t.pnl || 0) < 0).length;
  const winRate = userData.tradingJournal.length > 0 
    ? ((winningTrades / userData.tradingJournal.length) * 100).toFixed(1)
    : 0;

  // Financial metrics
  const netWorth = userData.financialData?.netWorth || 0;
  const monthlyIncome = userData.financialData?.monthlyIncome || 0;
  const monthlyExpenses = userData.financialData?.monthlyExpenses || 0;
  const savingsRate = monthlyIncome > 0 ? (((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100).toFixed(1) : 0;

  // Health metrics
  const totalMinutes = userData.workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const avgDuration = userData.workouts.length > 0 ? (totalMinutes / userData.workouts.length).toFixed(1) : 0;

  // Career metrics
  const tierCounts = {
    'Tier 1': userData.jobApplications.filter(a => a.tier === 'Tier 1').length,
    'Tier 2': userData.jobApplications.filter(a => a.tier === 'Tier 2').length,
    'Tier 3': userData.jobApplications.filter(a => a.tier === 'Tier 3').length,
    'Tier 4': userData.jobApplications.filter(a => a.tier === 'Tier 4').length
  };

  return (
    <div className="space-y-6">
      {/* AI Agent Recommendations Panel */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl border border-blue-600/30 p-4">
        <IntelligentAgent 
          recommendations={agentRecommendations}
          predictions={predictions}
          nudges={nudges}
        />
      </div>

      {/* Adaptive Coach */}
      <AdaptiveCoach userData={userData} metrics={{ avgWeeklyScore, jobAppsThisWeek, workoutsThisWeek }} />

      {/* Key Metrics Section - Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {/* Today's Score */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Score />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Today's Score</div>
          <div className={`text-xl md:text-3xl font-bold ${todayScore && todayScore.totalScore >= 8 ? 'text-green-400' : 'text-orange-400'}`}>
            {todayScore ? todayScore.totalScore.toFixed(1) : '0.0'}/10
          </div>
          <div className="text-xs text-slate-400 mt-1">{todayScore ? '✅' : '⏳'}</div>
        </div>

        {/* Weekly Average */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Trend />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">7-Day Avg</div>
          <div className="text-xl md:text-3xl font-bold text-blue-400">{avgWeeklyScore}/10</div>
          <div className="text-xs text-slate-400 mt-1">{thisWeek.length}d</div>
        </div>

        {/* Job Applications */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Applications />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Apps/Wk</div>
          <div className={`text-xl md:text-3xl font-bold ${jobAppsThisWeek >= 15 ? 'text-green-400' : 'text-yellow-400'}`}>
            {jobAppsThisWeek}/15
          </div>
          <div className="text-xs text-slate-400 mt-1">Target</div>
        </div>

        {/* Workouts */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Workouts />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Workouts</div>
          <div className={`text-xl md:text-3xl font-bold ${workoutsThisWeek >= 6 ? 'text-green-400' : 'text-yellow-400'}`}>
            {workoutsThisWeek}/6
          </div>
          <div className="text-xs text-slate-400 mt-1">Target</div>
        </div>
      </div>

      {/* Key Metrics Section - Row 2: Advanced Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {/* Trading P&L */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.PnL />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">P&L</div>
          <div className={`text-xl md:text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${totalPnL.toFixed(0)}
          </div>
          <div className="text-xs text-slate-400 mt-1">{userData.tradingJournal.length}t</div>
        </div>

        {/* Win Rate */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.WinRate />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Win Rate</div>
          <div className={`text-xl md:text-3xl font-bold ${winRate >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
            {winRate}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{winningTrades}W/{losingTrades}L</div>
        </div>

        {/* Net Worth */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.NetWorth />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Net Worth</div>
          <div className="text-xl md:text-3xl font-bold text-green-400">
            ${(netWorth/1000).toFixed(0)}K
          </div>
          <div className="text-xs text-slate-400 mt-1">Assets</div>
        </div>

        {/* Savings Rate */}
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Savings />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Save Rate</div>
          <div className={`text-xl md:text-3xl font-bold ${savingsRate >= 20 ? 'text-green-400' : 'text-yellow-400'}`}>
            {savingsRate}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Monthly</div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Time />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Workout Time</div>
          <div className="text-xl md:text-3xl font-bold text-blue-400">{totalMinutes} min</div>
          <div className="text-xs text-slate-400 mt-1">{userData.workouts.length}w</div>
        </div>

        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Duration />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Avg Duration</div>
          <div className="text-xl md:text-3xl font-bold text-blue-400">{avgDuration}m</div>
          <div className="text-xs text-slate-400 mt-1">Per WO</div>
        </div>

        <div className="stat-box">
          <div className="icon-container">
            <MetricIcons.Applications />
          </div>
          <div className="text-slate-300 text-xs md:text-sm">Total Apps</div>
          <div className="text-xl md:text-3xl font-bold text-purple-400">{userData.jobApplications.length}</div>
          <div className="text-xs text-slate-400 mt-1">All time</div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {Object.entries(tierCounts).map(([tier, count]) => (
          <div key={tier} className="glass rounded-lg p-2 md:p-4 border border-red-900/50 text-center">
            <div className="text-slate-300 text-xs md:text-sm font-semibold">{tier}</div>
            <div className="text-lg md:text-2xl font-bold text-red-400 mt-1">{count}</div>
          </div>
        ))}
      </div>

      {/* 5-Year Vision */}
      <div className="framework-card">
        <h2 className="section-title text-lg md:text-xl">🎯 5-YEAR VISION (2030)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="bg-slate-900/50 p-2 md:p-3 rounded-lg border border-red-900/30">
            <div className="text-red-400 font-semibold text-sm md:text-base">Financial</div>
            <div className="text-white text-xs md:text-sm">$2M+ net worth, passive income exceeding expenses</div>
          </div>
          <div className="bg-slate-900/50 p-2 md:p-3 rounded-lg border border-red-900/30">
            <div className="text-red-400 font-semibold text-sm md:text-base">Career</div>
            <div className="text-white text-xs md:text-sm">Senior Quant/AI Architect at tier-1 firm</div>
          </div>
          <div className="bg-slate-900/50 p-2 md:p-3 rounded-lg border border-red-900/30">
            <div className="text-red-400 font-semibold text-sm md:text-base">Health</div>
            <div className="text-white text-xs md:text-sm">Peak physical condition, marathons, 10% body fat</div>
          </div>
          <div className="bg-slate-900/50 p-2 md:p-3 rounded-lg border border-red-900/30">
            <div className="text-red-400 font-semibold text-sm md:text-base">Skills</div>
            <div className="text-white text-xs md:text-sm">Published research, thought leader in AI/Finance</div>
          </div>
        </div>
      </div>

      {/* 2026 Immediate Objectives */}
      <div className="framework-card">
        <h2 className="section-title text-lg md:text-xl">🚀 2026 IMMEDIATE OBJECTIVES</h2>
        <div className="space-y-2 md:space-y-3">
          {[
            { emoji: '💼', title: 'Career', desc: 'Quant researcher role at target firm (Q2 2026)' },
            { emoji: '📈', title: 'Trading', desc: 'Scale to $500K AUM with 20%+ annual returns' },
            { emoji: '🎓', title: 'Education', desc: 'MS Financial Engineering completion (4.0 GPA)' },
            { emoji: '💰', title: 'Wealth', desc: 'Increase net worth by 40% via trading + employment' },
            { emoji: '💪', title: 'Health', desc: '12% body fat, half-marathon sub-1:45' },
            { emoji: '🤝', title: 'Network', desc: 'Build relationships with 50+ industry pros' }
          ].map((obj, idx) => (
            <div key={idx} className="flex items-start gap-2 md:gap-3 bg-slate-900/50 p-2 md:p-3 rounded-lg border border-red-900/30">
              <span className="text-xl md:text-2xl flex-shrink-0">{obj.emoji}</span>
              <div className="min-w-0">
                <div className="text-red-400 font-semibold text-xs md:text-sm">{obj.title}</div>
                <div className="text-slate-300 text-xs md:text-sm line-clamp-2">{obj.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section - Row 1: Line Chart & Category Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
        {/* Weekly Trend */}
        <div className="framework-card">
          <h2 className="section-title text-lg md:text-xl">📊 7-DAY TREND</h2>
          <WeeklyChart data={thisWeek} />
        </div>

        {/* Daily Category Breakdown */}
        {userData.dailyScores.length > 0 && (
          <div className="framework-card">
            <h2 className="section-title text-lg md:text-xl">🎯 TODAY'S BREAKDOWN</h2>
            <DailyCategoryChart dailyScores={userData.dailyScores} />
          </div>
        )}
      </div>

      {/* Charts Section - Row 2: Career & Trading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Career Pipeline */}
        {userData.jobApplications.length > 0 && (
          <div className="framework-card">
            <h2 className="section-title">💼 CAREER PIPELINE STATUS</h2>
            <CareerPipelineChart applications={userData.jobApplications} />
          </div>
        )}

        {/* Trading P&L Trend */}
        {userData.tradingJournal.length > 0 && (
          <div className="framework-card">
            <h2 className="section-title">📈 CUMULATIVE P&L TREND</h2>
            <TradingPnLChart trades={userData.tradingJournal} />
          </div>
        )}
      </div>

      {/* Charts Section - Row 3: Health & Fitness */}
      {userData.workouts.length > 0 && (
        <div className="framework-card">
          <h2 className="section-title">💪 WORKOUT TYPE DISTRIBUTION</h2>
          <div style={{ height: '250px' }}>
            <WorkoutTypeChart workouts={userData.workouts} />
          </div>
        </div>
      )}

      {/* Adaptive Evaluation Section - GOAL TRACKING */}
      <div className="mt-8 pt-8 border-t border-slate-700">
        <AdaptiveEvaluation userData={userData} setUserData={() => {}} />
      </div>

      {/* Psychology Coach Panel - Brain Enhancement & Master Integration */}
      <div className="mt-8 pt-8 border-t border-slate-700">
        <PsychologyCoachPanel userData={userData} />
      </div>

      {/* Quick Actions */}
      <div className="framework-card">
        <h2 className="section-title">⚡ QUICK ACTIONS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { emoji: '📝', label: 'Daily Score', action: 'Log today' },
            { emoji: '💼', label: 'Job Application', action: 'Add app' },
            { emoji: '📊', label: 'Trading Log', action: 'Log trade' },
            { emoji: '💪', label: 'Workout', action: 'Log workout' },
            { emoji: '📚', label: 'Learning', action: 'Track hours' },
            { emoji: '📋', label: 'Weekly Review', action: 'Reflect' }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action.action)}
              className="bg-red-900 hover:bg-red-800 text-white font-semibold py-3 px-2 rounded-lg transition-all text-center transform hover:scale-105"
            >
              <div className="text-2xl mb-1">{action.emoji}</div>
              <div className="text-xs">{action.action}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Intelligent Chatbox - Fixed Position */}
      <IntelligentChatbox userData={userData} setUserData={setUserData} />

      {/* Quick Action Recommendations Modal */}
      {showActionRecommendations && currentActionRecommendations && (
        <QuickActionRecommendations
          recommendations={currentActionRecommendations}
          onDismiss={handleRecommendationsDismiss}
        />
      )}
    </div>
  );
}

export default Dashboard;
