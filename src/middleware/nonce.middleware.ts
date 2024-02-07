import { RequestHandler as Middleware } from 'express'
import createHttpError from 'http-errors'
import { TimestampedNonce } from '../custom.js'
import log, { LogType } from '../utils/log.util.js'

/**
 * Nonce expiration limit in millis (default 30000 ms)
 */
export const NONCE_STALE_MS: number = parseInt(process.env.NONCE_STALE_MS!) || 30 * 1000

/**
 * Cached nonces
 */
export const nonceCache: TimestampedNonce[] = []

/**
 * Push nonce onto cache stack
 * @param nonce Nonce to push
 */
export const pushNonce = (nonce: TimestampedNonce) => {
    // Cache request nonce
    log('nonce', `pushed nonce: ${nonce.value}`, LogType.V)
    nonceCache.push(nonce)
}

const badNonceError = new createHttpError.BadRequest('Bad nonce')

/**
 * Nonce checking middleware
 */
export const nonceMiddleware: Middleware = (req, _, next) => {
    let nonce = req.body.nonce! as string
    try {
        nonceCache.forEach((it, i) => {
            // Evict nonce if stale
            if (it.timestamp + NONCE_STALE_MS <= Date.now()) {
                log('nonce', `evicting nonce: ${it.value}`, LogType.V)
                nonceCache.splice(i, 1)
            }

            // Check if nonce is cached
            if (it.value === nonce) {
                log('nonce', `BAD NONCE! ${nonce}`, LogType.I)
                throw badNonceError
            }
        })

        // Push nonce to stack
        pushNonce({
            timestamp: Date.now(),
            value: nonce
        })

        // Nonce OK
        next()
    } catch(err) {
        return next(err)
    }
}

