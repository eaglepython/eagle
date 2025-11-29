import { useState, useEffect } from 'react';

export default function HighValueReminder({ userData, addNotification }) {
  const [highlightedItems, setHighlightedItems] = useState([]);
  const [circlePosition, setCirclePosition] = useState(0);

  useEffect(() => {
    // Find all items > 500 across all data
    const itemsOver500 = [];

    // Check financial data
    if (userData.financialData) {
      if (userData.financialData.netWorth > 500) {
        itemsOver500.push({
          type: 'Net Worth',
          value: userData.financialData.netWorth,
          emoji: '💰',
          icon: '$'
        });
      }
      if (userData.financialData.monthlyIncome > 500) {
        itemsOver500.push({
          type: 'Monthly Income',
          value: userData.financialData.monthlyIncome,
          emoji: '💵',
          icon: '$'
        });
      }
      if (userData.financialData.savingsRate > 500) {
        itemsOver500.push({
          type: 'Savings Total',
          value: userData.financialData.savingsRate,
          emoji: '🏦',
          icon: '$'
        });
      }
    }

    // Check job applications
    if (userData.careerData?.applications?.length > 500) {
      itemsOver500.push({
        type: 'Total Applications',
        value: userData.careerData.applications.length,
        emoji: '📝',
        icon: '#'
      });
    }

    // Check goals
    if (userData.goals?.length > 0) {
      userData.goals.forEach(goal => {
        if (goal.target && goal.target > 500) {
          itemsOver500.push({
            type: goal.name,
            value: goal.target,
            emoji: '🎯',
            icon: '#'
          });
        }
      });
    }

    setHighlightedItems(itemsOver500);

    // Rotate reminder every 30 seconds
    if (itemsOver500.length > 0) {
      const interval = setInterval(() => {
        const randomItem = itemsOver500[Math.floor(Math.random() * itemsOver500.length)];
        addNotification(
          `🔴 HIGH VALUE: ${randomItem.type} → ${randomItem.value.toLocaleString()} ${randomItem.icon}`,
          'warning'
        );

        // Animate circle
        setCirclePosition(prev => (prev + 360) % 360);
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [userData, addNotification]);

  if (highlightedItems.length === 0) return null;

  return (
    <div className="hidden">
      {/* Hidden component - all work done via notifications and effects */}
    </div>
  );
}
