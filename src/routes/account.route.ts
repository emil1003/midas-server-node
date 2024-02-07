import express from 'express'
import { handleGetAccount, handleGetAccountTransactions, handlePutAccountLabel } from '../handlers/account.handler.js'
import { accountMiddleware } from '../middleware/account.middleware.js'
import { jwtMiddleware } from '../middleware/jwt.middleware.js'
import { jwtPermissionsMiddleware } from '../middleware/jwtPermissions.middleware.js'
import { verifyRequest } from '../middleware/verifyReq.middleware.js'

export const accountsRouter = express.Router()

// All endpoints require authentication
accountsRouter.use(jwtMiddleware)

/**
 * Get all accounts/specific belonging to token owner
 * Requires 'read' permission
 */
accountsRouter.get(
    '/:acc?',
    jwtPermissionsMiddleware.check([['admin'], ['read']]),
    accountMiddleware,
    handleGetAccount
)

/**
 * Get transactions relating to account
 */
accountsRouter.get(
    '/:acc/transactions',
    jwtPermissionsMiddleware.check([['admin'], ['read']]),
    accountMiddleware,
    handleGetAccountTransactions
)

/**
 * Change account label
 */
accountsRouter.put(
    '/:acc/label',
    jwtPermissionsMiddleware.check([['admin'], ['modify']]),
    verifyRequest({ body: ['label'] }),
    accountMiddleware,
    handlePutAccountLabel
)

