export const validators = {
  required: (value, label = 'This field') => {
    if (!value || !String(value).trim()) return `${label} is required.`;
    return '';
  },
  minLength: (value, min, label = 'This field') => {
    if (String(value || '').trim().length < min) {
      return `${label} must be at least ${min} characters.`;
    }
    return '';
  },
  email: (value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return 'Email address is required.';
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(trimmed)) return 'Enter a valid email address (e.g., alex@example.com).';
    return '';
  },
  password: (value) => {
    if (!value) return 'Password is required.';
    if (value.length < 6) return 'Password must be at least 6 characters.';
    return '';
  },
  match: (value, target, label = 'Passwords') => {
    if (value !== target) return `${label} do not match.`;
    return '';
  },
  positiveNumber: (value, label = 'Value') => {
    const num = Number(value);
    if (isNaN(num) || num < 0) return `${label} must be 0 or greater.`;
    return '';
  },
};

export function validateForm(values, rules) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    for (const rule of fieldRules) {
      const error = rule(values[field], values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}