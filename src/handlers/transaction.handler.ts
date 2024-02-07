import { mongoose } from '@typegoose/typegoose'
import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { AccountModel } from '../structs/account.js'
import { Currency } from '../structs/currency.js'
import { EnumTransactionStatus, Transaction, TransactionModel } from '../structs/transaction.js'

/**
 * Get an existing transaction from database, if user has permission to
 */
export const handleGetTransaction: RequestHandler = async (req, res, next) => {
    let accounts = req.accounts!
    let transactionId = req.params.trid!

    // Try parsing transaction ID as ObjectId
    if (!mongoose.isValidObjectId(transactionId)) {
        return next(new createHttpError.BadRequest('Invalid param: trid'))
    }

    // Try fetching transaction from database
    let transaction: Transaction
    try {
        transaction = await TransactionModel
            .findById(transactionId)
            .populate("currency")
            .orFail(new createHttpError.NotFound('No such transaction'))
    } catch(err) {
        return next(err)
    }

    // Iterate over accounts
    let owned = false
    accounts.forEach(acc => {
        // If transaction source or target matches account, mark as owned
        if (transaction.source?._id.equals(acc.id) || transaction.target?._id.equals(acc.id)) {
            owned = true
        }
    })

    if (!owned) {
        // User shouldn't see transaction, respond 404
        return next(new createHttpError.NotFound('No such transaction'))
    }

    res.status(200).json({
        success: true,
        transaction: transaction
    })
}

/**
 * Perform a new transaction and insert record into database
 */
export const handlePostNewTransaction: RequestHandler = async (req, res, next) => {
    let userId = req.auth.sub!
    let sourceId = req.body.source as string
    let targetId = req.body.target as string
    let amount = parseFloat(req.body.amount)
    let description = req.body.description as string | null

    try {
        // Check that transaction makes sense
        if (sourceId === targetId || amount <= 0) {
            return next(new createHttpError.BadRequest('Invalid transaction options'))
        }

        // Get source account and currency
        let source = await AccountModel
            .findById(sourceId)
            .where('owner').equals(userId)
            .populate('currency')
            .orFail(new createHttpError.BadRequest('No such account: owner'))

        // Round amount to currency resolution
        let currency = source.currency as Currency
        let fixedAmount = parseFloat(amount.toFixed(currency.resolution))

        // If amount now differs, fail
        if (fixedAmount !== amount) {
            return next(new createHttpError.BadRequest('Invalid transaction options'))
        }
        amount = fixedAmount

        // Check whether account has neccesary balance
        if (source.balance < amount) {
            return next(new createHttpError.BadRequest('Insufficient funds'))
        }

        // Get target account if currency is the same
        let target = await AccountModel
            .findById(targetId)
            .where('currency').equals(currency._id)
            .orFail(new createHttpError.BadRequest('No such account: target'))

        let transaction

        // Enter transaction enviroment
        // Any throws rolls back database
        await mongoose.connection.transaction(async (session) => {
            // Change source account balance
            source.balance -= amount
            await source.save({ session })

            // Change target account balance
            target.balance += amount
            await target.save({ session })

            // Create transaction document
            transaction = new TransactionModel({
                _id:         new mongoose.Types.ObjectId(),
                source:      source._id,
                target:      target._id,
                amount:      amount,
                currency:    currency._id,
                description: description,
                status:      EnumTransactionStatus.FINISHED
            })

            // Store transaction
            await transaction.save({ session })
        })

        // By here, we can trust that changes was committed successfully
        res.status(200).json({
            success: true,
            transaction: transaction
        })
    } catch(err) {
        return next(err)
    }
}

