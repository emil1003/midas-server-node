import { mongoose } from '@typegoose/typegoose'
import { BeAnObject } from '@typegoose/typegoose/lib/types'
import { JwtPayload } from 'jsonwebtoken'
import { Account } from './structs/account.js'
import { Currency } from './structs/currency.js'
import { User } from './structs/user.js'

declare type TimestampedNonce = {
    timestamp: number,
    value: string
}

declare type Dict<T> = {
    [key: string]: T
}

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        scope?: string
    }
}

declare module 'express-serve-static-core' {
    export interface Request {
        auth: JwtPayload
        account?: (mongoose.Document<mongoose.Types.ObjectId, BeAnObject, any> & Account)
        accounts?: (mongoose.Document<mongoose.Types.ObjectId, BeAnObject, any> & Account)[]
        currency?: (mongoose.Document<mongoose.Types.ObjectId, BeAnObject, any> & Currency)
        currencies?: (mongoose.Document<mongoose.Types.ObjectId, BeAnObject, any> & Currency)[]
        user?: (mongoose.Document<mongoose.Types.ObjectId, BeAnObject, any> & User)
    }
}

