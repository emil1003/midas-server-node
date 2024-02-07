import { ErrorRequestHandler } from 'express'
import { UnauthorizedError } from 'express-jwt'
import createHttpError from 'http-errors'
import log, { LogType } from '../utils/log.util.js'

export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {

    // If only...
    if (err instanceof UnauthorizedError) {
        err = new createHttpError.Unauthorized(err.message)
    }

    // Return error if it's a HttpError that's exposable
    if (createHttpError.isHttpError(err)) {
        if (err.expose) {
            res.status(err.status).json({
                success: false,
                message: err.message
            })
            // Break
            return next()
        }
    }

    // Return generic Internal Server Error

    log('midas', `${err.name}: ${err.message}`, LogType.E)
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    })
}

