import express from 'express'
import { handleGetManifest } from '../handlers/manifest.handler.js'

export const manifestRouter = express.Router()

/**
 * Get manifest
 */
manifestRouter.get(
    '/',
    handleGetManifest
)

