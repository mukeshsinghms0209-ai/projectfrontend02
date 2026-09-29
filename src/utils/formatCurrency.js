/**
 * Format numeric value as Indian Rupee (₹) or standard currency string
 * @param {number|string} amount 
 * @param {boolean} showDecimals
 * @returns {string} Formatted currency string (e.g. ₹1,250 or ₹1,250.50)
 */
export const formatCurrency = (amount, showDecimals = false) => {
  const num = Number(amount) || 0;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  }).format(num);
};

export const formatCompactCurrency = (amount) => {
  const num = Number(amount) || 0;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
  return `₹${num}`;
};
