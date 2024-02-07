import pkg from '@typegoose/typegoose'
import { Model } from './model.js'
const { ModelOptions } = pkg

/**
 * Helper class for providing ObjectID timestamp
 * on a model as a virtual property
 */
@ModelOptions({ schemaOptions: {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
}})
export abstract class VirtualTimestamp extends Model {
    /**
     * Document creation timestamp extracted from ObjectID
     */
    public get timestamp(): number {
        return this._id?.getTimestamp().getTime() / 1000
    }
}

