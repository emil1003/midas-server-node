import express from 'express'
import { handleGetUser, handlePutUsername } from '../handlers/user.handler.js'
import { jwtMiddleware } from '../middleware/jwt.middleware.js'
import { jwtPermissionsMiddleware } from '../middleware/jwtPermissions.middleware.js'
import { userMiddleware } from '../middleware/user.middleware.js'
import { verifyRequest } from '../middleware/verifyReq.middleware.js'

export const userRouter = express.Router()

// All user endpoints require authentication
userRouter.use(jwtMiddleware)

/**
 * Get user 
 */
userRouter.get(
    '/',
    jwtPermissionsMiddleware.check([['admin'], ['read']]),
    userMiddleware,
    handleGetUser
)

/**
 * Update username
 */
userRouter.put(
    '/username',
    jwtPermissionsMiddleware.check([['admin'], ['modify']]),
    verifyRequest({ body: ['username'] }),
    userMiddleware,
    handlePutUsername
)

