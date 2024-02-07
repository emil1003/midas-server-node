
/**
 * Log types
 */
export enum LogType {
    V = 0,
    D = 1,
    I = 2,
    E = 3
}

export const LOG_LEVEL = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL!) : LogType.I

/**
 * Output a log message
 * @param tag log tag
 * @param msg message
 * @param lvl message level, default I
 * @returns 
 */
export default function log(tag: string, msg: string, lvl: LogType = LogType.I) {
    if (lvl < LOG_LEVEL) {
        return
    }

    console.log(`${new Date().toISOString()} ${lvl}/${tag}: ${msg}`)
}

