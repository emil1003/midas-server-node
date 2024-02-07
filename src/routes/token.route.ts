import express from 'express'
import { handleIssueToken } from '../handlers/token.handler.js'
import { verifyRequest } from '../middleware/verifyReq.middleware.js'

export const tokenRouter = express.Router()

/**
 * Handle issuing tokens
 */
tokenRouter.post(
    '/issue',
    verifyRequest({ body: ['email', 'password', 'scope']}),
    handleIssueToken
)

