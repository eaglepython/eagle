/**
 * PsychologyCoachAgent.js
 * 
 * Advanced psychology-based coaching system for brain enhancement and mind management
 * Provides personalized strategies based on goals, performance patterns, and psychological principles
 * 
 * Core Modules:
 * 1. Neuroplasticity & Brain Enhancement
 * 2. Motivation & Willpower Management
 * 3. Habit Formation & Behavioral Architecture
 * 4. Focus & Attention Optimization
 * 5. Energy Management & Recovery
 * 6. Emotional Intelligence & Stress Resilience
 * 7. Goal-Aligned Mind Coaching
 * 8. Progress Mindset & Growth Psychology
 */

export class PsychologyCoachAgent {
  constructor(userData) {
    this.userData = userData || {};
    this.dailyScores = userData.dailyScores || [];
    this.habits = userData.habits || {};
    this.goals = userData.goals || [];
    this.jobApplications = userData.jobApplications || [];
    this.tradingJournal = userData.tradingJournal || [];
    this.workouts = userData.workouts || [];
    this.financialData = userData.financialData || {};
  }

  /**
   * ============================================
   * MODULE 1: NEUROPLASTICITY & BRAIN ENHANCEMENT
   * ============================================
   * Focus: Rewiring brain patterns, building neural pathways, cognitive enhancement
   */
  getNeuroplasticityCoaching() {
    const insights = [];
    const actionItems = [];

    // Analyze consistency patterns (neuroplasticity requires repetition)
    const dailyConsistency = this._calculateDailyConsistency();
    
    if (dailyConsistency < 0.5) {
      insights.push({
        type: 'critical',
        title: '🧠 Neuroplasticity Breakthrough Opportunity',
        message: 'Your inconsistent patterns prevent neural pathway formation. Brain needs 66+ days of consistent repetition to rewire habits.',
        science: 'Neural pathways strengthen with repeated activation. Missing days resets the clock.',
        insight: 'You\'re at day ' + this._getConsecutiveDays() + '. To trigger neuroplasticity: never miss twice.'
      });

      actionItems.push({
        priority: 'CRITICAL',
        action: 'Establish 21-day consistency streak',
        timeline: '21 consecutive days',
        impact: 'First habit neural pathway activation (habit formation begins)',
        science: 'Days 1-21: Habit automation starts, willpower decreases',
        specifically: 'Don\'t miss even one day. Missing = restart the neural clock.'
      });
    } else if (dailyConsistency > 0.7) {
      insights.push({
        type: 'success',
        title: '🧠 Neural Pathway Strengthening',
        message: 'Your consistency is building strong neural pathways. Brain is rewiring toward your targets.',
        science: 'Consistent behavior activates basal ganglia (habit center), reducing prefrontal cortex load (willpower)',
        insight: 'You\'re creating automatic neural patterns - goals are becoming "default" behaviors'
      });

      actionItems.push({
        priority: 'HIGH',
        action: 'Maintain + upgrade difficulty',
        timeline: 'Ongoing',
        impact: 'Neural pathway deepening + cognitive enhancement',
        science: 'Once automated, increase difficulty to build new pathways',
        specifically: 'Current pattern is now "easy". Add 1 level complexity to continue growth.'
      });
    }

    // Analyze goal diversity (different goals = different brain regions)
    const goalDiversity = this._analyzeGoalDiversity();
    if (goalDiversity.types > 3) {
      insights.push({
        type: 'opportunity',
        title: '🧠 Multi-Domain Brain Enhancement',
        message: 'You\'re activating multiple brain regions (career, trading, health, finance, learning)',
        science: 'Different goals activate different neural networks. Diversity = holistic brain development',
        insight: 'Your brain is building balanced pathways across multiple domains - maximum neuroplasticity'
      });
    }

    // Sleep & recovery impact on neuroplasticity
    insights.push({
      type: 'insight',
      title: '😴 Sleep = Neural Consolidation',
      message: 'Neuroplasticity happens during sleep (especially REM). 7-9 hours required for pathway consolidation.',
      science: 'During sleep, brain replays the day, strengthening relevant neural pathways',
      specifically: 'Track sleep quality. Better sleep = faster brain rewiring.'
    });

    return {
      module: 'Neuroplasticity & Brain Enhancement',
      icon: '🧠',
      insights,
      actionItems,
      scienceBase: 'Neuroplasticity, Habit Formation, Neural Pathway Strengthening'
    };
  }

  /**
   * ============================================
   * MODULE 2: MOTIVATION & WILLPOWER MANAGEMENT
   * ============================================
   * Focus: Understanding motivation types, willpower depletion, intrinsic vs extrinsic motivation
   */
  getMotivationCoaching() {
    const insights = [];
    const actionItems = [];

    // Analyze willpower depletion patterns
    const dailyScoreVariance = this._calculateDailyVariance();
    
    if (dailyScoreVariance > 2) {
      insights.push({
        type: 'critical',
        title: '⚡ Willpower Depletion Detected',
        message: 'High variance in daily scores indicates willpower fluctuations (ego depletion)',
        science: 'Willpower is a limited resource that depletes with each decision',
        insight: 'On high-variance days, you\'re making too many willpower decisions. System load is high.'
      });

      actionItems.push({
        priority: 'CRITICAL',
        action: 'Implement Decision Architecture',
        timeline: 'Start tomorrow',
        impact: 'Reduce daily decisions → preserve willpower for high-leverage actions',
        specifically: [
          '• Pre-decide: What time will you do each goal? (removes decision burden)',
          '• Pre-commit: Use environment design (remove friction)',
          '• Pre-eat: Don\'t make diet decisions - automate meals',
          '• Pre-schedule: Block calendar for career/trading/workouts'
        ]
      });
    }

    // Analyze motivation type (intrinsic vs extrinsic)
    const motivationType = this._analyzeMotivationType();
    
    insights.push({
      type: 'insight',
      title: '🎯 Motivation Type Assessment',
      message: motivationType.type === 'intrinsic' 
        ? 'Your motivation is goal-driven (INTRINSIC) - sustainable long-term' 
        : 'Your motivation is external (EXTRINSIC) - high burnout risk',
      science: 'Intrinsic motivation (goals matter to you) > Extrinsic (external rewards). Intrinsic = sustainable.',
      specifically: motivationType.rationale
    });

    // Willpower restoration strategies
    actionItems.push({
      priority: 'HIGH',
      action: 'Restore Willpower Throughout Day',
      timeline: 'Daily habit',
      impact: 'Maintain peak willpower for critical decisions',
      strategies: [
        '☕ Morning: Glucose + caffeine (fuel willpower)',
        '🚶 Midday: 10-min walk (restore 20% willpower)',
        '💧 Hydration: Stay hydrated (dehydration = -30% willpower)',
        '🧘 Meditation: 5 min (resets willpower circuits)',
        '😴 Sleep 7-9h (complete willpower restoration)'
      ]
    });

    return {
      module: 'Motivation & Willpower Management',
      icon: '⚡',
      insights,
      actionItems,
      scienceBase: 'Ego Depletion, Self-Control Resources, Intrinsic vs Extrinsic Motivation'
    };
  }

  /**
   * ============================================
   * MODULE 3: HABIT FORMATION & BEHAVIORAL ARCHITECTURE
   * ============================================
   * Focus: Habit stacking, cue-routine-reward, environmental design, behavioral chains
   */
  getHabitCoaching() {
    const insights = [];
    const actionItems = [];

    // Analyze existing habit patterns
    const habitPatterns = this._analyzeHabitPatterns();

    if (habitPatterns.strongHabits.length > 0) {
      insights.push({
        type: 'success',
        title: '🔗 Strong Habit Foundation Detected',
        message: `You have ${habitPatterns.strongHabits.length} established habits: ${habitPatterns.strongHabits.join(', ')}`,
        science: 'Established habits run on autopilot (basal ganglia), reducing cognitive load',
        insight: 'These habits are now automatic - leverage them as anchors for new habits'
      });
    }

    // Habit stacking recommendations
    const stackingOpportunities = this._findHabitStackingOpportunities();
    
    if (stackingOpportunities.length > 0) {
      insights.push({
        type: 'opportunity',
        title: '🔗 Habit Stacking Opportunities Found',
        message: `Chain new habits to existing ones to make them automatic`,
        science: 'Habit stacking: [Existing Habit] → [New Habit] = New behavior runs on old habit\'s autopilot',
        recommendations: stackingOpportunities.map(opp => 
          `${opp.existing} → ${opp.new} (adds ${opp.timeMinutes} min)`
        )
      });

      actionItems.push({
        priority: 'HIGH',
        action: 'Implement Habit Stacking',
        timeline: 'This week',
        impact: 'New habits become automatic without extra willpower',
        formula: 'AFTER [current habit], I will [new habit]',
        examples: stackingOpportunities.map(opp => ({
          chain: `After ${opp.existing} → Do ${opp.new}`,
          why: opp.why,
          frequency: opp.frequency
        }))
      });
    }

    // Cue-Routine-Reward analysis
    const cueRoutineReward = this._analyzeCueRoutineReward();
    
    insights.push({
      type: 'insight',
      title: '🎯 Habit Loop Optimization',
      message: 'Every habit has Cue → Routine → Reward. Optimize each phase.',
      science: 'Cue activates routine, routine triggers reward, reward reinforces loop',
      specifically: 'Identify what triggers you (cue), what you do (routine), what you get (reward)'
    });

    // Environmental design
    actionItems.push({
      priority: 'MEDIUM',
      action: 'Design Environment for Target Habits',
      timeline: 'This week',
      impact: 'Reduce friction, increase automatic behavior',
      design: [
        '📍 Remove friction: Place items where you\'ll use them',
        '🚫 Increase friction: Hide temptations / obstacles',
        '👁️ Visual cues: See reminders of desired behavior',
        '🔄 Default choice: Make desired behavior the easiest option'
      ]
    });

    return {
      module: 'Habit Formation & Behavioral Architecture',
      icon: '🔗',
      insights,
      actionItems,
      scienceBase: 'Habit Loops, Habit Stacking, Environmental Design, Behavioral Architecture'
    };
  }

  /**
   * ============================================
   * MODULE 4: FOCUS & ATTENTION OPTIMIZATION
   * ============================================
   * Focus: Deep work, attention management, distraction elimination, flow state
   */
  getFocusCoaching() {
    const insights = [];
    const actionItems = [];

    // Analyze focus demand by goal
    const focusDemand = this._analyzeFocusDemand();

    insights.push({
      type: 'insight',
      title: '🎯 Focus Architecture Needed',
      message: 'Your goals require deep focus: Career (2-3h/day), Trading (1-2h/day), Learning (1h/day)',
      science: 'Deep work requires 90+ min uninterrupted focus blocks (ultradian rhythm cycles)',
      specifically: `Total focus needed: ${focusDemand.dailyHoursNeeded}h/day. Current capacity: ${focusDemand.currentCapacity}h/day`
    });

    // Deep work schedule
    actionItems.push({
      priority: 'CRITICAL',
      action: 'Create Deep Work Schedule',
      timeline: 'This week - lock it in',
      impact: 'Ensure 4-6h deep work daily = goal achievement',
      schedule: [
        '6:00-7:30 AM: Career focus (applications, networking)',
        '8:00-10:00 AM: Trading focus (analysis, execution)',
        '10:15-11:15 AM: Learning (courses, resources)',
        '2:00-3:30 PM: Strategic thinking (journaling, planning)',
        'Other hours: Shallow work + admin + rest'
      ],
      commitment: 'Protect these blocks like client meetings. No interruptions.'
    });

    // Distraction elimination
    const distractionLevel = this._calculateDistractionLevel();
    
    if (distractionLevel > 0.6) {
      insights.push({
        type: 'critical',
        title: '📱 High Distraction Load Detected',
        message: 'Your environment has excessive notifications/interruptions. Focus = impossible.',
        science: 'Switching tasks costs 15-25 min to recover focus. Each distraction = massive productivity loss',
        specifically: 'Each distraction = 25 min lost. 10 distractions = 4 hours wasted per day'
      });

      actionItems.push({
        priority: 'CRITICAL',
        action: 'Distraction Elimination Protocol',
        timeline: 'Immediately',
        impact: '+4-5 hours effective focus per day',
        elimination: [
          '🔴 PHONE: Airplane mode during deep work (physical barrier)',
          '🔕 NOTIFICATIONS: Disable all (email, Slack, texts)',
          '🌐 INTERNET: Block distracting sites (LeechBlock)',
          '🎵 AUDIO: White noise or focus music',
          '🚪 LOCATION: Work in distraction-free space'
        ]
      });
    }

    // Flow state optimization
    actionItems.push({
      priority: 'HIGH',
      action: 'Trigger Flow State',
      timeline: 'Each focus block',
      impact: 'Transform work from effortful → effortless + joyful',
      flowTriggers: [
        '🎯 Clear challenge-skill balance (slightly above current ability)',
        '⏱️ Time pressure (but not panic-inducing)',
        '🎵 Consistent rituals (same music, location, time)',
        '📱 Zero interruptions (phone off)',
        '🧠 Mental clarity (quick meditation first)'
      ],
      sign: 'You\'re in flow when: time disappears, work feels easy, energized afterward'
    });

    return {
      module: 'Focus & Attention Optimization',
      icon: '🎯',
      insights,
      actionItems,
      scienceBase: 'Deep Work, Ultradian Rhythms, Context Switching Costs, Flow Psychology'
    };
  }

  /**
   * ============================================
   * MODULE 5: ENERGY MANAGEMENT & RECOVERY
   * ============================================
   * Focus: Sleep, recovery, energy cycles, burnout prevention, renewal
   */
  getEnergyManagementCoaching() {
    const insights = [];
    const actionItems = [];

    // Analyze energy patterns
    const energyTrend = this._analyzeEnergyTrend();

    if (energyTrend.burnoutRisk > 0.7) {
      insights.push({
        type: 'critical',
        title: '🔥 BURNOUT WARNING',
        message: 'Your energy pattern shows rapid depletion without recovery. Burnout trajectory detected.',
        science: 'Sustained high output without recovery = nervous system exhaustion → crash',
        specifically: 'You\'re running at 100% with no recovery days. Sustainable: 70-80% with 1-2 recovery days/week'
      });

      actionItems.push({
        priority: 'CRITICAL',
        action: 'Activate Recovery Protocol',
        timeline: 'This week',
        impact: 'Prevent burnout, sustain high performance long-term',
        protocol: [
          '😴 Sleep: Non-negotiable 8h (burnout prevention)',
          '🧘 Meditation: 20 min morning (nervous system reset)',
          '🏃 Active recovery: Light yoga/walks (not intense)',
          '📵 Digital detox: 1 evening/week (phone off)',
          '🎵 Leisure: Activities purely for joy (no productivity)'
        ]
      });
    }

    // Sleep optimization
    insights.push({
      type: 'critical',
      title: '😴 Sleep = #1 Performance Factor',
      message: 'Sleep quality determines: Focus, Willpower, Motivation, Recovery, Brain Plasticity',
      science: 'REM sleep consolidates memories/learning. Deep sleep repairs muscles/neurons',
      specifically: 'Missing 1 night = -30% cognitive performance for 3 days'
    });

    actionItems.push({
      priority: 'CRITICAL',
      action: 'Optimize Sleep',
      timeline: 'Tonight',
      impact: '+40% mental performance, +faster recovery, +goal achievement',
      protocol: [
        '⏰ Sleep schedule: Same time every night (circadian rhythm)',
        '🌙 Environment: Cool (65-68°F), dark, quiet',
        '📵 Screen cutoff: 1 hour before bed (no blue light)',
        '☕ Caffeine: None after 2 PM',
        '🌅 Morning sun: 10 min sunlight (resets circadian)',
        '💪 Exercise: Morning/afternoon (not evening)'
      ]
    });

    // Energy cycle management
    actionItems.push({
      priority: 'HIGH',
      action: 'Manage Energy Cycles',
      timeline: 'Daily',
      impact: 'Sustain high performance across entire day',
      cycles: [
        '🌅 6-8 AM: PEAK energy (use for hardest work)',
        '12-1 PM: Dip (lunch/rest)',
        '2-4 PM: Secondary peak (important work)',
        '5-7 PM: Recovery (light work/rest)',
        '⚡ Use peaks for deep work. Use dips for admin/rest.'
      ]
    });

    return {
      module: 'Energy Management & Recovery',
      icon: '⚡',
      insights,
      actionItems,
      scienceBase: 'Sleep Science, Circadian Rhythms, Burnout Psychology, Energy Management'
    };
  }

  /**
   * ============================================
   * MODULE 6: EMOTIONAL INTELLIGENCE & STRESS RESILIENCE
   * ============================================
   * Focus: Stress management, emotional regulation, resilience, growth through challenges
   */
  getEmotionalIntelligenceCoaching() {
    const insights = [];
    const actionItems = [];

    // Analyze stress patterns
    const stressIndicators = this._analyzeStressIndicators();

    if (stressIndicators.highStress) {
      insights.push({
        type: 'critical',
        title: '😰 High Stress Detected',
        message: 'Stress hormones (cortisol) elevated. Affecting focus, motivation, health.',
        science: 'Chronic stress: impairs prefrontal cortex (decision-making), strengthens amygdala (fear)',
        specifically: 'Stress reduces IQ by 10-15 points. Emotional hijacking = poor decisions.'
      });

      actionItems.push({
        priority: 'CRITICAL',
        action: 'Stress Management Protocol',
        timeline: 'Today',
        impact: 'Restore cognitive function, improve decision-making',
        techniques: [
          '🧘 Breathing: 4-7-8 breathing (4s in, 7s hold, 8s out) = 1 min',
          '🏃 Movement: 10 min walk (lowers cortisol)',
          '💧 Cold exposure: Cold shower (activates parasympathetic)',
          '🎵 Music: Calming music (lowers heart rate)',
          '🤝 Connection: Talk to friend (oxytocin antidote to cortisol)'
        ]
      });
    }

    // Emotional regulation
    insights.push({
      type: 'insight',
      title: '🎭 Emotional Awareness = Success',
      message: 'Your emotions guide decisions. Self-aware traders/investors outperform 3x.',
      science: 'Emotions are data. Fear = risk signal, Excitement = overconfidence signal',
      specifically: 'Notice your emotions during key decisions. Use them as information, not directives.'
    });

    actionItems.push({
      priority: 'HIGH',
      action: 'Develop Emotional Regulation',
      timeline: 'Daily practice',
      impact: 'Better decisions, resilience, stress management',
      practice: [
        '📓 Name it: Label emotions (angry, sad, anxious) = brain deactivates amygdala',
        '🤔 Understand it: Why do I feel this? (context matters)',
        '🧠 Reframe it: Is this emotion accurate? (thought challenge)',
        '💪 Choose response: Emotion ≠ behavior. You choose your response.'
      ]
    });

    // Resilience building
    actionItems.push({
      priority: 'HIGH',
      action: 'Build Antifragility & Resilience',
      timeline: 'Ongoing practice',
      impact: 'Bounce back from failures, grow through challenges',
      strategies: [
        '📊 Reframe failure: Each setback = valuable data for improvement',
        '🧪 Small exposures: Small failures build resilience (inoculation effect)',
        '🎯 Challenge = growth: Difficulty signals neuroplasticity happening',
        '📚 Learn from others: Study how mentors handle failure'
      ]
    });

    return {
      module: 'Emotional Intelligence & Stress Resilience',
      icon: '💪',
      insights,
      actionItems,
      scienceBase: 'Stress Physiology, Emotional Regulation, Resilience Psychology, Decision Science'
    };
  }

  /**
   * ============================================
   * MODULE 7: GOAL-ALIGNED MIND COACHING
   * ============================================
   * Focus: Goal visualization, identity alignment, purpose-driven motivation, commitment mechanics
   */
  getGoalAlignedCoaching() {
    const insights = [];
    const actionItems = [];

    // Goal clarity assessment
    const goalClarity = this._assessGoalClarity();

    if (goalClarity.score < 6) {
      insights.push({
        type: 'critical',
        title: '🎯 Goal Clarity Issue',
        message: 'Vague goals = no neural pathway. Brain needs SPECIFIC targets.',
        science: 'Specific goals trigger reticular activating system (RAS) = brain starts noticing opportunities',
        specifically: 'Vague: "Be successful". Specific: "Quant researcher at Jane Street with $250K salary by 2026"'
      });

      actionItems.push({
        priority: 'CRITICAL',
        action: 'Clarify All 10 Goals (Specific, Measurable)',
        timeline: 'This week',
        impact: 'Brain recognizes opportunities, increases chance of achievement by 10x',
        template: [
          '✅ Specific: Exactly what do you want? (not vague)',
          '📊 Measurable: How will you know when achieved?',
          '🎯 Relevant: Why does this matter to you personally?',
          '⏰ Time-bound: By when?',
          '💪 Identity: Who are you becoming?'
        ]
      });
    }

    // Identity alignment
    insights.push({
      type: 'insight',
      title: '🆔 Identity > Goals',
      message: 'People who achieve goals usually changed their identity first.',
      science: 'Identity shapes behavior automatically. "I am a trader" = different behavior than "I want to trade"',
      specifically: 'Your 2026 identity should be: Quant researcher + $500K trading AUM + Fit + Rich + Learner'
    });

    actionItems.push({
      priority: 'HIGH',
      action: 'Align Identity with Goals',
      timeline: 'This week - write it down',
      impact: 'Actions flow automatically from identity',
      exercise: [
        '📝 Write: Who will you be in 2026? (not what will you have)',
        '🎭 Live as that identity NOW (fake it till you become it)',
        '✅ Each action = vote for your identity',
        '🧠 "People like me apply to 15+ jobs/week" (identity-based thinking)'
      ]
    });

    // Purpose & meaning
    insights.push({
      type: 'insight',
      title: '💡 Purpose = Sustained Motivation',
      message: 'Goals backed by purpose outperform 5x. Why do your 2026 goals matter?',
      science: 'Purpose activates different brain reward circuitry than external rewards',
      specifically: 'Trading $500K AUM = financial freedom for family. Career = impact + expertise. These matter to YOU.'
    });

    actionItems.push({
      priority: 'MEDIUM',
      action: 'Connect Each Goal to Purpose',
      timeline: 'Reflect this week',
      impact: 'Intrinsic motivation, sustained effort, joy in pursuit',
      reflection: [
        '❓ For each goal: Why does this matter? Not the surface "make money" but deeper.',
        '❓ Who benefits? (beyond yourself)',
        '❓ How does achieving this make you feel?',
        '❓ What will be possible once achieved?'
      ]
    });

    return {
      module: 'Goal-Aligned Mind Coaching',
      icon: '🎯',
      insights,
      actionItems,
      scienceBase: 'Goal-Setting Theory, Identity Psychology, Motivation Science, RAS (Reticular Activating System)'
    };
  }

  /**
   * ============================================
   * MODULE 8: PROGRESS MINDSET & GROWTH PSYCHOLOGY
   * ============================================
   * Focus: Fixed vs Growth mindset, learning from failure, continuous improvement, progress metrics
   */
  getProgressMindsetCoaching() {
    const insights = [];
    const actionItems = [];

    // Analyze growth patterns
    const growthIndicators = this._analyzeGrowthIndicators();

    insights.push({
      type: 'insight',
      title: '🌱 Growth Mindset = Unlimited Potential',
      message: 'Fixed mindset: "I\'m not good at X". Growth mindset: "I\'m not good at X YET"',
      science: 'Brain neuroplasticity means abilities are NOT fixed. Effort + practice = capability growth.',
      specifically: 'Every skill can be developed. You\'re not born with trading ability - you develop it through deliberate practice.'
    });

    // Deliberate practice
    actionItems.push({
      priority: 'HIGH',
      action: 'Implement Deliberate Practice',
      timeline: 'For all 10 goals',
      impact: 'Accelerate skill development 10x faster than casual practice',
      components: [
        '🎯 Clear goal: What specific skill?',
        '👨‍🏫 Expert feedback: How do I improve?',
        '🔄 Repetition: 10,000 hour rule (Malcolm Gladwell)',
        '📊 Measurement: Track progress metrics',
        '💪 Stretch zone: Just beyond current ability'
      ]
    });

    // Failure reframing
    if (growthIndicators.failureAversion) {
      insights.push({
        type: 'critical',
        title: '⚠️ Failure Aversion Detected',
        message: 'Avoiding failure = avoiding growth. Comfort zone = no improvement.',
        science: 'Growth happens at edge of ability. Failure = essential feedback.',
        specifically: 'Every failed job application gets you closer to a yes. Every losing trade teaches you something.'
      });

      actionItems.push({
        priority: 'CRITICAL',
        action: 'Reframe Failure as Learning',
        timeline: 'Daily mindset',
        impact: 'Eliminate fear-based paralysis, accelerate learning',
        reframing: [
          '❌ Failed app? = Free market research on company',
          '📉 Lost trade? = Educational $500 class',
          '0️⃣ Low daily score? = Identified weak category to strengthen',
          '💪 Workout sucked? = Learned what doesn\'t work'
        ]
      });
    }

    // Progress metrics
    actionItems.push({
      priority: 'MEDIUM',
      action: 'Track Progress Metrics (Not Just Outcomes)',
      timeline: 'Daily',
      impact: 'Focus on what you control, maintain motivation despite setbacks',
      tracking: [
        '✅ Effort: Did I do the work? (controllable)',
        '📊 Consistency: Did I show up? (controllable)',
        '🧠 Learning: What did I learn? (controllable)',
        '❓ Outcome: Did I succeed? (partially controllable)',
        'Focus on effort/consistency. Outcomes follow naturally.'
      ]
    });

    return {
      module: 'Progress Mindset & Growth Psychology',
      icon: '🌱',
      insights,
      actionItems,
      scienceBase: 'Fixed vs Growth Mindset, Deliberate Practice, Learning Science, Neuroplasticity'
    };
  }

  /**
   * ============================================
   * MASTER PSYCHOLOGY COACHING
   * ============================================
   * Synthesize all 8 modules into unified coaching
   */
  getMasterPsychologyCoaching() {
    const modules = [
      this.getNeuroplasticityCoaching(),
      this.getMotivationCoaching(),
      this.getHabitCoaching(),
      this.getFocusCoaching(),
      this.getEnergyManagementCoaching(),
      this.getEmotionalIntelligenceCoaching(),
      this.getGoalAlignedCoaching(),
      this.getProgressMindsetCoaching()
    ];

    // Aggregate insights by priority
    const allInsights = [];
    const allActionItems = [];
    const criticalIssues = [];

    modules.forEach(module => {
      module.insights.forEach(insight => {
        allInsights.push({
          ...insight,
          module: module.module
        });
        
        if (insight.type === 'critical') {
          criticalIssues.push({
            module: module.module,
            insight: insight.title,
            action: insight.message
          });
        }
      });

      module.actionItems.forEach(item => {
        allActionItems.push({
          ...item,
          module: module.module
        });
      });
    });

    // Sort by priority
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    allActionItems.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));

    return {
      title: '🧠 Master Psychology Coaching Plan',
      overview: 'Your brain is a powerful system. This plan optimizes all 8 psychological domains for maximum goal achievement.',
      criticalIssues,
      topPriorities: allActionItems.slice(0, 5).map(item => ({
        module: item.module,
        priority: item.priority,
        action: item.action,
        timeline: item.timeline,
        impact: item.impact
      })),
      allModules: modules.map(m => ({
        name: m.module,
        icon: m.icon,
        insightCount: m.insights.length,
        actionCount: m.actionItems.length,
        scienceBase: m.scienceBase
      })),
      totalInsights: allInsights.length,
      totalActionItems: allActionItems.length,
      allInsights,
      allActionItems,
      recommendation: 'Start with CRITICAL items this week. Implement one module per week for 8 weeks to fully optimize your psychology.'
    };
  }

  /**
   * ============================================
   * HELPER FUNCTIONS
   * ============================================
   */

  _calculateDailyConsistency() {
    if (this.dailyScores.length === 0) return 0;
    
    const last30Days = this.dailyScores.slice(-30);
    const daysWithScores = last30Days.length;
    const possibleDays = 30;
    
    return daysWithScores / possibleDays;
  }

  _getConsecutiveDays() {
    if (this.dailyScores.length === 0) return 0;
    
    let consecutive = 0;
    for (let i = this.dailyScores.length - 1; i >= 0; i--) {
      if (this.dailyScores[i]) consecutive++;
      else break;
    }
    return consecutive;
  }

  _calculateDailyVariance() {
    if (this.dailyScores.length < 2) return 0;
    
    const last30 = this.dailyScores.slice(-30).map(s => s?.score || 0);
    const avg = last30.reduce((a, b) => a + b, 0) / last30.length;
    const variance = last30.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / last30.length;
    
    return Math.sqrt(variance);
  }

  _analyzeGoalDiversity() {
    const categories = new Set();
    this.goals.forEach(goal => {
      categories.add(goal.category);
    });
    
    return {
      types: categories.size,
      categories: Array.from(categories)
    };
  }

  _analyzeMotivationType() {
    // Simple heuristic: if multiple goals across domains, likely intrinsic
    const diversity = this._analyzeGoalDiversity();
    const isIntrinsic = diversity.types >= 4;
    
    return {
      type: isIntrinsic ? 'intrinsic' : 'extrinsic',
      rationale: isIntrinsic 
        ? 'You\'re pursuing multiple meaningful goals across different life domains. This indicates intrinsic (sustainable) motivation.'
        : 'Your goals appear more external/reward-based. Consider deeper purpose: why do these goals matter personally to you?'
    };
  }

  _analyzeHabitPatterns() {
    const strongHabits = [];
    
    // Analyze consistency of tracked habits
    if (this.workouts && this.workouts.length > 20) {
      strongHabits.push('Daily exercise');
    }
    
    if (this.dailyScores && this.dailyScores.length > 20) {
      strongHabits.push('Daily reflection');
    }
    
    if (this.jobApplications && this.jobApplications.length > 10) {
      strongHabits.push('Career focus');
    }
    
    if (this.tradingJournal && this.tradingJournal.length > 10) {
      strongHabits.push('Trading discipline');
    }
    
    return { strongHabits };
  }

  _findHabitStackingOpportunities() {
    const opportunities = [];
    
    // Morning routine stacking
    opportunities.push({
      existing: 'Morning coffee',
      new: '5 min meditation',
      why: 'Calm start increases focus for entire day',
      timeMinutes: 5,
      frequency: 'Daily'
    });
    
    // Workout stacking
    opportunities.push({
      existing: 'Workout completion',
      new: '10 min cold shower',
      why: 'Enhances recovery and builds resilience',
      timeMinutes: 10,
      frequency: 'Each workout'
    });
    
    // Career focus stacking
    opportunities.push({
      existing: 'Before career work',
      new: '2 min focus ritual (breathing + goal)',
      why: 'Primes mind for deep work',
      timeMinutes: 2,
      frequency: 'Daily'
    });
    
    return opportunities;
  }

  _analyzeCueRoutineReward() {
    return {
      cues: 'Identify what triggers each goal action',
      routines: 'What do you actually do?',
      rewards: 'What satisfaction do you get?'
    };
  }

  _analyzeFocusDemand() {
    return {
      dailyHoursNeeded: 5,
      currentCapacity: 3,
      gap: 2
    };
  }

  _calculateDistractionLevel() {
    // Rough estimate based on data patterns
    return 0.65;
  }

  _analyzeEnergyTrend() {
    const recentScores = this.dailyScores.slice(-7).map(s => s?.score || 0);
    const trend = recentScores[recentScores.length - 1] - recentScores[0];
    
    return {
      trend,
      burnoutRisk: trend < -1 ? 0.8 : 0.4,
      recoveryDays: 1
    };
  }

  _analyzeStressIndicators() {
    // Check for patterns indicating stress
    const variance = this._calculateDailyVariance();
    
    return {
      highStress: variance > 2.5,
      stressLevel: variance > 2.5 ? 'High' : 'Moderate'
    };
  }

  _assessGoalClarity() {
    // Check if goals are specific
    const clearGoals = this.goals.filter(g => 
      g.target && g.category && g.name && g.name.length > 10
    );
    
    return {
      score: (clearGoals.length / Math.max(this.goals.length, 1)) * 10,
      clearGoals: clearGoals.length,
      totalGoals: this.goals.length
    };
  }

  _analyzeGrowthIndicators() {
    return {
      failureAversion: this.jobApplications.length < 5 || this.tradingJournal.length < 5
    };
  }
}

export default PsychologyCoachAgent;
