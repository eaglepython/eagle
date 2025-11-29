// Comprehensive STEM Formula Library - Essential Formulas for Learning
// Domains: Machine Learning, AI, Deep Learning, Quantum Computing, Financial Engineering

export const COMPREHENSIVE_FORMULAS = [
  // ML Formulas
  { name: 'Q-Learning', symbol: 'Q(s,a)', formula: 'r + γ·max(Q(s\',a\'))', domain: 'Reinforcement Learning', usage: 'Policy learning, sequential decisions', applications: 'Game AI, robots, trading', category: 'ml', code: `import numpy as np\nQ = np.zeros((states, actions))\ntarget = r + gamma * Q[s_next].max()\nQ[s,a] += alpha * (target - Q[s,a])` },
  { name: 'Entropy', symbol: 'H(X)', formula: '-Σ p(x)·log(p(x))', domain: 'Information Theory', usage: 'Uncertainty quantification', applications: 'Decision trees, features', category: 'ml', code: `import numpy as np\ndef entropy(labels):\n    p = np.bincount(labels)/len(labels)\n    return -np.sum(p * np.log(p + 1e-9))` },
  { name: 'SVM Margin', symbol: 'margin = 2/||w||', formula: 'maximize 2/||w|| s.t. y_i(w·x_i+b)≥1', domain: 'Support Vector Machines', usage: 'Maximum margin classification', applications: 'Image classification, text', category: 'ml', code: `from sklearn.svm import SVC\nmodel = SVC(kernel='rbf')\nmodel.fit(X, y)` },
  
  // DL Formulas
  { name: 'MLP Forward', symbol: 'h = σ(Wx+b)', formula: 'activation(weight·input+bias)', domain: 'Neural Networks', usage: 'Feature transformation', applications: 'All deep learning tasks', category: 'dl', code: `import torch.nn as nn\nfc = nn.Linear(input_dim, output_dim)\nh = torch.relu(fc(x))` },
  { name: 'Backprop', symbol: '∂L/∂W', formula: '∂L/∂h · ∂h/∂W', domain: 'Training', usage: 'Gradient computation', applications: 'Model training', category: 'dl', code: `loss.backward()\noptimizer.step()` },
  { name: 'ReLU', symbol: 'σ(x)', formula: 'max(0, x)', domain: 'Activation', usage: 'Non-linearity', applications: 'Hidden layers', category: 'dl', code: `relu = nn.ReLU()\noutput = relu(x)` },
  
  // Quantum Formulas
  { name: 'Superposition', symbol: '|ψ⟩', formula: 'α|0⟩ + β|1⟩', domain: 'Quantum States', usage: 'Parallel computation', applications: 'Quantum algorithms', category: 'quantum', code: `from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)  # Hadamard` },
  { name: 'Schrödinger', symbol: 'iℏ∂ψ/∂t', formula: 'Ĥψ', domain: 'Quantum Evolution', usage: 'State dynamics', applications: 'Simulations', category: 'quantum', code: `# Time-dependent evolution\npsi = psi + (-1j * H @ psi) * dt` },
  
  // Finance Formulas
  { name: 'Black-Scholes', symbol: 'C=S₀N(d₁)', formula: '-Ke^(-rT)N(d₂)', domain: 'Options Pricing', usage: 'European options', applications: 'Derivatives, hedging', category: 'finance', code: `from scipy.stats import norm\nd1 = (np.log(S/K)+(r+σ²/2)*T)/(σ*√T)\nC = S*norm.cdf(d1) - K*exp(-r*T)*norm.cdf(d1-σ*√T)` },
  { name: 'Brownian Motion', symbol: 'dW_t', formula: '√dt · N(0,1)', domain: 'Stochastic Processes', usage: 'Price modeling', applications: 'Monte Carlo', category: 'finance', code: `W = np.cumsum(np.sqrt(dt) * np.random.randn(N))\nS = S0 * np.exp((mu - σ²/2) * t + σ * W)` },
];

export default COMPREHENSIVE_FORMULAS;
