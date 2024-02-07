import { RequestHandler as Middleware } from 'express'
import createHttpError from 'http-errors'
import log, { LogType } from '../utils/log.util.js'

/**
 * Options for VerifyRequest
 */
export type VerifyRequestOptions = {
    body?: string[]
    query?: string[]
}

const badRequest = new createHttpError.BadRequest()

/**
 * Middleware that checks if specified
 * elements exist on request
 * @param body Body elements to check
 * @param query Query elements to check
 * @returns Middleware
 */
export const verifyRequest = (options: VerifyRequestOptions) => {
    const verifyReqMethod: Middleware = (req, _, next) => {
        let isBad = false

        options.body && options.body.every(e => {
            if (!req.body[e]) {
                log('verifyReq', `missing on body: ${e}`, LogType.V)
                isBad = true
                return false // Breaks loop
            }
            return true
        })

        options.query && !isBad && options.query.every(e => {
            if (!req.query[e]) {
                log('verifyReq', `missing on query: ${e}`, LogType.V)
                isBad = true
                return false // Breaks loop
            }
            return true
        })

        next(isBad && badRequest)
    }
    return verifyReqMethod
}

