import { useState, useEffect } from 'react';

export function Header({ currentTime }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todayFormula, setTodayFormula] = useState('');
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Enhanced formula database with domain, usage, and code
  const formulas = [
    { 
      name: 'Brownian Motion', 
      symbol: 'dW_t', 
      formula: '√dt · N(0,1)',
      domain: 'Stochastic Calculus / Quantitative Finance',
      usage: 'Stock price modeling, option pricing, derivative valuation',
      applications: 'Black-Scholes model, Monte Carlo simulations, risk assessment',
      code: `import numpy as np\nimport numpy.random as rnd\n# Brownian Motion simulation\ndef brownian_motion(T, N, S0=100, mu=0.05, sigma=0.2):\n    dt = T / N\n    t = np.linspace(0, T, N)\n    W = np.cumsum(np.sqrt(dt) * rnd.randn(N)) - np.sqrt(dt) * rnd.randn()\n    S = S0 * np.exp((mu - 0.5*sigma**2) * t + sigma * W)\n    return t, S`,
      category: 'paths'
    },
    { 
      name: 'Black-Scholes', 
      symbol: 'C = S₀N(d₁)', 
      formula: '- Ke^(-rT)N(d₂)',
      domain: 'Financial Engineering / Options Pricing',
      usage: 'European option valuation, derivative pricing, Greeks calculation',
      applications: 'Risk hedging, portfolio optimization, trading strategies',
      code: `from scipy.stats import norm\nimport numpy as np\n# Black-Scholes option pricing\ndef black_scholes(S, K, T, r, sigma, option='call'):\n    d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))\n    d2 = d1 - sigma*np.sqrt(T)\n    if option == 'call':\n        price = S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)\n    else:\n        price = K*np.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)\n    return price`,
      category: 'finance'
    },
    { 
      name: 'MLP Forward Pass', 
      symbol: 'h = σ(Wx + b)', 
      formula: 'activation(weight·input + bias)',
      domain: 'Deep Learning / Neural Networks',
      usage: 'Feature transformation, non-linear mapping, representation learning',
      applications: 'Image classification, NLP, regression, time-series forecasting',
      code: `import torch\nimport torch.nn as nn\n# MLP layer forward pass\nclass MLP(nn.Module):\n    def __init__(self, input_dim, hidden_dim, output_dim):\n        super().__init__()\n        self.fc1 = nn.Linear(input_dim, hidden_dim)\n        self.relu = nn.ReLU()\n        self.fc2 = nn.Linear(hidden_dim, output_dim)\n    def forward(self, x):\n        h = self.relu(self.fc1(x))\n        return self.fc2(h)`,
      category: 'dl'
    },
    { 
      name: 'Backpropagation', 
      symbol: '∂L/∂W', 
      formula: '∂L/∂h · ∂h/∂W',
      domain: 'Deep Learning / Gradient Descent',
      usage: 'Weight optimization, loss minimization, neural network training',
      applications: 'Model training, fine-tuning, transfer learning',
      code: `import torch\nimport torch.optim as optim\n# Backpropagation for neural network training\nmodel = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))\noptimizer = optim.Adam(model.parameters(), lr=0.001)\nloss_fn = nn.CrossEntropyLoss()\n\nfor epoch in range(100):\n    for X_batch, y_batch in dataloader:\n        optimizer.zero_grad()\n        logits = model(X_batch)\n        loss = loss_fn(logits, y_batch)\n        loss.backward()  # Backpropagation\n        optimizer.step()`,
      category: 'dl'
    },
    { 
      name: 'Q-Learning', 
      symbol: 'Q(s,a)', 
      formula: 'r + γ·max(Q(s\',a\'))',
      domain: 'Reinforcement Learning / Machine Learning',
      usage: 'Policy learning, reward optimization, decision-making',
      applications: 'Game AI, robotics, autonomous systems, trading bots',
      code: `import numpy as np\n# Q-Learning algorithm\nclass QLearningAgent:\n    def __init__(self, n_states, n_actions, alpha=0.1, gamma=0.99, epsilon=0.1):\n        self.Q = np.zeros((n_states, n_actions))\n        self.alpha, self.gamma, self.epsilon = alpha, gamma, epsilon\n    def update(self, s, a, r, s_next):\n        target = r + self.gamma * np.max(self.Q[s_next])\n        self.Q[s, a] += self.alpha * (target - self.Q[s, a])\n    def act(self, s):\n        if np.random.rand() < self.epsilon:\n            return np.random.randint(self.Q.shape[1])\n        return np.argmax(self.Q[s])`,
      category: 'ml'
    },
    { 
      name: 'Entropy', 
      symbol: 'H(X)', 
      formula: '-Σ p(x)·log(p(x))',
      domain: 'Information Theory / Machine Learning',
      usage: 'Information measurement, uncertainty quantification, decision trees',
      applications: 'Feature selection, model evaluation, classification metrics',
      code: `import numpy as np\nfrom scipy.stats import entropy\n# Entropy calculation for information theory\ndef calculate_entropy(labels):\n    value_counts = np.bincount(labels)\n    probabilities = value_counts / len(labels)\n    return entropy(probabilities, base=2)\n\n# Cross-entropy for neural networks\ndef cross_entropy_loss(y_true, y_pred):\n    return -np.mean(y_true * np.log(y_pred + 1e-9))`,
      category: 'ml'
    },
    { 
      name: 'Quantum Superposition', 
      symbol: '|ψ⟩', 
      formula: 'α|0⟩ + β|1⟩',
      domain: 'Quantum Computing / Quantum Mechanics',
      usage: 'Quantum state representation, parallel computation, information encoding',
      applications: 'Quantum algorithms, quantum optimization, cryptography',
      code: `from qiskit import QuantumCircuit, QuantumRegister\nimport numpy as np\n# Quantum superposition state\ndef create_superposition():\n    qc = QuantumCircuit(2, 2)\n    qc.h(0)  # Hadamard gate creates superposition\n    qc.h(1)\n    return qc\n# Bell state (entangled superposition)\ndef bell_state():\n    qc = QuantumCircuit(2, 2)\n    qc.h(0)\n    qc.cx(0, 1)  # CNOT creates entanglement\n    return qc`,
      category: 'quantum'
    },
    { 
      name: 'Schrödinger Equation', 
      symbol: 'iℏ∂ψ/∂t', 
      formula: 'Ĥψ',
      domain: 'Quantum Mechanics / Quantum Simulation',
      usage: 'Quantum state evolution, molecular simulation, quantum dynamics',
      applications: 'Drug discovery, materials science, quantum simulation',
      code: `import numpy as np\nfrom scipy.integrate import odeint\n# Time-dependent Schrödinger equation solver\ndef schrodinger_solver(psi0, H, dt, steps):\n    '''Solve time-dependent Schrödinger equation: iℏ dψ/dt = Ĥψ'''\n    psi = psi0\n    evolution = [psi]\n    for _ in range(steps):\n        dpsi = -1j * H @ psi\n        psi = psi + dpsi * dt\n        evolution.append(psi)\n    return np.array(evolution)`,
      category: 'quantum'
    },
    { 
      name: 'Wiener Process', 
      symbol: 'W(t)', 
      formula: 'continuous path, N(0,t)',
      domain: 'Stochastic Processes / Financial Mathematics',
      usage: 'Continuous-time random walk modeling, diffusion processes',
      applications: 'Interest rate modeling, currency pricing, regime switching',
      code: `import numpy as np\nimport matplotlib.pyplot as plt\n# Wiener Process (Standard Brownian Motion)\ndef wiener_process(T, N):\n    dt = T / N\n    W = np.zeros(N+1)\n    for i in range(1, N+1):\n        W[i] = W[i-1] + np.sqrt(dt) * np.random.randn()\n    return W\n# Multi-dimensional Wiener process\ndef multi_wiener(T, N, dim):\n    dt = T / N\n    return np.cumsum(np.sqrt(dt) * np.random.randn(N, dim), axis=0)`,
      category: 'paths'
    },
    { 
      name: 'Vasicek Model', 
      symbol: 'dr_t', 
      formula: 'a(b-r_t)dt + σdW_t',
      domain: 'Interest Rate Modeling / Fixed Income',
      usage: 'Short-rate modeling, bond pricing, fixed income derivatives',
      applications: 'Bond valuation, swaption pricing, portfolio management',
      code: `import numpy as np\n# Vasicek Interest Rate Model\ndef vasicek_model(r0, a, b, sigma, T, N):\n    '''dr = a(b-r)dt + sigma*dW'''\n    dt = T / N\n    rates = np.zeros(N+1)\n    rates[0] = r0\n    for i in range(N):\n        dW = np.sqrt(dt) * np.random.randn()\n        rates[i+1] = rates[i] + a*(b - rates[i])*dt + sigma*dW\n    return rates`,
      category: 'finance'
    }
  ];

  useEffect(() => {
    // Rotate formula every load
    const randomFormula = formulas[Math.floor(Math.random() * formulas.length)];
    setTodayFormula(randomFormula);

    // Get upcoming events
    const events = [
      { date: new Date(2025, 11, 25), name: 'Christmas Day', emoji: '🎄' },
      { date: new Date(2025, 11, 31), name: 'New Year\'s Eve', emoji: '🎉' },
      { date: new Date(2026, 0, 1), name: 'New Year 2026', emoji: '🎆' },
      { date: new Date(2026, 0, 15), name: 'MLK Day', emoji: '🇺🇸' },
      { date: new Date(2026, 1, 14), name: 'Valentine\'s Day', emoji: '💕' },
      { date: new Date(2026, 2, 17), name: 'St. Patrick\'s Day', emoji: '🍀' },
      { date: new Date(2026, 4, 25), name: 'Memorial Day', emoji: '🇺🇸' },
      { date: new Date(2026, 6, 4), name: 'Independence Day', emoji: '🎆' },
      { date: new Date(2026, 8, 7), name: 'Labor Day', emoji: '💼' },
      { date: new Date(2026, 10, 26), name: 'Thanksgiving', emoji: '🦃' },
      { date: new Date(2026, 11, 25), name: 'Christmas 2026', emoji: '🎄' }
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 2);

    setUpcomingEvents(upcoming);
  }, []);

  // Calculate days until event
  const daysUntilEvent = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    target.setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getFormulaColor = (category) => {
    switch(category) {
      case 'finance': return 'from-green-900/30 to-emerald-900/30 border-green-600/30';
      case 'dl': return 'from-orange-900/30 to-amber-900/30 border-orange-600/30';
      case 'ml': return 'from-purple-900/30 to-violet-900/30 border-purple-600/30';
      case 'quantum': return 'from-indigo-900/30 to-blue-900/30 border-indigo-600/30';
      case 'paths': return 'from-pink-900/30 to-rose-900/30 border-pink-600/30';
      default: return 'from-slate-900/30 to-slate-800/30 border-slate-600/30';
    }
  };

  const getCategoryEmoji = (category) => {
    switch(category) {
      case 'finance': return '💰';
      case 'dl': return '🧠';
      case 'ml': return '🤖';
      case 'quantum': return '⚛️';
      case 'paths': return '📊';
      default: return '📐';
    }
  };

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <>
      <div className="glass rounded-xl md:rounded-2xl p-3 md:p-6 mb-4 md:mb-6 border-b-2 md:border-b-4 border-red-900 space-y-3 md:space-y-4">
        {/* Top Row: Title and Time */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 break-words">⚡ LIFE EXCELLENCE TRACKER</h1>
            <p className="text-xs md:text-sm lg:text-base text-slate-300 truncate">Joseph Bidias | Life Optimization</p>
            <p className="text-red-400 text-xs md:text-sm font-semibold mt-1 line-clamp-2">📋 v1.0 | Discipline = Freedom</p>
          </div>

          {/* Time with Seconds & Date */}
          <div className="text-right bg-slate-800 rounded-lg md:rounded-xl p-2 md:p-4 border border-red-900/50 flex-shrink-0">
            <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-white font-mono whitespace-nowrap">
              {timeStr}
            </div>
            <div className="text-red-400 text-xs md:text-sm truncate">{dateStr}</div>
          </div>
        </div>

        {/* Bottom Row: Formulas & Upcoming Events */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
          {/* Daily Formula - Clickable */}
          {todayFormula && (
            <div 
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className={`bg-gradient-to-br ${getFormulaColor(todayFormula.category)} rounded-lg p-2 md:p-3 border hover:border-opacity-100 transition cursor-pointer hover:scale-105 transform`}
            >
              <span className="text-2xl md:text-3xl flex-shrink-0">{getCategoryEmoji(todayFormula.category)}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-slate-300">{todayFormula.name}</div>
                <div className="text-xs md:text-sm font-mono text-white">{todayFormula.symbol}</div>
                <div className="text-xs text-slate-400 line-clamp-1">{todayFormula.formula}</div>
              </div>
            </div>
          )}

          {/* Upcoming Event 1 */}
          {upcomingEvents.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-2 md:p-3 border border-purple-600/30 flex items-center gap-2 hover:border-purple-500/50 transition">
              <span className="text-2xl md:text-3xl flex-shrink-0">{upcomingEvents[0].emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-slate-300 truncate">{upcomingEvents[0].name}</div>
                <div className="text-base md:text-lg font-semibold text-white">{daysUntilEvent(upcomingEvents[0].date)}d</div>
                <div className="text-xs text-slate-400">away</div>
              </div>
            </div>
          )}

          {/* Upcoming Event 2 */}
          {upcomingEvents.length > 1 && (
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-2 md:p-3 border border-blue-600/30 flex items-center gap-2 hover:border-blue-500/50 transition">
              <span className="text-2xl md:text-3xl flex-shrink-0">{upcomingEvents[1].emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-slate-300 truncate">{upcomingEvents[1].name}</div>
                <div className="text-base md:text-lg font-semibold text-white">{daysUntilEvent(upcomingEvents[1].date)}d</div>
                <div className="text-xs text-slate-400">away</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formula Details Modal */}
      {showFormulaDetails && todayFormula && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={() => setShowFormulaDetails(false)}>
          <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {getCategoryEmoji(todayFormula.category)} {todayFormula.name}
              </h2>
              <button onClick={() => setShowFormulaDetails(false)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-red-400 font-semibold text-sm">📍 Domain:</p>
                <p className="text-slate-300 text-sm">{todayFormula.domain}</p>
              </div>

              <div>
                <p className="text-green-400 font-semibold text-sm">🔧 Usage:</p>
                <p className="text-slate-300 text-sm">{todayFormula.usage}</p>
              </div>

              <div>
                <p className="text-blue-400 font-semibold text-sm">🎯 Applications:</p>
                <p className="text-slate-300 text-sm">{todayFormula.applications}</p>
              </div>

              <div>
                <p className="text-yellow-400 font-semibold text-sm">💻 Python Code:</p>
                <pre className="bg-slate-800 p-3 rounded text-xs font-mono text-green-300 overflow-x-auto">
                  <code>{todayFormula.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
