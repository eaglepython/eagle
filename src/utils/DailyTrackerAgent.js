/**
 * Specialized Daily Tracker Agent
 * Provides category-specific, real-time insights and personalized nudges
 */

export class DailyTrackerAgent {
  constructor(userData) {
    this.userData = userData;
  }

  /**
   * Detailed category analysis with specific suggestions
   */
  analyzeCategoryDetails() {
    const dailyScores = this.userData.dailyScores || [];
    if (dailyScores.length < 2) return null;

    const categories = {
      morningRoutine: {
        label: 'Morning Routine',
        target: 9,
        importance: 'CRITICAL - Sets tone for entire day',
        requirement: 'Wake 5:00 AM, cold shower, vision review, 30 min reading'
      },
      deepWork: {
        label: 'Deep Work',
        target: 9,
        importance: 'CRITICAL - Drives career progression',
        requirement: '4+ hours uninterrupted focus (9-1 PM ideal)',
        leverage: 'Each extra hour = +2 career opportunities'
      },
      exercise: {
        label: 'Exercise',
        target: 9,
        importance: 'HIGH - Energy, confidence, health',
        requirement: '45+ mins (strength + cardio balance)',
        timing: 'Best: 6-7 AM before deep work'
      },
      trading: {
        label: 'Trading',
        target: 9,
        importance: 'HIGH - Revenue generation',
        requirement: 'Execute plan + journal all trades by 4 PM',
        risk: 'Missing journal = repeat mistakes'
      },
      learning: {
        label: 'Learning',
        target: 8,
        importance: 'MEDIUM - Skill accumulation',
        requirement: '60+ mins (courses, reading, podcasts)',
        compounding: 'Daily learning = 365x/year compounding'
      },
      nutrition: {
        label: 'Nutrition',
        target: 9,
        importance: 'MEDIUM - Physical performance',
        requirement: 'Hit macros, 3+ veg, hydrate (100 oz water)',
        impact: 'Poor nutrition = -1 to -2 score impact'
      },
      sleep: {
        label: 'Sleep',
        target: 9,
        importance: 'CRITICAL - Recovery and cognition',
        requirement: '7-8 hours, bed by 10 PM, dark room',
        warning: 'One bad sleep night = 3-day recovery needed'
      },
      social: {
        label: 'Social',
        target: 7,
        importance: 'MEDIUM - Mental health, relationships',
        requirement: 'Meaningful conversation (not scrolling)',
        quality: '1 deep conversation > 5 surface interactions'
      },
      dailyMIT: {
        label: 'Daily MIT',
        target: 10,
        importance: 'CRITICAL - Accomplishment focus',
        requirement: 'One most-important-task completed before sleep',
        strategy: 'MIT = highest leverage task for tomorrow'
      }
    };

    const details = {};
    const lastWeek = dailyScores.slice(-7);

    Object.entries(categories).forEach(([key, category]) => {
      const scores = lastWeek
        .filter(d => d.scores && d.scores[key] !== undefined)
        .map(d => d.scores[key]);

      if (scores.length > 0) {
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const current = scores[scores.length - 1];
        const trend = average >= 7 ? '↑ improving' : average >= 5 ? '→ stable' : '↓ declining';
        const gap = Math.max(0, category.target - average);
        const impact = gap * 0.15; // Each point on this category = 0.15 daily score

        details[key] = {
          ...category,
          average: parseFloat(average.toFixed(1)),
          current,
          trend,
          gap,
          scoringImpact: parseFloat(impact.toFixed(2)),
          status: average >= 8 ? 'EXCELLENT' : average >= 6 ? 'GOOD' : 'NEEDS FOCUS'
        };
      }
    });

    return details;
  }

  /**
   * Generate specific, actionable category recommendations
   */
  generateCategoryRecommendations() {
    const details = this.analyzeCategoryDetails();
    if (!details) return [];

    const recs = [];

    // Morning routine check
    if (details.morningRoutine.current < 7) {
      recs.push({
        category: 'morningRoutine',
        type: 'urgent',
        title: '⏰ Morning Routine Quality Issue',
        specific: `Current: ${details.morningRoutine.current}/10, Target: 9/10`,
        problem: `You're missing 1-2 morning essentials. Late start cascades through entire day.`,
        solution: 'Checklist: 5:00 wake → cold shower (3 min) → vision review (5 min) → read (25 min)',
        impact: 'Fixing this = +0.8 daily score (most leveraged category)',
        timeNeeded: '5-10 minutes',
        deadline: 'Tomorrow 5:00 AM'
      });
    }

    // Deep work check
    if (details.deepWork.current < 7) {
      recs.push({
        category: 'deepWork',
        type: 'urgent',
        title: '🎯 Deep Work Insufficient',
        specific: `Current: ${details.deepWork.current}/10 | Target: 9/10 | Gap: -${details.deepWork.gap.toFixed(1)} points`,
        problem: `At ${details.deepWork.average}/10 avg, career progression stalls. Applications improve, but quality suffers.`,
        solution: 'Block 9 AM-1 PM NO INTERRUPTIONS. Phone: silent. Browser: single tab.',
        insight: 'Deep work is THE leverage point for career goals',
        careerImpact: 'Each hour deep work = 1.5x better quality applications',
        deadline: 'Block: 9 AM - 1 PM',
        track: 'Log: start time, end time, focus quality (1-10)'
      });
    }

    // Exercise check
    if (details.exercise.current < 7) {
      recs.push({
        category: 'exercise',
        type: 'warning',
        title: '💪 Workout Gap Detected',
        specific: `Current: ${details.exercise.current}/10 | Days since last: check workouts`,
        problem: `Skipping exercise kills daily score AND energy for deep work. They compound.`,
        solution: 'Make it automatic: 6:30 AM gym slot non-negotiable.',
        types: 'Mix: 2x strength, 2x cardio, 1x HIIT, 1x flexibility',
        timing: 'Morning best: energy boost for deep work',
        energyBoost: '+2 points on deep work after exercise',
        deadline: 'Tomorrow 6:30 AM'
      });
    }

    // Trading check
    if (details.trading.current < 7) {
      recs.push({
        category: 'trading',
        type: 'urgent',
        title: '📊 Trading Execution Missing',
        specific: `Current: ${details.trading.current}/10 | Issue: likely trades not executed or not journaled`,
        problem: `Trading only counts if: (1) Trade executed, (2) Journal complete with entry/exit/why`,
        solution: 'Checklist: Market open → execute plan → log in journal by 3 PM',
        verification: 'Check: "Did I execute?" + "Did I journal?"',
        revenueImpact: 'Consistent execution = $500K AUM progression track',
        deadline: 'Today 3 PM trading journal complete'
      });
    }

    // Learning check
    if (details.learning.current < 6) {
      recs.push({
        category: 'learning',
        type: 'insight',
        title: '📚 Skill Development Stalling',
        specific: `Current: ${details.learning.current}/10 | Target: 8/10`,
        problem: `60+ mins daily = 365+ hours/year. Skipping compounds negatively.`,
        solution: 'Habit stack: After lunch = 30 min course, Evening = 30 min reading',
        focus: 'Prioritize: Quant trader skills > General knowledge',
        roi: '1 hour daily = Industry expert in 2 years',
        deadline: 'Add to calendar: 12:30 PM learning (30 min)'
      });
    }

    // Nutrition check
    if (details.nutrition.current < 6) {
      recs.push({
        category: 'nutrition',
        type: 'warning',
        title: '🥗 Nutrition Impact',
        specific: `Current: ${details.nutrition.current}/10 | Poor nutrition = brain fog + fatigue`,
        problem: `Diet directly impacts: deep work quality, energy levels, trading psychology`,
        solution: 'Track: Protein, carbs, water. Goal: 12% body fat by 2026',
        details: 'Prep: 2-hour Sunday meal prep for Mon-Wed',
        macroTarget: 'Protein: 200g, Carbs: 250g, Fat: 80g (for your stats)',
        deadline: 'Sunday: meal prep completed'
      });
    }

    // Sleep check (most important)
    if (details.sleep.current < 8) {
      recs.push({
        category: 'sleep',
        type: 'urgent',
        title: '😴 Sleep Quality Critical',
        specific: `Current: ${details.sleep.current}/10 | This affects EVERYTHING`,
        problem: `Poor sleep = -0.5 daily score, -2 trading accuracy, -1 decision quality`,
        solution: 'Non-negotiable: Bed 10 PM, sleep by 10:15 PM, wake 5 AM',
        protocol: 'Blue light blocker 9 PM, no screens, dark room 68°F, white noise',
        impact: 'One good night = recovery from one bad day',
        deadline: 'Bed tonight: 10 PM sharp'
      });
    }

    // Social check
    if (details.social.current < 5) {
      recs.push({
        category: 'social',
        type: 'insight',
        title: '👥 Isolation Risk',
        specific: `Current: ${details.social.current}/10 | Mental health risk if ignored`,
        problem: `Isolation: affects motivation, decision quality, and long-term sustainability`,
        solution: 'Schedule: 1x daily meaningful conversation (10-30 min)',
        quality: 'Deep conversation > scrolling. One person > group chat.',
        mental: 'This prevents burnout on hard goals',
        deadline: 'Today: 15 min call with someone'
      });
    }

    // MIT check
    if (details.dailyMIT.current < 9) {
      recs.push({
        category: 'dailyMIT',
        type: 'urgent',
        title: '✅ Most Important Task',
        specific: `Current: ${details.dailyMIT.current}/10 | MIT incomplete = day incomplete`,
        problem: `MIT scores 100% of daily completion. Everything else is bonus.`,
        solution: 'Define MIT by 5 PM: "What ONE thing would make today successful?"',
        rule: 'MIT must be done before sleep. No exceptions.',
        examples: 'Send 5 applications, complete portfolio project, master one concept',
        deadline: 'Tonight: MIT completed before sleep'
      });
    }

    return recs.sort((a, b) => {
      const typeOrder = { urgent: 0, warning: 1, insight: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }

  /**
   * Real-time scoring guidance
   */
  getScoringGuidance() {
    return {
      '9-10': 'Perfect: ALL requirements met, quality execution, no shortcuts',
      '8-9': 'Excellent: Core requirements met, minor gaps acceptable',
      '6-8': 'Good: Main requirements done, quality could improve',
      '4-6': 'Needs work: Half-done or partial execution',
      '1-4': 'Critical gap: Barely attempted or off track',
      '0': 'Not attempted'
    };
  }

  /**
   * Daily score impact calculator
   */
  calculateScoreImpact() {
    const details = this.analyzeCategoryDetails();
    if (!details) return null;

    const impacts = {};
    let totalPotentialGain = 0;

    Object.entries(details).forEach(([key, detail]) => {
      const gap = detail.gap;
      const pointValue = gap * 0.15; // 15% of total score per point
      impacts[key] = {
        category: detail.label,
        currentScore: detail.current,
        target: detail.target,
        gap,
        pointValue: parseFloat(pointValue.toFixed(2)),
        leverage: gap > 1 ? 'HIGH' : gap > 0.5 ? 'MEDIUM' : 'LOW',
        effort: detail.current < 4 ? 'Hard to recover' : 'Achievable today'
      };
      totalPotentialGain += pointValue;
    });

    return {
      impacts,
      totalPotentialGain: parseFloat(totalPotentialGain.toFixed(2)),
      quickWins: Object.entries(impacts)
        .filter(([_, imp]) => imp.effort === 'Achievable today' && imp.pointValue > 0.2)
        .map(([key, imp]) => ({
          category: imp.category,
          action: `Improve ${imp.category} from ${imp.currentScore} to ${imp.target}`,
          pointGain: imp.pointValue
        }))
    };
  }

  /**
   * Today's action plan
   */
  getTodaysPlan() {
    const recs = this.generateCategoryRecommendations();
    const impacts = this.calculateScoreImpact();

    const plan = {
      priority: recs.filter(r => r.type === 'urgent'),
      schedule: this._buildDaySchedule(),
      quickWins: impacts?.quickWins || [],
      targetScore: 8.0,
      currentTrajectory: this._calculateCurrentTrajectory()
    };

    return plan;
  }

  /**
   * Build optimized daily schedule
   */
  _buildDaySchedule() {
    return [
      { time: '5:00 AM', activity: 'Wake-up + Morning Routine (9/10 required)', key: 'morningRoutine' },
      { time: '5:30 AM', activity: 'Cold shower + Vision review (5 min)', importance: 'CRITICAL' },
      { time: '6:00 AM', activity: 'Reading (30 min)', benefit: 'Learning + mental prep' },
      { time: '6:30 AM', activity: 'Exercise (45-60 min)', key: 'exercise', energy: '+2 points' },
      { time: '7:30 AM', activity: 'Breakfast + Hydration', key: 'nutrition' },
      { time: '8:00 AM', activity: 'Deep Work Prep (plan day)', key: 'deepWork' },
      { time: '9:00 AM', activity: 'DEEP WORK BLOCK (4 hours)', key: 'deepWork', critical: true },
      { time: '1:00 PM', activity: 'Trading Session + Journal', key: 'trading' },
      { time: '2:00 PM', activity: 'Lunch + Learning (30 min course)', key: 'nutrition', key2: 'learning' },
      { time: '3:00 PM', activity: 'Job applications (5-7 quality ones)', note: 'Career tracker' },
      { time: '4:00 PM', activity: 'Deep Work Block 2 (if urgent)', optional: true },
      { time: '5:00 PM', activity: 'Define Tomorrow\'s MIT', key: 'planning' },
      { time: '5:30 PM', activity: 'Workout 2 (optional) or Rest', key: 'exercise', optional: true },
      { time: '6:00 PM', activity: 'Evening Reading (30 min)', key: 'learning' },
      { time: '7:00 PM', activity: 'Dinner + Social time (phone call)', key: 'social', key2: 'nutrition' },
      { time: '9:00 PM', activity: 'Transition to sleep (no screens)', key: 'sleep' },
      { time: '10:00 PM', activity: 'Lights out (verify 8-hour sleep window)', key: 'sleep' }
    ];
  }

  /**
   * Calculate current trajectory
   */
  _calculateCurrentTrajectory() {
    const dailyScores = this.userData.dailyScores || [];
    if (dailyScores.length < 3) return null;

    const lastThree = dailyScores.slice(-3).map(s => s.totalScore);
    const average = lastThree.reduce((a, b) => a + b, 0) / lastThree.length;
    const trend = lastThree[lastThree.length - 1] - lastThree[0];

    return {
      last3DayAverage: parseFloat(average.toFixed(1)),
      trend: trend > 0 ? `↑ improving (+${trend.toFixed(1)})` : trend < 0 ? `↓ declining (${trend.toFixed(1)})` : '→ stable',
      trajectory: average >= 8 ? '✅ ON TRACK' : average >= 7 ? '⚠️ CLOSE' : '🔴 NEEDS FOCUS'
    };
  }
}

export default DailyTrackerAgent;
