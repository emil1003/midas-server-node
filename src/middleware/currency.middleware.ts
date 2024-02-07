import { mongoose } from '@typegoose/typegoose'
import { RequestHandler as Middleware } from 'express'
import createHttpError from 'http-errors'
import { CurrencyModel } from '../structs/currency.js'

/**
 * Middleware for getting currency/currencies
 */
export const currencyMiddleware: Middleware = async (req, _, next) => {
    let currencyId = req.params.currency

    try {
        if (currencyId) {
            if (!mongoose.isValidObjectId(currencyId)) {
                return next( new createHttpError.BadRequest('Invalid param: id'))
            }

            req.currency = await CurrencyModel
                .findById(currencyId)
                .orFail(new createHttpError.NotFound('No such currency'))
        } else {
            req.currencies = await CurrencyModel
                .find()
                .orFail(new createHttpError.NotFound('Currencies not found'))
        }
    } catch(err) {
        return next(err)
    }

    next()
}

