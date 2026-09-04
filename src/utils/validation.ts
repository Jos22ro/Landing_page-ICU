/**
 * Utility functions for form validation across the ICU Eventos application.
 * Enforces:
 * 1. Email contains '@' and has a valid email format.
 * 2. No empty required fields.
 * 3. Period fields: 'desde' cannot be greater than 'hasta'.
 */

export const validateEmail = (email: string): { isValid: boolean; error: string | null } => {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'El correo electrónico no puede estar vacío' };
  }
  if (!trimmed.includes('@')) {
    return { isValid: false, error: "El correo electrónico debe contener el carácter '@'" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Ingresa un formato de correo válido (ej. usuario@dominio.com)' };
  }
  return { isValid: true, error: null };
};

export const validateNotEmpty = (value: string, fieldName = 'Este campo'): { isValid: boolean; error: string | null } => {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} no puede estar vacío` };
  }
  return { isValid: true, error: null };
};

export interface PeriodValidationOptions {
  /** If false (default), neither 'desde' nor 'hasta' can be in the future beyond current date/year */
  allowFuture?: boolean;
  /** Maximum allowable difference in years between start and end. Default: 50 */
  maxSpanYears?: number;
  /** Maximum number of years in the past relative to current year. Default: 50 (límite razonable de vida laboral activa) */
  maxPastYears?: number;
}

export const extractYearFromStr = (str: string): number | null => {
  if (!str) return null;
  const trimmed = str.trim().toLowerCase();
  if (/^(presente|actual|actualidad|hoy|en curso)$/.test(trimmed)) {
    return new Date().getFullYear();
  }
  if (trimmed.includes('años 20') || trimmed.includes('los 20') || trimmed === '20s') {
    return 1920;
  }
  // 4 digits year like 1920, 2024, 2026
  const match4 = trimmed.match(/\b(18\d{2}|19\d{2}|20\d{2}|21\d{2})\b/);
  if (match4) {
    return parseInt(match4[1], 10);
  }
  const any4 = trimmed.match(/\b(\d{4})\b/);
  if (any4) {
    return parseInt(any4[1], 10);
  }
  // 2-digit number (e.g. "20" for the 1920s or 20)
  const directNum = parseInt(trimmed, 10);
  if (!isNaN(directNum) && directNum > 0) {
    if (directNum < 100) {
      return directNum === 20 ? 1920 : (directNum <= 30 ? 2000 + directNum : 1900 + directNum);
    }
    return directNum;
  }
  const dateObj = new Date(trimmed);
  if (!isNaN(dateObj.getTime())) {
    return dateObj.getFullYear();
  }
  return null;
};

export const validatePeriod = (
  desde: string,
  hasta: string,
  options: PeriodValidationOptions = {}
): { isValid: boolean; error: string | null } => {
  const {
    allowFuture = false,
    maxSpanYears = 50,
    maxPastYears = 50,
  } = options;

  const d = (desde || '').trim();
  const h = (hasta || '').trim();

  if (!d && !h) {
    return { isValid: false, error: 'Los campos de período (Desde y Hasta) no pueden estar vacíos' };
  }
  if (!d) {
    return { isValid: false, error: "La fecha 'Desde' no puede estar vacía" };
  }
  if (!h) {
    return { isValid: false, error: "La fecha 'Hasta' no puede estar vacía" };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

  const isOngoing = /^(presente|actual|actualidad|hoy|en curso)$/i.test(h);

  const yearD = extractYearFromStr(d);
  const yearH = isOngoing ? currentYear : extractYearFromStr(h);

  // 1. Check if beyond current date/year (when future is disallowed)
  if (!allowFuture) {
    if (yearD !== null && yearD > currentYear) {
      return {
        isValid: false,
        error: `El período no puede superar el año actual (máximo ${currentYear})`,
      };
    }
    if (!isOngoing && yearH !== null && yearH > currentYear) {
      return {
        isValid: false,
        error: `El período no puede superar el año actual (máximo ${currentYear})`,
      };
    }

    // If full date strings
    const timeD = new Date(d).getTime();
    if (!isNaN(timeD) && (d.includes('-') || d.includes('/')) && timeD > endOfToday) {
      return { isValid: false, error: "La fecha 'Desde' no puede ser posterior a la fecha actual" };
    }
    if (!isOngoing) {
      const timeH = new Date(h).getTime();
      if (!isNaN(timeH) && (h.includes('-') || h.includes('/')) && timeH > endOfToday) {
        return { isValid: false, error: "La fecha 'Hasta' no puede ser posterior a la fecha actual" };
      }
    }
  }

  // 2. Check maximum past age (start year cannot be older than currentYear - maxPastYears)
  if (yearD !== null && yearD < currentYear - maxPastYears) {
    return {
      isValid: false,
      error: `El año de inicio no puede ser anterior a ${currentYear - maxPastYears} (máximo ${maxPastYears} años hacia atrás según la vida laboral activa)`,
    };
  }

  // 3. Check chronological order (Desde cannot be greater than Hasta)
  if (yearD !== null && yearH !== null && yearD > yearH) {
    return { isValid: false, error: "La fecha 'Desde' no puede ser mayor que 'Hasta'" };
  }

  const timeD = new Date(d).getTime();
  const timeH = isOngoing ? now.getTime() : new Date(h).getTime();
  if (!isNaN(timeD) && !isNaN(timeH) && !isOngoing && timeD > timeH) {
    return { isValid: false, error: "La fecha 'Desde' no puede ser mayor que 'Hasta'" };
  }

  // 4. Check maximum span (cannot span more than maxSpanYears, e.g. 50 years)
  if (yearD !== null && yearH !== null) {
    const diff = yearH - yearD;
    if (diff > maxSpanYears) {
      return {
        isValid: false,
        error: `El período no puede tener una duración mayor a ${maxSpanYears} años (actual: ${diff} años)`,
      };
    }
  }

  // 5. Lexicographical / number fallback
  const numD = Number(d);
  const numH = Number(h);
  if (!isOngoing && !isNaN(numD) && !isNaN(numH) && d.length >= 4 && h.length >= 4) {
    if (numD > numH) {
      return { isValid: false, error: "La fecha 'Desde' no puede ser mayor que 'Hasta'" };
    }
    if (numH - numD > maxSpanYears) {
      return {
        isValid: false,
        error: `El período no puede tener una duración mayor a ${maxSpanYears} años`,
      };
    }
  }

  return { isValid: true, error: null };
};

export const parsePeriod = (periodStr: string): { desde: string; hasta: string } => {
  if (!periodStr) return { desde: '', hasta: '' };
  const parts = periodStr.split(/\s*[-–—]\s*/);
  return {
    desde: parts[0] || '',
    hasta: parts[1] || (parts[0] ? '' : ''),
  };
};

export const formatPeriod = (desde: string, hasta: string): string => {
  const d = (desde || '').trim();
  const h = (hasta || '').trim();
  if (!d && !h) return '';
  if (d && !h) return d;
  if (!d && h) return h;
  return `${d} - ${h}`;
};

/**
 * Validates a hexadecimal color code (e.g. #FFFFFF or #fff)
 */
export const validateHexColor = (hex: string): { isValid: boolean; error: string | null } => {
  const trimmed = (hex || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'El código hexadecimal no puede estar vacío' };
  }
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  if (!hexRegex.test(trimmed)) {
    return { isValid: false, error: 'Formato HEX inválido (ej. #5D172D o #FFFFFF)' };
  }
  return { isValid: true, error: null };
};

/**
 * Validates minimum string length
 */
export const validateMinLength = (
  value: string,
  min: number,
  fieldName = 'Este campo'
): { isValid: boolean; error: string | null } => {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} no puede estar vacío` };
  }
  if (trimmed.length < min) {
    return { isValid: false, error: `${fieldName} debe tener al menos ${min} caracteres (actual: ${trimmed.length})` };
  }
  return { isValid: true, error: null };
};

/**
 * Validates phone number format and minimum digit count (at least 7 digits)
 */
export const validatePhone = (phone: string): { isValid: boolean; error: string | null } => {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'El número de teléfono no puede estar vacío' };
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    return { isValid: false, error: 'El teléfono debe contener al menos 7 dígitos numéricos' };
  }
  if (!/^[0-9+\-()\s.]+$/.test(trimmed)) {
    return { isValid: false, error: 'El teléfono contiene caracteres no válidos' };
  }
  return { isValid: true, error: null };
};

/**
 * Validates a web address / URL
 */
export const validateUrl = (url: string, fieldName = 'El sitio web'): { isValid: boolean; error: string | null } => {
  const trimmed = (url || '').trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} no puede estar vacío` };
  }
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
  if (!urlPattern.test(trimmed)) {
    return { isValid: false, error: 'Ingresa un enlace o dominio válido (ej. www.unsitiogenial.es)' };
  }
  return { isValid: true, error: null };
};

/**
 * Validates numeric range
 */
export const validateNumberRange = (
  value: number | string,
  min: number,
  max: number,
  fieldName = 'El valor'
): { isValid: boolean; error: string | null } => {
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} debe ser un número válido` };
  }
  if (num < min || num > max) {
    return { isValid: false, error: `${fieldName} debe estar entre ${min} y ${max}` };
  }
  return { isValid: true, error: null };
};
