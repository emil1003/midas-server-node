import { RequestHandler as Middleware } from 'express'
import createHttpError from 'http-errors'
import { UserModel } from '../structs/user.js'

export const userMiddleware: Middleware = async (req, _, next) => {
    try {
        req.user = await UserModel
            .findById(req.auth.sub)
            .orFail(new createHttpError.NotFound('No such user'))
    } catch(err) {
        return next(err)
    }

    next()
}

