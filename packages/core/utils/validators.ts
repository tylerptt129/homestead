// ---------------------------------------------------------------------------
// Homestead Forge - Input Validators
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  message: string | null;
}

const ok = (): ValidationResult => ({ valid: true, message: null });
const fail = (message: string): ValidationResult => ({ valid: false, message });

// ---- Email ----------------------------------------------------------------

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return fail('Email is required.');
  }
  if (email.length > 254) {
    return fail('Email must be at most 254 characters.');
  }
  if (!EMAIL_RE.test(email)) {
    return fail('Please enter a valid email address.');
  }
  return ok();
}

// ---- Homestead name -------------------------------------------------------

export function validateHomesteadName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return fail('Homestead name is required.');
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return fail('Homestead name must be at least 2 characters.');
  }
  if (trimmed.length > 60) {
    return fail('Homestead name must be at most 60 characters.');
  }
  if (!/^[a-zA-Z0-9 ''&\-]+$/.test(trimmed)) {
    return fail(
      'Homestead name can only contain letters, numbers, spaces, hyphens, apostrophes, and ampersands.',
    );
  }
  return ok();
}

// ---- Acreage --------------------------------------------------------------

export function validateAcreage(value: unknown): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return fail('Acreage is required.');
  }
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (Number.isNaN(num)) {
    return fail('Acreage must be a number.');
  }
  if (num <= 0) {
    return fail('Acreage must be greater than 0.');
  }
  if (num > 100_000) {
    return fail('Acreage must be at most 100,000.');
  }
  return ok();
}

// ---- Budget amount --------------------------------------------------------

export function validateBudgetAmount(value: unknown): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return fail('Amount is required.');
  }
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (Number.isNaN(num)) {
    return fail('Amount must be a valid number.');
  }
  if (num < 0) {
    return fail('Amount cannot be negative.');
  }
  if (num > 10_000_000) {
    return fail('Amount seems unreasonably large. Please double-check.');
  }
  // Allow at most two decimal places
  const parts = String(num).split('.');
  if (parts[1] && parts[1].length > 2) {
    return fail('Amount can have at most two decimal places.');
  }
  return ok();
}

// ---- Generic required text ------------------------------------------------

export function validateRequired(
  value: string | null | undefined,
  fieldName: string,
): ValidationResult {
  if (!value || value.trim().length === 0) {
    return fail(`${fieldName} is required.`);
  }
  return ok();
}

// ---- Compound validator ---------------------------------------------------

/**
 * Run multiple validators and return the first failure, or ok() if all pass.
 */
export function validateAll(
  ...results: ValidationResult[]
): ValidationResult {
  for (const r of results) {
    if (!r.valid) return r;
  }
  return ok();
}
