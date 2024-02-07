import pkg from '@typegoose/typegoose'
import { Account, AccountModel } from './account.js'
import { VirtualTimestamp } from './virtualTimestamp.js'
const { getModelForClass, Prop, ModelOptions } = pkg

/**
 * User data model
 */
@ModelOptions({ schemaOptions: {
    toJSON: {
        transform: (_, ret, __) => {
            ret.id = ret._id
            delete ret._id
            delete ret.passwd // Do not export passwd
            return ret
        }
    }
}})
export class User extends VirtualTimestamp {
    /**
     * User non-unique username
     */
    @Prop()
    public username!: string

    /**
     * User email-address
     */
    @Prop()
    public email!: string

    /**
     * User hashed password (not to be exported!)
     */
    @Prop()
    public passwd!: string

    /**
     * Get accounts belonging to this user
     *
     * @returns {Promise<Account[]>} Accounts
     */
    public async getAccounts(): Promise<Account[]> {
        return await AccountModel
            .find({owner: this._id})
    }
}

/**
 * User document model
 */
export const UserModel = getModelForClass(User)

