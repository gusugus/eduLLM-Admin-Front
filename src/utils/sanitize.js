const stripHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
};

const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const trimStr = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

const collapseSpaces = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/\s+/g, ' ');
};

const removeSqlInject = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*|\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/union/gi, '')
    .replace(/drop\s+table/gi, '')
    .replace(/delete\s+from/gi, '')
    .replace(/insert\s+into/gi, '')
    .replace(/exec\b/gi, '')
    .replace(/select\b/gi, '')
    .replace(/alter\b/gi, '')
    .replace(/truncate\b/gi, '');
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return collapseSpaces(trimStr(removeSqlInject(stripHtml(str))));
};

const sanitizeName = (str) => {
  if (typeof str !== 'string') return str;
  return sanitizeString(str)
    .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s.'-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.\s]+|[-.\s]+$/g, '');
};

const sanitizeEmail = (str) => {
  if (typeof str !== 'string') return str;
  return sanitizeString(str).toLowerCase();
};

const sanitizeUsername = (str) => {
  if (typeof str !== 'string') return str;
  return sanitizeString(str).replace(/[^a-zA-Z0-9_-]/g, '');
};

const sanitizeCedula = (str) => {
  if (typeof str !== 'string') return str;
  return sanitizeString(str).replace(/\D/g, '');
};

const sanitizeValue = (value, key) => {
  if (typeof value !== 'string') return value;

  const nameFields = ['primer_nombre', 'segundo_nombre', 'apellido_paterno', 'apellido_materno', 'departamento'];
  const emailFields = ['correo', 'email'];
  const usernameFields = ['username'];
  const cedulaFields = ['cedula'];
  const textFields = ['nombre', 'descripcion', 'titulo'];

  if (nameFields.includes(key)) return sanitizeName(value);
  if (emailFields.includes(key)) return sanitizeEmail(value);
  if (usernameFields.includes(key)) return sanitizeUsername(value);
  if (cedulaFields.includes(key)) return sanitizeCedula(value);
  if (textFields.includes(key)) return sanitizeString(value);

  return sanitizeString(value);
};

const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(item => sanitizeData(item));

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeValue(value, key);
  }
  return sanitized;
};

export {
  sanitizeString, sanitizeName, sanitizeEmail,
  sanitizeUsername, sanitizeCedula, sanitizeData,
  stripHtml, escapeHtml
};
