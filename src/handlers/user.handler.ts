import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { Dict } from '../custom'

export const handleGetUser: RequestHandler = (req, res, _) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}

export const handlePutUsername: RequestHandler = async (req, res, next) => {
    let user = req.user!
    let body = req.body as Dict<string>

    if (user.username === body.username) {
        // Username already the same as requested
        return res.status(204).send()
    }

    user.username = body.username!

    try {
        await user.save()
    } catch {
        return next(new createHttpError.InternalServerError())
    }

    res.status(204).send()
}

