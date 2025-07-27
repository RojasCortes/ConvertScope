export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export const currencies: Currency[] = [
  // Major currencies
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  
  // Popular currencies
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺' },
  
  // Americas
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'ARS', name: 'Argentine Peso', flag: '🇦🇷' },
  { code: 'CLP', name: 'Chilean Peso', flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso', flag: '🇨🇴' },
  { code: 'PEN', name: 'Peruvian Sol', flag: '🇵🇪' },
  
  // Asia Pacific
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
  { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
  
  // Middle East & Africa
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
  
  // Europe
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
  { code: 'RON', name: 'Romanian Leu', flag: '🇷🇴' },
  { code: 'BGN', name: 'Bulgarian Lev', flag: '🇧🇬' },
  { code: 'HRK', name: 'Croatian Kuna', flag: '🇭🇷' },
  
  // Cryptocurrencies
  { code: 'BTC', name: 'Bitcoin', flag: '₿' },
  { code: 'ETH', name: 'Ethereum', flag: 'Ξ' },
  { code: 'BNB', name: 'Binance Coin', flag: '🔶' },
  { code: 'ADA', name: 'Cardano', flag: '🔷' },
  { code: 'DOT', name: 'Polkadot', flag: '⚫' },
  { code: 'XRP', name: 'Ripple', flag: '◊' },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find(currency => currency.code === code);
};

export const getMajorCurrencies = (): Currency[] => {
  const majorCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];
  return currencies.filter(currency => majorCodes.includes(currency.code));
};

export const getCryptocurrencies = (): Currency[] => {
  const cryptoCodes = ['BTC', 'ETH', 'BNB', 'ADA', 'DOT', 'XRP'];
  return currencies.filter(currency => cryptoCodes.includes(currency.code));
};
