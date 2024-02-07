import { RequestHandler } from 'express'
import { manifest } from '../index.js'

export const handleGetManifest: RequestHandler = (_, res, __) => {
    res.status(200).json({
        success: true,
        manifest: manifest
    })
}

