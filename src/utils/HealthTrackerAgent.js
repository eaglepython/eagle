/**
 * Specialized Health Tracker Agent
 * Workout-specific optimization, recovery patterns, and fitness goals
 */

export class HealthTrackerAgent {
  constructor(userData) {
    this.userData = userData;
  }

  /**
   * Analyze workouts by type and consistency
   */
  analyzeWorkoutPatterns() {
    const workouts = this.userData.workouts || [];
    if (workouts.length < 3) return null;

    const workoutTypes = {
      strength: { label: 'Strength', target: 2, importance: 'HIGH - Muscle building', recovery: 48 },
      cardio: { label: 'Cardio', target: 2, importance: 'HIGH - Cardiovascular health', recovery: 24 },
      hiit: { label: 'HIIT', target: 1, importance: 'MEDIUM - Fat loss + conditioning', recovery: 48 },
      flexibility: { label: 'Flexibility', target: 1, importance: 'MEDIUM - Mobility, injury prevention', recovery: 0 },
      sports: { label: 'Sports', target: 1, importance: 'LOW - Fun + movement', recovery: 24 },
      hiking: { label: 'Hiking', target: 1, importance: 'LOW - Endurance + outdoors', recovery: 24 }
    };

    const analysis = {};

    // Analyze each type
    Object.entries(workoutTypes).forEach(([key, type]) => {
      const typeWorkouts = workouts.filter(w => w.type === key || w.type === type.label);
      
      if (typeWorkouts.length === 0) {
        analysis[key] = { ...type, workouts: [], status: 'MISSING' };
        return;
      }

      const lastWeek = typeWorkouts.filter(w => {
        const wDate = new Date(w.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return wDate > weekAgo;
      });

      const durations = typeWorkouts.map(w => parseFloat(w.duration) || 0);
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const consistency = this._calculateConsistency(typeWorkouts);

      analysis[key] = {
        ...type,
        workouts: typeWorkouts,
        thisWeek: lastWeek.length,
        total: typeWorkouts.length,
        avgDuration: parseFloat(avgDuration.toFixed(1)),
        lastWorkout: typeWorkouts[typeWorkouts.length - 1].date,
        status: this._assessWorkoutStatus(lastWeek.length, type.target, consistency)
      };
    });

    return {
      analysis,
      weekly: this._getWeeklyBreakdown(workouts),
      consistency: this._assessOverallConsistency(workouts),
      bodyFatGoal: this._assessBodyFatProgress()
    };
  }

  /**
   * Calculate consistency of workout type
   */
  _calculateConsistency(typeWorkouts) {
    if (typeWorkouts.length < 2) return 'INSUFFICIENT_DATA';
    
    // Check last 4 weeks
    const last4Weeks = typeWorkouts.filter(w => {
      const wDate = new Date(w.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 28);
      return wDate > monthAgo;
    });

    const avgPerWeek = (last4Weeks.length / 4).toFixed(1);
    
    if (avgPerWeek >= 1.5) return 'HIGH_CONSISTENCY';
    if (avgPerWeek >= 0.75) return 'MODERATE_CONSISTENCY';
    return 'LOW_CONSISTENCY';
  }

  /**
   * Assess overall weekly consistency
   */
  _assessOverallConsistency(workouts) {
    if (workouts.length < 7) return 'INSUFFICIENT_DATA';

    const lastMonth = workouts.filter(w => {
      const wDate = new Date(w.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return wDate > monthAgo;
    });

    const avgPerWeek = (lastMonth.length / 4.3).toFixed(1);

    return {
      totalLastMonth: lastMonth.length,
      avgPerWeek: parseFloat(avgPerWeek),
      target: 6,
      status: avgPerWeek >= 6 ? 'ON_TRACK' : avgPerWeek >= 4 ? 'BUILDING' : 'NEEDS_FOCUS'
    };
  }

  /**
   * Assess body fat progress toward 12% goal
   */
  _assessBodyFatProgress() {
    // This would ideally pull from health data, but for now returns framework
    return {
      goal: '12% body fat by 2026',
      requiresTracking: 'Need to add body fat tracking to health data',
      roadmap: {
        now: 'Estimate: 15-18% (typical for someone building)',
        '6months': 'Target: 14-15% (diet + exercise consistency)',
        '2026': 'Target: 12% (daily discipline paying off)'
      },
      key_drivers: {
        nutrition: 'Protein intake, caloric deficit when cutting',
        cardio: '2x cardio per week for fat loss',
        strength: '2x strength to preserve muscle during cut',
        sleep: '7-8 hours for recovery and hormonal balance'
      }
    };
  }

  /**
   * Assess status of specific workout type
   */
  _assessWorkoutStatus(thisWeek, target, consistency) {
    if (thisWeek >= target && consistency === 'HIGH_CONSISTENCY') {
      return 'EXCELLENT';
    } else if (thisWeek >= Math.max(1, target - 1) && consistency !== 'LOW_CONSISTENCY') {
      return 'GOOD';
    } else if (thisWeek >= 1) {
      return 'PRESENT';
    } else {
      return 'MISSING';
    }
  }

  /**
   * Get weekly breakdown
   */
  _getWeeklyBreakdown(workouts) {
    const thisWeek = workouts.filter(w => {
      const wDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return wDate > weekAgo;
    });

    const breakdown = {};
    thisWeek.forEach(w => {
      const type = w.type || 'unknown';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });

    return {
      total: thisWeek.length,
      target: 6,
      remaining: Math.max(0, 6 - thisWeek.length),
      breakdown,
      status: thisWeek.length >= 6 ? '✅ TARGET MET' : `⚠️ NEED ${6 - thisWeek.length} MORE`
    };
  }

  /**
   * Generate specific, actionable fitness recommendations
   */
  generateFitnessRecommendations() {
    const patterns = this.analyzeWorkoutPatterns();
    if (!patterns) return [];

    const recs = [];
    const analysis = patterns.analysis;

    // Strength analysis
    if (analysis.strength?.thisWeek < 2) {
      recs.push({
        type: 'urgent',
        title: '💪 Strength Training Gap',
        current: `${analysis.strength?.thisWeek || 0} workouts this week`,
        target: '2 per week (Monday/Wednesday or similar)',
        problem: 'Muscle building requires CONSISTENT 2x/week minimum. Gaps cause muscle loss.',
        specific: `Missing: ${2 - (analysis.strength?.thisWeek || 0)} strength session(s)`,
        solution: [
          '1. Schedule: Lock in Mon 6:30 AM + Thu 6:30 AM (non-negotiable)',
          '2. Program: Push/Pull/Legs or Upper/Lower split (compound lifts focus)',
          '3. Duration: 45-60 minutes (not more, not less)',
          '4. Progressive: Track weights, aim for +5 lbs per month per lift'
        ],
        impact: 'Consistent strength = +1 daily score from discipline + muscle preservation',
        bodyFat: 'Strength maintains muscle during body fat cut to 12%',
        deadline: 'This week: Schedule and complete next strength session'
      });
    }

    // Cardio analysis
    if (analysis.cardio?.thisWeek < 2) {
      recs.push({
        type: 'warning',
        title: '🏃 Cardio Consistency Missing',
        current: `${analysis.cardio?.thisWeek || 0} workouts this week`,
        target: '2 per week (Tuesday/Saturday)',
        problem: 'No cardio = energy issues + body fat doesn\'t drop + trading performance suffers',
        specific: `Missing: ${2 - (analysis.cardio?.thisWeek || 0)} cardio session(s)`,
        types: 'Mix: 1x steady-state (30-40 min) + 1x moderate intensity (20-30 min)',
        solution: [
          '1. Easy day: Run/bike/swim 30 mins at conversational pace',
          '2. Moderate day: 20 mins at 75-80% max heart rate',
          '3. Time: Morning (6 AM) or lunch break to boost focus',
          '4. Tracking: Log duration + how you felt'
        ],
        energyBoost: 'Cardio 2x/week = +0.5 daily score from energy + better trading focus',
        deadline: 'This week: Add next cardio session'
      });
    }

    // HIIT analysis
    if (analysis.hiit?.thisWeek === 0 && (analysis.strength?.thisWeek || 0) >= 2) {
      recs.push({
        type: 'insight',
        title: '⚡ HIIT For Fat Loss Acceleration',
        current: 'No HIIT workouts this month',
        target: '1 per week (optional but recommended)',
        benefit: 'HIIT = Maximum fat loss in minimum time (20 min = equivalent to 45 min cardio)',
        strategy: 'Add 1x HIIT per week for body fat reduction to 12%',
        example: '20 mins: 30 sec all-out effort, 90 sec recovery (x8 rounds)',
        timing: 'Best: Friday or Sunday',
        caution: 'Recovery needed: 48 hours before next hard workout',
        impact: 'HIIT + 2x cardio + 2x strength + diet = Body fat 15% → 12% in 6 months'
      });
    }

    // Flexibility analysis
    if (analysis.flexibility?.thisWeek === 0) {
      recs.push({
        type: 'warning',
        title: '🧘 Mobility: Injury Prevention Missing',
        current: 'No flexibility/mobility work this week',
        target: '1-2 per week',
        problem: 'Tight muscles from training = injury risk + reduced performance',
        solution: [
          '1. Add 10-15 min stretching post-workout (already there)',
          '2. Weekly yoga/mobility: 20-30 min dedicated session',
          '3. Timing: Sunday rest day (active recovery)',
          '4. Focus: Hip flexors, hamstrings, shoulders, lower back'
        ],
        benefit: 'Prevents injuries that derail entire program'
      });
    }

    // Weekly total check
    const thisWeekTotal = patterns.weekly.total;
    if (thisWeekTotal < 4) {
      recs.push({
        type: 'urgent',
        title: '🔴 Weekly Volume Too Low',
        current: `${thisWeekTotal} workouts this week`,
        target: '6 workouts per week',
        missing: `Need ${6 - thisWeekTotal} more`,
        problem: 'At 3-4 workouts/week, you won\'t see progress. Inconsistency is your biggest obstacle.',
        specific: {
          week1: 'Current gaps: ' + Object.entries(patterns.weekly.breakdown || {})
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ')
        },
        ideal_week: [
          'Monday: Strength 60 min',
          'Tuesday: Cardio 30 min',
          'Wednesday: Strength 60 min',
          'Thursday: Cardio 30 min',
          'Friday: HIIT 20 min',
          'Saturday/Sunday: 1 of (HIIT, Yoga, Sports, Hiking)'
        ],
        commitment: 'This requires 4-5 hours/week = non-negotiable time blocks',
        deadline: 'Tomorrow: Schedule entire week of workouts on calendar'
      });
    } else if (thisWeekTotal >= 6) {
      recs.push({
        type: 'insight',
        title: '✅ Weekly Volume On Track',
        current: `${thisWeekTotal} workouts this week`,
        achievement: 'This is the discipline level needed for 12% body fat + peak performance',
        maintain: 'Keep this pace: consistency matters more than intensity',
        tracking: 'Continue logging everything'
      });
    }

    // Average duration analysis
    const avgDurationOverall = patterns.analysis.strength?.avgDuration || 0;
    if (avgDurationOverall > 90) {
      recs.push({
        type: 'insight',
        title: '⏱️ Workout Duration Check',
        current: `Average: ${avgDurationOverall} minutes`,
        recommendation: 'Consider: Are workouts efficient or too long? Rule: 45-60 min is ideal',
        efficient: 'Longer ≠ Better. Focus > Time.',
        target: 'Get same results in less time through intensity'
      });
    }

    // Recovery pattern
    recs.push({
      type: 'insight',
      title: '🛌 Recovery Protocol',
      importance: 'Recovery = Where muscles grow, not in gym',
      protocols: {
        sleep: '7-8 hours per night (non-negotiable)',
        nutrition: 'Protein 200g/day, carbs post-workout',
        foam_rolling: '10 min post-workout',
        active_recovery: 'Walking, stretching on rest days',
        water: 'Hydrate: Half your body weight in ounces (if 200 lbs, 100 oz water)'
      }
    });

    // Body fat goal progress
    recs.push({
      type: 'insight',
      title: '🎯 12% Body Fat Goal (2026)',
      roadmap: patterns.bodyFatProgress,
      current_status: 'Assuming ~15-17% starting point',
      path: [
        'Month 1-3: Establish workout consistency + clean nutrition',
        'Month 4-6: Add caloric deficit, should see 1-2% body fat drop',
        'Month 7-12: Maintain workouts, steady 1% drop per month',
        '2025: Hit 13% body fat',
        '2026: Achieve 12% body fat target'
      ],
      keyFactor: 'Nutrition is 70% of body composition change'
    });

    return recs.sort((a, b) => {
      const order = { urgent: 0, warning: 1, insight: 2 };
      return (order[a.type] || 2) - (order[b.type] || 2);
    });
  }

  /**
   * Weekly workout schedule template
   */
  getIdealWeeklySchedule() {
    return {
      monday: {
        time: '6:30-7:30 AM',
        workout: 'Strength (Upper Body)',
        exercises: 'Bench, Rows, Overhead Press, Pull-ups',
        duration: '60 min'
      },
      tuesday: {
        time: '12:00-12:30 PM',
        workout: 'Cardio (Steady State)',
        exercise: 'Running, cycling, or swimming',
        duration: '30 min',
        pace: 'Conversational'
      },
      wednesday: {
        time: '6:30-7:30 AM',
        workout: 'Strength (Lower Body)',
        exercises: 'Squats, Deadlifts, Lunges, Leg Press',
        duration: '60 min'
      },
      thursday: {
        time: '12:00-12:30 PM',
        workout: 'Cardio (Moderate Intensity)',
        exercise: 'Running, cycling, or swimming',
        duration: '30 min',
        pace: '75-80% max HR'
      },
      friday: {
        time: '5:30-6:00 PM',
        workout: 'HIIT',
        exercise: '30 sec all-out, 90 sec recovery (x8)',
        duration: '20 min',
        recovery: '48 hours before next hard workout'
      },
      saturday: {
        time: 'Flexible',
        workout: 'Optional: Sports, hiking, or light workout',
        duration: '30-60 min'
      },
      sunday: {
        time: '10:00-10:30 AM',
        workout: 'Yoga / Mobility / Active Recovery',
        focus: 'Flexibility, stretching, foam rolling',
        duration: '30 min'
      },
      summary: {
        total: '6 workouts / ~4 hours',
        strength: '2x',
        cardio: '2x',
        hiit: '1x',
        flexibility: '1x',
        body_part_balance: 'Upper + Lower balanced'
      }
    };
  }

  /**
   * Nutrition for fitness goals
   */
  getNutritionGuidance() {
    return {
      goal: '12% body fat while maintaining strength',
      daily_macros: {
        protein: '200g (1g per lb of body weight)',
        carbs: '250g (pre/during/post workout timing)',
        fats: '80g (20% of calorie intake)',
        total_calories: 'Maintenance - 300 calorie deficit'
      },
      meal_timing: {
        breakfast: 'Post-workout: Carbs + Protein (6-7 AM)',
        lunch: 'Heavy protein: Chicken, fish, rice',
        snack: 'Protein shake or fruit + nuts',
        dinner: 'Lean protein + vegetables + carbs',
        hydration: '100+ oz water daily (more on workout days)'
      },
      supplements: {
        creatine: '5g/day (strength + recovery)',
        protein_powder: 'Fill protein gaps',
        multivitamin: 'Cover micronutrient gaps',
        optional: 'Beta-alanine, caffeine for HIIT'
      },
      body_fat_specific: {
        deficit: 'Create 300-500 calorie daily deficit',
        protein_high: 'Protein high = preserve muscle during cut',
        cardio_timing: 'Fasted cardio optional (30 min morning walk)',
        tracking: 'Log food for 1 week, identify cut opportunities'
      }
    };
  }

  /**
   * Weekly fitness tracking summary
   */
  getWeeklyFitnessSummary() {
    const patterns = this.analyzeWorkoutPatterns();
    if (!patterns) return null;

    const { weekly, consistency } = patterns;

    return {
      weekStats: {
        total: weekly.total,
        target: weekly.target,
        remaining: weekly.remaining,
        status: weekly.status
      },
      breakdown: weekly.breakdown,
      consistency: consistency,
      progressToGoal: {
        target12BodyFat: patterns.bodyFatProgress,
        estimated_timeline: 'Achievable in 6-12 months with current plan'
      },
      nextWeekGoal: {
        minWorkouts: 6,
        focus: 'Maintain current schedule consistently',
        stretch: 'Add 1 extra workout or increase intensity'
      }
    };
  }
}

export default HealthTrackerAgent;
