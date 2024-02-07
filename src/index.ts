import express, { json, urlencoded } from 'express'
import Mongoose from 'mongoose'
import { errorHandler } from './handlers/error.handler.js'
import { endpoints } from './routes/index.route.js'
import log from './utils/log.util.js'
import fs from 'fs'

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT!
const MONGODB_URI = process.env.MONGODB_URI!
const MANIFEST_PATH = process.env.MANIFEST_PATH!

log('midas', 'init')

//Read manifest file
log('midas', `reading manifest: ${MANIFEST_PATH}`)
let manifestFile = fs.readFileSync(
    MANIFEST_PATH,
    'utf-8')

export const manifest = JSON.parse(manifestFile)

const app = express()

// Inject middlewares
app.use(json())
app.use(urlencoded({ extended: false }))

// Setup endpoints
endpoints.forEach(endpoint => {
    log('midas', `  using ${endpoint.basePath}`)
    app.use(endpoint.basePath, endpoint.router)
})

// Setup error handler as last route
app.use(errorHandler)

// Listen for SIGINT
process.once('SIGINT', () => {
    log('midas', 'received SIGINT, exiting')

    // Disconnect safely
    switch (Mongoose.connection.readyState) {
        case 1: // Connected
        case 3: // Disconnecting, listen for event
            // Database connected, await disconnect
            Mongoose.disconnect()
                .then(() => {
                    log('midas', `disconnected from ${MONGODB_URI}`)
                    process.exit(0)
                })
                .catch(() => {
                    log('midas', `could not disconnect from ${MONGODB_URI}`)
                    process.exit(1)
            })
        break
        default:
            // Database not connected, exit immediately
            process.exit(0)
    }
})

// First, connect to database
log('mongo', `connecting to ${MONGODB_URI}`)
let connStart = new Date().getTime()
Mongoose.connect(MONGODB_URI, { dbName: 'midas', directConnection: true })
   .then(() => {
        // With database, listen
        let connDelta = new Date().getTime() - connStart
        log('mongo', `connected to ${MONGODB_URI}, took ${connDelta} ms`)

        let config = {
            port: PORT,
            host: HOST
        }

        app.listen(config, () => {
            log('midas', `hosting ${manifest.providerName} as ${manifest.hostname}`)
            log("midas", `listening on ${HOST}:${PORT}`)
        });
    })
    .catch(() => {
        // Without database, exit process
        log('mongo', `${MONGODB_URI} failed to connect, exiting`)
        process.exit(1)
})

