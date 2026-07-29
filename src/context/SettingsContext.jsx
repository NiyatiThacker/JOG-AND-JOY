import React, { createContext, useContext } from 'react';
import { useSettings } from '../queries/useSettings';
import { format } from 'date-fns';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { data: settings, isLoading } = useSettings();

  const formatCurrency = (amount) => {
    if (isLoading || !settings) return `₹${amount}`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: settings.currency || 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return format(new Date(isoString), 'MMM dd, yyyy');
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, formatCurrency, formatDate }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettingsContext must be used within SettingsProvider');
  return ctx;
}
