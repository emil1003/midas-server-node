import pkg, { mongoose } from '@typegoose/typegoose'
const { ModelOptions, Prop } = pkg

/**
 * Document model base class
 */
@ModelOptions({ schemaOptions: {
    bufferCommands: false,
    versionKey: false,
}})
export abstract class Model {
    /**
     * Document ObjectID
     */
    @Prop()
    public _id!: mongoose.Types.ObjectId
}

