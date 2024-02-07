import express from 'express'
import { handleGetCurrency } from '../handlers/currency.handler.js'
import { currencyMiddleware } from '../middleware/currency.middleware.js'

export const currencyRouter = express.Router()

/**
 * Get currency/currencies
 */
currencyRouter.get(
    '/:currency?',
    currencyMiddleware,
    handleGetCurrency
)

