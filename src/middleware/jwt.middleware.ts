import { RequestHandler as Middleware } from 'express'
import { expressjwt as ExpressJwt } from 'express-jwt'

/**
 * JWT authentication middleware
 */
export const jwtMiddleware: Middleware = ExpressJwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ['HS256'],
    requestProperty: 'auth'
})

