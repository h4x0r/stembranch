import type { WesternZodiacSign, WesternZodiacResult } from './types';

interface ZodiacEntry {
  sign: WesternZodiacSign;
  symbol: string;
  chineseName: string;
  element: string;
  startMonth: number;
  startDay: number;
}

/**
 * Western zodiac signs with their approximate date boundaries.
 * Ordered by calendar appearance (Capricorn starts ~Dec 22).
 * The actual boundaries vary by ±1 day depending on year.
 */
const ZODIAC_DATA: ZodiacEntry[] = [
  { sign: 'Capricorn', symbol: '♑', chineseName: '摩羯座', element: 'Earth', startMonth: 12, startDay: 22 },
  { sign: 'Aquarius', symbol: '♒', chineseName: '水瓶座', element: 'Air', startMonth: 1, startDay: 20 },
  { sign: 'Pisces', symbol: '♓', chineseName: '雙魚座', element: 'Water', startMonth: 2, startDay: 19 },
  { sign: 'Aries', symbol: '♈', chineseName: '白羊座', element: 'Fire', startMonth: 3, startDay: 21 },
  { sign: 'Taurus', symbol: '♉', chineseName: '金牛座', element: 'Earth', startMonth: 4, startDay: 20 },
  { sign: 'Gemini', symbol: '♊', chineseName: '雙子座', element: 'Air', startMonth: 5, startDay: 21 },
  { sign: 'Cancer', symbol: '♋', chineseName: '巨蟹座', element: 'Water', startMonth: 6, startDay: 21 },
  { sign: 'Leo', symbol: '♌', chineseName: '獅子座', element: 'Fire', startMonth: 7, startDay: 23 },
  { sign: 'Virgo', symbol: '♍', chineseName: '處女座', element: 'Earth', startMonth: 8, startDay: 23 },
  { sign: 'Libra', symbol: '♎', chineseName: '天秤座', element: 'Air', startMonth: 9, startDay: 23 },
  { sign: 'Scorpio', symbol: '♏', chineseName: '天蠍座', element: 'Water', startMonth: 10, startDay: 23 },
  { sign: 'Sagittarius', symbol: '♐', chineseName: '射手座', element: 'Fire', startMonth: 11, startDay: 22 },
];

/**
 * Get the Western zodiac (太陽星座) sign for a given date.
 * Based on the Sun's position in the zodiac on that date.
 *
 * @param date - Date to determine zodiac for
 * @returns Western zodiac result with sign, symbol, Chinese name, and element
 */
export function getWesternZodiac(date: Date): WesternZodiacResult {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const md = month * 100 + day;

  // Capricorn wraps around Dec 22 → Jan 19
  if (md >= 1222 || md < 120) {
    return pick(ZODIAC_DATA[0]);
  }

  // Find the matching sign by walking backward from December
  for (let i = ZODIAC_DATA.length - 1; i >= 1; i--) {
    const entry = ZODIAC_DATA[i];
    const entryMd = entry.startMonth * 100 + entry.startDay;
    if (md >= entryMd) {
      return pick(entry);
    }
  }

  // Should not reach here, but default to Capricorn
  return pick(ZODIAC_DATA[0]);
}

function pick(entry: ZodiacEntry): WesternZodiacResult {
  return {
    sign: entry.sign,
    symbol: entry.symbol,
    chineseName: entry.chineseName,
    element: entry.element,
  };
}
