/**
 * Shared validation rules and constants for the frontend
 */

export const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#ff6b6b' },
  { name: 'Snacks', icon: '🍿', color: '#fcc419' },
  { name: 'Transportation', icon: '🚌', color: '#4dabf7' },
  { name: 'School', icon: '📚', color: '#20c997' },
  { name: 'Entertainment', icon: '🎬', color: '#845ef7' },
  { name: 'Shopping', icon: '🛍️', color: '#f06595' },
  { name: 'Gaming', icon: '🎮', color: '#7950f2' },
  { name: 'Subscriptions', icon: '🎧', color: '#339af0' },
  { name: 'Mobile/Internet', icon: '📱', color: '#15aabf' },
  { name: 'Health', icon: '💊', color: '#51cf66' },
  { name: 'Gifts', icon: '🎁', color: '#fa5252' },
  { name: 'Sports', icon: '⚽', color: '#ff922b' },
  { name: 'Travel', icon: '✈️', color: '#0ca678' },
  { name: 'Other', icon: '💳', color: '#868e96' }
];

export const PAYMENT_METHODS = [
  { name: 'Cash', icon: '💵' },
  { name: 'UPI', icon: '⚡' },
  { name: 'Debit Card', icon: '💳' },
  { name: 'Credit Card', icon: '🏦' },
  { name: 'Bank Transfer', icon: '🏛️' },
  { name: 'Other', icon: '✨' }
];

export const getCategoryMeta = (categoryName) => {
  return CATEGORIES.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase()) || {
    name: categoryName || 'Other',
    icon: '🏷️',
    color: '#6366f1'
  };
};

export const getPaymentMeta = (methodName) => {
  return PAYMENT_METHODS.find(m => m.name.toLowerCase() === (methodName || '').toLowerCase()) || {
    name: methodName || 'Cash',
    icon: '💳'
  };
};
