/** Authentication domain types */

export interface AuthToken {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface TokenValidation {
  isValid: boolean
  message?: string
}

/** Decoded JWT payload (subset we care about) */
export interface JwtPayload {
  sub: string
  exp: number
  iat: number
}
