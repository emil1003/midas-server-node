import { scryptSync, timingSafeEqual, randomBytes } from 'crypto'
import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { manifest } from '../index.js'
import { UserModel } from '../structs/user.js'
import log, { LogType } from '../utils/log.util.js'

/**
 * Error to return when not authorized
 */
const UNAUTHORIZED_BAD_CREDS = new createHttpError.Unauthorized('Credentials not accepted')

/**
 * Check user credentials and issue new JWT if successful
 */
export const handleIssueToken: RequestHandler = async (req, res, next) => {
    let email = req.body.email
    let passwdInput = req.body.password
    let scope = req.body.scope

    // Find user with email address
    let user
    try {
        user = await UserModel
            .findOne({
                email: email
            })
            .orFail(UNAUTHORIZED_BAD_CREDS) 
    } catch(err) {
        return next(err)
    }

    // Get salt and key from user object
    let [salt, key] = user.passwd.split(':')

    // Hash the provided password with salt
    let hashedBuffer
    try {
        hashedBuffer = scryptSync(
            passwdInput,
            salt,
            parseInt(process.env.SCRYPT_KEY_LENGTH as string))
    } catch(err) {
        // scrypt can fail
        return next(new createHttpError.InternalServerError())
    }

    // Get key as hex
    let keyBuffer = Buffer.from(key, 'hex')

    // Check if input matches stored key with time safety
    let match
    try {
        match = timingSafeEqual(hashedBuffer, keyBuffer)
    } catch(err) {
        // Buffer length don't match
        return next(UNAUTHORIZED_BAD_CREDS)
    }

    // Check if key was accepted
    if (!match) {
        return next(UNAUTHORIZED_BAD_CREDS)
    }

    // Credentials accepted
    let tokenId = randomBytes(16).toString('hex')

    let token = jwt.sign(
        {scope: scope},
        process.env.JWT_SECRET!,
        {
            subject: user.id,
            audience: manifest.hostname,
            expiresIn: process.env.JWT_EXPIRES_IN,
            noTimestamp: true,
            algorithm: 'HS256',
            jwtid: tokenId
        }
    )

    log('handleIssueToken', `issued token ${tokenId} for user ${user.id}`, LogType.V)

    res.status(200).json({
        success: true,
        token: token
    })
}

