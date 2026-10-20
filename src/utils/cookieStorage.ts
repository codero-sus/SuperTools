// Client-Side Cookie Storage & Settings Synchronization Utility
// Provides RFC 6265 compliant cookie operations to mirror and preserve user settings,
// hardware scaling preferences, and AI model configurations across browser sessions.

export const COOKIE_EXPIRY_DAYS = 365;

/**
 * Retrieves the string value of a cookie by name.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = encodeURIComponent(name) + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

/**
 * Sets a cookie with specified name, value, expiration in days, and optional SameSite policy.
 */
export function setCookie(
  name: string,
  value: string,
  days: number = COOKIE_EXPIRY_DAYS,
  path: string = '/'
): void {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value || '')}${expires}; path=${path}; SameSite=Lax`;
}

/**
 * Deletes a cookie by setting its expiration date to the past.
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax`;
}

/**
 * Returns a dictionary of all accessible cookies.
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  const cookies: Record<string, string> = {};
  if (!document.cookie) return cookies;
  const list = document.cookie.split(';');
  for (let i = 0; i < list.length; i++) {
    const parts = list[i].split('=');
    const name = parts[0]?.trim();
    if (name) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(parts.slice(1).join('='));
    }
  }
  return cookies;
}

// Canonical keys for SuperTools settings and AI configuration
export const SUPERTOOLS_SETTINGS_KEYS = [
  'supertools_hw_level',
  'supertools_hw_auto',
  'supertools_ram_budget',
  'supertools_res_cap',
  'supertools_workers',
  'supertools_theme',
  'supertools_ambient',
  'supertools_cookies_enabled',
  'supertools_ocr_default_model',
  'supertools_ocr_lang',
  'supertools_bg_precision',
  'supertools_upscale_factor',
  'supertools_scanner_filter',
  'supertools_doc_model',
  'supertools_redact_model',
  'supertools_summary_model',
  'supertools_colorize_model',
  'supertools_palette_model',
  'supertools_speech_lang'
] as const;

/**
 * Synchronizes all current settings from localStorage into browser cookies.
 */
export function syncSettingsToCookies(): void {
  if (typeof window === 'undefined') return;
  try {
    SUPERTOOLS_SETTINGS_KEYS.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val !== null && val !== undefined) {
        setCookie(key, val, COOKIE_EXPIRY_DAYS);
      }
    });
    setCookie('supertools_settings_synced', new Date().toISOString(), COOKIE_EXPIRY_DAYS);
  } catch (err) {
    console.warn('[SuperTools Cookie Storage] Failed to sync settings to cookies:', err);
  }
}

/**
 * Synchronizes any stored cookies back into localStorage (e.g. on new domain/session).
 */
export function syncCookiesToSettings(): void {
  if (typeof window === 'undefined') return;
  try {
    SUPERTOOLS_SETTINGS_KEYS.forEach((key) => {
      const cookieVal = getCookie(key);
      const localVal = localStorage.getItem(key);
      // If cookie exists and localStorage is empty or differs, restore from cookie
      if (cookieVal !== null && localVal === null) {
        localStorage.setItem(key, cookieVal);
      }
    });
  } catch (err) {
    console.warn('[SuperTools Cookie Storage] Failed to sync cookies to settings:', err);
  }
}

/**
 * Initializes bidirectional settings persistence on application boot.
 */
export function initSettingsPersistence(): void {
  // 1. Recover missing settings from cookies if available
  syncCookiesToSettings();
  // 2. Ensure current state is saved to cookies for future sessions
  syncSettingsToCookies();
}

/**
 * Clears all SuperTools-specific cookies from the browser.
 */
export function clearAllSuperToolsCookies(): void {
  SUPERTOOLS_SETTINGS_KEYS.forEach((key) => {
    deleteCookie(key);
  });
  deleteCookie('supertools_settings_synced');
}
