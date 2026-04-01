function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const env = {
  PORT: parseInt(optional('PORT', '3000'), 10),
  NODE_ENV: optional('NODE_ENV', 'development'),
  REACT_EDITOR: optional('REACT_EDITOR', 'code'),
  DATABASE_URL: required('DATABASE_URL'),
  GOOGLE_CLIENT_ID: required('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: required('GOOGLE_CLIENT_SECRET'),
  SUPER_ADMIN_EMAILS: optional('SUPER_ADMIN_EMAIL', '').split(',').map(e => e.trim()).filter(Boolean),
} as const
