// Format currency with Indian Rupee default or other international currencies
export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount) || 0;

  let locale = 'en-IN';
  if (currency === 'USD') locale = 'en-US';
  if (currency === 'EUR') locale = 'de-DE';
  if (currency === 'GBP') locale = 'en-GB';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (err) {
    // Fallback if currency symbol fails
    return `₹${num.toLocaleString('en-IN')}`;
  }
};

// Format standard date
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format percentage
export const formatPercent = (num) => {
  const val = Number(num) || 0;
  return `${Math.round(val)}%`;
};
