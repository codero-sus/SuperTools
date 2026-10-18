export interface UnitOption {
  id: string;
  name: string;
  factor: number; // Factor relative to standard base unit
  symbol?: string;
}

export interface UnitDimension {
  id: string;
  name: string;
  baseUnit: string;
  units: UnitOption[];
}

export const UNIT_DIMENSIONS: Record<string, UnitDimension> = {
  length: {
    id: 'length',
    name: 'Length & Distance',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meters (m)', factor: 1, symbol: 'm' },
      { id: 'km', name: 'Kilometers (km)', factor: 1000, symbol: 'km' },
      { id: 'cm', name: 'Centimeters (cm)', factor: 0.01, symbol: 'cm' },
      { id: 'mm', name: 'Millimeters (mm)', factor: 0.001, symbol: 'mm' },
      { id: 'in', name: 'Inches (in)', factor: 0.0254, symbol: 'in' },
      { id: 'ft', name: 'Feet (ft)', factor: 0.3048, symbol: 'ft' },
      { id: 'yd', name: 'Yards (yd)', factor: 0.9144, symbol: 'yd' },
      { id: 'mi', name: 'Miles (mi)', factor: 1609.344, symbol: 'mi' },
      { id: 'nmi', name: 'Nautical Miles', factor: 1852, symbol: 'nmi' }
    ]
  },
  weight: {
    id: 'weight',
    name: 'Weight & Mass',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilograms (kg)', factor: 1, symbol: 'kg' },
      { id: 'g', name: 'Grams (g)', factor: 0.001, symbol: 'g' },
      { id: 'mg', name: 'Milligrams (mg)', factor: 0.000001, symbol: 'mg' },
      { id: 'lb', name: 'Pounds (lb)', factor: 0.45359237, symbol: 'lb' },
      { id: 'oz', name: 'Ounces (oz)', factor: 0.028349523, symbol: 'oz' },
      { id: 'ton', name: 'Metric Tons (t)', factor: 1000, symbol: 't' },
      { id: 'stone', name: 'Stones (st)', factor: 6.35029318, symbol: 'st' }
    ]
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'c',
    units: [
      { id: 'c', name: 'Celsius (°C)', factor: 1, symbol: '°C' },
      { id: 'f', name: 'Fahrenheit (°F)', factor: 1, symbol: '°F' },
      { id: 'k', name: 'Kelvin (K)', factor: 1, symbol: 'K' },
      { id: 'r', name: 'Rankine (°R)', factor: 1, symbol: '°R' }
    ]
  },
  area: {
    id: 'area',
    name: 'Area',
    baseUnit: 'sqm',
    units: [
      { id: 'sqm', name: 'Square Meters (m²)', factor: 1, symbol: 'm²' },
      { id: 'sqkm', name: 'Square Kilometers (km²)', factor: 1000000, symbol: 'km²' },
      { id: 'sqft', name: 'Square Feet (ft²)', factor: 0.092903, symbol: 'ft²' },
      { id: 'sqin', name: 'Square Inches (in²)', factor: 0.00064516, symbol: 'in²' },
      { id: 'sqyd', name: 'Square Yards (yd²)', factor: 0.836127, symbol: 'yd²' },
      { id: 'acre', name: 'Acres', factor: 4046.8564, symbol: 'ac' },
      { id: 'hectare', name: 'Hectares (ha)', factor: 10000, symbol: 'ha' },
      { id: 'sqmi', name: 'Square Miles (mi²)', factor: 2589988.11, symbol: 'mi²' }
    ]
  },
  volume: {
    id: 'volume',
    name: 'Volume & Capacity',
    baseUnit: 'l',
    units: [
      { id: 'l', name: 'Liters (L)', factor: 1, symbol: 'L' },
      { id: 'ml', name: 'Milliliters (mL)', factor: 0.001, symbol: 'mL' },
      { id: 'm3', name: 'Cubic Meters (m³)', factor: 1000, symbol: 'm³' },
      { id: 'gal', name: 'US Gallons (gal)', factor: 3.78541, symbol: 'gal' },
      { id: 'qt', name: 'US Quarts (qt)', factor: 0.946353, symbol: 'qt' },
      { id: 'pt', name: 'US Pints (pt)', factor: 0.473176, symbol: 'pt' },
      { id: 'cup', name: 'US Cups', factor: 0.236588, symbol: 'cup' },
      { id: 'floz', name: 'US Fluid Ounces (fl oz)', factor: 0.0295735, symbol: 'fl oz' },
      { id: 'tbsp', name: 'Tablespoons (tbsp)', factor: 0.0147868, symbol: 'tbsp' },
      { id: 'tsp', name: 'Teaspoons (tsp)', factor: 0.00492892, symbol: 'tsp' }
    ]
  },
  speed: {
    id: 'speed',
    name: 'Speed & Velocity',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meters per Second (m/s)', factor: 1, symbol: 'm/s' },
      { id: 'kmh', name: 'Kilometers per Hour (km/h)', factor: 0.277778, symbol: 'km/h' },
      { id: 'mph', name: 'Miles per Hour (mph)', factor: 0.44704, symbol: 'mph' },
      { id: 'knot', name: 'Knots (kn)', factor: 0.514444, symbol: 'kn' },
      { id: 'fps', name: 'Feet per Second (ft/s)', factor: 0.3048, symbol: 'ft/s' },
      { id: 'mach', name: 'Mach (sea level)', factor: 340.29, symbol: 'Ma' }
    ]
  },
  time: {
    id: 'time',
    name: 'Time Duration',
    baseUnit: 's',
    units: [
      { id: 'ms', name: 'Milliseconds (ms)', factor: 0.001, symbol: 'ms' },
      { id: 's', name: 'Seconds (s)', factor: 1, symbol: 's' },
      { id: 'min', name: 'Minutes (min)', factor: 60, symbol: 'min' },
      { id: 'hr', name: 'Hours (hr)', factor: 3600, symbol: 'hr' },
      { id: 'day', name: 'Days', factor: 86400, symbol: 'day' },
      { id: 'week', name: 'Weeks', factor: 604800, symbol: 'wk' },
      { id: 'month', name: 'Months (30 days)', factor: 2592000, symbol: 'mo' },
      { id: 'year', name: 'Years (365.25 days)', factor: 31557600, symbol: 'yr' }
    ]
  },
  'digital-storage': {
    id: 'digital-storage',
    name: 'Digital Data Storage',
    baseUnit: 'B',
    units: [
      { id: 'b', name: 'Bits (b)', factor: 0.125, symbol: 'b' },
      { id: 'B', name: 'Bytes (B)', factor: 1, symbol: 'B' },
      { id: 'KB', name: 'Kilobytes (KB - 1,000 B)', factor: 1000, symbol: 'KB' },
      { id: 'KiB', name: 'Kibibytes (KiB - 1,024 B)', factor: 1024, symbol: 'KiB' },
      { id: 'MB', name: 'Megabytes (MB - 1,000 KB)', factor: 1000000, symbol: 'MB' },
      { id: 'MiB', name: 'Mebibytes (MiB - 1,024 KiB)', factor: 1048576, symbol: 'MiB' },
      { id: 'GB', name: 'Gigabytes (GB - 1,000 MB)', factor: 1000000000, symbol: 'GB' },
      { id: 'GiB', name: 'Gibibytes (GiB - 1,024 MiB)', factor: 1073741824, symbol: 'GiB' },
      { id: 'TB', name: 'Terabytes (TB)', factor: 1000000000000, symbol: 'TB' },
      { id: 'TiB', name: 'Tebibytes (TiB)', factor: 1099511627776, symbol: 'TiB' }
    ]
  },
  'data-transfer': {
    id: 'data-transfer',
    name: 'Data Transfer Rate',
    baseUnit: 'bps',
    units: [
      { id: 'bps', name: 'Bits per second (bps)', factor: 1, symbol: 'bps' },
      { id: 'Kbps', name: 'Kilobits per second (Kbps)', factor: 1000, symbol: 'Kbps' },
      { id: 'Mbps', name: 'Megabits per second (Mbps)', factor: 1000000, symbol: 'Mbps' },
      { id: 'Gbps', name: 'Gigabits per second (Gbps)', factor: 1000000000, symbol: 'Gbps' },
      { id: 'Bps', name: 'Bytes per second (B/s)', factor: 8, symbol: 'B/s' },
      { id: 'KBps', name: 'Kilobytes per second (KB/s)', factor: 8000, symbol: 'KB/s' },
      { id: 'MBps', name: 'Megabytes per second (MB/s)', factor: 8000000, symbol: 'MB/s' },
      { id: 'GBps', name: 'Gigabytes per second (GB/s)', factor: 8000000000, symbol: 'GB/s' }
    ]
  },
  pressure: {
    id: 'pressure',
    name: 'Pressure',
    baseUnit: 'pa',
    units: [
      { id: 'pa', name: 'Pascals (Pa)', factor: 1, symbol: 'Pa' },
      { id: 'kpa', name: 'Kilopascals (kPa)', factor: 1000, symbol: 'kPa' },
      { id: 'bar', name: 'Bar', factor: 100000, symbol: 'bar' },
      { id: 'mbar', name: 'Millibar (mbar)', factor: 100, symbol: 'mbar' },
      { id: 'psi', name: 'Pounds per Square Inch (PSI)', factor: 6894.757, symbol: 'psi' },
      { id: 'atm', name: 'Standard Atmospheres (atm)', factor: 101325, symbol: 'atm' },
      { id: 'torr', name: 'Torr / mmHg', factor: 133.322, symbol: 'mmHg' }
    ]
  },
  energy: {
    id: 'energy',
    name: 'Energy & Work',
    baseUnit: 'j',
    units: [
      { id: 'j', name: 'Joules (J)', factor: 1, symbol: 'J' },
      { id: 'kj', name: 'Kilojoules (kJ)', factor: 1000, symbol: 'kJ' },
      { id: 'cal', name: 'Gram Calories (cal)', factor: 4.184, symbol: 'cal' },
      { id: 'kcal', name: 'Kilocalories / Food Calories (kcal)', factor: 4184, symbol: 'kcal' },
      { id: 'wh', name: 'Watt-hours (Wh)', factor: 3600, symbol: 'Wh' },
      { id: 'kwh', name: 'Kilowatt-hours (kWh)', factor: 3600000, symbol: 'kWh' },
      { id: 'btu', name: 'British Thermal Units (BTU)', factor: 1055.06, symbol: 'BTU' },
      { id: 'ev', name: 'Electronvolts (eV)', factor: 1.602176634e-19, symbol: 'eV' }
    ]
  },
  power: {
    id: 'power',
    name: 'Power',
    baseUnit: 'w',
    units: [
      { id: 'w', name: 'Watts (W)', factor: 1, symbol: 'W' },
      { id: 'kw', name: 'Kilowatts (kW)', factor: 1000, symbol: 'kW' },
      { id: 'mw', name: 'Megawatts (MW)', factor: 1000000, symbol: 'MW' },
      { id: 'hp', name: 'Mechanical Horsepower (HP)', factor: 745.69987, symbol: 'HP' },
      { id: 'btuh', name: 'BTU per hour (BTU/hr)', factor: 0.293071, symbol: 'BTU/hr' }
    ]
  },
  angle: {
    id: 'angle',
    name: 'Angle',
    baseUnit: 'deg',
    units: [
      { id: 'deg', name: 'Degrees (°)', factor: 1, symbol: '°' },
      { id: 'rad', name: 'Radians (rad)', factor: 180 / Math.PI, symbol: 'rad' },
      { id: 'grad', name: 'Gradians (grad)', factor: 0.9, symbol: 'grad' },
      { id: 'arcmin', name: 'Arcminutes (arcmin)', factor: 1 / 60, symbol: '′' },
      { id: 'arcsec', name: 'Arcseconds (arcsec)', factor: 1 / 3600, symbol: '″' }
    ]
  },
  'fuel-economy': {
    id: 'fuel-economy',
    name: 'Fuel Economy',
    baseUnit: 'mpg_us',
    units: [
      { id: 'mpg_us', name: 'Miles per Gallon (US)', factor: 1, symbol: 'MPG US' },
      { id: 'mpg_uk', name: 'Miles per Gallon (UK)', factor: 1.20095, symbol: 'MPG UK' },
      { id: 'kml', name: 'Kilometers per Liter (km/L)', factor: 0.425144, symbol: 'km/L' }
    ]
  },
  cooking: {
    id: 'cooking',
    name: 'Cooking & Recipe Units',
    baseUnit: 'ml',
    units: [
      { id: 'ml', name: 'Milliliters (ml)', factor: 1, symbol: 'ml' },
      { id: 'cup', name: 'Cups (US)', factor: 236.588, symbol: 'cup' },
      { id: 'tbsp', name: 'Tablespoons (tbsp)', factor: 14.7868, symbol: 'tbsp' },
      { id: 'tsp', name: 'Teaspoons (tsp)', factor: 4.92892, symbol: 'tsp' },
      { id: 'floz', name: 'Fluid Ounces (fl oz)', factor: 29.5735, symbol: 'fl oz' },
      { id: 'pinch', name: 'Pinches (1/16 tsp)', factor: 0.308, symbol: 'pinch' }
    ]
  },
  typography: {
    id: 'typography',
    name: 'Typography (px, rem, pt, em)',
    baseUnit: 'px',
    units: [
      { id: 'px', name: 'Pixels (px)', factor: 1, symbol: 'px' },
      { id: 'rem', name: 'Root REM (base 16px)', factor: 16, symbol: 'rem' },
      { id: 'em', name: 'EM (base 16px)', factor: 16, symbol: 'em' },
      { id: 'pt', name: 'Points (pt - 1/72 in)', factor: 1.33333, symbol: 'pt' }
    ]
  }
};
