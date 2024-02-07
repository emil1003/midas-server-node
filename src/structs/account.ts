import pkg, { Ref } from '@typegoose/typegoose'
import { Currency } from './currency.js'
import { User, UserModel } from './user.js'
import { VirtualTimestamp } from './virtualTimestamp.js'
const { getModelForClass, Prop, ModelOptions } = pkg

/**
 * Account data model
 */
@ModelOptions({schemaOptions: {
    toJSON: {
        transform: (_, ret, __) => {
            ret.id = ret._id
            delete ret._id
            return ret
        }
    }
}})
export class Account extends VirtualTimestamp {
    /**
     * Account owner
     */
    @Prop({ ref: () => User })
    public owner!: Ref<User>

    /**
     * User-set account label
     */
    @Prop()
    public label?: string

    /**
     * Account balance
     */
    @Prop({ min: 0 })
    public balance!: number

    /**
     * Account currency
     */
    @Prop({ref: () => Currency})
    public currency!: Ref<Currency>

    /**
     * Get the owner of this account
     *
     * @returns {Promise<User?>} User
     */
    public async getOwner(): Promise<User | null> {
        return await UserModel
            .findById(this.owner)
    }
}

/**
 * Account document model
 */
export const AccountModel = getModelForClass(Account)

