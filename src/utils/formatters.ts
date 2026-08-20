// src/utils/formatters.ts

const CURRENCY_SYMBOLS: Record<string, string> = {
  PKR: '₨',
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED',
  SAR: 'SAR',
  CAD: 'CA$',
  AUD: 'AU$',
  BDT: '৳'
};

export function formatCurrency(amount: number, currency: string = 'PKR'): string {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || currency;
  return `${symbol} ${Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function calculateFCR(totalFeedKg: number, totalLiveWeightGrams: number, initialWeightGrams: number = 40): number {
  const weightGainKg = (totalLiveWeightGrams - initialWeightGrams) / 1000;
  if (weightGainKg <= 0) return 0;
  return Number((totalFeedKg / weightGainKg).toFixed(2));
}
