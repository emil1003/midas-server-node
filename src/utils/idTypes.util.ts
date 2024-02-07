import { mongoose } from '@typegoose/typegoose'

export enum EnumIdTypes {
    USER        = '~',
    ACCOUNT     = '@',
    CURRENCY    = '$',
    TRANSACTION = '!'
}

/**
 * Check whether ID is of type
 * @param type ID type
 * @param id ID
 * @returns ID is type
 */
export function isOfType(type: EnumIdTypes, id: string) {
    return id.startsWith(type)
}

/**
 * Get raw ID
 * @param type ID type
 * @param id ID
 * @returns Raw ID
 */
export function getRaw(type: EnumIdTypes, id: string) {
    if (!isOfType(type, id)) {
        throw new Error('id not of type')
    }

    let raw = id.substring(type.length)

    if (!mongoose.isValidObjectId(raw)) {
        throw new Error('id not valid ObjectID')
    }

    return raw
}

