import pkg, { Ref } from '@typegoose/typegoose'
import { Account } from './account.js'
import { Currency } from './currency.js'
import { VirtualTimestamp } from './virtualTimestamp.js'
const { getModelForClass, Prop, ModelOptions } = pkg

/**
 * Transaction status string enumerator
 */
export enum EnumTransactionStatus {
    /**
     * Request awaiting an answer
     */
    AWAITING = 'awaiting',

    /**
     * Request/transaction finished
     */
    FINISHED = 'finished',

    /**
     * Request rejected by any party
    */
    REJECTED = 'rejected',

    /**
     * Request stalled (timeout, stale)
    */
    STALLED	= 'stalled'
}

/**
 * Transaction data model
 */
@ModelOptions({ schemaOptions: {
    toJSON: {
        transform: (_, ret, __) => {
            ret.id = ret._id
            delete ret._id
            return ret
        }
    }
}})
export class Transaction extends VirtualTimestamp {
    /**
     * Transaction source account
     */
    @Prop({ ref: () => Account })
    public source!: Ref<Account>

    /**
     * Transaction target account
     */
    @Prop({ ref: () => Account })
    public target!: Ref<Account>

    /**
     * Transacted amount
     */
    @Prop()
    public amount!: number

    /**
     * Transaction currency
     */
    @Prop({ ref: () => Currency})
    public currency!: Ref<Currency>

    /**
     * User-created transaction description
     */
    @Prop()
    public description?: string

    /**
     * Transaction status string
     */
    @Prop({ enum: EnumTransactionStatus })
    public status!: EnumTransactionStatus
}

/**
 * Transaction document model
 */
export const TransactionModel = getModelForClass(Transaction)

