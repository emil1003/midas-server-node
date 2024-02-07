import express from 'express'
import { handleGetTransaction, handlePostNewTransaction } from '../handlers/transaction.handler.js'
import { accountMiddleware } from '../middleware/account.middleware.js'
import { jwtMiddleware } from '../middleware/jwt.middleware.js'
import { jwtPermissionsMiddleware } from '../middleware/jwtPermissions.middleware.js'
import { nonceMiddleware } from '../middleware/nonce.middleware.js'
import { verifyRequest } from '../middleware/verifyReq.middleware.js'

export const transactionRouter = express.Router()

// All transaction endpoints require authentication
transactionRouter.use(jwtMiddleware)

/**
 * Get transaction
 */
transactionRouter.get(
    '/:trid',
    jwtPermissionsMiddleware.check([['admin'], ['read']]),
    accountMiddleware,
    handleGetTransaction
)

/**
 * Handle posting a new transaction
 */
transactionRouter.post(
    '/new',
    jwtPermissionsMiddleware.check([['admin'], ['read', 'transact']]),
    verifyRequest({ body: ['source', 'target', 'amount', 'nonce'] }),
    nonceMiddleware,
    handlePostNewTransaction
)

