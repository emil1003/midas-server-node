import pkg from '@typegoose/typegoose'
import { VirtualTimestamp } from './virtualTimestamp.js'
const { getModelForClass, Prop, ModelOptions } = pkg

/**
 * Currency symbol type enumerator
 */
export enum CurrencySymbolType {
    /**
     * Currency denotes symbol as a prefix
     */
    PREFIX = 'prefix',

    /**
     * Currency denotes symbol as a suffix
     */
    SUFFIX = 'suffix'
}

/**
 * Currency data model
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
export class Currency extends VirtualTimestamp {
    /**
     * Currency name
     */
    @Prop()
    public name!: string

    /**
     * Currency symbol (max 5 chars)
     */
    @Prop({
        validate: {
            validator: (v: string) => {
                // Symbol length max 5 characters
                return v.length <= 5
            },
            message: "Symbol longer than 5 characters"
        }
    })
    public symbol!: string

    /**
     * Currency symbol type
     */
    @Prop({ enum: CurrencySymbolType})
    public type!: CurrencySymbolType

    /**
     * Number of decimals used for currency
     */
    @Prop()
    public resolution!: number
}

export const CurrencyModel = getModelForClass(Currency)

