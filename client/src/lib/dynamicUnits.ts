import { Category, Unit } from './conversions';
import { useTranslation } from '@/hooks/useTranslation';

// Base data in both languages
const categoriesData = {
  es: [
    { id: 'currency', emoji: '💰', name: 'Divisas', description: '170+ monedas' },
    { id: 'length', emoji: '📏', name: 'Longitud', description: 'Metros, pies, etc.' },
    { id: 'weight', emoji: '⚖️', name: 'Peso', description: 'Kg, libras, etc.' },
    { id: 'temperature', emoji: '🌡️', name: 'Temperatura', description: '°C, °F, K' },
    { id: 'time', emoji: '⏱️', name: 'Tiempo', description: 'Horas, días, etc.' },
    { id: 'speed', emoji: '🚗', name: 'Velocidad', description: 'km/h, mph, etc.' },
    { id: 'data', emoji: '📱', name: 'Datos', description: 'MB, GB, TB' },
    { id: 'energy', emoji: '⚡', name: 'Energía', description: 'Calorías, julios' },
    { id: 'area', emoji: '📐', name: 'Área', description: 'm², hectáreas' },
  ],
  en: [
    { id: 'currency', emoji: '💰', name: 'Currency', description: '170+ currencies' },
    { id: 'length', emoji: '📏', name: 'Length', description: 'Meters, feet, etc.' },
    { id: 'weight', emoji: '⚖️', name: 'Weight', description: 'Kg, pounds, etc.' },
    { id: 'temperature', emoji: '🌡️', name: 'Temperature', description: '°C, °F, K' },
    { id: 'time', emoji: '⏱️', name: 'Time', description: 'Hours, days, etc.' },
    { id: 'speed', emoji: '🚗', name: 'Speed', description: 'km/h, mph, etc.' },
    { id: 'data', emoji: '📱', name: 'Data', description: 'MB, GB, TB' },
    { id: 'energy', emoji: '⚡', name: 'Energy', description: 'Calories, joules' },
    { id: 'area', emoji: '📐', name: 'Area', description: 'm², hectares' },
  ]
};

const unitsData = {
  es: [
    // Length
    { id: 'm', name: 'Metro', symbol: 'm', toBase: 1, category: 'length' },
    { id: 'km', name: 'Kilómetro', symbol: 'km', toBase: 1000, category: 'length' },
    { id: 'cm', name: 'Centímetro', symbol: 'cm', toBase: 0.01, category: 'length' },
    { id: 'mm', name: 'Milímetro', symbol: 'mm', toBase: 0.001, category: 'length' },
    { id: 'ft', name: 'Pie', symbol: 'ft', toBase: 0.3048, category: 'length' },
    { id: 'in', name: 'Pulgada', symbol: 'in', toBase: 0.0254, category: 'length' },
    { id: 'yd', name: 'Yarda', symbol: 'yd', toBase: 0.9144, category: 'length' },
    { id: 'mi', name: 'Milla', symbol: 'mi', toBase: 1609.344, category: 'length' },
    { id: 'nmi', name: 'Milla náutica', symbol: 'nmi', toBase: 1852, category: 'length' },

    // Weight
    { id: 'kg', name: 'Kilogramo', symbol: 'kg', toBase: 1, category: 'weight' },
    { id: 'g', name: 'Gramo', symbol: 'g', toBase: 0.001, category: 'weight' },
    { id: 'mg', name: 'Miligramo', symbol: 'mg', toBase: 0.000001, category: 'weight' },
    { id: 'lb', name: 'Libra', symbol: 'lb', toBase: 0.453592, category: 'weight' },
    { id: 'oz', name: 'Onza', symbol: 'oz', toBase: 0.0283495, category: 'weight' },
    { id: 't', name: 'Tonelada', symbol: 't', toBase: 1000, category: 'weight' },
    { id: 'st', name: 'Stone', symbol: 'st', toBase: 6.35029, category: 'weight' },

    // Temperature
    { id: 'c', name: 'Celsius', symbol: '°C', toBase: 1, category: 'temperature' },
    { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: 1, category: 'temperature' },
    { id: 'k', name: 'Kelvin', symbol: 'K', toBase: 1, category: 'temperature' },

    // Time
    { id: 's', name: 'Segundo', symbol: 's', toBase: 1, category: 'time' },
    { id: 'min', name: 'Minuto', symbol: 'min', toBase: 60, category: 'time' },
    { id: 'h', name: 'Hora', symbol: 'h', toBase: 3600, category: 'time' },
    { id: 'd', name: 'Día', symbol: 'd', toBase: 86400, category: 'time' },
    { id: 'w', name: 'Semana', symbol: 'sem', toBase: 604800, category: 'time' },
    { id: 'month', name: 'Mes', symbol: 'mes', toBase: 2629746, category: 'time' },
    { id: 'y', name: 'Año', symbol: 'año', toBase: 31556952, category: 'time' },

    // Speed
    { id: 'mps', name: 'Metro por segundo', symbol: 'm/s', toBase: 1, category: 'speed' },
    { id: 'kmh', name: 'Kilómetro por hora', symbol: 'km/h', toBase: 0.277778, category: 'speed' },
    { id: 'mph', name: 'Milla por hora', symbol: 'mph', toBase: 0.44704, category: 'speed' },
    { id: 'fps', name: 'Pie por segundo', symbol: 'ft/s', toBase: 0.3048, category: 'speed' },
    { id: 'knot', name: 'Nudo', symbol: 'kn', toBase: 0.514444, category: 'speed' },

    // Data
    { id: 'byte', name: 'Byte', symbol: 'B', toBase: 1, category: 'data' },
    { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: 1024, category: 'data' },
    { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: 1048576, category: 'data' },
    { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: 1073741824, category: 'data' },
    { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: 1099511627776, category: 'data' },
    { id: 'pb', name: 'Petabyte', symbol: 'PB', toBase: 1125899906842624, category: 'data' },
    { id: 'bit', name: 'Bit', symbol: 'bit', toBase: 0.125, category: 'data' },

    // Energy
    { id: 'j', name: 'Julio', symbol: 'J', toBase: 1, category: 'energy' },
    { id: 'kj', name: 'Kilojulio', symbol: 'kJ', toBase: 1000, category: 'energy' },
    { id: 'cal', name: 'Caloría', symbol: 'cal', toBase: 4.184, category: 'energy' },
    { id: 'kcal', name: 'Kilocaloría', symbol: 'kcal', toBase: 4184, category: 'energy' },
    { id: 'kwh', name: 'Kilovatio-hora', symbol: 'kWh', toBase: 3600000, category: 'energy' },
    { id: 'btu', name: 'BTU', symbol: 'BTU', toBase: 1055.06, category: 'energy' },

    // Area
    { id: 'm2', name: 'Metro cuadrado', symbol: 'm²', toBase: 1, category: 'area' },
    { id: 'km2', name: 'Kilómetro cuadrado', symbol: 'km²', toBase: 1000000, category: 'area' },
    { id: 'cm2', name: 'Centímetro cuadrado', symbol: 'cm²', toBase: 0.0001, category: 'area' },
    { id: 'ft2', name: 'Pie cuadrado', symbol: 'ft²', toBase: 0.092903, category: 'area' },
    { id: 'in2', name: 'Pulgada cuadrada', symbol: 'in²', toBase: 0.00064516, category: 'area' },
    { id: 'ha', name: 'Hectárea', symbol: 'ha', toBase: 10000, category: 'area' },
    { id: 'acre', name: 'Acre', symbol: 'acre', toBase: 4046.86, category: 'area' },
  ],
  en: [
    // Length
    { id: 'm', name: 'Meter', symbol: 'm', toBase: 1, category: 'length' },
    { id: 'km', name: 'Kilometer', symbol: 'km', toBase: 1000, category: 'length' },
    { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: 0.01, category: 'length' },
    { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: 0.001, category: 'length' },
    { id: 'ft', name: 'Foot', symbol: 'ft', toBase: 0.3048, category: 'length' },
    { id: 'in', name: 'Inch', symbol: 'in', toBase: 0.0254, category: 'length' },
    { id: 'yd', name: 'Yard', symbol: 'yd', toBase: 0.9144, category: 'length' },
    { id: 'mi', name: 'Mile', symbol: 'mi', toBase: 1609.344, category: 'length' },
    { id: 'nmi', name: 'Nautical mile', symbol: 'nmi', toBase: 1852, category: 'length' },

    // Weight
    { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: 1, category: 'weight' },
    { id: 'g', name: 'Gram', symbol: 'g', toBase: 0.001, category: 'weight' },
    { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: 0.000001, category: 'weight' },
    { id: 'lb', name: 'Pound', symbol: 'lb', toBase: 0.453592, category: 'weight' },
    { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: 0.0283495, category: 'weight' },
    { id: 't', name: 'Ton', symbol: 't', toBase: 1000, category: 'weight' },
    { id: 'st', name: 'Stone', symbol: 'st', toBase: 6.35029, category: 'weight' },

    // Temperature
    { id: 'c', name: 'Celsius', symbol: '°C', toBase: 1, category: 'temperature' },
    { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: 1, category: 'temperature' },
    { id: 'k', name: 'Kelvin', symbol: 'K', toBase: 1, category: 'temperature' },

    // Time
    { id: 's', name: 'Second', symbol: 's', toBase: 1, category: 'time' },
    { id: 'min', name: 'Minute', symbol: 'min', toBase: 60, category: 'time' },
    { id: 'h', name: 'Hour', symbol: 'h', toBase: 3600, category: 'time' },
    { id: 'd', name: 'Day', symbol: 'd', toBase: 86400, category: 'time' },
    { id: 'w', name: 'Week', symbol: 'wk', toBase: 604800, category: 'time' },
    { id: 'month', name: 'Month', symbol: 'mo', toBase: 2629746, category: 'time' },
    { id: 'y', name: 'Year', symbol: 'yr', toBase: 31556952, category: 'time' },

    // Speed
    { id: 'mps', name: 'Meter per second', symbol: 'm/s', toBase: 1, category: 'speed' },
    { id: 'kmh', name: 'Kilometer per hour', symbol: 'km/h', toBase: 0.277778, category: 'speed' },
    { id: 'mph', name: 'Mile per hour', symbol: 'mph', toBase: 0.44704, category: 'speed' },
    { id: 'fps', name: 'Foot per second', symbol: 'ft/s', toBase: 0.3048, category: 'speed' },
    { id: 'knot', name: 'Knot', symbol: 'kn', toBase: 0.514444, category: 'speed' },

    // Data
    { id: 'byte', name: 'Byte', symbol: 'B', toBase: 1, category: 'data' },
    { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: 1024, category: 'data' },
    { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: 1048576, category: 'data' },
    { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: 1073741824, category: 'data' },
    { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: 1099511627776, category: 'data' },
    { id: 'pb', name: 'Petabyte', symbol: 'PB', toBase: 1125899906842624, category: 'data' },
    { id: 'bit', name: 'Bit', symbol: 'bit', toBase: 0.125, category: 'data' },

    // Energy
    { id: 'j', name: 'Joule', symbol: 'J', toBase: 1, category: 'energy' },
    { id: 'kj', name: 'Kilojoule', symbol: 'kJ', toBase: 1000, category: 'energy' },
    { id: 'cal', name: 'Calorie', symbol: 'cal', toBase: 4.184, category: 'energy' },
    { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', toBase: 4184, category: 'energy' },
    { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', toBase: 3600000, category: 'energy' },
    { id: 'btu', name: 'BTU', symbol: 'BTU', toBase: 1055.06, category: 'energy' },

    // Area
    { id: 'm2', name: 'Square meter', symbol: 'm²', toBase: 1, category: 'area' },
    { id: 'km2', name: 'Square kilometer', symbol: 'km²', toBase: 1000000, category: 'area' },
    { id: 'cm2', name: 'Square centimeter', symbol: 'cm²', toBase: 0.0001, category: 'area' },
    { id: 'ft2', name: 'Square foot', symbol: 'ft²', toBase: 0.092903, category: 'area' },
    { id: 'in2', name: 'Square inch', symbol: 'in²', toBase: 0.00064516, category: 'area' },
    { id: 'ha', name: 'Hectare', symbol: 'ha', toBase: 10000, category: 'area' },
    { id: 'acre', name: 'Acre', symbol: 'acre', toBase: 4046.86, category: 'area' },
  ]
};

export function useLocalizedCategories(): Category[] {
  const { language } = useTranslation();
  return categoriesData[language as keyof typeof categoriesData] || categoriesData.es;
}

export function useLocalizedUnits(): Unit[] {
  const { language } = useTranslation();
  return unitsData[language as keyof typeof unitsData] || unitsData.es;
}

export function getLocalizedUnitsForCategory(categoryId: string): Unit[] {
  const units = useLocalizedUnits();
  return units.filter(unit => unit.category === categoryId);
}