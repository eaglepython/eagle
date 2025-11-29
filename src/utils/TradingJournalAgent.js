/**
 * Specialized Trading Journal Agent
 * Trade-by-trade pattern detection, risk/reward analysis, and edge identification
 */

export class TradingJournalAgent {
  constructor(userData) {
    this.userData = userData;
  }

  /**
   * Analyze trade patterns across recent trades
   */
  analyzeTradingPatterns() {
    const trades = this.userData.tradingJournal || [];
    if (trades.length < 3) return null;

    const recentTrades = trades.slice(-20); // Last 20 trades
    const patterns = {
      wins: [],
      losses: [],
      overall: {}
    };

    // Categorize trades
    recentTrades.forEach(trade => {
      const pnl = parseFloat(trade.pnl) || 0;
      if (pnl > 0) {
        patterns.wins.push(trade);
      } else if (pnl < 0) {
        patterns.losses.push(trade);
      }
    });

    // Calculate overall statistics
    const totalPnL = recentTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
    const winRate = recentTrades.length > 0 ? parseFloat((patterns.wins.length / recentTrades.length * 100).toFixed(1)) : 0;
    const avgWin = patterns.wins.length > 0 
      ? patterns.wins.reduce((sum, t) => sum + Math.abs(parseFloat(t.pnl)), 0) / patterns.wins.length
      : 0;
    const avgLoss = patterns.losses.length > 0 
      ? patterns.losses.reduce((sum, t) => sum + Math.abs(parseFloat(t.pnl)), 0) / patterns.losses.length
      : 0;

    patterns.overall = {
      totalTrades: recentTrades.length,
      totalPnL: parseFloat(totalPnL.toFixed(2)),
      winCount: patterns.wins.length,
      lossCount: patterns.losses.length,
      winRate: parseFloat(winRate),
      avgWin: parseFloat(avgWin.toFixed(2)),
      avgLoss: parseFloat(avgLoss.toFixed(2)),
      profitFactor: avgLoss > 0 ? parseFloat((avgWin / avgLoss).toFixed(2)) : 0,
      riskRewardRatio: this._calculateAverageRiskReward(recentTrades)
    };

    return {
      recentTrades,
      patterns,
      assetAnalysis: this._analyzeByAsset(recentTrades),
      typeAnalysis: this._analyzeByTradeType(recentTrades),
      entryExitAnalysis: this._analyzeEntryExit(recentTrades)
    };
  }

  /**
   * Analyze trades by asset class
   */
  _analyzeByAsset(trades) {
    const byAsset = {};

    trades.forEach(trade => {
      const asset = trade.asset || 'unknown';
      if (!byAsset[asset]) {
        byAsset[asset] = {
          asset,
          trades: [],
          stats: {}
        };
      }
      byAsset[asset].trades.push(trade);
    });

    Object.entries(byAsset).forEach(([asset, data]) => {
      const tradeList = data.trades;
      const wins = tradeList.filter(t => parseFloat(t.pnl) > 0);
      const losses = tradeList.filter(t => parseFloat(t.pnl) < 0);
      const totalPnL = tradeList.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);

      data.stats = {
        count: tradeList.length,
        totalPnL: parseFloat(totalPnL.toFixed(2)),
        winRate: parseFloat(((wins.length / tradeList.length) * 100).toFixed(1)),
        avgWin: wins.length > 0 ? parseFloat((wins.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / wins.length).toFixed(2)) : 0,
        avgLoss: losses.length > 0 ? parseFloat((losses.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / losses.length).toFixed(2)) : 0,
        consistency: this._assessConsistency(tradeList)
      };
    });

    return byAsset;
  }

  /**
   * Analyze trades by type (long/short/scalp/swing)
   */
  _analyzeByTradeType(trades) {
    const byType = {};

    trades.forEach(trade => {
      const type = trade.type || 'unknown';
      if (!byType[type]) {
        byType[type] = {
          type,
          trades: [],
          stats: {}
        };
      }
      byType[type].trades.push(trade);
    });

    Object.entries(byType).forEach(([type, data]) => {
      const tradeList = data.trades;
      const wins = tradeList.filter(t => parseFloat(t.pnl) > 0);
      const totalPnL = tradeList.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);

      data.stats = {
        count: tradeList.length,
        totalPnL: parseFloat(totalPnL.toFixed(2)),
        winRate: parseFloat(((wins.length / tradeList.length) * 100).toFixed(1)),
        avgTrade: parseFloat((totalPnL / tradeList.length).toFixed(2))
      };
    });

    return byType;
  }

  /**
   * Analyze entry and exit quality
   */
  _analyzeEntryExit(trades) {
    const analysis = {
      earlyExits: [],
      lateExits: [],
      goodEntries: [],
      badEntries: [],
      patterns: []
    };

    trades.forEach(trade => {
      // Analyze if entry was good/bad based on subsequent price action
      const pnl = parseFloat(trade.pnl);
      const notes = trade.notes || '';

      if (pnl > 0) {
        if (pnl > 50) analysis.goodEntries.push(trade);
      } else {
        if (pnl < -50) analysis.badEntries.push(trade);
      }
    });

    // Identify patterns
    if (analysis.badEntries.length >= 3) {
      analysis.patterns.push('BAD_ENTRIES');
    }
    if (analysis.earlyExits.length >= 3) {
      analysis.patterns.push('EARLY_EXITS');
    }

    return analysis;
  }

  /**
   * Calculate average risk/reward ratio
   */
  _calculateAverageRiskReward(trades) {
    const riskRewards = trades
      .filter(t => t.notes)
      .map(t => {
        const notes = t.notes || '';
        // Extract R:R ratio if present in notes (e.g., "2:1 R:R")
        const match = notes.match(/(\d+\.?\d*)\s*:\s*(\d+\.?\d*)/);
        if (match) return parseFloat(match[1]) / parseFloat(match[2]);
        return null;
      })
      .filter(x => x !== null);

    if (riskRewards.length === 0) return 0;
    const avg = riskRewards.reduce((a, b) => a + b, 0) / riskRewards.length;
    return parseFloat(avg.toFixed(2));
  }

  /**
   * Assess consistency of trading
   */
  _assessConsistency(trades) {
    if (trades.length < 2) return 'INSUFFICIENT_DATA';
    
    const pnls = trades.map(t => parseFloat(t.pnl) || 0);
    const mean = pnls.reduce((a, b) => a + b, 0) / pnls.length;
    const variance = pnls.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / pnls.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = Math.abs(mean) > 0 ? stdDev / Math.abs(mean) : stdDev;

    if (coefficient < 0.5) return 'HIGH_CONSISTENCY';
    if (coefficient < 1.5) return 'MODERATE_CONSISTENCY';
    return 'LOW_CONSISTENCY';
  }

  /**
   * Generate specific, actionable trading recommendations
   */
  generateTradingRecommendations() {
    const analysis = this.analyzeTradingPatterns();
    if (!analysis) return [];

    const recs = [];
    const patterns = analysis.patterns;

    // Win rate analysis
    const winRate = patterns.overall.winRate;
    if (winRate < 45) {
      recs.push({
        type: 'urgent',
        title: '🔴 Critical Win Rate Issue',
        current: `${winRate}% win rate (${patterns.overall.winCount}/${patterns.overall.totalTrades} trades)`,
        target: '50-55% win rate minimum',
        problem: `${winRate}% means you lose more than you win. Even with good R:R, this is unsustainable.`,
        analysis: `Last 20 trades: ${patterns.overall.winCount} wins, ${patterns.overall.lossCount} losses`,
        riskAmount: `Each loss: -$${patterns.overall.avgLoss.toFixed(2)} avg | Each win: +$${patterns.overall.avgWin.toFixed(2)} avg`,
        solution: [
          '1. Review last 5 losses: What triggered entry? Was it valid signal or forced?',
          '2. Tighten entry criteria: Only take 1:2+ R:R setups',
          '3. Journal improvement: Document EXACTLY why you entered each trade',
          '4. A/B test: Trade half size for 1 week with stricter entries'
        ],
        deadline: '48-hour win rate review required'
      });
    }

    // Risk/reward analysis
    const rrRatio = patterns.overall.riskRewardRatio;
    if (rrRatio < 1.5 && rrRatio > 0) {
      recs.push({
        type: 'warning',
        title: '⚠️ Poor Risk/Reward Ratio',
        current: `${rrRatio}:1 average risk/reward`,
        target: '2:1 or better',
        problem: `At ${rrRatio}:1, you need a ${(100 / (1 + rrRatio)).toFixed(0)}%+ win rate just to break even.`,
        math: `Breakeven win rate: ${(100 / (1 + rrRatio)).toFixed(0)}% | Your current: ${winRate}%`,
        solution: [
          `1. Review entries: Average R:R is too tight. Adjust stops further out.`,
          '2. Identify best setups: Which trades had 2:1+ R:R? Repeat those.',
          '3. Reject trades: If setup doesn\'t offer 2:1+, skip it.',
          `4. Adjust position sizing: At ${rrRatio}:1 R:R, risk more to compensate`
        ],
        impact: `Improving R:R from ${rrRatio}:1 → 2.5:1 = 50% more profitability`
      });
    }

    // Asset-specific analysis
    Object.entries(analysis.assetAnalysis).forEach(([asset, data]) => {
      const assetWinRate = parseFloat(data.stats.winRate);
      const assetPnL = data.stats.totalPnL;

      if (assetWinRate < 40 && data.stats.count >= 5) {
        recs.push({
          type: 'warning',
          title: `📊 ${asset.toUpperCase()}: Low Win Rate`,
          current: `${assetWinRate}% win rate (${data.stats.count} trades, ${assetPnL > 0 ? '+' : ''}$${assetPnL})`,
          problem: `${asset} is underperforming. Consider specializing in fewer assets if needed.`,
          options: [
            `1. Master ${asset}: Commit 2 weeks, study patterns, increase profitability`,
            `2. Reduce ${asset}: Cut position size 50%, focus on better-performing assets`,
            `3. Eliminate: If pattern doesn't improve in 20 trades, stop trading ${asset}`
          ]
        });
      }
    });

    // Trade type analysis
    Object.entries(analysis.typeAnalysis).forEach(([type, data]) => {
      const typeWinRate = parseFloat(data.stats.winRate);
      const typePnL = data.stats.totalPnL;

      if (typeWinRate > 55 && data.stats.count >= 3 && typePnL > 0) {
        recs.push({
          type: 'insight',
          title: `✅ ${type.toUpperCase()} Trades: Your Edge Found`,
          performance: `${typeWinRate}% win rate, +$${typePnL} on ${data.stats.count} trades`,
          insight: `This is your PROVEN edge. Double down on this trade type.`,
          recommendation: `Increase allocation to ${type} trades: 40-50% of capital`,
          sample: `Current: ${data.stats.count} | Target: ${Math.round(data.stats.count * 2)} trades next month`,
          detail: `Your brain is wired for ${type} trading. Specialize.`
        });
      }
    });

    // Total PnL analysis
    if (patterns.overall.totalPnL < -500) {
      recs.push({
        type: 'urgent',
        title: '🚨 Negative Month/Week Alert',
        current: `-$${Math.abs(patterns.overall.totalPnL).toFixed(2)} total P&L`,
        status: 'DRAWDOWN MODE - Risk reduction needed',
        action: [
          '1. REDUCE position size 50%: Recover from emotional trading',
          '2. Manual trading only: No automation, full control',
          '3. Execute checklist before EVERY trade: Slow down, think clearly',
          '4. Daily review: What went wrong? Track in journal.'
        ],
        timeline: 'Recovery mode: Continue until break-even reached'
      });
    } else if (patterns.overall.totalPnL > 500) {
      recs.push({
        type: 'insight',
        title: '🎉 Positive Month Alert',
        current: `+$${patterns.overall.totalPnL.toFixed(2)} P&L`,
        achievement: `This is YOUR edge working. Document what you did.`,
        action: [
          '1. Analyze winning trades: What setups generated profits?',
          '2. Replicate: Focus exclusively on this setup type',
          '3. Scaling: Increase position size slightly (10-20%)',
          '4. Documentation: This becomes your edge for next month'
        ],
        path_to_500k: `At $${patterns.overall.totalPnL}/month, you\'re on track for $${(patterns.overall.totalPnL * 12).toFixed(0)}/year`
      });
    }

    // Consistency check
    const consistency = patterns.patterns.includes('LOW_CONSISTENCY') ? 'LOW' : 'GOOD';
    if (consistency === 'LOW') {
      recs.push({
        type: 'warning',
        title: '📈 Consistency Issue',
        problem: 'Your trading results are too variable. Huge wins, huge losses.',
        solution: [
          '1. Standardize: Same position size for every trade',
          '2. Same setups: Trade only your proven patterns',
          '3. Risk per trade: Fixed 1-2% account risk, always',
          '4. Eliminate variance: Discipline beats luck'
        ]
      });
    }

    return recs.sort((a, b) => {
      const order = { urgent: 0, warning: 1, insight: 2 };
      return (order[a.type] || 2) - (order[b.type] || 2);
    });
  }

  /**
   * Trading checklist for pre-trade ritual
   */
  getPreTradeChecklist() {
    return {
      before_market_open: [
        '☐ Market conditions: Bull, bear, or consolidation?',
        '☐ Economic calendar: Any major news today?',
        '☐ Previous day review: Wins & losses analyzed?',
        '☐ Plan for today: 3-5 target setups identified?',
        '☐ Risk per trade: Fixed at 1-2% of account'
      ],
      pre_entry: [
        '☐ Setup criteria met? (Support/resistance, volume, trend aligned)',
        '☐ Risk/reward minimum: 2:1 or better?',
        '☐ Position size calculated? (Account size × risk % ÷ stop distance)',
        '☐ Stop loss level: Logical? Protected from noise?',
        '☐ Target level: Realistic based on risk/reward?',
        '☐ Emotions check: Am I trading rationally or forced?'
      ],
      pre_exit: [
        '☐ Profit target hit? Execute immediately.',
        '☐ Stop loss triggered? Exit without hesitation.',
        '☐ Early exit scenario? Protect 50% profits if uncertain.',
        '☐ Trade thesis broken? Get out, reassess.'
      ],
      post_trade: [
        '☐ Log immediately: Entry, exit, setup, R:R actual',
        '☐ Outcome: W or L?',
        '☐ Lesson: What worked? What didn\'t?',
        '☐ Adjustment needed? Yes/No'
      ]
    };
  }

  /**
   * Monthly trading statistics
   */
  getMonthlyStats() {
    const trades = this.userData.tradingJournal || [];
    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
    
    const monthTrades = trades.filter(t => new Date(t.date) >= monthStart);
    
    const wins = monthTrades.filter(t => parseFloat(t.pnl) > 0);
    const losses = monthTrades.filter(t => parseFloat(t.pnl) < 0);
    const totalPnL = monthTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);

    return {
      month: thisMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalTrades: monthTrades.length,
      wins: wins.length,
      losses: losses.length,
      totalPnL: parseFloat(totalPnL.toFixed(2)),
      winRate: monthTrades.length > 0 ? ((wins.length / monthTrades.length) * 100).toFixed(1) : 0,
      avgWin: wins.length > 0 ? (wins.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / wins.length).toFixed(2) : 0,
      avgLoss: losses.length > 0 ? (losses.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / losses.length).toFixed(2) : 0,
      status: totalPnL > 0 ? '✅ PROFITABLE' : totalPnL < -500 ? '🔴 DRAWDOWN' : '⚠️ BREAKEVEN',
      trajectory: `On pace for $${(totalPnL * 12).toFixed(0)}/year at this rate`
    };
  }

  /**
   * Path to $500K AUM
   */
  getAUMTrajectory() {
    const currentPnL = (this.userData.tradingJournal || [])
      .reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
    
    const analysis = this.analyzeTradingPatterns();
    const estimatedMonthlyReturn = analysis?.patterns?.overall?.totalPnL || 0;

    return {
      current: {
        estimated_aum: '$50-100K', // Based on typical initial capital
        current_pnl: currentPnL,
        estimated_monthly: estimatedMonthlyReturn
      },
      target_2026: {
        goal: '$500K AUM',
        required_return: '20%+ annually',
        monthly_target: `$${(500000 * 0.20 / 12).toFixed(0)}/month`,
        weekly_target: `$${(500000 * 0.20 / 52).toFixed(0)}/week`
      },
      current_trajectory: {
        monthly_estimate: estimatedMonthlyReturn,
        annual_estimate: estimatedMonthlyReturn * 12,
        aum_needed: estimatedMonthlyReturn > 0 
          ? (estimatedMonthlyReturn * 12) / 0.20 
          : 'Insufficient data'
      }
    };
  }
}

export default TradingJournalAgent;
