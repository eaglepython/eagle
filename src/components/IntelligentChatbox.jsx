import React, { useState, useRef, useEffect } from 'react';
import { RAGEvaluationEngine } from '../utils/RAGEvaluationEngine';
import { DailyTrackerAgent } from '../utils/DailyTrackerAgent';
import { CareerTrackerAgent } from '../utils/CareerTrackerAgent';
import { TradingJournalAgent } from '../utils/TradingJournalAgent';
import { HealthTrackerAgent } from '../utils/HealthTrackerAgent';
import { FinanceTrackerAgent } from '../utils/FinanceTrackerAgent';

function IntelligentChatbox({ userData, setUserData }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! I\'m your intelligent life tracker assistant. I can help you with:\n\n📊 Analysis: Get insights on any tracker (daily, career, trading, health, finance)\n🎯 Recommendations: Receive personalized advice based on your goals\n📈 Progress: Track your progress toward 2026 targets\n🔍 Explanations: Understand your patterns and performance\n\nWhat would you like to know?',
      timestamp: new Date(),
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userQuery) => {
    const queryLower = userQuery.toLowerCase();
    let response = '';
    let sources = [];

    try {
      // Initialize agents
      const ragEngine = new RAGEvaluationEngine(userData, []);
      const dailyAgent = new DailyTrackerAgent(userData);
      const careerAgent = new CareerTrackerAgent(userData);
      const tradingAgent = new TradingJournalAgent(userData);
      const healthAgent = new HealthTrackerAgent(userData);
      const financeAgent = new FinanceTrackerAgent(userData);

      // Daily Score Analysis
      if (
        queryLower.includes('daily') ||
        queryLower.includes('score') ||
        queryLower.includes('discipline')
      ) {
        const analysis = dailyAgent.analyzeCategoryDetails();
        const recommendations = dailyAgent.generateCategoryRecommendations();
        response = `📊 Daily Score Analysis\n\n`;
        response += `Current Performance:\n`;
        response += `• Categories Tracked: ${Object.keys(analysis).length}\n`;
        response += `• Top Performing: ${Object.entries(analysis).reduce((a, b) => a[1].current > b[1].current ? a : b)?.[0] || 'N/A'}\n\n`;
        response += `Top Recommendations:\n`;
        recommendations.slice(0, 3).forEach((rec, idx) => {
          response += `${idx + 1}. ${rec.category}: ${rec.actionable}\n`;
        });
        response += `\n💡 Focus on maintaining consistency. Your discipline score is crucial for all other goals.`;
        sources = ['Daily Tracker Agent', 'RAG Evaluation'];
      }

      // Career Analysis
      else if (
        queryLower.includes('career') ||
        queryLower.includes('job') ||
        queryLower.includes('application')
      ) {
        const analysis = careerAgent.analyzeTierPerformance();
        const recs = careerAgent.generateTierRecommendations();
        response = `💼 Career Progress Analysis\n\n`;
        response += `Current Status:\n`;
        response += `• Tier 1 Apps: ${analysis.tier1.count || 0} (Target: 5/week)\n`;
        response += `• Tier 2 Apps: ${analysis.tier2.count || 0}\n`;
        response += `• Tier 3+ Apps: ${analysis.tier3Plus.count || 0}\n`;
        response += `• Conversion Rate: ${analysis.overallConversionRate || '0'}%\n\n`;
        response += `Quality Metrics:\n`;
        response += `• Interview Rate: ${analysis.interviewRate || '0'}%\n`;
        response += `• Offer Rate: ${analysis.offerRate || '0'}%\n\n`;
        response += `Immediate Actions:\n`;
        recs.slice(0, 3).forEach((rec, idx) => {
          response += `${idx + 1}. ${rec.recommendation}\n`;
        });
        response += `\n🎯 Focus on Tier 1 firms. Quality over quantity is key for 2026 quant researcher role.`;
        sources = ['Career Tracker Agent', 'RAG Evaluation'];
      }

      // Trading Analysis
      else if (
        queryLower.includes('trading') ||
        queryLower.includes('trade') ||
        queryLower.includes('win rate') ||
        queryLower.includes('pnl')
      ) {
        const patterns = tradingAgent.analyzeTradingPatterns();
        const recs = tradingAgent.generateTradingRecommendations();
        const monthlyStats = tradingAgent.getMonthlyStats();
        response = `📈 Trading Performance Analysis\n\n`;
        response += `Monthly Stats:\n`;
        response += `• Trades: ${monthlyStats.tradeCount || 0}\n`;
        response += `• Win Rate: ${monthlyStats.winRate || '0'}% (Target: 55%)\n`;
        response += `• Total P&L: $${monthlyStats.totalPnL?.toFixed(2) || '0.00'}\n`;
        response += `• Best Trade: $${monthlyStats.bestTrade?.toFixed(2) || '0.00'}\n\n`;
        response += `Risk Analysis:\n`;
        response += `• Avg Win: $${patterns.avgWin?.toFixed(2) || '0.00'}\n`;
        response += `• Avg Loss: -$${patterns.avgLoss?.toFixed(2) || '0.00'}\n`;
        response += `• Risk/Reward Ratio: ${patterns.riskRewardRatio?.toFixed(2) || '0'}:1\n\n`;
        response += `Key Recommendations:\n`;
        recs.slice(0, 3).forEach((rec, idx) => {
          response += `${idx + 1}. ${rec}\n`;
        });
        response += `\n🚀 Path to $500K AUM: ${(patterns.aumProjection || '').substring(0, 50)}...`;
        sources = ['Trading Journal Agent', 'RAG Evaluation'];
      }

      // Health & Fitness
      else if (
        queryLower.includes('health') ||
        queryLower.includes('workout') ||
        queryLower.includes('fitness') ||
        queryLower.includes('body fat')
      ) {
        const patterns = healthAgent.analyzeWorkoutPatterns();
        const recs = healthAgent.generateFitnessRecommendations();
        response = `💪 Fitness Progress Analysis\n\n`;
        response += `Current Status:\n`;
        response += `• Workouts This Month: ${patterns.monthlyWorkouts || 0} (Target: 24)\n`;
        response += `• Workout Types: ${Object.keys(patterns.typeBreakdown || {}).join(', ') || 'None tracked'}\n`;
        response += `• Avg Duration: ${patterns.avgDuration || '0'} min\n\n`;
        response += `Body Composition:\n`;
        response += `• Current Body Fat: ${userData.healthData?.bodyFat || 'N/A'}% (Target: 12%)\n`;
        response += `• Progress: ${userData.healthData?.bodyFat ? (userData.healthData.bodyFat > 12 ? 'Needs improvement' : 'On track') : 'Not tracked'}\n\n`;
        response += `Recommended Schedule:\n`;
        recs.slice(0, 3).forEach((rec, idx) => {
          response += `${idx + 1}. ${rec}\n`;
        });
        response += `\n✅ Consistency is key. 6 workouts per week will get you to 12% body fat by 2026.`;
        sources = ['Health Tracker Agent', 'RAG Evaluation'];
      }

      // Finance Analysis
      else if (
        queryLower.includes('finance') ||
        queryLower.includes('expense') ||
        queryLower.includes('savings') ||
        queryLower.includes('money')
      ) {
        const analysis = financeAgent.analyzeFinancialHealth();
        const recs = financeAgent.generateFinancialRecommendations();
        response = `💰 Financial Health Analysis\n\n`;
        response += `Current Status:\n`;
        response += `• Monthly Expenses: $${(userData.financeData?.monthlyExpenses || 0).toFixed(2)}\n`;
        response += `• Savings Rate: ${analysis.savingsRate || '0'}% (Target: 30%)\n`;
        response += `• Net Worth Trajectory: ${analysis.netWorthStatus || 'Not calculated'}\n\n`;
        response += `Expense Breakdown:\n`;
        if (analysis.expenseCategories) {
          Object.entries(analysis.expenseCategories).slice(0, 5).forEach(([cat, val]) => {
            response += `• ${cat}: $${val?.toFixed(2) || '0.00'}\n`;
          });
        }
        response += `\nInvestment Strategy:\n`;
        recs.slice(0, 3).forEach((rec, idx) => {
          response += `${idx + 1}. ${rec}\n`;
        });
        response += `\n📊 Path to $2M net worth: Maintain 30% savings rate and invest strategically.`;
        sources = ['Finance Tracker Agent', 'RAG Evaluation'];
      }

      // Overall Progress & Goals
      else if (
        queryLower.includes('progress') ||
        queryLower.includes('goal') ||
        queryLower.includes('2026') ||
        queryLower.includes('overall')
      ) {
        const evaluation = ragEngine.generateAdaptiveEvaluation();
        const insights = ragEngine.generateKeyInsights();
        response = `🎯 2026 Goals Progress Report\n\n`;
        response += `Overall Progress: ${evaluation.overallScore}%\n\n`;
        response += `Goal Status:\n`;
        Object.entries(evaluation.categories).forEach(([goal, data]) => {
          const status = data.score >= 75 ? '✅' : data.score >= 50 ? '⚠️' : '❌';
          response += `${status} ${goal.replace(/_/g, ' ')}: ${data.score}% (${data.current}/${data.target})\n`;
        });
        response += `\nKey Insights:\n`;
        insights.slice(0, 3).forEach((insight, idx) => {
          response += `${idx + 1}. ${insight.message}\n`;
        });
        response += `\n📈 You're making steady progress. Focus on the CRITICAL items first.`;
        sources = ['RAG Evaluation Engine', 'All Agents'];
      }

      // Default response with system overview
      else {
        response = `🤖 System Overview\n\n`;
        response += `I can help you with:\n\n`;
        response += `📊 Daily Score: Ask about your discipline and daily metrics\n`;
        response += `💼 Career: Discuss job applications and Tier 1 focus\n`;
        response += `📈 Trading: Analyze trades, win rates, and $500K AUM path\n`;
        response += `💪 Health: Review workouts and body fat progression\n`;
        response += `💰 Finance: Examine expenses and $2M net worth path\n`;
        response += `🎯 Progress: Check overall 2026 goals status\n\n`;
        response += `Try asking: "How's my career progress?" or "What should I do for trading?"`;
        sources = ['System Overview'];
      }

      return { response, sources };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        response: `I encountered an issue analyzing your data. Please try again.\n\nError: ${error.message}`,
        sources: ['Error Handler']
      };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date(),
      sources: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Generate bot response
    try {
      const { response, sources } = await generateBotResponse(input);
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response,
        timestamp: new Date(),
        sources
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
        sources: ['Error']
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      {/* Chat Window */}
      {showChat && (
        <div className="glass rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                🤖 AI Assistant
              </h3>
              <p className="text-xs text-slate-400 mt-1">RAG-Powered Life Tracker AI</p>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-slate-400 hover:text-white transition text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                  
                  {/* Sources for bot messages */}
                  {msg.type === 'bot' && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700/30 text-xs text-slate-400">
                      <span>📚 Sources: {msg.sources.join(', ')}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-500 mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700/50 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-600"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="glass rounded-full w-14 h-14 flex items-center justify-center border border-slate-700/50 hover:border-blue-600 transition shadow-lg hover:shadow-xl text-2xl hover:scale-110 transform"
        >
          🤖
        </button>
      )}
    </div>
  );
}

export default IntelligentChatbox;
