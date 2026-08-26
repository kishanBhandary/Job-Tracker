import crypto from 'crypto'

// Use a session secret from environment, fallback to a derived key from DATABASE_URL or static fallback
const rawSecret = process.env.SESSION_SECRET || process.env.DATABASE_URL || 'jobtrack-default-secret-key-32-chars-long!'
const ENCRYPTION_KEY = crypto.createHash('sha256').update(rawSecret).digest()
const IV_LENGTH = 16

/**
 * Encrypt a text string using AES-256-CBC
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

/**
 * Decrypt a text string using AES-256-CBC
 */
export function decrypt(text: string): string {
  try {
    const textParts = text.split(':')
    const ivHex = textParts.shift()
    const encryptedHex = textParts.join(':')
    if (!ivHex || !encryptedHex) return ''
    
    const iv = Buffer.from(ivHex, 'hex')
    const encryptedText = Buffer.from(encryptedHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}

/**
 * Hash a password using PBKDF2 (SHA-512)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify a password against a PBKDF2 hash
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, hash] = combinedHash.split(':')
    if (!salt || !hash) return false
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return testHash === hash
  } catch (error) {
    console.error('Password verification failed:', error)
    return false
  }
}
