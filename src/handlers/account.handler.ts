import { mongoose } from '@typegoose/typegoose'
import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { Dict } from '../custom.js'
import { TransactionModel } from '../structs/transaction.js'

const MAX_RECORD_LIMIT = parseInt(process.env.MAX_RECORD_LIMIT as string) || 20

/**
 * Clamp 'limit' variable to acceptable range
 * @return Limit within acceptable range
 */
const clampLimit = (input: number): number => {
    return Math.max(1, Math.min(input, MAX_RECORD_LIMIT))
}

/**
 * Handler for getting account(s)
 */
export const handleGetAccount: RequestHandler = (req, res, _) => {
    res.status(200).json({
        success: true,
        account: req.account,
        accounts: req.accounts
    })
}

/*
 * Handler for getting transactions on given account
 */
export const handleGetAccountTransactions: RequestHandler = async (req, res, next) => {
    let accId = req.params.acc as string
    //let offset = parseInt(req.query.offset as string) || 0
    let limit = clampLimit(parseInt(req.query.limit as string) || 20)
    let before = parseInt(req.query.before as string) || Date.now() / 1000

    // Ensure offset and limit larger than 0 and 1
    //offset = (offset > 0) ? offset : 0
    //limit = (limit > 1) ? limit : 1

    // Get timestamp as ObjectID
    let beforeObj
    try {
        beforeObj = mongoose.Types.ObjectId.createFromTime(before)
    } catch (err) {
        return next(new createHttpError.BadRequest('Timestamp out of range'))
    }

    // Find transactions involving account
    let transactions

    try {
        transactions = await TransactionModel
            .find({
                _id: {$lt: beforeObj.toString()}, // Transaction older than 'before'
                $or: [{source: accId}, {target: accId}] // accId is source or target
            })
            //.skip(offset).
            .limit(limit).populate("currency") // TODO: Consider removing: saves bytes in Xfer, makes clients do more work
            //.orFail(new createHttpError.NotFound('No transactions matching query'))
    } catch (err) {
        return next(err)
    }

    // Transactions may be empty, but as long as query completed,
    // query result is correct
    res.status(200).json({
        success: true,
        transactions: transactions.reverse()
    })
}

/*
 * Handler for setting account label
 */
export const handlePutAccountLabel: RequestHandler = async (req, res, next) => {
    let acc = req.account!
    let body = req.body as Dict<string>

    if (acc.label === body.label) {
        // Attempt to set the same label, reply 204
        return res.status(204).send()
    }

    acc.label = body.label!

    try {
        await acc.save()
    } catch {
        return next(new createHttpError.InternalServerError())
    }

    res.status(200).json({
        success: true
    })
}

