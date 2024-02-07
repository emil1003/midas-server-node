import { mongoose } from '@typegoose/typegoose'
import { RequestHandler as Middleware } from 'express'
import createHttpError from 'http-errors'
import { AccountModel } from '../structs/account.js'

export const accountMiddleware: Middleware = async (req, _, next) => {
    let userId = req.auth.sub!
    let accId = req.params.acc

    if (accId && !mongoose.isValidObjectId(accId)) {
        return next(new createHttpError.BadRequest('Invalid param: acc'))
    }

    try {
        if (accId) {
            req.account = await AccountModel
                .findById(accId)
                .where('owner').equals(userId)
                .populate('currency') // TODO: reconsider
                .orFail(new createHttpError.NotFound('No such account'))
        } else {
            req.accounts = await AccountModel
                .find({
                    owner: userId
                })
                .populate('currency')
                .orFail(new createHttpError.NotFound('No accounts found for user'))
        }
    } catch(err) {
        return next(err)
    }

    next()
}

