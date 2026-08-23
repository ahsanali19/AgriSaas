// src/context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
    hi: string;
  };
}

export const translations: Translations = {
  appName: { en: 'AgriSaaS', ur: 'ایگری ساس', hi: 'एग्री सास' },
  tagline: { en: 'Livestock, Poultry & Fish Farm ERP', ur: 'ڈیری، پولٹری اور مچھلی فارم منیجر', hi: 'डेयरी, पोल्ट्री और मछली फार्म प्रबंधक' },
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ', hi: 'डैशबोर्ड' },
  dairy: { en: 'Dairy & Livestock', ur: 'ڈیری و لائیو اسٹاک', hi: 'डेयरी व पशुपालन' },
  poultry: { en: 'Poultry Farm', ur: 'پولٹری فارم', hi: 'पोल्ट्री फार्म' },
  fish: { en: 'Fish Aquaculture', ur: 'مچھلی فارمنگ', hi: 'मत्स्य पालन' },
  khata: { en: 'Master Khata (Ledger)', ur: 'کھاتہ / کیش بک', hi: 'खाता / बहीखाता' },
  subscriptions: { en: 'Subscription & Tier', ur: 'پلان اور اپ گریڈ', hi: 'सब्सक्रिप्शन प्लान' },
  freeTier: { en: 'Free Kisan Tier', ur: 'مفت کسان پلان', hi: 'मुफ्त किसान प्लान' },
  proTier: { en: 'AgriSaaS Pro', ur: 'ایگری ساس پرو', hi: 'एग्री सास प्रो' },
  upgradeToPro: { en: 'Upgrade to Pro', ur: 'پرو حاصل کریں', hi: 'प्रो अपग्रेड करें' },
  totalAnimals: { en: 'Total Animals', ur: 'کل مویشی', hi: 'कुल पशु' },
  dailyMilk: { en: 'Today\'s Milk Yield', ur: 'آج کا کل دودھ', hi: 'आज का कुल दूध' },
  activeFlocks: { en: 'Active Poultry Flocks', ur: 'ایکٹو پولٹری فلاک', hi: 'सक्रिय पोल्ट्री झुंड' },
  totalBirds: { en: 'Total Live Birds', ur: 'کل زندہ مرغیاں', hi: 'कुल जीवित मुर्गियां' },
  activePonds: { en: 'Active Fish Ponds', ur: 'فعال مچھلی تالاب', hi: 'सक्रिय मछली तालाब' },
  monthlyRevenue: { en: 'Monthly Income', ur: 'ماہانہ آمدن', hi: 'मासिक आय' },
  monthlyExpense: { en: 'Monthly Expenses', ur: 'ماہانہ اخراجات', hi: 'मासिक खर्च' },
  netProfit: { en: 'Net Profit / Loss', ur: 'خالص منافع / نقصان', hi: 'शुद्ध लाभ / हानि' },
  addAnimal: { en: 'Add Animal', ur: 'نیا جانور شامل کریں', hi: 'नया पशु जोड़ें' },
  logMilk: { en: 'Log Daily Milk', ur: 'روزانہ دودھ درج کریں', hi: 'दूध दर्ज करें' },
  addBatch: { en: 'New Poultry Batch', ur: 'نیا پولٹری فلاک', hi: 'नया बैच जोड़ें' },
  logMortalityFeed: { en: 'Log Feed & Mortality', ur: 'خوراک و اموات درج کریں', hi: 'खुराक व मृत्यु दर्ज करें' },
  addPond: { en: 'New Fish Pond', ur: 'نیا تالاب بنائیں', hi: 'नया तालाब बनाएं' },
  addTransaction: { en: 'Add Khata Entry', ur: 'کھاتہ انٹری کریں', hi: 'खाता प्रविष्टि करें' },
  quotaWarning: { en: 'Tier Limit Reached', ur: 'پلان کی حد ختم ہو گئی', hi: 'सीमा समाप्त हो गई' },
  quotaMessage: { en: 'You have reached the maximum free limit for this module.', ur: 'آپ نے مفت پلان کی حد مکمل کر لی ہے۔', hi: 'आपने इस मॉड्यूल के लिए अधिकतम मुफ्त सीमा पार कर ली है।' }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
