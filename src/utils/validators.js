/**
 * Data Validators
 * Ensures data integrity across all trackers
 */

export const validators = {
  /**
   * Validate daily score entry
   */
  dailyScore: (score, category) => {
    if (typeof score !== 'number') {
      return { valid: false, error: 'Score must be a number' };
    }
    if (score < 0 || score > 10) {
      return { valid: false, error: 'Score must be between 0 and 10' };
    }
    if (!category || typeof category !== 'string') {
      return { valid: false, error: 'Category is required' };
    }
    return { valid: true };
  },

  /**
   * Validate trade entry
   */
  tradeEntry: (entry) => {
    if (!entry.date) {
      return { valid: false, error: 'Trade date is required' };
    }
    if (typeof entry.pnl !== 'number') {
      return { valid: false, error: 'P&L must be a number' };
    }
    if (!entry.entryPrice || entry.entryPrice <= 0) {
      return { valid: false, error: 'Entry price must be positive' };
    }
    if (!entry.exitPrice || entry.exitPrice <= 0) {
      return { valid: false, error: 'Exit price must be positive' };
    }
    if (!entry.quantity || entry.quantity <= 0) {
      return { valid: false, error: 'Quantity must be positive' };
    }
    return { valid: true };
  },

  /**
   * Validate job application
   */
  jobApplication: (app) => {
    if (!app.company || typeof app.company !== 'string') {
      return { valid: false, error: 'Company name is required' };
    }
    if (!['Tier1', 'Tier2', 'Tier3', 'Tier4'].includes(app.tier)) {
      return { valid: false, error: 'Invalid tier. Must be Tier1, Tier2, Tier3, or Tier4' };
    }
    if (!app.date) {
      return { valid: false, error: 'Application date is required' };
    }
    return { valid: true };
  },

  /**
   * Validate workout entry
   */
  workout: (workout) => {
    if (!workout.date) {
      return { valid: false, error: 'Workout date is required' };
    }
    if (!workout.type || typeof workout.type !== 'string') {
      return { valid: false, error: 'Workout type is required' };
    }
    if (typeof workout.duration !== 'number' || workout.duration <= 0) {
      return { valid: false, error: 'Duration must be a positive number (minutes)' };
    }
    if (typeof workout.intensity !== 'number' || workout.intensity < 1 || workout.intensity > 10) {
      return { valid: false, error: 'Intensity must be 1-10' };
    }
    return { valid: true };
  },

  /**
   * Validate expense entry
   */
  expense: (expense) => {
    if (typeof expense.amount !== 'number' || expense.amount <= 0) {
      return { valid: false, error: 'Amount must be a positive number' };
    }
    if (!expense.category || typeof expense.category !== 'string') {
      return { valid: false, error: 'Category is required' };
    }
    if (!expense.date) {
      return { valid: false, error: 'Expense date is required' };
    }
    return { valid: true };
  },

  /**
   * Validate date format (ISO string or Date object)
   */
  date: (date) => {
    if (!date) {
      return { valid: false, error: 'Date is required' };
    }
    try {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        return { valid: false, error: 'Invalid date format' };
      }
      return { valid: true, date: parsed };
    } catch {
      return { valid: false, error: 'Invalid date format' };
    }
  },

  /**
   * Validate percentage (0-100)
   */
  percentage: (value) => {
    if (typeof value !== 'number') {
      return { valid: false, error: 'Must be a number' };
    }
    if (value < 0 || value > 100) {
      return { valid: false, error: 'Must be between 0 and 100' };
    }
    return { valid: true };
  },

  /**
   * Validate monetary amount
   */
  money: (amount) => {
    if (typeof amount !== 'number') {
      return { valid: false, error: 'Must be a number' };
    }
    if (amount < 0) {
      return { valid: false, error: 'Cannot be negative' };
    }
    // Check for reasonable amount (< $1 billion)
    if (amount > 1000000000) {
      return { valid: false, error: 'Amount seems too large' };
    }
    return { valid: true };
  }
};

/**
 * Normalize data for consistency
 */
export const normalizers = {
  /**
   * Normalize date to ISO string
   */
  date: (date) => {
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString();
    return new Date().toISOString();
  },

  /**
   * Normalize score to 0-10
   */
  score: (score) => {
    const normalized = Math.max(0, Math.min(10, Number(score) || 0));
    return Math.round(normalized * 10) / 10;
  },

  /**
   * Normalize percentage to 0-100
   */
  percentage: (pct) => {
    return Math.max(0, Math.min(100, Number(pct) || 0));
  },

  /**
   * Normalize money to 2 decimal places
   */
  money: (amount) => {
    return Math.round(Number(amount) || 0 * 100) / 100;
  }
};

/**
 * Batch validate multiple entries
 */
export function validateBatch(entries, validator) {
  return entries.map((entry, idx) => ({
    index: idx,
    entry,
    ...validator(entry)
  }));
}

/**
 * Check if all entries are valid
 */
export function allValid(validationResults) {
  return validationResults.every(result => result.valid === true);
}

/**
 * Get validation errors for failed entries
 */
export function getErrors(validationResults) {
  return validationResults
    .filter(result => !result.valid)
    .map(result => ({ index: result.index, error: result.error }));
}
